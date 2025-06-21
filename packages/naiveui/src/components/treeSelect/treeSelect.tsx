import type { IUseTreeProps } from '@duxweb/dvha-core'
import type { TreeSelectProps } from 'naive-ui'
import type { PropType } from 'vue'
import { useTree } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NTreeSelect } from 'naive-ui'
import { defineComponent, toRef } from 'vue'

interface DuxTreeSelectProps extends TreeSelectProps {
  path?: string
  params?: Record<string, any>
  hookProps?: IUseTreeProps
}

export const DuxTreeSelect = defineComponent<DuxTreeSelectProps>({
  name: 'DuxTreeSelect',
  props: {
    path: String,
    params: Object as PropType<Record<string, any>>,
    hookProps: Object as PropType<IUseTreeProps>,
  },
  extends: NTreeSelect,
  setup(props, { emit }) {
    const params = toRef(props, 'params', {})
    const path = toRef(props, 'path', '')

    const model = useVModel(props, 'value', emit, {
      passive: true,
      deep: true,
      defaultValue: props.defaultValue || [],
    })

    const { options, loading } = useTree({
      path: path.value,
      params: params.value,
      ...props.hookProps,
    })

    return () => (
      <NTreeSelect
        {...props}
        loading={loading.value}
        options={options.value}
        v-model:value={model.value}
      >
      </NTreeSelect>
    )
  },
})
