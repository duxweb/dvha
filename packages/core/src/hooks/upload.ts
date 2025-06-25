import type { UseMutationOptions } from '@tanstack/vue-query'
import type { IDataProviderCustomOptions, IDataProviderError, IDataProviderResponse } from '../types'
import type { IUploadDriver } from './upload/types'
import { useFileDialog } from '@vueuse/core'
import { uniqueId } from 'lodash-es'
import { computed, ref, watch } from 'vue'
import { createLocalUploadDriver } from './upload/local'

export interface IUseUploadProps extends Omit<IDataProviderCustomOptions, 'onUploadProgress' | 'onDownloadProgress'> {
  method?: 'POST' | 'PUT'
  maxFileSize?: number
  maxFileCount?: number
  accept?: string
  multiple?: boolean
  autoUpload?: boolean
  params?: Record<string, string>

  // 驱动实例
  driver?: IUploadDriver

  options?: UseMutationOptions<IDataProviderResponse, IDataProviderError, IDataProviderCustomOptions>
  onSuccess?: (data: IDataProviderResponse) => void
  onError?: (error: IDataProviderError) => void

  onDataCallback?: (data: IDataProviderResponse, file: IUseUploadFile) => Partial<IUseUploadFileData>
  onProgress?: (progress: IOverallProgress) => void
  onCancel?: (id: string) => void
  onComplete?: (data: IUseUploadFile[]) => void

}

export type IUseUploadType = 'file' | 'blob' | 'base64' | 'arrayBuffer'
export type IUseUploadPayload = File | Blob | string | ArrayBuffer

export interface IUseUploadFileData {
  url?: string
  filename?: string
  filesize?: number
  filetype?: string
}

export interface IUseUploadFile extends IUseUploadFileData {
  id: string
  progress?: IUploadProgress
  file?: File
  filesizeText?: string
  status?: 'pending' | 'uploading' | 'success' | 'error' | 'cancelled'
  error?: string
  data?: IDataProviderResponse
}

export interface IUploadProgress {
  loaded: number
  total?: number
  percent?: number
  speed?: number
  speedText?: string
  uploadTime?: number
  remainingTime?: number
}

export interface IOverallProgress {
  index: number
  totalFiles: number
  currentFile?: IUseUploadFile
  totalPercent: number
  totalLoaded: number
  totalSize: number
}

