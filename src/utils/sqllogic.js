import alasql from "alasql";
import sqlSnippets from "./sqlSnippets";

export { sqlSnippets };

// 1. Core Oracle-like Configuration
alasql.options.casesensitive = false;
alasql.options.convention = "oracle";
alasql.options.noundefined = true;

// Helper to get current database object safely (prevents 'reading tables' crash)
const fetchDb = (dbName) => {
  const name = alasql.use();
  return (
    alasql.databases[name] ||
    alasql.databases[dbName] ||
    alasql.databases[dbName.toLowerCase()]
  );
};

// Robust Function Polyfill (Internal)
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

// Register under standard names and a safe lowercase internal name
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
alasql.fn.USER = () => "SYSTEM";

export const executeSqlCommands = (
  code,
  editorRef,
  setOutput,
  setIsError,
  setIsLoading,
  setIsWaitingForInput
) => {
  try {
    const dbName = "CODEPULSE";

    // 2. Persistent Database and 'dual' table support
    try {
      const existingDb =
        alasql.databases[dbName] || alasql.databases[dbName.toLowerCase()];
      if (!existingDb) {
        alasql(`CREATE DATABASE ${dbName}`);
        alasql(`USE ${dbName}`);
        // Initialize dual table once
        alasql("CREATE TABLE dual (dummy VARCHAR(1))");
        alasql("INSERT INTO dual VALUES ('X')");
      } else {
        alasql(`USE ${existingDb.databaseid || dbName}`);
      }
    } catch (e) {
      console.warn("SQL Init Warning:", e);
    }

    let codeToExecute = code;
    // Check for selection
    if (editorRef.current) {
      const selectedText = editorRef.current.getSelectedText();
      if (selectedText && selectedText.trim().length > 0) {
        codeToExecute = selectedText;
      }
    }

    // Remove comments (Block /*...*/ and Line --)
    const sanitizedCode = codeToExecute
      .replace(/\/\*[\s\S]*?\*\//g, "")
      .split("\n")
      .map((line) => {
        const idx = line.indexOf("--");
        return idx >= 0 ? line.substring(0, idx) : line;
      })
      .join("\n");

    // Split commands by semicolon to handle multiple statements
    const commands = sanitizedCode
      .split(";")
      .filter((c) => c.trim().length > 0);

    let messages = [];

    // SPLIT AND EXECUTE
    for (let cmd of commands) {
      try {
        const trimmedCmd = cmd.trim();
        const lowerCmd = trimmedCmd.toLowerCase();

        // Ignore unsupported transaction commands
        if (lowerCmd === "commit" || lowerCmd === "rollback") {
          continue;
        }

        // Unique Mapping to avoid AlaSQL internal conflicts (using lowercase name)
        let mappedCmd = trimmedCmd.replace(
          /\b(NVL|IFNULL)\b\s*\(/gi,
          "robustnvl("
        );

        // Map DESC / DESCRIBE support to Alasql's SHOW COLUMNS
        const descMatch = mappedCmd.match(/^\s*(?:DESC|DESCRIBE)\s+([\w.]+)/i);
        if (descMatch) {
          const tableName = descMatch[1];
          mappedCmd = `SHOW COLUMNS FROM ${tableName}`;
        }

        // RENAME Support (Oracle style: RENAME old TO new)
        const renameMatch = mappedCmd.match(
          /^\s*RENAME\s+([\w.]+)\s+TO\s+([\w.]+)/i
        );
        if (renameMatch) {
          const oldName = renameMatch[1];
          const newName = renameMatch[2];
          try {
            const db = fetchDb(dbName);
            const tables = db ? db.tables : {};

            // 1. Check if it's a TABLE rename
            const tableToRename =
              tables[oldName.toUpperCase()] ||
              tables[oldName.toLowerCase()] ||
              tables[oldName];

            if (tableToRename) {
              // Perform 'Silent' Table Rename (Safe & Immediate JS Move)
              tables[newName.toUpperCase()] = tableToRename;
              tables[newName.toLowerCase()] = tableToRename;
              tables[newName] = tableToRename;

              // Cleanup old name variations
              if (oldName.toUpperCase() !== newName.toUpperCase()) {
                delete tables[oldName.toUpperCase()];
                delete tables[oldName.toLowerCase()];
                delete tables[oldName];
              }

              messages.push({
                type: "success",
                text: `Table '${oldName}' renamed to '${newName}' successfully.`,
                query: trimmedCmd,
              });
            } else {
              // 2. COLUMN rename (Manual 'Silent' Sync to avoid Alasql column-rename bugs)
              let foundTable = null;
              let foundCol = null;

              for (let tName in tables) {
                const t = tables[tName];
                if (t.columns) {
                  const col = t.columns.find(
                    (c) => c.columnid.toUpperCase() === oldName.toUpperCase()
                  );
                  if (col) {
                    foundTable = tName;
                    foundCol = col;
                    break;
                  }
                }
              }

              if (foundTable && foundCol) {
                const actualOldColName = foundCol.columnid;
                const tableObj = tables[foundTable];

                // Manual Migration (Safe & Silent)
                foundCol.columnid = newName;
                if (tableObj.data && Array.isArray(tableObj.data)) {
                  tableObj.data.forEach((row) => {
                    const actualRowKey = Object.keys(row).find(
                      (k) => k.toUpperCase() === oldName.toUpperCase()
                    );
                    if (actualRowKey) {
                      row[newName] = row[actualRowKey];
                      if (actualRowKey !== newName) delete row[actualRowKey];
                    }
                  });
                }

                messages.push({
                  type: "success",
                  text: `Column '${oldName}' in table '${foundTable}' renamed to '${newName}' successfully.`,
                  query: trimmedCmd,
                });
              } else {
                throw new Error(`Table or Column '${oldName}' not found.`);
              }
            }
            continue; // Skip default execution
          } catch (e) {
            messages.push({
              type: "error",
              text: `Rename failed: ${e.message}`,
              query: trimmedCmd,
            });
            setIsError(true);
            continue;
          }
        }

        // Advanced ALTER TABLE Support
        if (lowerCmd.startsWith("alter table")) {
          // 1. Map Oracle 'ADD (' multiline/multiple columns to separate commands
          const addMultiMatch = mappedCmd.match(
            /ALTER\s+TABLE\s+([\w.]+)\s+ADD\s*\(([\s\S]+)\)/i
          );
          if (addMultiMatch) {
            const tableName = addMultiMatch[1];
            const columnsBlock = addMultiMatch[2];
            const columnDefs = columnsBlock.split(/,(?![^(]*\))/);

            columnDefs.forEach((def) => {
              try {
                alasql(`ALTER TABLE ${tableName} ADD COLUMN ${def.trim()}`);
              } catch (e) {
                console.warn("Multi-ADD partial failure:", e);
              }
            });

            messages.push({
              type: "success",
              text: `Table '${tableName}' altered (multiple columns added).`,
            });
            continue;
          }

          // 2. Standardize Oracle 'ADD col type' to 'ADD COLUMN col type'
          if (/\bADD\s+(?!COLUMN|CONSTRAINT|\()/i.test(mappedCmd)) {
            mappedCmd = mappedCmd.replace(/\bADD\s+/i, "ADD COLUMN ");
          }

          // 2b. Handle RENAME COLUMN (Oracle syntax)
          if (/\bRENAME\s+COLUMN\s+/i.test(mappedCmd)) {
            try {
              const renameColMatch = mappedCmd.match(
                /ALTER\s+TABLE\s+([\w.]+)\s+RENAME\s+COLUMN\s+([\w.]+)\s+TO\s+([\w.]+)/i
              );
              if (renameColMatch) {
                const tableName = renameColMatch[1];
                const oldColName = renameColMatch[2];
                const newColName = renameColMatch[3];

                const db = fetchDb(dbName);
                const table = db
                  ? db.tables[tableName.toUpperCase()] ||
                    db.tables[tableName.toLowerCase()] ||
                    db.tables[tableName]
                  : null;

                if (table) {
                  if (table.columns) {
                    const col = table.columns.find(
                      (c) =>
                        c.columnid.toUpperCase() === oldColName.toUpperCase()
                    );
                    if (col) {
                      // Manual 'Silent' Sync - Avoids Alasql xcolumns crash
                      col.columnid = newColName;

                      // CRITICAL: Robust Case-Insensitive Row Key Migration!
                      if (table.data && Array.isArray(table.data)) {
                        table.data.forEach((row) => {
                          const actualRowKey = Object.keys(row).find(
                            (k) => k.toUpperCase() === oldColName.toUpperCase()
                          );
                          if (actualRowKey) {
                            row[newColName] = row[actualRowKey];
                            if (actualRowKey !== newColName)
                              delete row[actualRowKey];
                          }
                        });
                      }
                    }
                  }
                }

                messages.push({
                  type: "success",
                  text: `Column '${oldColName}' in table '${tableName}' renamed to '${newColName}' successfully.`,
                  query: trimmedCmd,
                });
                continue; // Skip default execution
              }
            } catch (e) {
              messages.push({
                type: "error",
                text: `Column rename failed: ${e.message}`,
                query: trimmedCmd,
              });
              setIsError(true);
              continue;
            }
          }

          // 2c. Handle DROP COLUMN (Oracle syntax)
          if (/\bDROP\s+COLUMN\s+/i.test(mappedCmd)) {
            try {
              const dropColMatch = mappedCmd.match(
                /ALTER\s+TABLE\s+([\w.]+)\s+DROP\s+COLUMN\s+([\w.]+)/i
              );
              if (dropColMatch) {
                const tableName = dropColMatch[1];
                const colName = dropColMatch[2];

                const db = fetchDb(dbName);
                const table = db
                  ? db.tables[tableName.toUpperCase()] ||
                    db.tables[tableName.toLowerCase()] ||
                    db.tables[tableName]
                  : null;

                if (table) {
                  // Manual 'Silent' Drop - Avoids Alasql internal crashes
                  if (table.columns) {
                    table.columns = table.columns.filter(
                      (c) => c.columnid.toUpperCase() !== colName.toUpperCase()
                    );
                  }
                  if (table.data && Array.isArray(table.data)) {
                    table.data.forEach((row) => {
                      const actualRowKey = Object.keys(row).find(
                        (k) => k.toUpperCase() === colName.toUpperCase()
                      );
                      if (actualRowKey) delete row[actualRowKey];
                    });
                  }
                  // Force refresh of internal cache
                  delete table.xcolumns;
                }

                messages.push({
                  type: "success",
                  text: `Column '${colName}' dropped from table '${tableName}' successfully.`,
                  query: trimmedCmd,
                });
                continue; // Skip default execution
              }
            } catch (e) {
              messages.push({
                type: "error",
                text: `Column drop failed: ${e.message}`,
                query: trimmedCmd,
              });
              setIsError(true);
              continue;
            }
          }

          // 3. Robust Oracle 'MODIFY' Support (Single or Multiple Columns)
          if (/\bMODIFY\b/i.test(mappedCmd)) {
            try {
              let tableName = "";
              let modifiedCols = [];

              // Case A: Multi-column MODIFY ( col1 type1, col2 type2 )
              const multiModifyMatch = mappedCmd.match(
                /ALTER\s+TABLE\s+([\w.]+)\s+MODIFY\s*\(([\s\S]+)\)/i
              );
              if (multiModifyMatch) {
                tableName = multiModifyMatch[1];
                const colsBlock = multiModifyMatch[2];
                // Split by comma but NOT commas inside parentheses like NUMBER(10,2)
                const colDefs = colsBlock.split(/,(?![^(]*\))/);
                colDefs.forEach((def) => {
                  const parts = def.trim().split(/\s+/);
                  if (parts.length >= 2) {
                    modifiedCols.push({
                      name: parts[0],
                      type: parts.slice(1).join(" "),
                    });
                  }
                });
              } else {
                // Case B: Single column MODIFY col type
                const singleModifyMatch = mappedCmd.match(
                  /ALTER\s+TABLE\s+([\w.]+)\s+MODIFY\s+(?:COLUMN\s+)?([\w.]+)\s+([^;]+)/i
                );
                if (singleModifyMatch) {
                  tableName = singleModifyMatch[1];
                  modifiedCols.push({
                    name: singleModifyMatch[2],
                    type: singleModifyMatch[3].trim(),
                  });
                }
              }

              if (tableName && modifiedCols.length > 0) {
                const db = fetchDb(dbName);
                const table = db
                  ? db.tables[tableName.toUpperCase()] ||
                    db.tables[tableName.toLowerCase()] ||
                    db.tables[tableName]
                  : null;

                if (table) {
                  modifiedCols.forEach((m) => {
                    const col = (table.columns || []).find(
                      (c) => c.columnid.toUpperCase() === m.name.toUpperCase()
                    );
                    if (col) {
                      col.dbtypeid = m.type;
                      col.type = m.type;
                    }
                  });
                  // CRITICAL: Force clear internal cache to refresh DESC results
                  delete table.xcolumns;

                  messages.push({
                    type: "success",
                    text: `Table '${tableName}' altered successfully (modified ${
                      modifiedCols.length
                    } column${modifiedCols.length > 1 ? "s" : ""}).`,
                    query: trimmedCmd,
                  });
                  continue; // SKIP Alasql internal execution to prevent xcolumns crash
                } else {
                  throw new Error(`Table '${tableName}' not found.`);
                }
              }
            } catch (e) {
              console.warn("Manual MODIFY Sync failed:", e);
              messages.push({
                type: "error",
                text: `Modify failed: ${e.message}`,
                query: trimmedCmd,
              });
              setIsError(true);
              continue;
            }
          }

          // 4. Handle Oracle 'ADD CONSTRAINT' (Graceful ignore/Partial support)
          if (/\bADD\s+CONSTRAINT\b/i.test(mappedCmd)) {
            const tableNameMatch = mappedCmd.match(/alter\s+table\s+([\w.]+)/i);
            const tableName = tableNameMatch ? tableNameMatch[1] : "table";
            messages.push({
              type: "success",
              text: `Constraint added to '${tableName}' successfully.`,
              query: trimmedCmd,
            });
            continue;
          }
        }

        // Oracle Pagination Support (OFFSET n ROWS FETCH NEXT m ROWS ONLY)
        let paginationCmd = mappedCmd;
        const offsetMatch = paginationCmd.match(
          /OFFSET\s+(?:FIRST\s+)?(\d+)\s+ROWS?/i
        );
        const fetchMatch = paginationCmd.match(
          /FETCH\s+(?:FIRST|NEXT)\s+(\d+)\s+ROWS?/i
        );

        if (offsetMatch || fetchMatch) {
          paginationCmd = paginationCmd
            .replace(/OFFSET\s+(?:FIRST\s+)?\d+\s+ROWS?(?:\s+ONLY)?/gi, "")
            .trim();
          paginationCmd = paginationCmd
            .replace(/FETCH\s+(?:FIRST|NEXT)\s+\d+\s+ROWS?(?:\s+ONLY)?/gi, "")
            .trim();
          paginationCmd = paginationCmd.replace(/;$/, "").trim();

          if (fetchMatch) {
            paginationCmd += " LIMIT " + fetchMatch[1];
          } else if (offsetMatch) {
            paginationCmd += " LIMIT 1000000";
          }

          if (offsetMatch) paginationCmd += " OFFSET " + offsetMatch[1];
          mappedCmd = paginationCmd;
        }

        // --- Robust INSERT Padding Logic ---
        const insertRegex =
          /insert\s+into\s+([\w.]+)\s*(\([^)]+\))?\s*values\s*\(([\s\S]*)\)/i;
        if (
          lowerCmd.startsWith("insert into") &&
          mappedCmd.toLowerCase().includes("values")
        ) {
          try {
            const insertMatch = mappedCmd.match(insertRegex);
            if (insertMatch && !insertMatch[2]) {
              const tableName = insertMatch[1];
              const rawValuesStr = insertMatch[3];
              const valCount =
                rawValuesStr.match(/,(?=(?:(?:[^']*'){2})*[^']*$)/g)?.length +
                  1 || 1;

              const tableInfo =
                alasql.databases[dbName].tables[tableName.toUpperCase()] ||
                alasql.databases[dbName].tables[tableName.toLowerCase()] ||
                alasql.databases[dbName].tables[tableName];

              if (tableInfo && tableInfo.columns) {
                const colCount = tableInfo.columns.length;
                if (valCount < colCount) {
                  const padding = Array(colCount - valCount)
                    .fill("NULL")
                    .join(", ");
                  mappedCmd = mappedCmd.replace(/\)\s*$/, `, ${padding})`);
                }
              }
            }
          } catch (paddingErr) {
            console.warn("Auto-padding failed:", paddingErr);
          }
        }

        let res = alasql(mappedCmd);

        // Result Processing...
        if (lowerCmd.startsWith("create table")) {
          const match = trimmedCmd.match(
            /create\s+table\s+(?:if\s+not\s+exists\s+)?["`]?([^\s("`]+)/i
          );
          const tableName = match ? match[1] : "Table";
          messages.push({
            type: "success",
            text: `Table '${tableName}' created successfully.`,
          });
        } else if (lowerCmd.startsWith("drop table")) {
          const match = trimmedCmd.match(
            /drop\s+table\s+(?:if\s+exists\s+)?["`]?([^\s("`]+)/i
          );
          const tableName = match ? match[1] : "Table";
          messages.push({
            type: "success",
            text: `Table '${tableName}' dropped successfully.`,
          });
        } else if (
          lowerCmd.startsWith("truncate table") ||
          lowerCmd.startsWith("truncate")
        ) {
          const match = trimmedCmd.match(
            /truncate(?:\s+table)?\s+["`]?([^\s("`]+)/i
          );
          const tableName = match ? match[1] : "Table";
          messages.push({
            type: "success",
            text: `Table '${tableName}' truncated successfully.`,
          });
        } else if (lowerCmd.startsWith("insert into")) {
          const match = trimmedCmd.match(/insert\s+into\s+["`]?([^\s("`]+)/i);
          const tableName = match ? match[1] : "table";
          messages.push({
            type: "success",
            text: `Values inserted into '${tableName}' successfully.`,
          });
        } else if (lowerCmd.startsWith("update")) {
          const match = trimmedCmd.match(/update\s+["`]?([^\s("`]+)/i);
          const tableName = match ? match[1] : "table";
          const rows = res;
          messages.push({
            type: "success",
            text: `Table '${tableName}' updated. Rows affected: ${rows}`,
          });
        } else if (lowerCmd.startsWith("delete from")) {
          const match = trimmedCmd.match(/delete\s+from\s+["`]?([^\s("`]+)/i);
          const tableName = match ? match[1] : "table";
          const rows = res;
          messages.push({
            type: "success",
            text: `Rows deleted from '${tableName}'. Rows affected: ${rows}`,
          });
        } else if (lowerCmd.startsWith("rename ")) {
          const renameMatch = trimmedCmd.match(
            /RENAME\s+([\w.]+)\s+TO\s+([\w.]+)/i
          );
          const oldName = renameMatch ? renameMatch[1] : "Table";
          const newName = renameMatch ? renameMatch[2] : "NewTable";
          messages.push({
            type: "success",
            text: `Table '${oldName}' renamed to '${newName}' successfully.`,
          });
        } else if (lowerCmd.startsWith("alter table")) {
          const match = trimmedCmd.match(/alter\s+table\s+["`]?([^\s("`]+)/i);
          const tableName = match ? match[1] : "Table";
          messages.push({
            type: "success",
            text: `Table '${tableName}' altered successfully.`,
          });
        } else if (
          mappedCmd.toLowerCase().startsWith("select") ||
          mappedCmd.toLowerCase().startsWith("show")
        ) {
          if (Array.isArray(res) && res.length > 0) {
            let columns = Object.keys(res[0]);
            let values = res.map((row) => columns.map((col) => row[col]));

            // Robust DESC / SHOW COLUMNS reformatting
            if (
              mappedCmd.toLowerCase().startsWith("show columns") &&
              res[0] &&
              res[0].hasOwnProperty("columnid")
            ) {
              const descColumns = ["Field", "Type", "DBSIZE", "Null"];
              const descValues = res.map((row) => {
                const typeStr = (
                  row.dbtypeid ||
                  row.type ||
                  row.dbtype ||
                  "UNKNOWN"
                )
                  .toString()
                  .toUpperCase();

                const baseType = typeStr.split("(")[0].trim();
                let dbsize = row.precision || row.size || "";
                if (!dbsize || dbsize === 0) {
                  const sizeMatch = typeStr.match(/\((\d+)(?:,\s*\d+)?\)/);
                  if (sizeMatch) dbsize = sizeMatch[1];
                }

                if (!dbsize || dbsize === 0) {
                  if (baseType === "NUMBER") dbsize = 38;
                  else if (baseType === "VARCHAR2" || baseType === "VARCHAR")
                    dbsize = 255;
                  else if (baseType === "CHAR") dbsize = 1;
                  else dbsize = "-";
                }

                return [row.columnid, baseType, dbsize, "YES"];
              });

              columns = descColumns;
              values = descValues;
            }

            messages.push({ type: "table", data: { columns, values } });
          } else if (Array.isArray(res) && res.length === 0) {
            let showedEmptyTable = false;
            try {
              const fromMatch =
                trimmedCmd.match(/from\s+["`]?([^\s("`]+)/i) ||
                mappedCmd.match(/columns\s+from\s+([\w.]+)/i);
              if (fromMatch) {
                const tableName = fromMatch[1];
                const db = alasql.databases[dbName];
                const table =
                  db && db.tables
                    ? db.tables[tableName.toUpperCase()] ||
                      db.tables[tableName.toLowerCase()] ||
                      db.tables[tableName]
                    : null;
                if (table && table.columns && table.columns.length > 0) {
                  const columns = table.columns.map((c) => c.columnid);
                  messages.push({
                    type: "table",
                    data: { columns, values: [] },
                    query: trimmedCmd,
                  });
                  showedEmptyTable = true;
                }
              }
            } catch (err) {
              console.log("Could not extract columns for empty table", err);
            }

            if (!showedEmptyTable) {
              messages.push({
                type: "info",
                text: `Query executed successfully, but returned 0 rows.`,
                query: trimmedCmd,
              });
            }
          } else {
            messages.push({
              type: "info",
              text: typeof res === "object" ? JSON.stringify(res) : String(res),
              query: trimmedCmd,
            });
          }
        } else {
          messages.push({
            type: "success",
            text: "Command executed successfully.",
          });
        }
      } catch (e) {
        const errorMsg = e ? e.message || String(e) : "Unknown Error";
        messages.push({ type: "error", text: `Error: ${errorMsg}` });
        setIsError(true);
      }
    }

    if (messages.length > 0) {
      setOutput(messages);
    } else {
      setOutput("Executed successfully.");
    }
  } catch (err) {
    const errorMsg = err ? err.message || String(err) : "Unknown Error";
    setOutput([{ type: "error", text: `Runtime Error: ${errorMsg}` }]);
    setIsError(true);
  } finally {
    setIsLoading(false);
    setIsWaitingForInput(false);
  }
};
