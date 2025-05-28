import type { IDataProviderError, IDataProviderResponse } from '../types'
import { cloneDeep } from 'lodash-es'
import { computed, ref, toRef, watch } from 'vue'
import { useCreate, useOne, useUpdate } from './data'

export interface IUseFormProps {
  path?: string
  id?: string | number
  form?: Record<string, any>
  onSuccess?: (data: IDataProviderResponse) => void
  onError?: (error: IDataProviderError) => void
  action?: 'create' | 'edit'
  providerName?: string
}

export function useForm(props: IUseFormProps) {
  const form = toRef(props.form || {})
  const initData = ref(cloneDeep(props.form || {}))

  const { data: oneData, isLoading: isLoadingOne, refetch } = useOne({
    path: props.path || '',
    id: props.id,
    options: {
      enabled: !!props.id,
    },
    providerName: props.providerName,
  })

  watch([() => props.action, () => props.id], async ([action]) => {
    if (action !== 'edit') {
      return
    }
    await refetch()
    const data = cloneDeep(oneData.value?.data || {})
    form.value = data
    initData.value = data
  }, {
    immediate: true,
  })

  const onReset = () => {
    form.value = cloneDeep(initData.value)
  }

  const create = useCreate({
    path: props.path ?? '',
    data: form.value,
    onSuccess: (data) => {
      props.onSuccess?.(data)
    },
    onError: (error) => {
      props.onError?.(error)
    },
    providerName: props.providerName,
  })

  const update = useUpdate({
    path: props.path ?? '',
    id: props.id,
    data: form.value,
    onSuccess: (data) => {
      props.onSuccess?.(data)
    },
    onError: (error) => {
      props.onError?.(error)
    },
    providerName: props.providerName,
  })

  const onSubmit = () => {
    if (props.action === 'create') {
      create.mutate({
        data: form.value,
      })
    }
    else {
      update.mutate({
        id: props.id,
        data: form.value,
      })
    }
  }

  const isLoading = computed<boolean>(() => isLoadingOne.value || create.isLoading.value || update.isLoading.value)

  return {
    form,
    isLoading,
    onSubmit,
    onReset,
  }
}
