/* eslint-disable @typescript-eslint/no-explicit-any */
let pyodideInstance: any = null

export async function initPyodide() {
  if (pyodideInstance) return pyodideInstance

  try {
    const { loadPyodide } = await import('pyodide')
    pyodideInstance = await loadPyodide({
      indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.29.0/full/',
    })
    return pyodideInstance
  } catch (error) {
    console.error('Failed to load Pyodide:', error)
    throw error
  }
}

export async function runPythonCode(
  code: string,
): Promise<{ output: string; error: string | null }> {
  try {
    const pyodide = await initPyodide()

    // Capture stdout
    let output = ''
    pyodide.setStdout({
      batched: (text: string) => {
        output += text + '\n'
      },
    })

    // Run the code
    await pyodide.runPythonAsync(code)

    return {
      output: output.trim(),
      error: null,
    }
  } catch (error: any) {
    return {
      output: '',
      error: error.message || 'Unknown error occurred',
    }
  }
}
