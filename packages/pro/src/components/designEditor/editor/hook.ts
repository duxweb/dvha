import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { ComputedRef, Ref } from 'vue'
import ShortUniqueId from 'short-unique-id'
import { computed, ref } from 'vue'

export interface PageEditorJsonProps {
  options?: Record<string, any>
  children?: PageEditorData[] | PageEditorData[][]
  model?: Record<string, any>
  convertToJsonSchema?: (children: PageEditorData[] | PageEditorData[][], childModel?: Record<string, any>) => JsonSchemaNode[]
}

export interface PageEditorComponent {
  name: string
  icon: string
  group?: string
  label?: string
  description?: string
  component: (props?: Record<string, any>) => any
  setting?: (props?: Record<string, any>) => any
  nested?: boolean
  settingDefault?: Record<string, any>
  json?: (props?: PageEditorJsonProps) => JsonSchemaNode
}

export interface PageEditorGroup {
  name: string
  label: string
  icon: string
  children?: PageEditorComponent[]
}

export interface PageEditorData {
  key: string
  name: string
  // 组件选项
  options?: Record<string, any>
  // 子组件
  children?: PageEditorData[]
}

export interface PageEditorSettingPage {
  component?: (props?: Record<string, any>) => any
  default?: Record<string, any>
}

export interface UseEditorResult {
  clearComponent: () => void
  addComponent: (data: PageEditorComponent) => void
  clearGroup: () => void
  addGroup: (data: PageEditorGroup) => void
  getData: (key?: string) => PageEditorData | undefined
  copyData: (key: string, index: number) => void
  deleteData: (key: string, index: number) => void
  tree: ComputedRef<PageEditorGroup[]>
  components: Ref<PageEditorComponent[]>
  group: Ref<PageEditorGroup[]>
  selected: Ref<string | undefined>
  value: Ref<UseEditorValue>
  settingPage: PageEditorSettingPage | undefined
}

export interface UseEditorValue {
  config: Record<string, any>
  data: PageEditorData[]
}

export function useEditor({ settingPage }: { settingPage?: PageEditorSettingPage }): UseEditorResult {
  const components = ref<PageEditorComponent[]>([])
  const group = ref<PageEditorGroup[]>([])
  const selected = ref<string>()
  const value = ref<UseEditorValue>({
    config: settingPage?.default || {},
    data: [],
  })

  const clearComponent = () => {
    components.value = []
  }

  const clearGroup = () => {
    group.value = []
  }

  // 添加组件
  const addComponent = (data: PageEditorComponent) => {
    const index = components.value.findIndex(item => item.name === data.name)
    if (index !== -1) {
      return
    }
    components.value.push(data)
  }

  // 添加分组
  const addGroup = (data: PageEditorGroup) => {
    const index = group.value.findIndex(item => item.name === data.name)
    if (index !== -1) {
      return
    }
    group.value.push(data)
  }

  // 获取树形组件
  const tree = computed(() => {
    return group.value.map((item) => {
      return {
        name: item.name,
        label: item.label,
        icon: item.icon,
        children: components.value.filter(comp => comp.group === item.name),
      }
    })
  })

  // 查找数据
  const findDataLoop = (key: string, data: PageEditorData[]): PageEditorData | undefined => {
    for (const item of data) {
      if (!item) {
        continue
      }

      if (Array.isArray(item)) {
        const info = findDataLoop(key, item)
        if (info) {
          return info
        }
        continue
      }

      if (item.key === key) {
        return item
      }

      if (item.children && item.children.length) {
        const info = findDataLoop(key, item.children)
        if (info) {
          return info
        }
      }
    }
  }

  const getData = (key?: string) => {
    if (!key) {
      return
    }
    return findDataLoop(key, value.value.data)
  }

  const { randomUUID } = new ShortUniqueId({ length: 10 })

  const restDataKey = (data: PageEditorData[]) => {
    return data?.map((item) => {
      if (!item) {
        return undefined
      }

      if (Array.isArray(item)) {
        return restDataKey(item)
      }

      item.key = randomUUID()
      if (item.children && item.children.length > 0) {
        item.children = restDataKey(item.children)
      }

      return item
    }).filter(item => item !== undefined)
  }

  const findParent = (data: PageEditorData[], key: string, parent?: PageEditorData | PageEditorData[]): PageEditorData | PageEditorData[] | undefined => {
    for (const node of data) {
      if (!node) {
        continue
      }

      if (Array.isArray(node)) {
        const foundParent = findParent(node, key, node)
        if (foundParent) {
          return foundParent
        }
        continue
      }

      if (node.key === key) {
        return parent
      }

      if (node.children && node.children.length) {
        const foundParent = findParent(node.children, key, node)
        if (foundParent) {
          return foundParent
        }
      }
    }
  }

  const copyData = (key: string, index: number) => {
    const item = getData(key)

    const newItem = JSON.parse(JSON.stringify(item))
    newItem.key = randomUUID()

    if (newItem.children && newItem.children.length > 0) {
      newItem.children = restDataKey(newItem.children)
    }

    const parent = findParent(value.value.data, key)

    if (parent) {
      if (Array.isArray(parent)) {
        parent.splice(index + 1, 0, newItem)
      }
      else {
        parent.children?.splice(index + 1, 0, newItem)
      }
    }
    else {
      value.value.data?.splice(index + 1, 0, newItem)
    }
  }

  const deleteData = (key: string, index: number) => {
    const parent = findParent(value.value.data, key)

    if (parent) {
      if (Array.isArray(parent)) {
        parent.splice(index, 1)
      }
      else {
        parent.children?.splice(index, 1)
      }
    }
    else {
      value.value.data.splice(index, 1)
    }

    selected.value = undefined

    value.value = { ...value.value }
  }

  return {
    clearGroup,
    clearComponent,
    addComponent,
    addGroup,
    tree,
    components,
    group,
    getData,
    selected,
    value,
    copyData,
    deleteData,
    settingPage,
  }
}
