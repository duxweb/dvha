import type { TypedSchema } from 'vee-validate'
import type { IUseFormProps } from './form'
import { computed, toRef } from 'vue'
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

  const formProps = computed(() => {
    const { form, ...rest } = props
    return {
      ...rest,
    }
  })

  const result = useForm({
    ...formProps.value,
    form: form.value,
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
