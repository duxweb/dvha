import type { CascaderProps } from 'naive-ui'
import type { PropType } from 'vue'
import { useTree } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NCascader, NSpin } from 'naive-ui'
import { computed, defineComponent, toRef } from 'vue'

interface DuxCascaderProps extends CascaderProps {
  path?: string
  params?: Record<string, any>
}

export const DuxCascader = defineComponent<DuxCascaderProps>({
  name: 'DuxCascader',
  props: {
    path: String,
    params: Object as PropType<Record<string, any>>,
  },
  extends: NCascader,
  setup(props, { emit, slots }) {
    const path = toRef(props, 'path', '')
    const params = toRef(props, 'params', {})

    const model = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: props.defaultValue,
    })

    const { options, loading } = useTree({
      path,
      params,
    })

    const cascaderProps = computed(() => {
      const { path, params, ...rest } = props
      return rest
    })

    return () => (
      <NSpin show={loading.value} class="w-full" size={16}>
        <NCascader
          {...cascaderProps.value}
          clearable
          options={options.value}
          v-model:value={model.value}
        >
          {{
            ...slots,
          }}
        </NCascader>
      </NSpin>
    )
  },
})
