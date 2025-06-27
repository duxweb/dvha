import type { IDataProviderError, IDataProviderResponse } from '@duxweb/dvha-core'
import type { MaybeRef, PropType } from 'vue'
import { useExtendForm, useI18n, useInvalidate, useTabStore } from '@duxweb/dvha-core'
import { NButton, NScrollbar, useMessage } from 'naive-ui'
import { defineComponent, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { DuxPage } from '../../pages'
import { DuxCard } from '../card'
import { DuxFormLayout } from './formLayout'

export const DuxPageForm = defineComponent({
  name: 'DuxPageForm',
  props: {
    id: {
      type: [String, Number] as PropType<string | number>,
    },
    action: {
      type: String as PropType<'create' | 'edit'>,
    },
    title: {
      type: String as PropType<string>,
    },
    description: {
      type: String as PropType<string>,
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
    invalidate: {
      type: String as PropType<string>,
    },
  },
  setup(props, { slots }) {
    const { t } = useI18n()
    const form = toRef(props, 'data', {})

    const message = useMessage()
    const router = useRouter()
    const tab = useTabStore()
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

        if (!result.isEdit.value && tab.current) {
          tab.delTab(tab.current, v => router.push(v.path || ''))
        }
        if (props.invalidate) {
          invalidate(props.invalidate)
        }
      },
    })

    const tabInfo = tab.tabs.find(v => v.path === tab.current)

    return () => (
      <DuxPage card={false} scrollbar={false}>
        <DuxCard
          title={props?.title || tabInfo?.label || (result.isEdit.value ? t('components.form.edit') : t('components.form.create'))}
          description={props?.description}
          class="h-full flex flex-col"
          contentClass="flex-1 min-h-0"
          contentSize="none"
          header-bordered
        >
          {{
            default: () => (
              <NScrollbar>
                <DuxFormLayout label-placement="page">
                  {slots?.default?.(result)}
                </DuxFormLayout>
              </NScrollbar>
            ),
            headerExtra: () => (
              <div class="flex gap-6 items-center">
                {slots?.actions?.(result)}
                <div class="flex gap-2">
                  <NButton onClick={() => result.onReset()}>
                    {{
                      default: () => t('components.button.reset'),
                      icon: () => <i class="i-tabler:refresh" />,
                    }}
                  </NButton>
                  <NButton type="primary" onClick={() => result.onSubmit()}>
                    {{
                      default: () => t('components.button.submit'),
                      icon: () => <i class="i-tabler:device-floppy" />,
                    }}
                  </NButton>
                </div>
              </div>
            ),
          }}
        </DuxCard>
      </DuxPage>
    )
  },
})
