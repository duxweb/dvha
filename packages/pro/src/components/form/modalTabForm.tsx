import type { IDataProviderError, IDataProviderResponse } from '@duxweb/dvha-core'
import type { MaybeRef, PropType, Ref } from 'vue'
import { useExtendForm, useI18n, useInvalidate } from '@duxweb/dvha-core'
import { NButton, useMessage } from 'naive-ui'
import { defineComponent, toRef } from 'vue'
import { DuxModalTab } from '..'

export const DuxModalTabForm = defineComponent({
  name: 'DuxModalTabForm',
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
    draggable: {
      type: Boolean,
      default: false,
    },
    handle: {
      type: [String, Object] as PropType<string | Ref<HTMLElement>>,
      default: '',
    },
  },
  setup(props, { slots }) {
    const { t } = useI18n()
    const form = toRef(props, 'data', {})
    const message = useMessage()
    const { invalidate } = useInvalidate()

    const { isLoading, onSubmit } = useExtendForm({
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
        if (props.invalidate) {
          invalidate(props.invalidate)
        }
        message.success(t('components.form.success') as string)
        props.onSuccess?.(data)
        props.onClose?.()
      },
    })

    return () => (
      <DuxModalTab
        defaultTab={props.defaultTab}
        draggable={props.draggable}
        handle={props.handle}
        onClose={props.onClose}
      >
        {{
          default: () => slots?.default?.(),
          footer: () => (
            <>
              <NButton onClick={() => props.onClose?.()}>
                {t('components.button.cancel')}
              </NButton>
              <NButton type="primary" loading={isLoading.value} onClick={() => onSubmit()}>
                {t('components.button.submit')}
              </NButton>
            </>
          ),
        }}
      </DuxModalTab>
    )
  },
})
