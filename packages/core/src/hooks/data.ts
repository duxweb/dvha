/* eslint-disable @tanstack/query/exhaustive-deps */
import type { DefaultError, DefinedInitialDataInfiniteOptions, DefinedInitialQueryOptions, InfiniteData, UseMutationOptions } from '@tanstack/vue-query'
import type { IDataProviderCreateManyOptions, IDataProviderCreateOptions, IDataProviderCustomOptions, IDataProviderDeleteManyOptions, IDataProviderDeleteOptions, IDataProviderError, IDataProviderGetManyOptions, IDataProviderGetOneOptions, IDataProviderListOptions, IDataProviderPagination, IDataProviderResponse, IDataProviderUpdateManyOptions, IDataProviderUpdateOptions } from '../types'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { trimStart } from 'lodash-es'
import { computed, ref, toRef, unref, watch } from 'vue'
import { useError, useGetAuth } from './auth'
import { useManage } from './manage'

type IDataQueryOptions = Partial<DefinedInitialQueryOptions<IDataProviderResponse | undefined, DefaultError, IDataProviderResponse | undefined, any>>
type IDataQueryOptionsInfinite = Partial<DefinedInitialDataInfiniteOptions<IDataProviderResponse | undefined, DefaultError, InfiniteData<IDataProviderResponse | undefined>, any, number>>

export interface IListParams extends IDataProviderListOptions {
  providerName?: string
  options?: IDataQueryOptions
  onError?: (error: IDataProviderError) => void
}

/**
 * Get list data
 * @param params
 */
export function useList(params: IListParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const providerName = params.providerName || 'default'

  const { mutate: onAuthError } = useError()

  const pagination = toRef<IDataProviderPagination>(params.pagination ? params.pagination as IDataProviderPagination : { page: 1, pageSize: 20 })
  const sorters = computed(() => unref(params.sorters) || {})
  const filters = computed(() => unref(params.filters) || {})
  const meta = computed(() => unref(params.meta) || {})

  const props = computed((): IDataProviderListOptions => {
    const { onError, options, pagination, filters, sorters, meta, ...rest } = params
    return rest
  })

  watch(props, () => {
    if (!params.pagination) {
      return
    }
    pagination.value.page = 1
  }, {
    deep: true,
  })

  const queryProps = computed(() => {
    return {
      ...props.value,
      pagination: params.pagination ? pagination.value : undefined,
      filters: filters.value,
      sorters: sorters.value,
      meta: meta.value,
    }
  })

  const queryKey = computed(() => {
    return [`${manage.config?.name}:${providerName}:${params.path}`, queryProps.value]
  })

  const req = useQuery({
    queryKey,
    queryFn: () => manage.config?.dataProvider?.[providerName]?.getList(queryProps.value, manage, auth),
    ...params.options,
  })

  const isLoading = computed<boolean>(() => {
    return req.isFetching.value
  })

  watch(req.isError, (v) => {
    if (!v) {
      return
    }
    onAuthError(req.error.value as IDataProviderError)
    params?.onError?.(req.error.value as IDataProviderError)
  })

  const data = ref<IDataProviderResponse | undefined>(undefined)
  const total = ref(0)
  const pageCount = ref(0)

  watch(req.data, (v) => {
    if (!v) {
      return
    }
    data.value = v
    total.value = manage.config?.dataProvider?.[providerName]?.getTotal?.(v) || 0
    pageCount.value = Math.ceil(total.value / (pagination.value.pageSize || 20)) || 0
  }, {
    immediate: true,
  })

  return {
    ...req,
    isLoading,
    data,
    refetch: req.refetch,
    pagination,
    total,
    pageCount,
  }
}

export interface IInfiniteListParams extends IDataProviderListOptions {
  providerName?: string
  pagination?: IDataProviderPagination
  options?: IDataQueryOptionsInfinite
  onError?: (error: IDataProviderError) => void
}

