import type { MentionOption, MentionProps } from 'naive-ui'
import type { PropType } from 'vue'
import { useCustomMutation } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NMention } from 'naive-ui'
import { defineComponent, ref, toRef } from 'vue'

interface DuxMentionProps extends MentionProps {
  path?: string
  params?: Record<string, any>
  labelField?: string
  valueField?: string
}

export const DuxMention = defineComponent<DuxMentionProps>({
  name: 'DuxMention',
  props: {
    path: String,
    params: Object as PropType<Record<string, any>>,
    labelField: {
      type: String,
      default: 'name',
    },
    valueField: {
      type: String,
      default: 'name',
    },
  },
  extends: NMention,
  setup(props, { emit, slots }) {
    const model = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: props.defaultValue,
    })

    const options = ref<MentionOption[]>([])
    const loading = ref(false)

    const path = toRef(props, 'path')
    const params = toRef(props, 'params', {})

    const { mutateAsync } = useCustomMutation({
      path: path.value,
      query: params.value,
      method: 'GET',
    })

    const handleSearch = (pattern: string) => {
      if (!path.value || !pattern) {
        options.value = []
        return
      }

      loading.value = true
      mutateAsync({
        query: {
          keyword: pattern,
          limit: 10,
        },
      }).then((res) => {
        options.value = res?.data?.map(row => ({
          label: row[props.labelField || 'name'],
          value: row[props.valueField || 'name'],
        })) || []
      }).catch(() => {
        options.value = []
      }).finally(() => {
        loading.value = false
      })
    }

    return () => (
      <NMention {...props} v-model:value={model.value} options={options.value} onSearch={handleSearch} loading={loading.value}>
        {{
          ...slots,
        }}
      </NMention>
    )
  },
})
