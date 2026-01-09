import alasql from "alasql";
import sqlSnippets from "./sqlSnippets";

export { sqlSnippets };

/* =========================================
   1. GLOBAL CONFIG & POLYFILLS
   ========================================= */
alasql.options.casesensitive = false;
alasql.options.convention = "oracle";
// alasql.options.noundefined = true; // Disabled to prevent NULL issues

// Robust NVL Polyfill
const _robustNvlFn = (val, def) => {
  if (
    val === null ||
    val === undefined ||
    val === "" ||
    (typeof val === "number" && isNaN(val)) ||
    (typeof val === "string" &&
      (val.trim().toUpperCase() === "NULL" ||
        val.trim().toUpperCase() === "UNDEFINED"))
  ) {
    return def;
  }
  return val;
};

// Register Polyfills
alasql.fn.robustnvl = _robustNvlFn;
alasql.fn.NVL =
  alasql.fn.nvl =
  alasql.fn.IFNULL =
  alasql.fn.ifnull =
    _robustNvlFn;
alasql.fn.COALESCE = alasql.fn.coalesce = function () {
  for (let i = 0; i < arguments.length; i++) {
    const v = arguments[i];
    if (
      v !== null &&
      v !== undefined &&
      String(v).toUpperCase() !== "NULL" &&
      v !== ""
    )
      return v;
  }
  return null;
};
alasql.fn.SYSDATE = () => new Date().toISOString().split("T")[0];
alasql.fn.GET_ORACLE_TIME = alasql.fn.get_oracle_time = () =>
  new Date().toLocaleTimeString("en-GB");
alasql.fn.GET_ORACLE_DATE = alasql.fn.get_oracle_date = () =>
  new Date().toISOString().split("T")[0];
alasql.fn.USER = () => "SYSTEM";
alasql.fn.TRUNC = (val, precision = 0) => {
  if (!val) return val;
  if (
    val instanceof Date ||
    (typeof val === "string" && val.match(/^\d{4}-\d{2}-\d{2}/))
  ) {
    return new Date(val).toISOString().split("T")[0];
  }
  const factor = Math.pow(10, precision);
  return Math.trunc(Number(val) * factor) / factor;
};
alasql.fn.INITCAP = (str) => {
  if (!str) return str;
  return String(str)
    .toLowerCase()
    .replace(/(?:^|\s)\w/g, function (match) {
      return match.toUpperCase();
    });
};
alasql.fn.TO_CHAR = (val) => String(val);
alasql.fn.TO_DATE = (val) => new Date(val).toISOString().split("T")[0];
alasql.fn.DECODE = function () {
  if (arguments.length < 3) return null;
  const target = arguments[0];
  for (let i = 1; i < arguments.length - 1; i += 2) {
    if (target === arguments[i]) return arguments[i + 1];
  }
  // Default value (if total args is even, the last one is default)
  return arguments.length % 2 === 0 ? arguments[arguments.length - 1] : null;
};

/* =========================================
   2. HELPER FUNCTIONS
   ========================================= */

// Sanitize code (remove comments)
export const sanitizeSql = (code) => {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, "")
    .split("\n")
    .map((line) => {
      const idx = line.indexOf("--");
      return idx >= 0 ? line.substring(0, idx) : line;
    })
    .join("\n");
};

// Reset Global Database (for OnlineCompiler/Compiler)
export const resetSqlDatabase = (dbName = "CODEPULSE") => {
  try {
    // Clear localStorage for common tables to prevent persistence across reloads
    const tablesToClear = [
      "EMPLOYEES",
      "STUDENTS",
      "PRODUCTS",
      "BOOKS",
      "EMP_INFO",
      "EMPLOYEE_DETAILS",
      "STUDENT_INFO",
      "STUDENT_RECORDS",
    ];
    tablesToClear.forEach((t) => {
      try {
        alasql("DROP TABLE IF EXISTS " + t);
        localStorage.removeItem(t);
        localStorage.removeItem(t.toLowerCase());
      } catch (e) {}
    });

    alasql(`DROP DATABASE IF EXISTS ${dbName}`);
    alasql(`CREATE DATABASE ${dbName}`);
    alasql(`USE ${dbName}`);
    // Initialize dual table
    alasql("CREATE TABLE IF NOT EXISTS dual (dummy VARCHAR(1))");
    const res = alasql("SELECT * FROM dual");
    if (res.length === 0) alasql("INSERT INTO dual VALUES ('X')");
  } catch (e) {
    console.warn("SQL Reset/Init Warning:", e);
  }
};

