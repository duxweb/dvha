import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NButton } from 'naive-ui'
import { defineComponent } from 'vue'
import { useModal } from '../../hooks'

export const DuxIconPicker = defineComponent({
  name: 'DuxIconPicker',
  props: {
    defaultValue: String,
    value: String,
  },
  setup(props, { emit }) {
    const model = useVModel(props, 'value', emit, {
      defaultValue: props.defaultValue,
      passive: true,
    })
    const modal = useModal()
    const { t } = useI18n()

    return () => (
      <NButton
        dashed={!model.value}
        onClick={() => {
          modal.show({
            title: t('components.iconPicker.title'),
            component: () => import('./iconPicker'),
          }).then((res) => {
            model.value = res
          })
        }}
        iconPlacement="right"
      >
        {{
          default: () => (
            <div class="flex gap-2 items-center">
              {model.value ? <div class={`size-4 ${model.value || ''}`}></div> : undefined}
              {t('components.iconPicker.title')}
            </div>
          ),
          icon: () => model.value
            ? (
                <div
                  class="rounded-full p-1 hover:bg-gray-2 hover:text-gray-7"
                  onClick={(e) => {
                    e.stopPropagation()
                    model.value = undefined
                  }}
                >
                  <div class="size-4 i-tabler:x"></div>
                </div>
              )
            : undefined,
        }}
      </NButton>
    )
  },
})
