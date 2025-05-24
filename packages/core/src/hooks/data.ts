/* eslint-disable @tanstack/query/exhaustive-deps */
import type { DefaultError, DefinedInitialDataInfiniteOptions, DefinedInitialQueryOptions, InfiniteData, UseMutationOptions } from '@tanstack/vue-query'
import type { IDataProviderCreateManyOptions, IDataProviderCreateOptions, IDataProviderCustomOptions, IDataProviderDeleteManyOptions, IDataProviderDeleteOptions, IDataProviderGetManyOptions, IDataProviderGetOneOptions, IDataProviderListOptions, IDataProviderResponse, IDataProviderUpdateManyOptions, IDataProviderUpdateOptions } from '../types'
import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from '@tanstack/vue-query'
import { computed, watch } from 'vue'
import { useError, useGetAuth } from './auth'
import { useManage } from './manage'

type IDataQueryOptions = DefinedInitialQueryOptions<IDataProviderResponse | undefined, DefaultError, IDataProviderResponse | undefined, any>
type IDataQueryOptionsInfinite = DefinedInitialDataInfiniteOptions<IDataProviderResponse | undefined, DefaultError, InfiniteData<IDataProviderResponse | undefined>, any, number>

interface IListParams extends IDataProviderListOptions {
  options?: IDataQueryOptions
  onError?: (error: any) => void
}

/**
 * Get list data
 * @param params
 */
