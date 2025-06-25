import { createLocalUploadDriver, createS3UploadDriver, IDataProviderResponse, IS3SignData, useManage } from '@duxweb/dvha-core'
import { computed } from 'vue'

export interface UseUploadConfigProps {
  driver?: 'local' | 's3'
  uploadPath?: string
  managePath?: string
  signPath?: string
  signCallback?: (response: IDataProviderResponse) => IS3SignData
}


export const useUploadConfig = (props?: UseUploadConfigProps) => {
  const manage = useManage()

  const uploadPath = computed(() => props?.uploadPath || manage.config?.apiPath?.upload || 'upload')
  const managePath = computed(() => props?.managePath || manage.config?.apiPath?.uploadManager || 'uploadManager')


  const driver = computed(() => {
    if (props?.driver === 's3') {
      return createS3UploadDriver({
        signPath: props?.signPath || manage.config?.apiPath?.upload || uploadPath.value || '',
        signCallback: props?.signCallback || manage.config?.upload?.signCallback || ((response: IDataProviderResponse) => {
          return {
            uploadUrl: response.data?.uploadUrl,
            url: response.data?.url,
            params: response.data?.params,
          }
        }),
      })
    }
    return createLocalUploadDriver()
  })

  return {
    uploadPath,
    managePath,
    driver,
  }
}