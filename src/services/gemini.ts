/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleGenAI } from '@google/genai'

let genAI: GoogleGenAI | null = null

export function initGemini() {
  if (!genAI) {
    genAI = new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY})
  }

  return genAI
}

export async function explainCode(code: string, language: string): Promise<string> {
  try {
    const ai = initGemini()

    const prompt = `Explain the following ${language} code in a clear and concise way.
Break down what the code does, its key components, and any important concepts:

\`\`\`${language}
${code}
\`\`\`

Provide a clear explanation suitable for someone learning to code.`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })
    if (response.text) {
      return response.text
    } else {
      throw new Error('Error explaining code')
    }
  } catch (error: any) {
    console.error('Error explaining code:', error)
    throw new Error(error.message || 'Failed to explain code')
  }
}

export async function improveCode(code: string, language: string): Promise<string> {
  try {
    const ai = initGemini()

    const prompt = `Improve the following ${language} code by:
1. Making it more efficient
2. Following best practices
3. Adding helpful comments
4. Improving readability
5. Fixing any potential bugs

Original code:
\`\`\`${language}
${code}
\`\`\`

Provide only the improved code without additional explanation.`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })
    if (response.text) {
      return response.text
    } else {
      throw new Error('Error explaining code')
    }
  } catch (error: any) {
    console.error('Error improving code:', error)
    throw new Error(error.message || 'Failed to improve code')
  }
}

export async function generateTests(code: string, language: string): Promise<string> {
  try {
    const ai = initGemini()

    const testFrameworks: Record<string, string> = {
      javascript: 'Jest',
      typescript: 'Jest',
      python: 'pytest',
      java: 'JUnit',
      csharp: 'NUnit',
      go: 'testing package',
      rust: 'built-in test framework',
      ruby: 'RSpec',
      php: 'PHPUnit',
      kotlin: 'JUnit',
      swift: 'XCTest',
    }

    const framework = testFrameworks[language] || 'appropriate testing framework'

    const prompt = `Generate comprehensive unit tests for the following ${language} code using ${framework}.
Include:
1. Test cases for normal scenarios
2. Edge cases
3. Error handling tests
4. Clear test descriptions

Code to test:
\`\`\`${language}
${code}
\`\`\`

Provide complete, runnable test code.`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })
    if (response.text) {
      return response.text
    } else {
      throw new Error('Error explaining code')
    }
  } catch (error: any) {
    console.error('Error generating tests:', error)
    throw new Error(error.message || 'Failed to generate tests')
  }
}

export async function customPrompt(
  code: string,
  language: string,
  userPrompt: string,
): Promise<string> {
  try {
    const ai = initGemini()

    const prompt = `${userPrompt}

Code (${language}):
\`\`\`${language}
${code}
\`\`\``

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })
    if (response.text) {
      return response.text
    } else {
      throw new Error('Error explaining code')
    }
  } catch (error: any) {
    console.error('Error processing custom prompt:', error)
    throw new Error(error.message || 'Failed to process request')
  }
}
