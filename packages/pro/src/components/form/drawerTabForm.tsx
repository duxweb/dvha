import type { IDataProviderError, IDataProviderResponse } from '@duxweb/dvha-core'
import type { MaybeRef, PropType } from 'vue'
import { useExtendForm, useI18n, useInvalidate } from '@duxweb/dvha-core'
import { NButton, useMessage } from 'naive-ui'
import { defineComponent, toRef } from 'vue'
import { DuxDrawerTab } from '..'

export const DuxDrawerTabForm = defineComponent({
  name: 'DuxDrawerTabForm',
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
    meta: {
      type: Object as PropType<MaybeRef<Record<string, any>>>,
    },
    params: {
      type: Object as PropType<MaybeRef<Record<string, any>>>,
    },
    onClose: {
      type: Function as PropType<() => void>,
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
    const { invalidate } = useInvalidate()

    const { isLoading, onSubmit, onReset } = useExtendForm({
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
        props.onClose?.()
        if (props.invalidate) {
          invalidate(props.invalidate)
        }
      },
    })

    return () => (
      <DuxDrawerTab defaultTab={props.defaultTab} onClose={props.onClose}>
        {{
          default: () => slots?.default?.(),
          footer: () => (
            <>
              <NButton onClick={onReset} loading={isLoading.value}>
                {t('components.button.reset')}
              </NButton>
              <NButton type="primary" loading={isLoading.value} onClick={() => onSubmit()}>
                {t('components.button.submit')}
              </NButton>
            </>
          ),
        }}
      </DuxDrawerTab>
    )
  },
})