/**
 * Get infinite list data
 * @param params
 */
export function useInfiniteList(params: IInfiniteListParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const providerName = params.providerName || 'default'
  const { mutate: onAuthError } = useError()

  const pagination = toRef(params, 'pagination', { page: 1, pageSize: 20 })
  const sorters = toRef(params, 'sorters', {})
  const filters = toRef(params, 'filters', {})
  const meta = toRef(params, 'meta', {})

  const props = computed((): IDataProviderListOptions => {
    const { onError, options, pagination, filters, sorters, meta, ...rest } = params
    return rest
  })

  watch(props, () => {
    pagination.value.page = 1
  }, {
    deep: true,
  })

  const total = ref(0)
  const pageCount = ref(0)

  const queryProps = computed(() => {
    return {
      ...props.value,
      filters: filters.value || {},
      sorters: sorters.value || {},
      meta: meta.value || {},
    }
  })

  const queryKey = computed(() => {
    return [`${manage.config?.name}:${providerName}:infinite:${params.path}`, queryProps.value]
  })

  const req = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => {
      pagination.value.page = pageParam
      return manage.config?.dataProvider?.[providerName]?.getList({
        ...queryProps.value,
        pagination: {
          ...pagination.value,
          page: pageParam,
        },
      }, manage, auth)
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage?.data || !lastPage?.data?.length) {
        return
      }

      const resTotal = manage.config?.dataProvider?.[providerName]?.getTotal?.(lastPage) || 0
      pageCount.value = Math.ceil(resTotal / (pagination.value.pageSize || 20)) || 0
      total.value = resTotal

      const currentTotal = lastPageParam * (pagination.value.pageSize || 20)
      if (currentTotal >= resTotal) {
        return
      }

      return lastPageParam + 1
    },
    getPreviousPageParam: (firstPage, _allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return
      }
      const resTotal = manage.config?.dataProvider?.[providerName]?.getTotal?.(firstPage) || 0
      pageCount.value = Math.ceil(resTotal / (pagination.value.pageSize || 20)) || 0
      total.value = resTotal
      return firstPageParam - 1
    },
    ...params.options,
  })

  const isLoading = computed<boolean>(() => {
    return req.isFetching.value
  })

  watch(req.isError, (v) => {
    if (!v) {
      return
    }
    onAuthError(req.error.value as IDataProviderError)
    params?.onError?.(req.error.value as IDataProviderError)
  })

  const fetchNextPage = () => {
    if (!req.hasNextPage.value || req.isFetching.value) {
      return
    }
    return req.fetchNextPage()
  }

  const data = ref<IDataProviderResponse | undefined>(undefined)
  watch(req.data, (v) => {
    if (!v || !v?.pages || !v.pages?.length) {
      return
    }
    const allData = v.pages.reduce((acc, page) => {
      if (page?.data && Array.isArray(page.data) && page.data?.length) {
        return acc.concat(page.data)
      }
      return acc
    }, [] as any[])

    const firstPage = v.pages[0]
    if (firstPage) {
      data.value = {
        ...firstPage,
        data: allData,
      }
    }
  }, {
    deep: true,
    immediate: true,
  })

  return {
    ...req,
    isLoading,
    data,
    fetchNextPage,
    hasNextPage: req.hasNextPage,
    refetch: req.refetch,
    pagination,
    total,
    pageCount,
  }
}

export interface IOneParams extends IDataProviderGetOneOptions {
  providerName?: string
  options?: IDataQueryOptions
  onError?: (error: IDataProviderError) => void
}

/**
 * Get one data
 * @param params
 */
