import type { TransferOption, TransferProps } from 'naive-ui'
import { useList } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NAvatar, NSpin, NTransfer } from 'naive-ui'
import { defineComponent, ref, toRef, watch } from 'vue'

export interface DuxTransferProps extends TransferProps {
  path: string
  params?: Record<string, any>
  value?: Array<string | number>
  labelField?: string
  valueField?: string
  imageField?: string
  descField?: string
}

export const DuxTransfer = defineComponent<DuxTransferProps>({
  name: 'DuxTransfer',
  props: {
    path: String,
    params: {
      type: Object,
    },
    labelField: {
      type: String,
      default: 'name',
    },
    valueField: {
      type: String,
      default: 'id',
    },
    imageField: {
      type: String,
    },
    descField: {
      type: String,
    },
  },
  extends: NTransfer,
  setup(props, { emit }) {
    const model = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: props.defaultValue || [],
    })

    const path = toRef(props, 'path', '')
    const params = toRef(props, 'params', {})

    const options = ref<TransferOption[]>([])

    const { data, isLoading } = useList({
      path: path.value,
      filters: params.value,
    })

    watch(data, (res) => {
      options.value = res?.value?.data?.map((row) => {
        const item: Record<string, any> = {
          label: row[props.labelField || 'name'],
          value: row[props.valueField || 'id'],
          raw: row,
        }
        return item
      }) || []
    }, {
      immediate: true,
    })

    return () => (
      <div class="w-full">
        <NSpin show={isLoading.value}>
          <NTransfer
            {...props}
            v-model:value={model.value}
            options={options.value}
            renderTargetLabel={({ option }: { option: Record<string, any> }) => {
              if (props.imageField || props.descField) {
                return (
                  <div style={{
                    padding: '0 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                  >
                    {props.imageField && (
                      <NAvatar round src={option?.raw[props.imageField]} size={32} />
                    )}
                    <div style={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                    }}
                    >
                      <div>{option?.raw[props.labelField || 'name']}</div>
                      {props.descField && <div style={{ opacity: 0.6 }}>{option?.raw[props.descField || 'desc']}</div>}
                    </div>
                  </div>
                )
              }
              else {
                return option?.raw[props.labelField || 'name']
              }
            }}
          />
        </NSpin>
      </div>
    )
  },
})
