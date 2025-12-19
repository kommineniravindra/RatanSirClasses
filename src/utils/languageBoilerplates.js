export const languageBoilerplates = {
  HTML: `<!DOCTYPE html>
<html>
<head>
    <title>Welcome</title>
</head>
<body>

    <h1>Welcome to codepulse-r!</h1>

</body>
</html>`,
  CSS: `body {
    font-family: Arial, sans-serif;
    color: #333;
}

.container {
    padding: 20px;
    border: 1px solid #ccc;
}`,
  JavaScript: `function solveProblem() {
    // Write your code here
    console.log("Welcome to codepulse-r!");
}

solveProblem();`,
  Java: `public class Main {
    public static void main(String[] args) {
        // Write your Java code here
        System.out.println("Welcome to codepulse-r!");
    }
}`,
  Python: `def solve_problem():
    # Write your Python code here
    print("Welcome to codepulse-r!")

if __name__ == "__main__":
    solve_problem()`,
  SQL: `-- Write your SQL query here
SELECT 'SQL Query Ready';`,
  c: `#include <stdio.h>

int main() {
    printf("Welcome to codepulse-r!\\n");
    return 0;
}`,
  cpp: `#include <iostream>

int main() {
    std::cout << "Welcome to codepulse-r!" << std::endl;
    return 0;
}`,
  csharp: `using System;
  
namespace HelloWorld
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Welcome to codepulse-r!");
        }
    }
}`,
  TypeScript: `function solveProblem(): void {
    // Write your TypeScript code here
    console.log("Welcome to codepulse-r!");
}

solveProblem();`,
  Kotlin: `fun main() {
    // Write your Kotlin code here
    println("Welcome to codepulse-r!")
}`,
  Go: `package main

import "fmt"

func main() {
    // Write your Go code here
    fmt.Println("Welcome to codepulse-r!")
}`,
  Rust: `fn main() {
    // Write your Rust code here
    println!("Welcome to codepulse-r!");
}`,
  Scala: `object Main extends App {
    // Write your Scala code here
    println("Welcome to codepulse-r!")
}`,
  Swift: `print("Welcome to codepulse-r!")`,
  Ruby: `def solve()
    # Write your Ruby code here
    puts "Welcome to codepulse-r!"
end

solve()`,
  PHP: `<?php
    echo "Welcome to codepulse-r!";
?>`,
  Bash: `echo "Welcome to codepulse-r!"`,
  // For special cases where CSS needs an HTML wrapper (e.g. OnlineCompiler preview)
  CSS_Wrapper: `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CSS Preview</title>
    <style>
        body {
            background-color: #f0f0f0;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        h1 {
            color: #007bff;
            text-align: center;
        }
    </style>
</head>
<body>
    <h1>CSS Styling Applied!</h1>
    <p>This text is styled by the CSS code.</p>
</body>
</html>`,
};

// Helper for lower-case keys access if needed
export const getBoilerplate = (lang) => {
  const key = Object.keys(languageBoilerplates).find(
    (k) => k.toLowerCase() === lang.toLowerCase()
  );
  return key ? languageBoilerplates[key] : "";
};
