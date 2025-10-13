import type { TypedSchema } from 'vee-validate'
import type { IUseFormProps } from './form'
import { toRef } from 'vue'
import { useForm } from './form'
import { useValidateForm } from './formValidate'

export interface UseExtendFormProps extends IUseFormProps {
  rules?: TypedSchema
}

export function useExtendForm(props: UseExtendFormProps) {
  const form = toRef(props, 'form', {})

  const { validate, reset: onResetValidate } = useValidateForm({
    data: form,
    rules: props.rules,
  })

  const result = useForm({
    id: props.id,
    path: props.path,
    form,
    action: props.action,
    onSuccess: props.onSuccess,
    onError: props.onError,
    providerName: props.providerName,
    meta: props.meta,
    params: props.params,
  })

  const onSubmit = (data?: Record<string, any>) => {
    validate().then((v) => {
      if (!v.valid) {
        props.onError?.({
          message: '表单验证失败',
        })
        return
      }
      result.onSubmit(data)
    })
  }

  const onReset = () => {
    result.onReset()
    onResetValidate()
  }

  return {
    isLoading: result.isLoading,
    isEdit: result.isEdit,
    form,
    onSubmit,
    onReset,
  }
}
