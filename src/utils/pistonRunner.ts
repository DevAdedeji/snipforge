/* eslint-disable @typescript-eslint/no-explicit-any */
interface PistonLanguage {
  language: string
  version: string
}

const languageMap: Record<string, PistonLanguage> = {
  javascript: { language: 'javascript', version: '18.15.0' },
  typescript: { language: 'typescript', version: '5.0.3' },
  python: { language: 'python', version: '3.10.0' },
  php: { language: 'php', version: '8.2.3' },
  java: { language: 'java', version: '15.0.2' },
  c: { language: 'c', version: '10.2.0' },
  cpp: { language: 'c++', version: '10.2.0' },
  csharp: { language: 'csharp', version: '6.12.0' },
  go: { language: 'go', version: '1.16.2' },
  rust: { language: 'rust', version: '1.68.2' },
  ruby: { language: 'ruby', version: '3.0.1' },
  swift: { language: 'swift', version: '5.3.3' },
  kotlin: { language: 'kotlin', version: '1.8.20' },
  r: { language: 'r', version: '4.1.1' },
  sql: { language: 'sqlite3', version: '3.36.0' },
}

export async function runCodeWithPiston(
  code: string,
  language: string,
): Promise<{ output: string; error: string | null }> {
  try {
    const langConfig = languageMap[language]

    if (!langConfig) {
      return {
        output: '',
        error: `Language ${language} not supported`,
      }
    }

    // Determine file name based on language
    let fileName = 'main'

    switch (language) {
      case 'c':
        fileName = 'main.c'
        break
      case 'cpp':
        fileName = 'main.cpp'
        break
      case 'csharp':
        fileName = 'main.cs'
        break
      case 'go':
        fileName = 'main.go'
        break
      case 'rust':
        fileName = 'main.rs'
        break
      case 'ruby':
        fileName = 'main.rb'
        break
      case 'swift':
        fileName = 'main.swift'
        break
      case 'kotlin':
        fileName = 'main.kt'
        break
      case 'r':
        fileName = 'main.r'
        break
      case 'sql':
        fileName = 'main.sql'
        break
      case 'php':
        fileName = 'main.php'
        break
      case 'java':
        const classMatch = code.match(/public\s+class\s+(\w+)/)
        fileName = classMatch ? `${classMatch[1]}.java` : 'Main.java'
        break
      case 'python':
        fileName = 'main.py'
        break
      case 'javascript':
        fileName = 'main.js'
        break
      case 'typescript':
        fileName = 'main.ts'
        break
      default:
        fileName = 'main.txt'
    }

    const response = await fetch('https://emkc.org/api/v2/piston/execute', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        language: langConfig.language,
        version: langConfig.version,
        files: [
          {
            name: fileName,
            content: code,
          },
        ],
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`API request failed: ${response.statusText}. ${errorText}`)
    }

    const result = await response.json()

    if (result.run) {
      const stdout = result.run.stdout || ''
      const stderr = result.run.stderr || ''
      const output = result.run.output || stdout

      if (stderr && result.run.code === 0) {
        return {
          output: output || 'Code executed successfully',
          error: null,
        }
      }

      if (result.run.code !== 0) {
        return {
          output: stdout,
          error: stderr || output || 'Execution failed',
        }
      }

      return {
        output: output || 'Code executed successfully',
        error: null,
      }
    }

    return {
      output: '',
      error: result.message || 'Execution failed',
    }
  } catch (error: any) {
    return {
      output: '',
      error: error.message || 'Code execution error',
    }
  }
}

// Update to include all new languages
export function shouldUsePiston(language: string): boolean {
  return [
    'php',
    'java',
    'c',
    'cpp',
    'csharp',
    'go',
    'rust',
    'ruby',
    'swift',
    'kotlin',
    'r',
    'sql',
  ].includes(language)
}
