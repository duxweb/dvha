export interface SchemaTreeNode {
  id: string
  name: string
  type: string
  description?: string
  params?: Record<string, any>
  children?: SchemaTreeNode[]
}

export interface SchemaTypeOption {
  label: string
  value: string
  tagType?: 'default' | 'info' | 'success' | 'warning' | 'error'
}

export interface SchemaParamField {
  key: string
  label: string
  component?: 'input' | 'textarea' | 'select' | 'number' | 'switch'
  options?: Array<{ label: string, value: any }>
  placeholder?: string
  rows?: number
  componentProps?: Record<string, any>
}