export function useOne(params: IOneParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const providerName = params.providerName || 'default'
  const { mutate: onAuthError } = useError()

  const props = computed((): IDataProviderGetOneOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useQuery({
    queryKey: [`${manage.config?.name}:${providerName}:${params.path}`, props],
    queryFn: () => manage.config?.dataProvider?.[providerName]?.getOne(props.value, manage, auth),
    ...params.options,
    staleTime: 0,
  })

  const isLoading = computed<boolean>(() => {
    if (req.isFetched.value) {
      return false
    }
    return req.isFetching.value
  })

  watch(req.isError, (v) => {
    if (!v) {
      return
    }
    onAuthError(req.error.value as IDataProviderError)
    params?.onError?.(req.error.value as IDataProviderError)
  }, {
    immediate: true,
  })

  const data = ref<IDataProviderResponse | undefined>(undefined)
  watch(req.data, (v) => {
    if (!v) {
      return
    }
    data.value = v
  }, {
    immediate: true,
  })

  return {
    ...req,
    isLoading,
    data,
    refetch: req.refetch,
  }
}

export interface IManyParams extends IDataProviderGetManyOptions {
  providerName?: string
  options?: IDataQueryOptions
  onError?: (error: IDataProviderError) => void
}
/**
 * Get many data
 * @param params
 */
export function useMany(params: IManyParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const providerName = params.providerName || 'default'
  const { mutate: onAuthError } = useError()

  const props = computed((): IDataProviderGetManyOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useQuery({
    queryKey: [`${manage.config?.name}:${providerName}:${params.path}`, props],
    queryFn: () => manage.config?.dataProvider?.[providerName]?.getMany(props.value, manage, auth),
    ...params.options,
    staleTime: 0,
  })

  const isLoading = computed<boolean>(() => {
    if (req.isFetched.value) {
      return false
    }
    return req.isFetching.value
  })

  watch(req.isError, (v) => {
    if (!v) {
      return
    }
    onAuthError(req.error.value as IDataProviderError)
    params?.onError?.(req.error.value as IDataProviderError)
  })

  const data = ref<IDataProviderResponse | undefined>(undefined)
  watch(req.data, (v) => {
    if (!v) {
      return
    }
    data.value = v
  }, {
    immediate: true,
  })

  return {
    ...req,
    isLoading,
    data,
    refetch: req.refetch,
  }
}

export interface ICreateParams extends IDataProviderCreateOptions {
  providerName?: string
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderCreateOptions>
  onSuccess?: (data: IDataProviderResponse) => void
  onError?: (error: IDataProviderError) => void
}

/**
 * Create data
 * @param params
 */
export function useCreate(params: ICreateParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const providerName = params.providerName || 'default'
  const { mutate: onAuthError } = useError()
  const { invalidate } = useInvalidate()

  const props = computed((): IDataProviderCreateOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config?.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      if (data.path) {
        params.path = data.path
      }
      return manage.config?.dataProvider?.[providerName]?.create({
        ...props.value,
        ...data,
      }, manage, auth)
    },
    onSuccess: (data) => {
      params.onSuccess?.(data)
      if (params.path) {
        invalidate(params.path)
      }
    },
    onError: (error) => {
      onAuthError(error)
      params?.onError?.(error)
    },
    ...params.options,
  })

  const isLoading = computed<boolean>(() => req.isPending.value)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

export interface ICreateManyParams extends IDataProviderCreateManyOptions {
  providerName?: string
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderCreateManyOptions>
  onSuccess?: (data: IDataProviderResponse) => void
  onError?: (error: IDataProviderError) => void
}

/**
 * Create data
 * @param params
 */
export function useCreateMany(params: ICreateManyParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const providerName = params.providerName || 'default'
  const { mutate: onAuthError } = useError()
  const { invalidate } = useInvalidate()
  const props = computed((): IDataProviderCreateManyOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config?.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      if (data.path) {
        params.path = data.path
      }
      return manage.config?.dataProvider?.[providerName]?.createMany({
        ...props.value,
        ...data,
      }, manage, auth)
    },
    onSuccess: (data) => {
      params.onSuccess?.(data)
      if (params.path) {
        invalidate(params.path)
      }
    },
    onError: (error) => {
      onAuthError(error)
      params?.onError?.(error)
    },
    ...params.options,
  })

  const isLoading = computed<boolean>(() => req.isPending.value)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

