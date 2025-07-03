import type { MaybeRef } from 'vue'
import type { IDataProviderError, IDataProviderResponse } from '../types'
import { cloneDeep } from 'lodash-es'
import { computed, ref, toRef, watch } from 'vue'
import { useCreate, useOne, useUpdate } from './data'

type Key = string | number | undefined
export interface IUseFormProps {
  path?: string
  id?: MaybeRef<Key>
  form?: MaybeRef<Record<string, any>>
  onSuccess?: (data: IDataProviderResponse) => void
  onError?: (error: IDataProviderError) => void
  action?: 'create' | 'edit'
  providerName?: string
}

export function useForm(props: IUseFormProps) {
  const form = toRef(props, 'form', {})
  const id = toRef(props, 'id', undefined)

  // 初始化数据，用于重置表单数据
  const editResetData = ref(cloneDeep(form.value || {}))
  // 首次初始化数据，用于创建时，设置表单数据
  const createResetData = ref(cloneDeep(form.value || {}))

  const isEdit = computed(() => {
    return props.action === 'edit' || !!id.value
  })

  const { data: oneData, isLoading: isLoadingOne, refetch } = useOne({
    get path() {
      return props.path || ''
    },
    get id() {
      return id.value as Key
    },
    options: {
      enabled: false,
    },
    providerName: props.providerName,
  })

  // 重置表单数据
  const onReset = () => {
    let resetData = {}
    if (isEdit.value) {
      resetData = cloneDeep(editResetData.value)
    }
    else {
      resetData = cloneDeep(createResetData.value)
    }
    Object.assign(form.value, resetData)
  }

  // 初始化表单数据
  watch([id, isEdit], async () => {
    if (!isEdit.value) {
      onReset()
      return
    }
    await refetch()
    const data = cloneDeep(oneData.value?.data || {})
    Object.assign(form.value as object, data)
    Object.assign(editResetData.value as object, data)
  }, {
    immediate: true,
    deep: true,
  })

  const create = useCreate({
    path: props.path ?? '',
    data: form.value,
    onSuccess: (data) => {
      onReset()
      props.onSuccess?.(data)
    },
    onError: (error) => {
      props.onError?.(error)
    },
    providerName: props.providerName,
  })

  const update = useUpdate({
    get path() {
      return props.path ?? ''
    },
    get id() {
      return id.value as Key
    },
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
    if (!isEdit.value) {
      create.mutate({
        data: data || form.value,
      })
    }
    else {
      update.mutate({
        id: id.value as Key,
        data: data || form.value,
      })
    }
  }

  const isLoading = computed<boolean>(() => isLoadingOne.value || create.isLoading.value || update.isLoading.value)

  return {
    form,
    initData: isEdit.value ? editResetData.value : createResetData.value,
    isLoading,
    isEdit,
    onSubmit,
    onReset,
  }
}