export function useUpload(props?: IUseUploadProps) {
  props = props || {}
  const isUploading = ref<boolean>(false)
  const uploadFiles = ref<IUseUploadFile[]>([])
  const currentUploadingIndex = ref<number>(-1)
  const uploadControllers = ref<Map<string, AbortController>>(new Map())

  // 创建上传驱动 - 默认使用本地驱动
  const uploadDriver = props.driver || createLocalUploadDriver()

  const params = computed(() => {
    const { onProgress, onDataCallback, onCancel, onComplete, maxFileSize, maxFileCount, accept, multiple, autoUpload, options, onSuccess, onError, method, driver, params, ...rest } = props
    return rest
  })

  const method = computed(() => {
    return props.method || 'POST'
  })

  const overallProgress = computed<IOverallProgress>(() => {
    const totalFiles = uploadFiles.value.length
    const totalSize = uploadFiles.value.reduce((sum, file) => sum + (file.filesize || 0), 0)

    let totalLoaded = 0
    let overallPercent = 0

    uploadFiles.value.forEach((file, index) => {
      if (index < currentUploadingIndex.value) {
        totalLoaded += file.filesize || 0
      }
      else if (index === currentUploadingIndex.value) {
        totalLoaded += file.progress?.loaded || 0
      }
    })

    if (totalSize > 0) {
      overallPercent = Math.round((totalLoaded / totalSize) * 100)
    }

    // index 计算：没有上传时为 0，上传时从 1 开始计数
    const index = currentUploadingIndex.value >= 0 ? currentUploadingIndex.value + 1 : 0

    return {
      index,
      totalFiles,
      currentFile: uploadFiles.value[currentUploadingIndex.value],
      totalPercent: overallPercent,
      totalLoaded,
      totalSize,
    }
  })

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) {
      return '0 Bytes'
    }
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`
  }

  // 格式化上传速度
  const formatSpeed = (bytesPerSecond: number): string => {
    if (bytesPerSecond === 0) {
      return '0 B/s'
    }
    const k = 1024
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s']
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k))
    return `${Number.parseFloat((bytesPerSecond / k ** i).toFixed(2))} ${sizes[i]}`
  }

  const generateId = (): string => {
    return uniqueId('upload-')
  }

  const convertToFile = async (payload: IUseUploadPayload, type: IUseUploadType, filename?: string): Promise<File> => {
    switch (type) {
      case 'file': {
        if (!(payload instanceof File)) {
          throw new TypeError('Payload must be a File when type is "file"')
        }
        return payload
      }
      case 'blob': {
        if (!(payload instanceof Blob)) {
          throw new TypeError('Payload must be a Blob when type is "blob"')
        }
        return new File([payload], filename || 'blob-file', { type: payload.type })
      }
      case 'base64': {
        if (typeof payload !== 'string') {
          throw new TypeError('Payload must be a string when type is "base64"')
        }
        const base64Data = payload.includes(',') ? payload.split(',')[1] : payload
        const mimeType = payload.includes(',') ? payload.split(',')[0].split(':')[1].split(';')[0] : 'application/octet-stream'
        const byteCharacters = atob(base64Data)
        const byteArray = new Uint8Array(byteCharacters.length)
        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i)
        }
        const blob = new Blob([byteArray], { type: mimeType })
        return new File([blob], filename || 'base64-file', { type: mimeType })
      }
      case 'arrayBuffer': {
        if (!(payload instanceof ArrayBuffer)) {
          throw new TypeError('Payload must be ArrayBuffer when type is "arrayBuffer"')
        }
        const arrayBlob = new Blob([payload])
        return new File([arrayBlob], filename || 'array-buffer-file', { type: 'application/octet-stream' })
      }
      default: {
        throw new Error(`Unsupported upload type: ${type}`)
      }
    }
  }

  // process file upload
  const checkFile = (file: File) => {
    if (props.maxFileSize && file.size > props.maxFileSize) {
      throw new Error(`File size cannot exceed ${formatFileSize(props.maxFileSize)}`)
    }

    if (props.maxFileCount && uploadFiles.value.length >= props.maxFileCount) {
      throw new Error(`File count cannot exceed ${props.maxFileCount}`)
    }
  }

  // add file to upload list
  const addFile = async (payload: IUseUploadPayload, type: IUseUploadType, filename?: string): Promise<IUseUploadFile> => {
    const file = await convertToFile(payload, type, filename)

    checkFile(file)

    const uploadFile: IUseUploadFile = {
      id: generateId(),
      file,
      filename: file.name,
      filesize: file.size,
      filetype: file.type,
      filesizeText: formatFileSize(file.size),
      status: 'pending',
      progress: {
        loaded: 0,
        total: file.size,
        percent: 0,
        speed: 0,
        speedText: formatSpeed(0),
        remainingTime: 0,
        uploadTime: 0,
      },
    }

    uploadFiles.value.push(uploadFile)
    return uploadFile
  }

  // update file status
  const updateFileStatus = (id: string, updates: Partial<IUseUploadFile>) => {
    const index = uploadFiles.value.findIndex(f => f.id === id)
    if (index !== -1) {
      uploadFiles.value[index] = { ...uploadFiles.value[index], ...updates }
    }
  }

  // trigger complete callback
  const triggerComplete = () => {
    const allCompleted = uploadFiles.value.every(file => file.status !== 'uploading')
    if (!allCompleted) {
      return
    }
    props.onComplete?.(uploadFiles.value)
  }

  // cancel file upload
  const cancelFile = (id: string) => {
    const file = uploadFiles.value.find(f => f.id === id)

    if (!file || (file.status !== 'pending' && file.status !== 'uploading')) {
      return false
    }

    if (file.status === 'uploading') {
      const controller = uploadControllers.value.get(id)
      if (controller) {
        controller.abort()
        uploadControllers.value.delete(id)
      }
    }

    updateFileStatus(id, {
      status: 'cancelled',
    })

    props.onCancel?.(id)
    triggerComplete()

    return true
  }

  // cancel files upload
  const cancelFiles = (ids?: string[]) => {
    if (ids) {
      ids.forEach(id => cancelFile(id))
    }
    else {
      uploadFiles.value.forEach(file => cancelFile(file.id))
    }
  }

  // trigger file upload
  const upload = async (uploadFile: IUseUploadFile): Promise<IUseUploadFile> => {
    if (!uploadFile.file) {
      throw new Error('File not found')
    }

    checkFile(uploadFile.file)

    const abortController = new AbortController()
    uploadControllers.value.set(uploadFile.id, abortController)

    const fileStartTime = Date.now()

    updateFileStatus(uploadFile.id, { status: 'uploading' })

    return uploadDriver.upload(uploadFile.file, {
      ...params.value,
      method: method.value,
      signal: abortController.signal,
      params: props.params,
      onUploadProgress: (progressData) => {
        const currentTime = Date.now()
        const elapsedTimeMs = currentTime - fileStartTime
        const elapsedTimeSeconds = elapsedTimeMs / 1000

        const speed = elapsedTimeSeconds > 0 ? progressData.loaded / elapsedTimeSeconds : 0

        const remainingBytes = (progressData.total || 0) - progressData.loaded
        const remainingTime = speed > 0 ? remainingBytes / speed : 0

        const newProgress = {
          loaded: progressData.loaded,
          total: progressData.total,
          percent: progressData.percent || 0,
          speed: Math.round(speed),
          speedText: formatSpeed(speed),
          uploadTime: Math.round(elapsedTimeSeconds),
          remainingTime: Math.round(remainingTime),
        }

        updateFileStatus(uploadFile.id, {
          status: 'uploading',
          progress: newProgress,
        })

        props.onProgress?.(overallProgress.value)
      },
    }).then((response) => {
      if (uploadFile.status === 'cancelled') {
        throw new Error('Upload cancelled')
      }

      const callbackData = props.onDataCallback?.(response, uploadFile) || response.data

      const finalUploadTime = Math.round((Date.now() - fileStartTime) / 1000)

      const updatedFile = {
        ...uploadFile,
        status: 'success' as const,
        data: response,
        ...callbackData,
        progress: {
          ...uploadFile.progress,
          loaded: uploadFile.filesize || 0,
          percent: 100,
          speed: 0,
          speedText: formatSpeed(0),
          uploadTime: finalUploadTime,
          remainingTime: 0,
        },
      }

      updateFileStatus(uploadFile.id, updatedFile)
      uploadControllers.value.delete(uploadFile.id)
      props.onSuccess?.(response)

      return updatedFile
    }).catch((err) => {
      if (err.message === 'canceled' || uploadFile.status === 'cancelled') {
        throw new Error('Upload cancelled')
      }
      updateFileStatus(uploadFile.id, {
        status: 'error',
        error: err.message,
      })
      uploadControllers.value.delete(uploadFile.id)
      throw err
    }).finally(() => {
      triggerComplete()
    })
  }

  // trigger upload
  const trigger = async (): Promise<IUseUploadFile[]> => {
    const pendingFiles = uploadFiles.value.filter(file => file.status === 'pending')
    if (pendingFiles.length === 0) {
      return []
    }

    isUploading.value = true

    try {
      const uploadedFiles: IUseUploadFile[] = []

      for (let i = 0; i < pendingFiles.length; i++) {
        const fileData = pendingFiles[i]

        const fileIndex = uploadFiles.value.findIndex(f => f.id === fileData.id)
        currentUploadingIndex.value = fileIndex

        const uploadedFile = await upload(fileData)
        uploadedFiles.push(uploadedFile)
      }

      return uploadedFiles
    }
    catch (error: any) {
      props.onError?.({
        status: error?.status || 500,
        message: error?.message || 'upload failed',
      })
      throw error
    }
    finally {
      isUploading.value = false
      currentUploadingIndex.value = -1
    }
  }

  // clear all files from upload list
  const clearFiles = () => {
    uploadFiles.value.forEach((file) => {
      cancelFile(file.id)
    })

    uploadControllers.value.clear()

    uploadFiles.value = []
    currentUploadingIndex.value = -1
  }

  // add files to upload list
  const addFiles = async (files: IUseUploadPayload[], type: IUseUploadType = 'file') => {
    try {
      if (!props.multiple && files.length > 1) {
        throw new Error('Single file mode: only one file can be selected')
      }

      if (!props.multiple && uploadFiles.value.length > 0) {
        clearFiles()
      }

      if (props.maxFileCount && uploadFiles.value.length + files.length > props.maxFileCount) {
        throw new Error(`Adding ${files.length} files would exceed the maximum limit of ${props.maxFileCount}`)
      }

      for (const payload of files) {
        await addFile(payload, type)
      }
    }
    catch (error: any) {
      props.onError?.({
        status: error?.status || 400,
        message: error?.message || 'Failed to add files',
      })
      throw error
    }

    if (props.autoUpload) {
      trigger().catch((error) => {
        console.warn('Auto upload failed:', error)
      })
    }
  }

  // remove file from upload list
  const removeFile = (id: string) => {
    const file = uploadFiles.value.find(f => f.id === id)
    if (file && file.status === 'uploading') {
      updateFileStatus(id, {
        status: 'cancelled',
      })

      const controller = uploadControllers.value.get(id)
      if (!controller) {
        return
      }

      controller.abort()
      uploadControllers.value.delete(id)
    }

    const index = uploadFiles.value.findIndex(f => f.id === id)
    if (index !== -1) {
      uploadFiles.value.splice(index, 1)
    }
  }

  // remove files from upload list
  const removeFiles = (ids?: string[]) => {
    if (ids) {
      ids.forEach(id => removeFile(id))
    }
    else {
      uploadFiles.value.forEach(file => removeFile(file.id))
    }
  }

  // file dialog selector
  const { files: selectedFiles, open: openFileDialog, reset: resetFiles } = useFileDialog({
    accept: props.accept,
    multiple: props.multiple || false,
  })

  const createFileFromData = (fileData: IUseUploadFileData): IUseUploadFile => {
    return {
      id: generateId(),
      ...fileData,
      filesizeText: fileData.filesize ? formatFileSize(fileData.filesize) : undefined,
      status: fileData.url ? 'success' : 'pending',
      progress: {
        loaded: 0,
        total: fileData.filesize || 0,
        percent: fileData.url ? 100 : 0,
        speed: 0,
        speedText: formatSpeed(0),
        remainingTime: 0,
        uploadTime: 0,
      },
    }
  }

  watch(selectedFiles, async (newFiles) => {
    if (newFiles && newFiles.length > 0) {
      const fileArray = Array.from(newFiles)
      resetFiles()
      await addFiles(fileArray, 'file').catch((error) => {
        console.warn('Failed to add selected files:', error)
      })
    }
  })

  const dataFiles = computed((): IUseUploadFileData[] => {
    return uploadFiles.value
      .filter(file => file.status === 'success')
      .map((file) => {
        return {
          url: file.url,
          filename: file.filename,
          filesize: file.filesize,
          filetype: file.filetype,
        }
      })
  })

  // add data files to upload list
  const addDataFiles = (dataFiles: IUseUploadFileData[]) => {
    if (!props.multiple && uploadFiles.value.length > 0) {
      clearFiles()
    }

    const newUploadFiles = dataFiles.map(fileData => createFileFromData(fileData))
    uploadFiles.value.push(...newUploadFiles)
  }

  return {
    isUploading,
    uploadFiles,
    dataFiles,
    progress: overallProgress,

    open: openFileDialog,
    trigger,
    resetFiles,
    clearFiles,
    removeFiles,
    addFiles,
    addDataFiles,
    cancelFiles,
  }
}