export interface IUpdateParams extends IDataProviderUpdateOptions {
  providerName?: string
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderUpdateOptions>
  onSuccess?: (data: IDataProviderResponse) => void
  onError?: (error: IDataProviderError) => void
}

/**
 * Update data
 * @param params
 */
export function useUpdate(params: IUpdateParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const providerName = params.providerName || 'default'
  const { mutate: onAuthError } = useError()
  const { invalidate } = useInvalidate()
  const props = computed((): IDataProviderUpdateOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config?.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      if (data.path) {
        params.path = data.path
      }
      return manage.config?.dataProvider?.[providerName]?.update({
        ...props.value,
        ...data,
      }, manage, auth)
    },
    onSuccess: (data) => {
      params.onSuccess?.(data)
      if (params.path) {
        invalidate(params.path)
      }
    },
    onError: (error) => {
      onAuthError(error)
      params?.onError?.(error)
    },
    ...params.options,
  })

  const isLoading = computed<boolean>(() => req.isPending.value)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

export interface IUpdateManyParams extends IDataProviderUpdateManyOptions {
  providerName?: string
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderUpdateManyOptions>
  onSuccess?: (data: IDataProviderResponse) => void
  onError?: (error: IDataProviderError) => void
}

export function useUpdateMany(params: IUpdateManyParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const providerName = params.providerName || 'default'
  const { mutate: onAuthError } = useError()
  const { invalidate } = useInvalidate()

  const props = computed((): IDataProviderUpdateManyOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config?.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      if (data.path) {
        params.path = data.path
      }
      return manage.config?.dataProvider?.[providerName]?.updateMany({
        ...props.value,
        ...data,
      }, manage, auth)
    },
    onSuccess: (data) => {
      params.onSuccess?.(data)
      if (params.path) {
        invalidate(params.path)
      }
    },
    onError: (error) => {
      onAuthError(error)
      params?.onError?.(error)
    },
    ...params.options,
  })

  const isLoading = computed<boolean>(() => req.isPending.value)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

export interface IDeleteParams extends IDataProviderDeleteOptions {
  providerName?: string
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderDeleteOptions>
  onSuccess?: (data: IDataProviderResponse) => void
  onError?: (error: IDataProviderError) => void
}

/**
 * Update data
 * @param params
 */
export function useDelete(params: IDeleteParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const providerName = params.providerName || 'default'
  const { mutate: onAuthError } = useError()
  const { invalidate } = useInvalidate()

  const props = computed((): IDataProviderDeleteOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config?.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      if (data.path) {
        params.path = data.path
      }
      return manage.config?.dataProvider?.[providerName]?.deleteOne({
        ...props.value,
        ...data,
      }, manage, auth)
    },
    onSuccess: (data) => {
      params.onSuccess?.(data)
      if (params.path) {
        invalidate(params.path)
      }
    },
    onError: (error) => {
      onAuthError(error)
      params?.onError?.(error)
    },
    ...params.options,
  })

  const isLoading = computed<boolean>(() => req.isPending.value)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

export interface IDeleteManyParams extends IDataProviderDeleteManyOptions {
  providerName?: string
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderDeleteManyOptions>
  onSuccess?: (data: IDataProviderResponse) => void
  onError?: (error: IDataProviderError) => void
}

/**
 * Update data
 * @param params
 */
export function useDeleteMany(params: IDeleteManyParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const providerName = params.providerName || 'default'
  const { mutate: onAuthError } = useError()
  const { invalidate } = useInvalidate()
  const props = computed((): IDataProviderDeleteManyOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config?.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      if (data.path) {
        params.path = data.path
      }
      return manage.config?.dataProvider?.[providerName]?.deleteMany({
        ...props.value,
        ...data,
      }, manage, auth)
    },
    onSuccess: (data) => {
      params.onSuccess?.(data)
      if (params.path) {
        invalidate(params.path)
      }
    },
    onError: (error) => {
      onAuthError(error)
      params?.onError?.(error)
    },
    ...params.options,
  })

  const isLoading = computed<boolean>(() => req.isPending.value)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

