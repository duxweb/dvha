import type { PropType, VNode } from 'vue'
import type { UseEditorResult } from './hook'
import { computed, defineComponent, inject } from 'vue'
import { DuxFormLayout } from '../../../components'

export const WidgetEditorSetting = defineComponent({
  name: 'WidgetEditorSetting',
  props: {
    actionRender: Function as PropType<(editor?: UseEditorResult) => VNode>,
  },
  setup(props) {
    const editor = inject<UseEditorResult>('editor.use')

    const curData = computed(() => {
      return editor?.getData(editor.selected.value)
    })
    const curComponent = computed(() => {
      return editor?.components.value?.find(item => item.name === curData.value?.name)
    })

    return () => (
      <div class="flex-none  p-2 max-w-full w-220px overflow-y-auto bg-default" key={curData.value?.key}>

        {curComponent.value?.setting?.({
          'value': curData.value?.options,
          'update:modelValue': (v) => {
            if (!curData?.value) {
              return
            }
            curData.value.options = v
          },
        })
        || (
          <div class='flex flex-col gap-2 h-full'>

            <div class='flex-1 min-h-0'>
              {editor?.settingPage?.component?.({
                'value': editor.value.value.config,
                'update:modelValue': (v) => {
                  editor.value.value.config = v
                },
              })}
            </div>

            {props?.actionRender?.(editor)}
          </div>
        )}
      </div>
    )
  },
})

export const WidgetEditorSettingCard = defineComponent({
  name: 'WidgetEditorSettingCard',
  props: {
    title: String,
    icon: String,
  },
  setup(props, { slots }) {
    return () => (
      <div class="flex flex-col">
        <div class="bg-elevated rounded py-2 px-4 flex justify-center items-center gap-2">
          <div>{props.title}</div>
        </div>
        <div class="py-4 flex-1">
        <DuxFormLayout labelPlacement='top'>
          {slots.default?.()}
        </DuxFormLayout>
        </div>
      </div>
    )
  },
})
