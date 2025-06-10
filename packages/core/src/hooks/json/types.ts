import type { Component } from 'vue'

export interface JsonSchemaNode {
  tag: string | Component
  attrs?: Record<string, any>
  children?: JsonSchemaNode | JsonSchemaNode[] | string
  slots?: Record<string, SlotContent>
}

export type SlotContent =
  | string
  | JsonSchemaNode
  | JsonSchemaNode[]
  | ((slotProps?: any) => SlotContent)

export interface IJsonAdaptorResult {
  props: Record<string, any>
  skip?: boolean
  nodes?: JsonSchemaNode[]
}

export interface IJsonAdaptor {
  name: string
  priority: number
  process: (node: JsonSchemaNode, props: Record<string, any>) => IJsonAdaptorResult | null
}

export interface JsonAdaptorOptions {
  adaptors?: IJsonAdaptor[]
}

export type EventModifier = 'prevent' | 'stop' | 'once' | 'capture' | 'self' | 'passive'

export interface VForConfig {
  list: any[]
  item?: string
  index?: string
}

export type VModelBinding =
  | [object, string]
  | [() => any, (val: any) => void]
