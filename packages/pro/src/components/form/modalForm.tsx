import type { IDataProviderError, IDataProviderResponse } from '@duxweb/dvha-core'
import type { MaybeRef, PropType } from 'vue'
import { useExtendForm, useI18n, useInvalidate } from '@duxweb/dvha-core'
import { NButton, useMessage } from 'naive-ui'
import { computed, defineComponent, toRef } from 'vue'
import { DuxModalPage } from '../../components'
import { DuxFormLayout } from './formLayout'

export const DuxModalForm = defineComponent({
  name: 'DuxModalForm',
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
    title: {
      type: String as PropType<string>,
    },
    invalidate: {
      type: String as PropType<string>,
    },
    onSuccess: {
      type: Function as PropType<(data?: IDataProviderResponse) => void>,
    },
    onError: {
      type: Function as PropType<(error?: IDataProviderError) => void>,
    },
  },
  extends: DuxFormLayout,
  setup(props, { slots }) {
    const { t } = useI18n()
    const formProps = computed(() => {
      const { onClose, onSuccess, onError, action, title, id, path, data, ...rest } = props
      return rest
    })
    const form = toRef(props, 'data', {})
    const message = useMessage()

    const { invalidate } = useInvalidate()

    const { isLoading, onSubmit, isEdit } = useExtendForm({
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
      <DuxModalPage title={props?.title || (isEdit.value ? t('components.form.edit') : t('components.form.create'))} onClose={props?.onClose}>
        {{
          default: () => (
            <DuxFormLayout
              {...formProps.value}
            >
              {slots?.default?.()}
            </DuxFormLayout>
          ),
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
      </DuxModalPage>
    )
  },
})
