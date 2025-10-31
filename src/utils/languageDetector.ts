type SupportedLanguage = 'javascript' | 'typescript' | 'python'

export function detectLanguage(codeString: string): SupportedLanguage {
  // Remove comments and strings for better detection
  const cleanCode = codeString
    .replace(/\/\*[\s\S]*?\*\//g, '') // Remove block comments
    .replace(/\/\/.*/g, '') // Remove line comments
    .replace(/#.*/g, '') // Remove Python comments
    .replace(/(['"`])(?:(?=(\\?))\2.)*?\1/g, '') // Remove strings

  // Python indicators
  const pythonIndicators = [
    /\bdef\s+\w+\s*\(/, // def function():
    /\bclass\s+\w+.*:/, // class Name:
    /\bif\s+.*:/, // if condition:
    /\bfor\s+\w+\s+in\s+/, // for x in
    /\bwhile\s+.*:/, // while condition:
    /\belif\s+/, // elif
    /\bimport\s+\w+/, // import module
    /\bfrom\s+\w+\s+import/, // from module import
    /\bprint\s*\(/, // print()
    /^\s{4}|\t/m, // 4-space or tab indentation (common in Python)
  ]

  // TypeScript indicators (check these BEFORE JavaScript)
  const typescriptIndicators = [
    /:\s*(string|number|boolean|any|void|never|unknown|undefined|null)\b/, // Type annotations
    /:\s*\w+\[\]/, // Array type syntax
    /interface\s+\w+/, // interface Name
    /type\s+\w+\s*=/, // type Alias =
    /<[A-Z]\w*>/, // Generics <T>
    /as\s+(string|number|boolean|any|const)/, // Type assertions
    /enum\s+\w+/, // enum Name
    /\bpublic\s+\w+/, // public modifier
    /\bprivate\s+\w+/, // private modifier
    /\bprotected\s+\w+/, // protected modifier
    /\breadonly\s+\w+/, // readonly modifier
    /\w+\s*:\s*\w+\s*[;,}]/, // Property with type annotation
    /function\s+\w+\s*\([^)]*:\s*\w+/, // Function with typed parameters
    /\w+\s*\([^)]*:\s*\w+[^)]*\)\s*:\s*\w+/, // Function with return type
    /\?\s*:/, // Optional property ?:
    /=>\s*\w+\s*\{/, // Arrow function with explicit return type hint
  ]

  // JavaScript indicators (less specific, default fallback)
  const javascriptIndicators = [
    /\bfunction\s+\w+\s*\(/, // function name()
    /\bconst\s+\w+\s*=/, // const x =
    /\blet\s+\w+\s*=/, // let x =
    /\bvar\s+\w+\s*=/, // var x =
    /=>\s*{/, // Arrow functions
    /\bconsole\.(log|error|warn)/, // console methods
    /\brequire\s*\(/, // require()
  ]

  let pythonScore = 0
  let typescriptScore = 0
  let javascriptScore = 0

  // Count matches for each language
  pythonIndicators.forEach((pattern) => {
    if (pattern.test(cleanCode)) pythonScore++
  })

  typescriptIndicators.forEach((pattern) => {
    if (pattern.test(cleanCode)) {
      typescriptScore++
    }
  })

  javascriptIndicators.forEach((pattern) => {
    if (pattern.test(cleanCode)) javascriptScore++
  })

  // Determine language based on scores
  // Python has highest priority if detected
  if (pythonScore > 0 && pythonScore >= typescriptScore && pythonScore >= javascriptScore) {
    return 'python'
  }

  // TypeScript gets priority over JavaScript if any TypeScript features detected
  if (typescriptScore > 0) {
    return 'typescript'
  }

  // Default to JavaScript
  return 'javascript'
}

export function shouldDetectLanguage(
  newCode: string,
  oldCode: string,
  threshold: number = 20,
): boolean {
  const lengthDiff = Math.abs(newCode.length - oldCode.length)
  return lengthDiff > threshold
}
