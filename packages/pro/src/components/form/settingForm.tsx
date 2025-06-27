import type { IDataProviderError, IDataProviderResponse } from '@duxweb/dvha-core'
import type { MaybeRef, PropType } from 'vue'
import { useExtendForm, useI18n, useInvalidate } from '@duxweb/dvha-core'
import { NTabs, useMessage } from 'naive-ui'
import { computed, defineComponent, ref, toRef } from 'vue'
import { DuxPage } from '../../pages'

export const DuxSettingForm = defineComponent({
  name: 'DuxSettingForm',
  props: {
    id: {
      type: [String, Number] as PropType<string | number>,
    },
    action: {
      type: String as PropType<'create' | 'edit'>,
    },
    path: {
      type: String as PropType<string>,
    },
    data: {
      type: Object as PropType<MaybeRef<Record<string, any>>>,
    },
    onSuccess: {
      type: Function as PropType<(data?: IDataProviderResponse) => void>,
    },
    onError: {
      type: Function as PropType<(error?: IDataProviderError) => void>,
    },
    tabs: {
      type: Boolean,
      default: false,
    },
    defaultTab: {
      type: String,
      default: '',
    },
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
      default: 'medium',
    },
    invalidate: {
      type: String as PropType<string>,
    },
  },
  setup(props, { slots }) {
    const activeTab = ref(props.defaultTab)
    const form = toRef(props, 'data', {})
    const { t } = useI18n()

    const message = useMessage()
    const { invalidate } = useInvalidate()

    const result = useExtendForm({
      id: props.id,
      path: props.path,
      form,
      action: props.action,
      onError: (error) => {
        message.error(error.message || t('components.form.error') as string)
        props.onError?.(error)
      },
      onSuccess: (data) => {
        message.success(t('components.form.success') as string)
        props.onSuccess?.(data)
        if (props.invalidate) {
          invalidate(props.invalidate)
        }
      },
    })

    const sizeClass = computed(() => {
      switch (props.size) {
        case 'small':
          return 'lg:max-w-lg'
        case 'large':
          return 'lg:max-w-4xl'
        case 'medium':
        default:
          return 'lg:max-w-2xl'
      }
    })

    return () => (
      <DuxPage>
        <div class={`flex flex-col gap-6 w-full ${sizeClass.value} mx-auto py-4`}>
          {props.tabs
            ? (
                <NTabs
                  defaultValue={props.defaultTab}
                  value={activeTab.value}
                  onUpdateValue={(value) => {
                    activeTab.value = value
                  }}
                  type="segment"
                >
                  {slots?.default?.(result)}
                </NTabs>
              )
            : (
                slots?.default?.(result)
              )}
        </div>
      </DuxPage>
    )
  },
})