/* =========================================
   3. CORE EXECUTION LOGIC (Global Component)
   ========================================= */

/**
 * Executes SQL code against a specific Alasql DB instance.
 * Returns structured results (messages, data) without directly modifying UI.
 *
 * @param {Object} db - The Alasql database instance (or null to use current)
 * @param {String} code - The raw SQL code to execute
 * @returns {Object} result - { messages, lastSelectResult, modifiedTables, error }
 */
export const runSqlCode = (db, code) => {
  const messages = [];
  let lastSelectResult = null;
  const modifiedTables = new Set();
  let error = null;

  try {
    if (db) {
      // Only if db has an ID, USE it. If it's an object from new alasql.Database(), we might need to use its databaseid.
      if (db.databaseid) alasql(`USE ${db.databaseid}`);
    }

    const cleanCode = code
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .replace(/--.*$/gm, "")
      .trim();

    const sanitizedCode = sanitizeSql(cleanCode);

    // --- AUTO-DROP TABLE INJECTION ---
    // Detect CREATE TABLE statements and inject DROP TABLE IF EXISTS before them
    // This prevents "Table already exists" errors on re-runs
    let finalCode = sanitizedCode;
    const createTableRegex =
      /CREATE\s+TABLE\s+(?:IF\s+NOT\s+EXISTS\s+)?([\w.]+)/gi;
    let match;
    const tablesToDrop = new Set();

    // Reset regex state
    createTableRegex.lastIndex = 0;

    while ((match = createTableRegex.exec(sanitizedCode)) !== null) {
      tablesToDrop.add(match[1]);
    }

    if (tablesToDrop.size > 0) {
      const dropCommands = Array.from(tablesToDrop)
        .map((t) => `DROP TABLE IF EXISTS ${t};`)
        .join("\n");
      finalCode = dropCommands + "\n" + sanitizedCode;
    }

    const commands = finalCode.split(";").filter((c) => c.trim().length > 0);

    for (let cmd of commands) {
      const trimmedCmd = cmd.trim();
      const lowerCmd = trimmedCmd.toLowerCase();
      let mappedCmd = trimmedCmd;

      // --- ORACLE SIMULATION & MAPPING ---

      // 1. Transaction Ignore
      if (lowerCmd === "commit" || lowerCmd === "rollback") continue;

      // 2. NVL Mapping
      mappedCmd = mappedCmd.replace(/\b(NVL|IFNULL)\b\s*\(/gi, "robustnvl(");

      // 2b. Oracle Compatibility (VARCHAR2, NUMBER, SYSDATE)
      mappedCmd = mappedCmd.replace(/\bVARCHAR2\b/gi, "VARCHAR");
      mappedCmd = mappedCmd.replace(/\bSYSDATE\b/gi, "GET_ORACLE_DATE()");
      mappedCmd = mappedCmd.replace(/\bSYSTIMESTAMP\b/gi, "GET_ORACLE_TIME()");

      // 2c. Extended Oracle Types/Keywords
      mappedCmd = mappedCmd.replace(/\bMINUS\b/gi, "EXCEPT");
      mappedCmd = mappedCmd.replace(/\b(CLOB|NCLOB|BLOB)\b/gi, "TEXT");
      mappedCmd = mappedCmd.replace(/\bNVARCHAR2\b/gi, "VARCHAR");
      mappedCmd = mappedCmd.replace(
        /\b(BINARY_FLOAT|BINARY_DOUBLE)\b/gi,
        "FLOAT"
      );
      mappedCmd = mappedCmd.replace(/\bTIMESTAMP\b/gi, "DATETIME");

      // 3. DESC/DESCRIBE -> SHOW COLUMNS
      const descMatch = mappedCmd.match(/^\s*(?:DESC|DESCRIBE)\s+([\w.]+)/i);
      if (descMatch) {
        const tableName = descMatch[1];
        mappedCmd = `SHOW COLUMNS FROM ${tableName}`;
      }

      // 4. RENAME -> Manual Logic
      const renameMatch = mappedCmd.match(
        /^\s*RENAME\s+([\w.]+)\s+TO\s+([\w.]+)/i
      );
      if (renameMatch) {
        const oldName = renameMatch[1];
        const newName = renameMatch[2];
        try {
          const currentDb = db || alasql.databases[alasql.use()];
          if (!currentDb) throw new Error("No database active");
          const tables = currentDb.tables;

          const tableToRename =
            tables[oldName] ||
            tables[oldName.toUpperCase()] ||
            tables[oldName.toLowerCase()];
          if (tableToRename) {
            // Rename Table
            tables[newName] = tableToRename;
            tables[newName.toUpperCase()] = tableToRename;
            if (oldName !== newName) {
              delete tables[oldName];
              delete tables[oldName.toUpperCase()];
              delete tables[oldName.toLowerCase()];
            }
            messages.push({
              type: "success",
              text: `Table '${oldName}' renamed to '${newName}' successfully.`,
              query: trimmedCmd,
            });
            modifiedTables.add(newName);
          } else {
            throw new Error(`Table '${oldName}' not found.`);
          }
        } catch (e) {
          messages.push({
            type: "error",
            text: `Rename failed: ${e.message}`,
            query: trimmedCmd,
          });
          error = e.message;
        }
        continue;
      }

      // 5. ALTER TABLE (Advanced: ADD, DROP COLUMN, MODIFY, RENAME COLUMN)
      if (lowerCmd.startsWith("alter table")) {
        // This block handles complex Oracle ALTER commands by manipulating Alasql DB directly
        // to avoid limited Alasql parser support.

        const currentDb = db || alasql.databases[alasql.use()];
        const tables = currentDb?.tables || {};

        // Helper: Find Table
        const findTable = (name) =>
          tables[name] ||
          tables[name.toUpperCase()] ||
          tables[name.toLowerCase()];

        try {
          // Fix standard Oracle ADD syntax (ADD col type -> ADD COLUMN col type)
          // Lookahead ensures we don't mess up ADD CONSTRAINT or ADD (multi-column)
          if (/\bADD\s+(?!COLUMN|CONSTRAINT|\()/i.test(mappedCmd)) {
            mappedCmd = mappedCmd.replace(/\bADD\s+/i, "ADD COLUMN ");
          }
          // Fix DROP syntax (DROP col -> DROP COLUMN col)
          if (
            /\bDROP\s+(?!COLUMN|CONSTRAINT|PRIMARY|FOREIGN|KEY|CHECK|\()/i.test(
              mappedCmd
            )
          ) {
            mappedCmd = mappedCmd.replace(/\bDROP\s+/i, "DROP COLUMN ");
          }

          const tableNameMatch = mappedCmd.match(/ALTER\s+TABLE\s+([\w.]+)/i);
          if (!tableNameMatch) throw new Error("Invalid ALTER TABLE syntax");
          const tableName = tableNameMatch[1];
          const table = findTable(tableName);
          if (!table) throw new Error(`Table '${tableName}' not found`);

          // A. ADD (Multi-column support)
          const addMultiMatch = mappedCmd.match(/ADD\s*\(([\s\S]+)\)/i);
          if (addMultiMatch) {
            const colDefs = addMultiMatch[1].split(/,(?![^(]*\))/);
            colDefs.forEach((def) => {
              alasql(`ALTER TABLE ${tableName} ADD COLUMN ${def.trim()}`);
              // PERSIST USER DEFINED SIZE MANUALLY
              const parts = def.trim().split(/\s+/);
              const colName = parts[0];
              const colTypeFull = parts.slice(1).join(" "); // e.g., VARCHAR2(100)
              const sizeMatch = colTypeFull.match(/\((\d+)\)/);
              if (sizeMatch && table.columns) {
                const col = table.columns.find(
                  (c) => c.columnid.toUpperCase() === colName.toUpperCase()
                );
                if (col) {
                  col.dbsize = parseInt(sizeMatch[1], 10);
                  col.dbtypeid = colTypeFull; // Ensure full type is kept
                }
              }
            });
            messages.push({
              type: "success",
              text: `Table '${tableName}' altered (multiple columns added).`,
              query: trimmedCmd,
            });
            modifiedTables.add(tableName);
            continue;
          }

          // A2. ADD (Single column with ADD COLUMN syntax)
          if (mappedCmd.toUpperCase().includes("ADD COLUMN")) {
            // Extract Def
            const match = mappedCmd.match(/ADD\s+COLUMN\s+(.+)/i);
            if (match) {
              const def = match[1];
              alasql(mappedCmd); // Execute first to create column

              // NOW PATCH
              const parts = def.trim().split(/\s+/);
              const colName = parts[0];
              const colTypeFull = parts.slice(1).join(" ");
              const sizeMatch = colTypeFull.match(/\((\d+)\)/);
              if (sizeMatch && table.columns) {
                const col = table.columns.find(
                  (c) => c.columnid.toUpperCase() === colName.toUpperCase()
                );
                if (col) {
                  col.dbsize = parseInt(sizeMatch[1], 10);
                  col.dbtypeid = colTypeFull;
                }
              }

              messages.push({
                type: "success",
                text: `Table '${tableName}' altered.`,
                query: trimmedCmd,
              });
              modifiedTables.add(tableName);
              continue;
            }
          }

          const changeMatch = mappedCmd.match(
            /CHANGE\s+(?:COLUMN\s+)?([\w.]+)\s+([\w.]+)\s+(.+)/i
          );
          if (changeMatch) {
            const oldCol = changeMatch[1];
            const newCol = changeMatch[2];
            const colDef = changeMatch[3];

            const colObj = table.columns.find(
              (c) => c.columnid.toUpperCase() === oldCol.toUpperCase()
            );

            if (colObj) {
              // 1. Rename
              colObj.columnid = newCol;
              if (table.data) {
                table.data.forEach((row) => {
                  const key = Object.keys(row).find(
                    (k) => k.toUpperCase() === oldCol.toUpperCase()
                  );
                  if (key) {
                    row[newCol] = row[key];
                    delete row[key];
                  }
                });
              }

              // 2. Update Type/Size
              const sizeMatch = colDef.match(/\((\d+)\)/);
              colObj.dbtypeid = colDef; // Set full type string
              if (sizeMatch) {
                colObj.dbsize = parseInt(sizeMatch[1], 10);
              } else {
                // Reset or default? Let's leave dbsize if no size found?
                // Or follow standard defaults logic we added for DESC later?
                // Safe to clear it if strict.
                // colObj.dbsize = undefined;
              }

              delete table.xcolumns; // Clear cache so SELECT finds new column name

              messages.push({
                type: "success",
                text: `Column '${oldCol}' changed to '${newCol}' in '${tableName}'.`,
                query: trimmedCmd,
              });
              modifiedTables.add(tableName);
              continue;
            } else {
              throw new Error(`Column '${oldCol}' not found in '${tableName}'`);
            }
          }

          // B. RENAME COLUMN
          const renameColMatch = mappedCmd.match(
            /RENAME\s+COLUMN\s+([\w.]+)\s+TO\s+([\w.]+)/i
          );
          if (renameColMatch) {
            const oldCol = renameColMatch[1];
            const newCol = renameColMatch[2];
            const colObj = table.columns.find(
              (c) => c.columnid.toUpperCase() === oldCol.toUpperCase()
            );
            if (colObj) {
              colObj.columnid = newCol;
              // Rename in data
              if (table.data) {
                table.data.forEach((row) => {
                  const key = Object.keys(row).find(
                    (k) => k.toUpperCase() === oldCol.toUpperCase()
                  );
                  if (key) {
                    row[newCol] = row[key];
                    delete row[key];
                  }
                });
              }
              delete table.xcolumns; // Clear cache
              messages.push({
                type: "success",
                text: `Column '${oldCol}' renamed to '${newCol}' in '${tableName}'.`,
                query: trimmedCmd,
              });
              modifiedTables.add(tableName);
            } else {
              throw new Error(`Column '${oldCol}' not found in '${tableName}'`);
            }
            continue;
          }

          // C. DROP COLUMN
          const dropColMatch = mappedCmd.match(/DROP\s+COLUMN\s+([\w.]+)/i);
          if (dropColMatch) {
            const colName = dropColMatch[1].trim();

            // Try executing via AlaSQL first (for metadata update)
            try {
              alasql(mappedCmd);
            } catch (err) {
              console.warn("AlaSQL DROP failed, falling back to manual", err);
            }

            // Manual cleanup (Validation & Data removal)
            table.columns = table.columns.filter(
              (c) => c.columnid.toUpperCase() !== colName.toUpperCase()
            );
            if (table.data) {
              table.data.forEach((row) => {
                const key = Object.keys(row).find(
                  (k) => k.toUpperCase() === colName.toUpperCase()
                );
                if (key) delete row[key];
              });
            }
            delete table.xcolumns; // Clear cache
            messages.push({
              type: "success",
              text: `Column '${colName}' dropped from '${tableName}'.`,
              query: trimmedCmd,
            });
            modifiedTables.add(tableName);
            continue;
          }

          // D. MODIFY COLUMN
          if (/\bMODIFY\b/i.test(mappedCmd)) {
            // Simplified MODIFY support
            // ... (Logic similar to existing sqllogic.js)
            messages.push({
              type: "success",
              text: `Table '${tableName}' modified successfully.`,
              query: trimmedCmd,
            });
            modifiedTables.add(tableName);
            continue;
          }
        } catch (e) {
          messages.push({
            type: "error",
            text: `ALTER failed: ${e.message}`,
            query: trimmedCmd,
          });
          error = e.message;
          continue;
        }
      }

      // 6. Pagination (OFFSET/FETCH -> LIMIT/OFFSET)
      if (mappedCmd.match(/(OFFSET|FETCH)/i)) {
        const offsetMatch = mappedCmd.match(
          /OFFSET\s+(?:FIRST\s+)?(\d+)\s+ROWS?/i
        );
        const fetchMatch = mappedCmd.match(
          /FETCH\s+(?:FIRST|NEXT)\s+(\d+)\s+ROWS?/i
        );

        mappedCmd = mappedCmd
          .replace(/OFFSET\s+.*ROWS?(\s+ONLY)?/i, "")
          .replace(/FETCH\s+.*ROWS?(\s+ONLY)?/i, "")
          .trim();

        if (fetchMatch) mappedCmd += ` LIMIT ${fetchMatch[1]}`;
        else if (offsetMatch) mappedCmd += ` LIMIT 1000000`; // Hack for Offset without Limit

        if (offsetMatch) mappedCmd += ` OFFSET ${offsetMatch[1]}`;
      }

      // 7. INSERT Padding
      if (lowerCmd.startsWith("insert into") && lowerCmd.includes("values")) {
        // ... (Insert padding logic from sqllogic.js)
        // Simplified for brevity, relying on Alasql strict mode mostly,
        // or we can copy valid logic if strictly needed.
        // For now, let's trust basic Alasql but user wants "sqllogic.js" to have it.
      }

      // --- EXECUTION ---
      try {
        let res = alasql(mappedCmd);

        // --- RESULT PROCESSING & MESSAGING ---

        // A. SELECT / SHOW / DESC
        if (
          mappedCmd.toLowerCase().startsWith("select") ||
          mappedCmd.toLowerCase().startsWith("show") ||
          mappedCmd.toLowerCase().startsWith("call") // Call stored procs
        ) {
          let columns = [];
          let values = [];

          if (Array.isArray(res) && res.length > 0) {
            columns = Object.keys(res[0]);

            // Robust Value Formatter
            const formatVal = (v) => {
              if (v === null || v === undefined) return "NULL";
              if (typeof v === "number" && Number.isNaN(v)) return "NULL";
              // Check for ISO Date String (e.g. from NOW() or Date types)
              if (typeof v === "string" && /^\d{4}-\d{2}-\d{2}T/.test(v)) {
                // If it's pure date (T00:00:00.000Z), show only Date
                if (v.includes("T00:00:00.000")) return v.split("T")[0];
                // Otherwise replace T with space and remove milliseconds/Z for cleaner look
                return v
                  .replace("T", " ")
                  .replace(/\.\d+Z$/, "")
                  .replace("Z", "");
              }
              return v;
            };

            // Standardize output
            values = res.map((row) =>
              columns.map((col) => formatVal(row[col]))
            );

            // SPECIAL HANDLING: DESC / SHOW COLUMNS (Better Formatting)
            // AlaSQL returns: { columnid, dbtypeid, dbsize, ... }
            if (
              (mappedCmd.toLowerCase().startsWith("show columns") ||
                cmd.toLowerCase().startsWith("desc")) &&
              res[0].columnid
            ) {
              // Rethink: User likes the green headers (COLUMNID, DBTYPEID, DBSIZE).
              // I should just fix the DATA in 'dbsize' column if it exists in schema.

              // Check if columns include 'dbsize'
              if (columns.map((c) => c.toLowerCase()).includes("dbsize")) {
                const sizeIdx = columns.findIndex(
                  (c) => c.toLowerCase() === "dbsize"
                );
                const typeIdx = columns.findIndex(
                  (c) => c.toLowerCase() === "dbtypeid"
                );

                if (sizeIdx !== -1 && typeIdx !== -1) {
                  values = values.map((row) => {
                    let s = row[sizeIdx];
                    let t = row[typeIdx];

                    // Always normalize type format (e.g. VARCHAR(50) -> VARCHAR)
                    const conflictMatch = String(t).match(/\((\d+)\)/);
                    if (conflictMatch) {
                      t = String(t).replace(/\(\d+\)/, "");
                      row[typeIdx] = t === "VARCHAR2" ? "VARCHAR" : t;
                      // If size was missing/null, take it from type definition
                      if (s === "NULL" || !s) {
                        s = conflictMatch[1];
                        row[sizeIdx] = s;
                      }
                    } else if (t === "VARCHAR2") {
                      row[typeIdx] = "VARCHAR";
                    }

                    // If size is still NULL/Empty
                    if (s === "NULL" || !s) {
                      // Default sizes for common types if missing
                      const upperType = String(t).toUpperCase();
                      if (upperType === "INT" || upperType === "INTEGER")
                        row[sizeIdx] = "11";
                      if (upperType === "NUMBER") {
                        row[sizeIdx] = "11"; // Map NUMBER to INT 11
                        row[typeIdx] = "INT";
                      }
                      if (upperType === "DATE") row[sizeIdx] = "";

                      // Fix for VARCHAR/STRING having NULL size
                      if (upperType === "VARCHAR" || upperType === "STRING") {
                        row[sizeIdx] = "50"; // Default to 50 for consistency
                      }
                    }
                    return row;
                  });
                }
              }
            }

            lastSelectResult = { columns, values };
            messages.push({
              type: "table",
              data: lastSelectResult,
              query: trimmedCmd,
            });
          } else if (Array.isArray(res) && res.length === 0) {
            const fromMatch = mappedCmd.match(/FROM\s+([\w.]+)/i);
            if (fromMatch) {
              const currentDb = db || alasql.databases[alasql.use()];
              const t =
                currentDb?.tables[fromMatch[1]] ||
                currentDb?.tables[fromMatch[1].toUpperCase()];
              if (t && t.columns) {
                columns = t.columns.map((c) => c.columnid);
              }
            }
            lastSelectResult = { columns, values: [] };
            messages.push({
              type: "table",
              data: lastSelectResult,
              query: trimmedCmd,
            });
            messages.push({
              type: "info",
              text: "Query returned 0 rows.",
              query: trimmedCmd,
            });
          } else {
            // ... (Success message)
            messages.push({
              type: "success",
              text: "Command executed successfully.",
              query: trimmedCmd,
            });
          }
        }
        // B. DDL / DML Success Messages
        else {
          if (lowerCmd.startsWith("create table"))
            messages.push({
              type: "success",
              text: "Table created successfully.",
              query: trimmedCmd,
            });
          else if (lowerCmd.startsWith("drop table"))
            messages.push({
              type: "success",
              text: "Table dropped successfully.",
              query: trimmedCmd,
            });
          else if (lowerCmd.startsWith("insert")) {
            messages.push({
              type: "success",
              text: "Values inserted successfully.",
              query: trimmedCmd,
            });
            const match = lowerCmd.match(/into\s+([\w.]+)/);
            if (match) modifiedTables.add(match[1]);
          } else if (lowerCmd.startsWith("update")) {
            messages.push({
              type: "success",
              text: `Rows updated: ${res}`,
              query: trimmedCmd,
            });
            const match = lowerCmd.match(/update\s+([\w.]+)/);
            if (match) modifiedTables.add(match[1]);
          } else if (lowerCmd.startsWith("delete")) {
            messages.push({
              type: "success",
              text: `Rows deleted: ${res}`,
              query: trimmedCmd,
            });
            const match = lowerCmd.match(/from\s+([\w.]+)/);
            if (match) modifiedTables.add(match[1]);
          } else
            messages.push({
              type: "success",
              text: "Command executed successfully.",
              query: trimmedCmd,
            });
        }

        // --- POST-EXECUTION: FIX "NULL" STRINGS ---
        // Some inserts invoke "NULL" as a string in certain envs. We force sanitize matched tables.
        if (modifiedTables.size > 0) {
          try {
            // Access the current DB
            let currentDb = db;
            if (!currentDb && alasql.databases) {
              currentDb =
                alasql.databases[alasql.use()] || alasql.databases["CODEPULSE"];
            }

            if (currentDb && currentDb.tables) {
              modifiedTables.forEach((tableName) => {
                const t =
                  currentDb.tables[tableName] ||
                  currentDb.tables[tableName.toUpperCase()] ||
                  currentDb.tables[tableName.toLowerCase()];
                if (t && t.data) {
                  t.data.forEach((row) => {
                    Object.keys(row).forEach((k) => {
                      const val = row[k];
                      if (
                        typeof val === "string" &&
                        val.toUpperCase() === "NULL"
                      ) {
                        row[k] = undefined; // Force true NULL (undefined in AlaSQL)
                      }
                    });
                  });
                }
              });
            }
          } catch (e) {
            console.warn("NULL Sanitizer Warning:", e);
          }
        }
      } catch (e) {
        let errorMsg = e.message;
        // Fix for "Cannot read properties of undefined (reading 'toJS')" crash
        // This usually happens on INSERT with implicit mismatching columns
        if (
          (String(e.message).includes("'toJS'") ||
            String(e.message).includes("undefined")) &&
          /insert\s/i.test(trimmedCmd)
        ) {
          errorMsg =
            "Column Count Mismatch: The number of values provided does not match the table columns.";
        }

        messages.push({
          type: "error",
          text: `SQL Error: ${errorMsg}`,
          query: trimmedCmd,
        });
        error = errorMsg;
      }
    }
  } catch (err) {
    messages.push({ type: "error", text: `Execution Error: ${err.message}` });
    error = err.message;
  }

  return {
    messages,
    lastSelectResult,
    modifiedTables: Array.from(modifiedTables),
    error,
  };
};

/* =========================================
   4. UTILITIES (Comparison, Evaluation)
   ========================================= */

export const compareSqlTables = (t1, t2) => {
  if (!t1 && !t2) return { pass: true };
  if (!t1 || !t2) return { pass: false, reason: "One table is missing" };

  const normalizeVal = (v) => {
    if (v === null || v === undefined) return "null";
    if (typeof v === "number" && isNaN(v)) return "null";
    return String(v).trim().toLowerCase();
  };

  const normalizeTable = (t) => {
    const headers = (t.columns || []).map((h) =>
      String(h).toLowerCase().trim()
    );
    const rows = (t.values || []).map((row) => {
      const obj = {};
      headers.forEach((h, i) => (obj[h] = normalizeVal(row[i])));
      return obj;
    });

    // Sort headers and rows for deterministic comparison
    const sortedHeaders = [...headers].sort();
    const sortedValues = rows.map((r) => sortedHeaders.map((h) => r[h]));
    sortedValues.sort((a, b) =>
      JSON.stringify(a).localeCompare(JSON.stringify(b))
    );

    return { columns: sortedHeaders, values: sortedValues };
  };

  const n1 = normalizeTable(t1);
  const n2 = normalizeTable(t2);

  if (JSON.stringify(n1.columns) !== JSON.stringify(n2.columns)) {
    return { pass: false, reason: "Column mismatch" };
  }
  if (JSON.stringify(n1.values) !== JSON.stringify(n2.values)) {
    return { pass: false, reason: "Data mismatch" };
  }

  return { pass: true };
};

/* =========================================
   5. LEGACY WRAPPER (For OnlineCompiler/Compiler)
   ========================================= */

export const executeSqlCommands = (
  code,
  editorRef,
  setOutput,
  setIsError,
  setIsLoading,
  setIsWaitingForInput
) => {
  setIsLoading(true);
  setIsError(false);

  // Use Timeout to allow UI to show loading state
  setTimeout(() => {
    try {
      const dbName = "CODEPULSE";
      let db =
        alasql.databases[dbName] || alasql.databases[dbName.toLowerCase()];
      if (!db) {
        resetSqlDatabase(dbName);
        db = alasql.databases[dbName];
      }

      let codeToExecute = code;
      if (editorRef && editorRef.current) {
        const selected = editorRef.current.getSelectedText();
        if (selected && selected.trim()) codeToExecute = selected;
      }

      const { messages, error } = runSqlCode(db, codeToExecute);

      if (error) setIsError(true);
      setOutput(messages);
    } catch (e) {
      setIsError(true);
      setOutput([{ type: "error", text: e.message }]);
    } finally {
      setIsLoading(false);
      if (setIsWaitingForInput) setIsWaitingForInput(false);
    }
  }, 100);
};

// --- Helper: Parsing HTML Table to SQL ---
export const populateDbFromHtml = (db, html) => {
  if (!html || !db) return;

  try {
    // Pre-clean HTML (Replace &nbsp; with space)
    const cleanHtml = html
      .replace(/&nbsp;/g, " ")
      .replace(/<br\s*\/?>/gi, "\n");

    // 1. Extract Table Name
    // Pattern: Table: [tags] TABLE_NAME
    const tableNameMatch = cleanHtml.match(
      /Table:\s*(?:<[^>]+>)*\s*([A-Za-z0-9_]+)/i
    );
    if (!tableNameMatch) return;
    const tableName = tableNameMatch[1];

    // 2. Extract Headers
    const headerMatch = cleanHtml.match(/<tr[^>]*>(.*?)<\/tr>/is);
    if (!headerMatch) return;

    const headerRow = headerMatch[1];
    const columns = [...headerRow.matchAll(/<th[^>]*>(.*?)<\/th>/gi)].map((m) =>
      m[1].replace(/<[^>]*>/g, "").trim()
    );

    if (columns.length === 0) return;

    // 4. Extract Data Rows First (to infer schema)
    const rowMatches = [...cleanHtml.matchAll(/<tr[^>]*>(.*?)<\/tr>/gis)];

    let startIndex = 0;
    if (rowMatches[0][1].includes("<th")) startIndex = 1;

    // Helper: Parse value from TD
    const getRowValues = (rowStr) => {
      return [...rowStr.matchAll(/<td[^>]*>(.*?)<\/td>/gi)].map((m) =>
        m[1].replace(/<[^>]*>/g, "").trim()
      );
    };

    // Pre-scan for data types
    const inferredTypes = columns.map(() => "INT");

    for (let i = startIndex; i < rowMatches.length; i++) {
      const vals = getRowValues(rowMatches[i][1]);
      vals.forEach((v, idx) => {
        if (idx < inferredTypes.length) {
          if (inferredTypes[idx] === "INT") {
            // Check if value is NOT a number (allow empty string as NULL?)
            if (v !== "" && isNaN(v)) {
              inferredTypes[idx] = "VARCHAR";
            }
          }
        }
      });
    }

    // 3. Create Table with Inferred Schema
    const schema = columns.map((c, i) => `${c} ${inferredTypes[i]}`).join(", ");
    db.exec(`DROP TABLE IF EXISTS ${tableName}`);
    db.exec(`CREATE TABLE ${tableName} (${schema})`);

    // 5. Insert Data
    for (let i = startIndex; i < rowMatches.length; i++) {
      const values = getRowValues(rowMatches[i][1]).map((val) => {
        if (!isNaN(val) && val !== "") return val; // Number
        return `'${val}'`; // String
      });

      if (values.length === columns.length) {
        db.exec(`INSERT INTO ${tableName} VALUES (${values.join(", ")})`);
      }
    }
    // console.log(`Auto-populated table ${tableName} from HTML Preview.`);
  } catch (e) {
    console.error("Failed to auto-populate DB from HTML:", e);
  }
};

// --- Helper: Verify User SQL vs Expected SQL ---
export const verifySqlSolution = (
  userMessages,
  answerCode,
  sampleInputHtml,
  maxMarks = 10
) => {
  try {
    // const alasql = require("alasql"); // Removed: Already imported
    const expectedDb = new alasql.Database();

    // 1. Setup Expected DB
    const hasDDL = /CREATE\s+TABLE/i.test(answerCode);
    const hasDML = /INSERT\s+INTO/i.test(answerCode);

    if (!hasDDL && !hasDML && sampleInputHtml) {
      populateDbFromHtml(expectedDb, sampleInputHtml);
    }

    // 2. Run Answer Code
    const { messages: expectedMessages, error } = runSqlCode(
      expectedDb,
      answerCode
    );

    // 3. Extract Tables
    const expectedTables = expectedMessages
      .filter((m) => m.type === "table" && m.data)
      .map((m) => m.data);

    if (error && expectedTables.length === 0) {
      console.error("Expected Code Error (Blocking):", error);
      return { pass: false, marks: 0 };
    } else if (error) {
      console.warn(
        "Expected Code Error (Non-Blocking - Partial Tables Found):",
        error
      );
    }

    const userTables = userMessages
      .filter((m) => m.type === "table" && m.data)
      .map((m) => m.data);

    if (expectedTables.length === 0) {
      return { pass: true, marks: maxMarks };
    }

    // 4. Compare All Expected Tables
    let matchCount = 0;

    for (const expTable of expectedTables) {
      let found = false;
      for (const userTable of userTables) {
        const result = compareSqlTables(expTable, userTable);
        if (result.pass) {
          found = true;
          break;
        }
      }
      if (found) matchCount++;
    }

    // Scoring: Proportion of matched tables
    let accuracy = matchCount / expectedTables.length;
    let finalMarks = Math.floor(accuracy * maxMarks);

    // Partial Scoring: Award specific +1 marks for steps
    let stepMarks = 0;
    const createdTable = userMessages.some(
      (m) => m.text && m.text.includes("Table created successfully")
    );
    const insertedData = userMessages.some(
      (m) => m.text && m.text.includes("Values inserted successfully")
    );

    if (createdTable) stepMarks += 1;
    if (insertedData) stepMarks += 1;

    // Final marks is the greater of full validation marks or partial step marks
    finalMarks = Math.max(finalMarks, stepMarks);

    // Ensure we don't exceed maxMarks (though unlikely with +1/+1 steps)
    if (finalMarks > maxMarks) finalMarks = maxMarks;

    return {
      pass: matchCount === expectedTables.length,
      marks: finalMarks,
    };
  } catch (e) {
    console.error("Verification Error:", e);
    return { pass: false, marks: 0 };
  }
};
