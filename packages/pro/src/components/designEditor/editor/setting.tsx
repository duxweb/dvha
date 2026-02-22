import type { PropType, VNode } from 'vue'
import type { UseEditorResult } from './hook'
import { useI18n } from '@duxweb/dvha-core'
import clsx from 'clsx'
import { NScrollbar } from 'naive-ui'
import { computed, defineComponent, inject } from 'vue'
import { DuxFormLayout } from '../../../components'

function SettingHeader({
  icon,
  iconBgClass = 'bg-primary',
  title,
  description,
}: {
  icon?: string
  iconBgClass?: string
  title: string
  description?: string
}) {
  return (
    <div class="p-4 border-b border-default">
      <div class="flex gap-2 items-center">
        {icon && (
          <div class={clsx(['rounded p-2 flex-shrink-0', iconBgClass])}>
            <div class={clsx(['size-6 text-white', icon])} />
          </div>
        )}
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-medium">{title}</h3>
          {description && (
            <p class="text-sm text-muted mt-1">{description}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export const WidgetEditorSetting = defineComponent({
  name: 'WidgetEditorSetting',
  props: {
    actionRender: Function as PropType<(editor?: UseEditorResult) => VNode>,
  },
  setup(props) {
    const { t } = useI18n()
    const editor = inject<UseEditorResult>('editor.use')

    const curData = computed(() => {
      return editor?.getData(editor.selected.value)
    })
    const curComponent = computed(() => {
      return editor?.components.value?.find(item => item.name === curData.value?.name)
    })

    return () => (
      <div class="h-full w-full flex flex-col" key={curData.value?.key}>
        {!curComponent.value && (
          <SettingHeader
            icon="i-tabler:settings"
            iconBgClass="bg-gray-500"
            title={t('components.designEditor.properties') || 'Properties'}
            description={t('components.designEditor.selectComponent') || 'Select a component to configure'}
          />
        )}
        {curComponent.value && (
          <SettingHeader
            icon={curComponent.value.icon}
            iconBgClass="bg-primary"
            title={curComponent.value.label || curComponent.value.name || t('components.designEditor.component') || 'Component'}
            description={curComponent.value.description || t('components.designEditor.componentSettings') || 'Configure component options'}
          />
        )}
        <NScrollbar class="flex-1 min-h-0">
          <div class="p-3 pr-2">
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
              <div class="flex flex-col gap-3">

                <div>
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
        </NScrollbar>
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
        <div class="bg-elevated border border-default rounded-md py-2 px-4 flex justify-center items-center gap-2">
          <div>{props.title}</div>
        </div>
        <div class="py-4 flex-1">
          <DuxFormLayout labelPlacement="top">
            {slots.default?.()}
          </DuxFormLayout>
        </div>
      </div>
    )
  },
})
