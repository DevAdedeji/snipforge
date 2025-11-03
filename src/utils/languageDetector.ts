type SupportedLanguage =
  | 'javascript'
  | 'typescript'
  | 'python'
  | 'php'
  | 'java'
  | 'c'
  | 'cpp'
  | 'csharp'
  | 'go'
  | 'rust'
  | 'ruby'
  | 'swift'
  | 'kotlin'
  | 'r'
  | 'sql'

export function detectLanguage(codeString: string): SupportedLanguage {
  // Remove comments and strings for better detection
  const cleanCode = codeString
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*/g, '') // Remove line comments
    .replace(/#.*/g, '') // Remove Python/Ruby/Bash comments
    .replace(/(['"`])(?:(?=(\\?))\2.)*?\1/g, '') // Remove strings

  // C indicators
  const cIndicators = [
    /#include\s*<.*\.h>/, // #include <stdio.h>
    /int\s+main\s*\(/, // int main(
    /printf\s*\(/, // printf(
    /scanf\s*\(/, // scanf(
    /malloc\s*\(/, // malloc(
    /free\s*\(/, // free(
  ]

  // C++ indicators
  const cppIndicators = [
    /#include\s*<iostream>/, // #include <iostream>
    /std::/, // std::cout, std::string
    /cout\s*<</, // cout
    /cin\s*>>/, // cin >>
    /namespace\s+\w+/, // namespace
    /class\s+\w+\s*{/, // class declaration
    /template\s*</, // template
    /vector\s*</, // vector
  ]

  // C# indicators
  const csharpIndicators = [
    /using\s+System/, // using System
    /namespace\s+\w+/, // namespace
    /class\s+\w+\s*:/, // class inheritance
    /Console\.WriteLine/, // Console.WriteLine
    /public\s+static\s+void\s+Main/, // public static void Main
    /\[.*\]/, // Attributes [...]
    /var\s+\w+\s*=/, // var declaration
    /async\s+Task/, // async Task
  ]

  // Go indicators
  const goIndicators = [
    /package\s+main/, // package main
    /func\s+main\s*\(/, // func main()
    /func\s+\w+\s*\(/, // func declaration
    /fmt\.(Print|Println)/, // fmt.Println
    /import\s+\(/, // import block
    /import\s+".*"/, // import "package"
    /:=/, // Short variable declaration
    /make\s*\(/, // make(
    /go\s+\w+\s*\(/, // goroutine
  ]

  // Rust indicators
  const rustIndicators = [
    /fn\s+main\s*\(/, // fn main()
    /fn\s+\w+\s*\(/, // fn declaration
    /let\s+(mut\s+)?\w+/, // let declaration
    /println!\s*\(/, // println!
    /use\s+std::/, // use std::
    /impl\s+\w+/, // impl block
    /struct\s+\w+/, // struct declaration
    /->\s*\w+/, // return type
    /&\w+/, // reference
  ]

  // Ruby indicators
  const rubyIndicators = [
    /def\s+\w+/, // def method
    /end\b/, // end keyword
    /puts\s+/, // puts
    /print\s+/, // print
    /require\s+['"].*['"]/, // require
    /class\s+\w+\s*</, // class inheritance
    /@\w+/, // Instance variable
    /do\s*\|.*\|/, // Block with parameters
  ]

  // Swift indicators
  const swiftIndicators = [
    /func\s+\w+\s*\(/, // func declaration
    /var\s+\w+\s*:/, // var with type
    /let\s+\w+\s*:/, // let with type
    /print\s*\(/, // print(
    /import\s+\w+/, // import
    /class\s+\w+\s*:/, // class declaration
    /struct\s+\w+/, // struct
    /\?\s*:/, // Optional ternary
    /guard\s+let/, // guard let
  ]

  // Kotlin indicators
  const kotlinIndicators = [
    /fun\s+main\s*\(/, // fun main()
    /fun\s+\w+\s*\(/, // fun declaration
    /val\s+\w+/, // val declaration
    /var\s+\w+/, // var declaration
    /println\s*\(/, // println(
    /data\s+class/, // data class
    /companion\s+object/, // companion object
    /when\s*\(/, // when expression
  ]

  // R indicators
  const rIndicators = [
    /<-/, // Assignment operator
    /function\s*\(/, // function(
    /library\s*\(/, // library(
    /data\.frame/, // data.frame
    /ggplot/, // ggplot
    /\$\w+/, // $ accessor
    /c\s*\(/, // c() vector
  ]

  // SQL indicators
  const sqlIndicators = [
    /SELECT\s+.*\s+FROM/i, // SELECT ... FROM
    /INSERT\s+INTO/i, // INSERT INTO
    /UPDATE\s+.*\s+SET/i, // UPDATE ... SET
    /DELETE\s+FROM/i, // DELETE FROM
    /CREATE\s+(TABLE|DATABASE)/i, // CREATE TABLE/DATABASE
    /DROP\s+(TABLE|DATABASE)/i, // DROP TABLE/DATABASE
    /WHERE\s+/i, // WHERE clause
    /JOIN\s+/i, // JOIN
    /GROUP\s+BY/i, // GROUP BY
  ]

  // Python indicators
  const pythonIndicators = [
    /\bdef\s+\w+\s*\(/,
    /\bclass\s+\w+.*:/,
    /\bif\s+.*:/,
    /\bfor\s+\w+\s+in\s+/,
    /\bwhile\s+.*:/,
    /\belif\s+/,
    /\bimport\s+\w+/,
    /\bfrom\s+\w+\s+import/,
    /\bprint\s*\(/,
    /^\s{4}|\t/m,
  ]

  // Java indicators
  const javaIndicators = [
    /public\s+class\s+\w+/,
    /public\s+static\s+void\s+main/,
    /System\.out\.println/,
    /System\.out\.print/,
    /public\s+(static\s+)?\w+\s+\w+\s*\(/,
    /private\s+(static\s+)?\w+\s+\w+/,
    /import\s+java\./,
    /package\s+\w+/,
    /extends\s+\w+/,
    /implements\s+\w+/,
    /new\s+\w+\s*\(/,
    /@Override/,
  ]

  // PHP indicators
  const phpIndicators = [
    /<\?php/,
    /\$\w+\s*=/,
    /function\s+\w+\s*\([^)]*\)\s*\{/,
    /echo\s+/,
    /\bforeach\s*\(/,
    /->\w+/,
    /::\w+/,
    /namespace\s+\w+/,
  ]

  // TypeScript indicators
  const typescriptIndicators = [
    /:\s*(string|number|boolean|any|void|never|unknown|undefined|null)\b/,
    /:\s*\w+\[\]/,
    /interface\s+\w+/,
    /type\s+\w+\s*=/,
    /<[A-Z]\w*>/,
    /as\s+(string|number|boolean|any|const)/,
    /enum\s+\w+/,
    /\bpublic\s+\w+/,
    /\bprivate\s+\w+/,
    /\bprotected\s+\w+/,
    /\breadonly\s+\w+/,
  ]

  // JavaScript indicators
  const javascriptIndicators = [
    /\bfunction\s+\w+\s*\(/,
    /\bconst\s+\w+\s*=/,
    /\blet\s+\w+\s*=/,
    /\bvar\s+\w+\s*=/,
    /=>\s*{/,
    /\bconsole\.(log|error|warn)/,
    /\brequire\s*\(/,
  ]

  // Count matches for each language
  const scores: Record<SupportedLanguage, number> = {
    c: 0,
    cpp: 0,
    csharp: 0,
    go: 0,
    rust: 0,
    ruby: 0,
    swift: 0,
    kotlin: 0,
    r: 0,
    sql: 0,
    python: 0,
    java: 0,
    php: 0,
    typescript: 0,
    javascript: 0,
  }

  const countMatches = (patterns: RegExp[], lang: SupportedLanguage) => {
    patterns.forEach((pattern) => {
      if (pattern.test(cleanCode)) {
        scores[lang] = (scores[lang] ?? 0) + 1
      }
    })
  }

  countMatches(cIndicators, 'c')
  countMatches(cppIndicators, 'cpp')
  countMatches(csharpIndicators, 'csharp')
  countMatches(goIndicators, 'go')
  countMatches(rustIndicators, 'rust')
  countMatches(rubyIndicators, 'ruby')
  countMatches(swiftIndicators, 'swift')
  countMatches(kotlinIndicators, 'kotlin')
  countMatches(rIndicators, 'r')
  countMatches(sqlIndicators, 'sql')
  countMatches(pythonIndicators, 'python')
  countMatches(javaIndicators, 'java')
  countMatches(phpIndicators, 'php')
  countMatches(typescriptIndicators, 'typescript')
  countMatches(javascriptIndicators, 'javascript')

  // Priority detection for languages with clear markers
  if (/<\?php/.test(cleanCode)) return 'php'
  if (/SELECT\s+.*\s+FROM/i.test(cleanCode)) return 'sql'
  if (/#include\s*<iostream>/.test(cleanCode)) return 'cpp'
  if (/#include\s*<.*\.h>/.test(cleanCode) && scores.cpp === 0) return 'c'
  if (/using\s+System/.test(cleanCode)) return 'csharp'
  if (/package\s+main/.test(cleanCode) && /func\s+main/.test(cleanCode)) return 'go'
  if (/fn\s+main/.test(cleanCode)) return 'rust'
  if (/fun\s+main/.test(cleanCode)) return 'kotlin'

  // Find language with highest score
  const maxScore = Math.max(...Object.values(scores))
  if (maxScore === 0) return 'javascript' // Default

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const detectedLang = Object.entries(scores).find(([_, score]) => score === maxScore)?.[0]

  return (detectedLang || 'javascript') as SupportedLanguage
}

export function shouldDetectLanguage(
  newCode: string,
  oldCode: string,
  threshold: number = 20,
): boolean {
  const lengthDiff = Math.abs(newCode.length - oldCode.length)
  return lengthDiff > threshold
}