export interface ICustomParams extends IDataProviderCustomOptions {
  providerName?: string
  options?: IDataQueryOptions
  onError?: (error: IDataProviderError) => void
}

/**
 * Custom query request
 * @param params
 */
export function useCustom(params?: ICustomParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const providerName = params?.providerName || 'default'
  const { mutate: onAuthError } = useError()

  const props = computed((): IDataProviderCustomOptions => {
    if (!params) {
      return {}
    }
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useQuery({
    queryKey: [`${manage.config?.name}:${providerName}:${params?.path}`, props],
    queryFn: () => manage.config?.dataProvider?.[providerName]?.custom(props.value, manage, auth),
    ...params?.options,
  })

  const isLoading = computed<boolean>(() => {
    if (req.isFetched.value) {
      return false
    }
    return req.isFetching.value
  })

  watch(req.isError, (v) => {
    if (!v) {
      return
    }
    onAuthError(req.error.value as IDataProviderError)
    params?.onError?.(req.error.value as IDataProviderError)
  })

  const data = ref<IDataProviderResponse | undefined>(undefined)
  watch(req.data, (v) => {
    if (!v) {
      return
    }
    data.value = v
  }, {
    immediate: true,
  })

  return {
    ...req,
    isLoading,
    data,
    refetch: req.refetch,
  }
}

export interface ICustomMutationParams extends IDataProviderCustomOptions {
  providerName?: string
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderCustomOptions>
  onSuccess?: (data: IDataProviderResponse) => void
  onError?: (error: IDataProviderError) => void
}

/**
 * Custom mutation request
 * @param params
 */
export function useCustomMutation(params?: ICustomMutationParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const providerName = params?.providerName || 'default'
  const { mutate: onAuthError } = useError()

  const props = computed((): IDataProviderCustomOptions => {
    if (!params) {
      return {}
    }
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config?.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      return manage.config?.dataProvider?.[providerName]?.custom({
        ...props.value,
        ...data,
      }, manage, auth)
    },
    onSuccess: (data) => {
      req.reset()
      params?.onSuccess?.(data)
    },
    onError: (error) => {
      onAuthError(error)
      params?.onError?.(error)
    },
    ...params?.options,
  })

  const isLoading = computed<boolean>(() => req.isPending.value)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

interface IClientParams extends IDataProviderCustomOptions {
  providerName?: string
}

/**
 * Custom request client
 */
export function useClient() {
  const manage = useManage()
  const auth = useGetAuth()
  const request = (params: IClientParams) => {
    if (!manage.config?.dataProvider) {
      throw new Error('Data provider is not initialized')
    }
    const providerName = params.providerName || 'default'
    return manage.config?.dataProvider?.[providerName]?.custom({
      ...params,
    }, manage, auth) as Promise<IDataProviderResponse>
  }

  return {
    request,
  }
}

export function useInvalidate() {
  const queryClient = useQueryClient()
  const manage = useManage()

  const invalidate = (path: string, providerName?: string) => {
    let marks: any = path
    if (!Array.isArray(path)) {
      marks = [path]
    }

    for (const mark of marks) {
      let cleanPath = mark
      if (manage.config?.apiBasePath && cleanPath.startsWith(manage.config.apiBasePath)) {
        cleanPath = trimStart(cleanPath.substring(manage.config.apiBasePath.length), '/')
      }

      const key = `${manage.config?.name}:${providerName || 'default'}:${cleanPath}`
      queryClient.invalidateQueries({
        queryKey: [key],
      })
    }
  }

  return {
    invalidate,
  }
}
