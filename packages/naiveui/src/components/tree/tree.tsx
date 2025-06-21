import type { IUseTreeProps } from '@duxweb/dvha-core'
import type { TreeProps } from 'naive-ui'
import type { PropType } from 'vue'
import { useTree } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NScrollbar, NSpin, NTree } from 'naive-ui'
import { computed, defineComponent, ref, toRef, watch } from 'vue'

export interface DuxTreeProps extends TreeProps {
  path?: string
  params?: Record<string, any>
  height?: string
  value?: Array<string | number> | null
  defaultValue?: Array<string | number> | null
  hookProps?: IUseTreeProps
  onUpdateValue?: (value: valueKey[]) => void
}

type valueKey = string | number

export const DuxTree = defineComponent<DuxTreeProps>({
  name: 'DuxTree',
  props: {
    path: String,
    params: Object as PropType<Record<string, any>>,
    height: String,
    value: Array as PropType<valueKey[]>,
    defaultValue: Array as PropType<valueKey[]>,
    hookProps: Object as PropType<IUseTreeProps>,
  },
  extends: NTree,
  setup(props, { emit }) {
    const params = toRef(props, 'params', {})
    const path = toRef(props, 'path', '')

    const model = useVModel(props, 'value', emit, {
      passive: true,
      deep: true,
      defaultValue: props.defaultValue || [],
    })

    const expanded = ref<valueKey[]>([])

    const { options, loading, expanded: expandedKeys } = useTree({
      path: path.value,
      params: params.value,
      ...props.hookProps,
    })

    watch(expandedKeys, (v) => {
      expanded.value = v as valueKey[]
    })

    const treeProps = computed(() => {
      const { hookProps, height, ...rest } = props
      return rest
    })

    return () => (
      <NSpin
        show={loading.value}
      >
        <NScrollbar style={{
          height: props.height || '300px',
        }}
        >
          <NTree
            {...treeProps.value}
            cascade
            checkable
            defaultExpandAll
            selectable={false}
            expandedKeys={expanded.value}
            onUpdateExpandedKeys={(v) => {
              expanded.value = v
            }}
            data={options.value || []}
            checkedKeys={model.value || []}
            onUpdateCheckedKeys={(v) => {
              model.value = v
              props.onUpdateValue?.(v)
            }}
          >
          </NTree>
        </NScrollbar>
      </NSpin>
    )
  },
})
