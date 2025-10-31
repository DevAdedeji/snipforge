export interface Snippet {
  id?: string
  title: string
  description: string
  tags: string[]
  code: string
  language: 'python' | 'javascript' | 'typescript'
  userId?: string
  private: boolean
}
