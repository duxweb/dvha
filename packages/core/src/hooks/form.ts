import type { MaybeRef } from 'vue'
import type { IDataProviderError, IDataProviderResponse } from '../types'
import { cloneDeep } from 'lodash-es'
import { computed, ref, toRef, watch } from 'vue'
import { useCreate, useOne, useUpdate } from './data'

export interface IUseFormProps {
  path?: string
  id?: string | number
  form?: MaybeRef<Record<string, any>>
  onSuccess?: (data: IDataProviderResponse) => void
  onError?: (error: IDataProviderError) => void
  action?: 'create' | 'edit'
  providerName?: string
}

export function useForm(props: IUseFormProps) {
  const form = toRef(props, 'form', {})
  const initData = ref(cloneDeep(props.form || {}))

  const isEdit = computed(() => {
    return props.action === 'edit' || props.id
  })

  const { data: oneData, isLoading: isLoadingOne, refetch } = useOne({
    path: props.path || '',
    id: props.id,
    options: {
      enabled: !!props.id,
    },
    providerName: props.providerName,
  })

  watch([() => props.action, () => props.id], async () => {
    if (!isEdit.value) {
      return
    }
    await refetch()
    const data = cloneDeep(oneData.value?.data || {})
    Object.assign(form.value as object, data)
    Object.assign(initData.value as object, data)
  }, {
    immediate: true,
  })

  const onReset = () => {
    const resetData = cloneDeep(initData.value)
    Object.assign(form.value, resetData)
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

  const onSubmit = (data?: Record<string, any>) => {
    if (props.action === 'create') {
      create.mutate({
        data: data || form.value,
      })
    }
    else {
      update.mutate({
        id: props.id,
        data: data || form.value,
      })
    }
  }

  const isLoading = computed<boolean>(() => isLoadingOne.value || create.isLoading.value || update.isLoading.value)

  return {
    form,
    initData,
    isLoading,
    isEdit,
    onSubmit,
    onReset,
  }
}
