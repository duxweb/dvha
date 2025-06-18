import type { IDataProviderError, IDataProviderResponse } from '@duxweb/dvha-core'
import type { MaybeRef, PropType } from 'vue'
import { useExtendForm, useI18n } from '@duxweb/dvha-core'
import { NButton, useMessage } from 'naive-ui'
import { defineComponent, toRef } from 'vue'
import { DuxPage } from '../../pages'

export const DuxPageForm = defineComponent({
  name: 'DuxPageForm',
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
    size: {
      type: String as PropType<'small' | 'medium' | 'large'>,
      default: 'medium',
    },
  },
  setup(props, { slots }) {
    const { t } = useI18n()
    const form = toRef(props, 'data', {})

    const message = useMessage()

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
      },
    })

    return () => (
      <DuxPage card={false}>
        {{
          default: () => slots?.default?.(result),
          actions: () => (
            <div class="flex gap-6 items-center">
              {slots?.actions?.(result)}
              <div class="flex gap-2">
                <NButton>
                  {{
                    default: () => t('components.button.reset'),
                    icon: () => <i class="i-tabler:refresh" />,
                  }}
                </NButton>
                <NButton type="primary">
                  {{
                    default: () => t('components.button.submit'),
                    icon: () => <i class="i-tabler:send" />,
                  }}
                </NButton>
              </div>
            </div>
          ),
        }}
      </DuxPage>
    )
  },
})
