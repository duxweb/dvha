import type { TypedSchema } from 'vee-validate'
import type { MaybeRef } from 'vue'
import { all } from '@vee-validate/rules'
import { cloneDeep } from 'lodash-es'
import { defineRule, useForm } from 'vee-validate'
import { toRef, watch } from 'vue'

export interface UseValidateFormProps {
  data?: MaybeRef<Record<string, any>>
  rules?: TypedSchema
}

export function useValidateForm(props: UseValidateFormProps) {
  const data = toRef(props, 'data')

  const { setValues, validate, resetForm, handleSubmit } = useForm({
    initialValues: cloneDeep(data.value || {}),
    validationSchema: props.rules,
  })

  watch(data, (v) => {
    setValues(v || {}, false)
  }, { deep: true })

  const reset = () => {
    resetForm()
  }

  return {
    validate,
    reset,
    submit: handleSubmit,
  }
}

export function initFormValidate() {
  Object.entries(all).forEach(([name, rule]) => {
    defineRule(name, rule)
  })
}
