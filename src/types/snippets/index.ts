export type SupportedLanguage =
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

export interface Snippet {
  id?: string
  title: string
  description: string
  tags: string[]
  code: string
  language: SupportedLanguage
  userId?: string
  private: boolean
  favourite?: boolean
}
