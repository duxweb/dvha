import type { IDataProviderError, IDataProviderResponse } from '@duxweb/dvha-core'
import type { MaybeRef, PropType } from 'vue'
import { useExtendForm, useI18n, useInvalidate, useTabStore } from '@duxweb/dvha-core'
import { NButton, NTabs, useMessage } from 'naive-ui'
import { defineComponent, toRef } from 'vue'
import { useRouter } from 'vue-router'
import { DuxPage } from '../../pages'
import { DuxCard } from '../card'

export const DuxPageTabForm = defineComponent({
  name: 'DuxPageTabForm',
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
    path: {
      type: String as PropType<string>,
    },
    data: {
      type: Object as PropType<MaybeRef<Record<string, any>>>,
    },
    meta: {
      type: Object as PropType<MaybeRef<Record<string, any>>>,
    },
    params: {
      type: Object as PropType<MaybeRef<Record<string, any>>>,
    },
    onSuccess: {
      type: Function as PropType<(data?: IDataProviderResponse) => void>,
    },
    onError: {
      type: Function as PropType<(error?: IDataProviderError) => void>,
    },
    invalidate: {
      type: String as PropType<string>,
    },
    defaultTab: {
      type: String as PropType<string>,
      default: '0',
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
      meta: props.meta,
      params: props.params,
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

    return () => (
      <DuxPage card={false} scrollbar={false}>
        <DuxCard class="h-full">
          <NTabs
            class="app-page-tabs"
            type="line"
            size="large"
            defaultValue={props.defaultTab}
          >
            {{
              prefix: () => (
                <div class="w-1">
                </div>
              ),
              default: () => slots?.default?.(result),
              suffix: () => (
                <div class="flex gap-6 items-center px-3">
                  {slots?.actions?.(result)}
                  <div class="flex gap-2">
                    <NButton onClick={() => result.onReset()} loading={result.isLoading.value}>
                      {{
                        default: () => t('components.button.reset'),
                        icon: () => <i class="i-tabler:refresh" />,
                      }}
                    </NButton>
                    <NButton type="primary" onClick={() => result.onSubmit()} loading={result.isLoading.value}>
                      {{
                        default: () => t('components.button.submit'),
                        icon: () => <i class="i-tabler:device-floppy" />,
                      }}
                    </NButton>
                  </div>
                </div>
              ),
            }}
          </NTabs>
        </DuxCard>
      </DuxPage>
    )
  },
})