export function useList(params: IListParams) {
  const manage = useManage()
  const auth = useGetAuth()

  const { mutate: onAuthError } = useError()

  const props = computed((): IDataProviderListOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useQuery({
    queryKey: [params.path, props],
    queryFn: () => manage.config.dataProvider?.getList(props.value, manage, auth),
    ...params.options,
  })

  const isLoading = computed(() => {
    if (req.isFetched) {
      return false
    }
    return req.isFetching
  })

  watch(() => req.isError, () => {
    onAuthError(req.error)
    params.onError?.(req.error)
  })

  return {
    ...req,
    isLoading,
    data: req.data,
    refetch: req.refetch,
  }
}

interface IInfiniteListParams extends IDataProviderListOptions {
  options?: IDataQueryOptionsInfinite
  onError?: (error: any) => void
}

/**
 * Get infinite list data
 * @param params
 */
export function useInfiniteList(params: IInfiniteListParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const { mutate: onAuthError } = useError()

  const props = computed((): IDataProviderListOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useInfiniteQuery({
    queryKey: [params.path, props],
    queryFn: () => manage.config.dataProvider?.getList(props.value, manage, auth),
    initialPageParam: 0,
    getNextPageParam: (lastPage, _allPages, lastPageParam) => {
      if (!lastPage?.data || lastPage?.data?.length === 0) {
        return undefined
      }
      return lastPageParam + 1
    },
    getPreviousPageParam: (_firstPage, _allPages, firstPageParam) => {
      if (firstPageParam <= 1) {
        return undefined
      }
      return firstPageParam - 1
    },
    ...params.options,
  })

  const isLoading = computed(() => {
    if (req.isFetched) {
      return false
    }
    return req.isFetching
  })

  watch(() => req.isError, () => {
    onAuthError(req.error)
    params.onError?.(req.error)
  })

  return {
    ...req,
    isLoading,
    data: req.data,
    fetchNextPage: req.fetchNextPage,
    hasNextPage: req.hasNextPage,
    refetch: req.refetch,
  }
}

interface IOneParams extends IDataProviderGetOneOptions {
  options?: IDataQueryOptions
  onError?: (error: any) => void
}

/**
 * Get one data
 * @param params
 */
export function useOne(params: IOneParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const { mutate: onAuthError } = useError()

  const props = computed((): IDataProviderGetOneOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useQuery({
    queryKey: [params.path, props],
    queryFn: () => manage.config.dataProvider?.getOne(props.value, manage, auth),
    ...params.options,
  })

  const isLoading = computed(() => {
    if (req.isFetched) {
      return false
    }
    return req.isFetching
  })

  watch(() => req.isError, () => {
    onAuthError(req.error)
    params.onError?.(req.error)
  })

  return {
    ...req,
    isLoading,
    data: req.data,
    refetch: req.refetch,
  }
}

interface IManyParams extends IDataProviderGetManyOptions {
  options?: IDataQueryOptions
  onError?: (error: any) => void
}
/**
 * Get many data
 * @param params
 */
export function useMany(params: IManyParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const { mutate: onAuthError } = useError()

  const props = computed((): IDataProviderGetManyOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useQuery({
    queryKey: [params.path, props],
    queryFn: () => manage.config.dataProvider?.getMany(props.value, manage, auth),
    ...params.options,
  })

  const isLoading = computed(() => {
    if (req.isFetched) {
      return false
    }
    return req.isFetching
  })

  watch(() => req.isError, () => {
    onAuthError(req.error)
    params.onError?.(req.error)
  })

  return {
    ...req,
    isLoading,
    data: req.data,
    refetch: req.refetch,
  }
}

interface ICreateParams extends IDataProviderCreateOptions {
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderCreateOptions>
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

/**
 * Create data
 * @param params
 */
export function useCreate(params: ICreateParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const { mutate: onAuthError } = useError()
  const { invalidate } = useInvalidate()

  const props = computed((): IDataProviderCreateOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      return manage.config.dataProvider.create({
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
      params.onError?.(error)
    },
    ...params.options,
  })

  const isLoading = computed(() => req.isPending)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

interface ICreateManyParams extends IDataProviderCreateManyOptions {
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderCreateManyOptions>
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

/**
 * Create data
 * @param params
 */
export function useCreateMany(params: ICreateManyParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const { mutate: onAuthError } = useError()
  const { invalidate } = useInvalidate()
  const props = computed((): IDataProviderCreateManyOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      return manage.config.dataProvider.createMany({
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
      params.onError?.(error)
    },
    ...params.options,
  })

  const isLoading = computed(() => req.isPending)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

interface IUpdateParams extends IDataProviderUpdateOptions {
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderUpdateOptions>
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

/**
 * Update data
 * @param params
 */
export function useUpdate(params: IUpdateParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const { mutate: onAuthError } = useError()
  const { invalidate } = useInvalidate()
  const props = computed((): IDataProviderUpdateOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      return manage.config.dataProvider.update({
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
      params.onError?.(error)
    },
    ...params.options,
  })

  const isLoading = computed(() => req.isPending)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

interface IUpdateManyParams extends IDataProviderUpdateManyOptions {
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderUpdateManyOptions>
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

export function useUpdateMany(params: IUpdateManyParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const { mutate: onAuthError } = useError()
  const { invalidate } = useInvalidate()

  const props = computed((): IDataProviderUpdateManyOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      return manage.config.dataProvider.updateMany({
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
      params.onError?.(error)
    },
    ...params.options,
  })

  const isLoading = computed(() => req.isPending)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

interface IDeleteParams extends IDataProviderDeleteOptions {
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderDeleteOptions>
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

/**
 * Update data
 * @param params
 */
export function useDelete(params: IDeleteParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const { mutate: onAuthError } = useError()
  const { invalidate } = useInvalidate()
  const props = computed((): IDataProviderDeleteOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      return manage.config.dataProvider.deleteOne({
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
      params.onError?.(error)
    },
    ...params.options,
  })

  const isLoading = computed(() => req.isPending)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

interface IDeleteManyParams extends IDataProviderDeleteManyOptions {
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderDeleteManyOptions>
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

/**
 * Update data
 * @param params
 */
export function useDeleteMany(params: IDeleteManyParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const { mutate: onAuthError } = useError()
  const { invalidate } = useInvalidate()
  const props = computed((): IDataProviderDeleteManyOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      return manage.config.dataProvider.deleteMany({
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
      params.onError?.(error)
    },
    ...params.options,
  })

  const isLoading = computed(() => req.isPending)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

interface ICustomParams extends IDataProviderCustomOptions {
  options?: IDataQueryOptions
  onError?: (error: any) => void
}

/**
 * Custom query request
 * @param params
 */
export function useCustom(params: ICustomParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const { mutate: onAuthError } = useError()

  const props = computed((): IDataProviderCustomOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useQuery({
    queryKey: [params.path, props],
    queryFn: () => manage.config.dataProvider?.custom(props.value, manage, auth),
    ...params.options,
  })

  const isLoading = computed(() => {
    if (req.isFetched) {
      return false
    }
    return req.isFetching
  })

  watch(() => req.isError, () => {
    onAuthError(req.error)
    params.onError?.(req.error)
  })

  return {
    ...req,
    isLoading,
    data: req.data,
    refetch: req.refetch,
  }
}

interface ICustomMutationParams extends IDataProviderCustomOptions {
  options?: UseMutationOptions<IDataProviderResponse, DefaultError, IDataProviderCustomOptions>
  onSuccess?: (data: any) => void
  onError?: (error: any) => void
}

/**
 * Custom mutation request
 * @param params
 */
export function useCustomMutation(params: ICustomMutationParams) {
  const manage = useManage()
  const auth = useGetAuth()
  const { mutate: onAuthError } = useError()

  const props = computed((): IDataProviderCustomOptions => {
    const { onError, options, ...rest } = params
    return rest
  })

  const req = useMutation({
    mutationFn: (data) => {
      if (!manage.config.dataProvider) {
        throw new Error('Data provider is not initialized')
      }
      return manage.config.dataProvider.custom({
        ...props.value,
        ...data,
      }, manage, auth)
    },
    onSuccess: (data) => {
      params.onSuccess?.(data)
    },
    onError: (error) => {
      onAuthError(error)
      params.onError?.(error)
    },
    ...params.options,
  })

  const isLoading = computed(() => req.isPending)

  return {
    ...req,
    isLoading,
    mutate: req.mutate,
  }
}

/**
 * Custom request client
 */
export function useClient() {
  const manage = useManage()
  const auth = useGetAuth()
  const request = (params: IDataProviderCustomOptions) => {
    if (!manage.config.dataProvider) {
      throw new Error('Data provider is not initialized')
    }
    return manage.config.dataProvider?.custom({
      ...params,
    }, manage, auth)
  }

  return {
    request,
  }
}

export function useInvalidate() {
  const queryClient = useQueryClient()

  const invalidate = (path: string) => {
    let marks: any = path
    if (!Array.isArray(path)) {
      marks = [path]
    }

    queryClient.invalidateQueries({
      queryKey: marks,
    })
  }

  return {
    invalidate,
  }
}
