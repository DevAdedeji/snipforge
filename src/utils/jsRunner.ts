/* eslint-disable @typescript-eslint/no-explicit-any */
import ts from 'typescript'

export function runJavaScriptCode(code: string): { output: string; error: string | null } {
  try {
    // Capture console.log output
    const logs: string[] = []
    const originalLog = console.log
    const originalError = console.error
    const originalWarn = console.warn

    console.log = (...args: any[]) => {
      logs.push(
        args
          .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)))
          .join(' '),
      )
    }

    console.error = (...args: any[]) => {
      logs.push('Error: ' + args.map((arg) => String(arg)).join(' '))
    }

    console.warn = (...args: any[]) => {
      logs.push('Warning: ' + args.map((arg) => String(arg)).join(' '))
    }

    // Execute the code
    // Using Function instead of eval for better scope isolation
    const func = new Function(code)
    func()

    // Restore original console methods
    console.log = originalLog
    console.error = originalError
    console.warn = originalWarn

    return {
      output: logs.join('\n'),
      error: null,
    }
  } catch (error: any) {
    return {
      output: '',
      error: error.message || 'Unknown error occurred',
    }
  }
}

export function runTypeScriptCode(code: string): { output: string; error: string | null } {
  try {
    // Transpile TypeScript to JavaScript
    const result = ts.transpileModule(code, {
      compilerOptions: {
        target: ts.ScriptTarget.ES2020,
        module: ts.ModuleKind.None,
        strict: false,
        esModuleInterop: true,
        skipLibCheck: true,
      },
    })

    // Check for diagnostics (errors/warnings)
    if (result.diagnostics && result.diagnostics.length > 0) {
      const errors = result.diagnostics
        .map((diagnostic) => {
          const message = ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')
          return message
        })
        .join('\n')

      return {
        output: '',
        error: `TypeScript compilation errors:\n${errors}`,
      }
    }

    // Run the transpiled JavaScript
    return runJavaScriptCode(result.outputText)
  } catch (error: any) {
    return {
      output: '',
      error: `TypeScript transpilation error: ${error.message}`,
    }
  }
}
