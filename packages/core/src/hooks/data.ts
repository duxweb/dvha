import { IDataProviderCreateManyOptions, IDataProviderCreateOptions, IDataProviderCustomOptions, IDataProviderDeleteManyOptions, IDataProviderDeleteOptions, IDataProviderGetManyOptions, IDataProviderGetOneOptions, IDataProviderListOptions, IDataProviderResponse, IDataProviderUpdateManyOptions, IDataProviderUpdateOptions } from "@/types"
import { useManage } from "./manage"
import { useError } from "./auth"
import { computed, watch } from "vue"
import { DefaultError, DefinedInitialDataInfiniteOptions, InfiniteData, QueryKey, UndefinedInitialDataOptions, useInfiniteQuery, useMutation, UseMutationOptions, useQuery, useQueryClient } from "@tanstack/react-query"


type IDataQueryOptions = UndefinedInitialDataOptions<IDataProviderResponse | undefined, DefaultError, IDataProviderResponse | undefined, QueryKey>
type IDataQueryOptionsInfinite = DefinedInitialDataInfiniteOptions<IDataProviderResponse | undefined, DefaultError, InfiniteData<IDataProviderResponse | undefined>, QueryKey, number>

interface IListParams extends IDataProviderListOptions {
    options?: IDataQueryOptions
    onError?: (error: any) => void
}

/**
 * Get list data
 * @param params
 * @returns
 */
export function useList(params: IListParams) {
    const { config: manage } = useManage()
    const { mutate: onAuthError} = useError()

    const props = computed((): IDataProviderListOptions => {
        const { onError, options, ...rest } = params
        return rest
    })

    const req = useQuery({
        queryKey: [params.path, props],
        queryFn: () => manage.dataProvider?.getList({...props.value}),
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
 * @returns
 */
export function useInfiniteList(params: IInfiniteListParams) {
    const { config: manage } = useManage()
    const { mutate: onAuthError} = useError()

    const props = computed((): IDataProviderListOptions => {
        const { onError, options, ...rest } = params
        return rest
    })

    const req = useInfiniteQuery({
        queryKey: [params.path, props],
        queryFn: () => manage.dataProvider?.getList({...props.value}),
        initialPageParam: 0,
        getNextPageParam: (lastPage, _allPages, lastPageParam) => {
            if (!lastPage?.data || lastPage?.data?.length == 0) {
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
 * @returns
 */
export function useOne(params: IOneParams) {
    const { config: manage } = useManage()
    const { mutate: onAuthError} = useError()

    const props = computed((): IDataProviderGetOneOptions => {
        const { onError, options, ...rest } = params
        return rest
    })

    const req = useQuery({
        queryKey: [params.path, props],
        queryFn: () => manage.dataProvider?.getOne({...props.value}),
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
 * @returns
 */
export function useMany(params: IManyParams) {
    const { config: manage } = useManage()
    const { mutate: onAuthError} = useError()

    const props = computed((): IDataProviderGetManyOptions => {
        const { onError, options, ...rest } = params
        return rest
    })

    const req = useQuery({
        queryKey: [params.path, props],
        queryFn: () => manage.dataProvider?.getMany({...props.value}),
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
 * @returns
 */
export function useCreate(params: ICreateParams) {
    const { config: manage } = useManage()
    const { mutate: onAuthError} = useError()
    const { invalidate } = useInvalidate()

    const props = computed((): IDataProviderCreateOptions => {
        const { onError, options, ...rest } = params
        return rest
    })

    const req = useMutation({
        mutationFn: (data) => {
            if (!manage.dataProvider) {
                throw new Error('Data provider is not initialized')
            }
            return manage.dataProvider.create({
                ...props.value,
                ...data,
            })
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
 * @returns
 */
export function useCreateMany(params: ICreateManyParams) {
    const { config: manage } = useManage()
    const { mutate: onAuthError} = useError()
    const { invalidate } = useInvalidate()
    const props = computed((): IDataProviderCreateManyOptions => {
        const { onError, options, ...rest } = params
        return rest
    })

    const req = useMutation({
        mutationFn: (data) => {
            if (!manage.dataProvider) {
                throw new Error('Data provider is not initialized')
            }
            return manage.dataProvider.createMany({
                ...props.value,
                ...data,
            })
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
 * @returns
 */
export function useUpdate(params: IUpdateParams) {
    const { config: manage } = useManage()
    const { mutate: onAuthError} = useError()
    const { invalidate } = useInvalidate()
    const props = computed((): IDataProviderUpdateOptions => {
        const { onError, options, ...rest } = params
        return rest
    })

    const req = useMutation({
        mutationFn: (data) => {
            if (!manage.dataProvider) {
                throw new Error('Data provider is not initialized')
            }
            return manage.dataProvider.update({
                ...props.value,
                ...data,
            })
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
    const { config: manage } = useManage()
    const { mutate: onAuthError} = useError()
    const { invalidate } = useInvalidate()

    const props = computed((): IDataProviderUpdateManyOptions => {
        const { onError, options, ...rest } = params
        return rest
    })

    const req = useMutation({
        mutationFn: (data) => {
            if (!manage.dataProvider) {
                throw new Error('Data provider is not initialized')
            }
            return manage.dataProvider.updateMany({
                ...props.value,
                ...data,
            })
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
 * @returns
 */
export function useDelete(params: IDeleteParams) {
    const { config: manage } = useManage()
    const { mutate: onAuthError} = useError()
    const { invalidate } = useInvalidate()
    const props = computed((): IDataProviderDeleteOptions => {
        const { onError, options, ...rest } = params
        return rest
    })

    const req = useMutation({
        mutationFn: (data) => {
            if (!manage.dataProvider) {
                throw new Error('Data provider is not initialized')
            }
            return manage.dataProvider.deleteOne({
                ...props.value,
                ...data,
            })
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
 * @returns
 */
export function useDeleteMany(params: IDeleteManyParams) {
    const { config: manage } = useManage()
    const { mutate: onAuthError} = useError()
    const { invalidate } = useInvalidate()
    const props = computed((): IDataProviderDeleteManyOptions => {
        const { onError, options, ...rest } = params
        return rest
    })

    const req = useMutation({
        mutationFn: (data) => {
            if (!manage.dataProvider) {
                throw new Error('Data provider is not initialized')
            }
            return manage.dataProvider.deleteMany({
                ...props.value,
                ...data,
            })
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
    const { config: manage } = useManage()
    const { mutate: onAuthError} = useError()


    const props = computed((): IDataProviderCustomOptions => {
        const { onError, options, ...rest } = params
        return rest
    })

    const req = useQuery({
        queryKey: [params.path, props],
        queryFn: () => manage.dataProvider?.custom({...props.value}),
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
    const { config: manage } = useManage()
    const { mutate: onAuthError} = useError()


    const props = computed((): IDataProviderCustomOptions => {
        const { onError, options, ...rest } = params
        return rest
    })

    const req = useMutation({
        mutationFn: (data) => {
            if (!manage.dataProvider) {
                throw new Error('Data provider is not initialized')
            }
            return manage.dataProvider.custom({
                ...props.value,
                ...data,
            })
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