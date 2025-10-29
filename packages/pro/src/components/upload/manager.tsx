import type { IDataProviderResponse, IS3SignData } from '@duxweb/dvha-core'
import type { PropType } from 'vue'
import { useClient, useI18n, useInfiniteList, useUpload } from '@duxweb/dvha-core'
import { cloneDeep } from 'lodash-es'
import { NButton, NDropdown, NInfiniteScroll, NInput, NSpin, NTab, NTabs, NTooltip, useMessage } from 'naive-ui'
import { computed, defineComponent, nextTick, ref } from 'vue'
import { useDialog, useDownload } from '../../hooks'
import { DuxDrawEmpty } from '../draw'
import { useUploadConfig } from './config'
import { DuxFileManageItem } from './manage/item'

export interface IUploadParams {
  path?: string
  driver?: 'local' | 's3'
  signPath?: string
  signCallback?: (response: IDataProviderResponse) => IS3SignData
  accept?: string
  multiple?: boolean
  maxNum?: number
  maxSize?: number
  method?: 'POST' | 'PUT'
}

const DuxFileManage = defineComponent({
  name: 'DuxFileManage',
  props: {
    path: String,
    type: String,
    onConfirm: Function as PropType<(value: Record<string, any>[]) => void>,
    onClose: Function as PropType<() => void>,
    multiple: Boolean,
    page: {
      type: Boolean,
      default: false,
    },
    handle: String,
    uploadParams: Object as PropType<IUploadParams>,
  },
  setup(props) {
    const showDropdown = ref(false)
    const xRef = ref(0)
    const yRef = ref(0)
    const { t } = useI18n()

    const selectValues = ref<Record<string, any>[]>([])

    const dialog = useDialog()
    const client = useClient()
    const message = useMessage()
    const download = useDownload()

    const form = ref<Record<string, any>>({
      manager: true,
      type: props.type || 'all',
      folder: null,
    })
    const currentData = ref<Record<string, any>>()

    const { uploadPath, managePath, driver, method } = useUploadConfig({
      driver: props.uploadParams?.driver,
      signPath: props.uploadParams?.signPath,
      signCallback: props.uploadParams?.signCallback,
      uploadPath: props.uploadParams?.path,
      managePath: props.path,
      method: props.uploadParams?.method,
    })

    const pagination = ref({
      page: 1,
      pageSize: 20,
    })

    const list = useInfiniteList({
      path: managePath.value,
      pagination: pagination.value,
      filters: form.value,
    })

    const uploadParams = computed(() => {
      const { driver, signPath, signCallback, ...rest } = props.uploadParams || {}
      return rest
    })

    const upload = useUpload({
      ...uploadParams.value,
      path: uploadPath.value,
      autoUpload: true,
      driver: driver.value,
      params: form.value,
      method: method.value,
      onSuccess: () => {
        selectValues.value = []
        list.refetch()
      },
      onError: (err) => {
        message.error(err?.message || t('components.uploadManage.uploadError') || '')
      },
    })

    const createFolder = (name?: string) => {
      if (!name) {
        message.error(t('components.uploadManage.namePlaceholder') || '')
        return
      }
      client.request({
        path: managePath.value,
        method: 'POST',
        payload: {
          name,
          folder: form.value.folder,
        },
      }).then(() => {
        list.refetch()
        selectValues.value = []
      }).catch(() => {
        message.error(t('components.uploadManage.createError') || '')
      })
    }

    const renameFile = (type: 'folder' | 'file', name?: string, id?: string | number) => {
      if (!name) {
        message.error(t('components.uploadManage.namePlaceholder') || '')
        return
      }
      client.request({
        path: managePath.value,
        method: 'PUT',
        payload: {
          name,
          id,
          type,
        },
      }).then(() => {
        list.refetch()
        selectValues.value = []
      }).catch(() => {
        message.error(t('components.uploadManage.editError') || '')
      })
    }

    const deleteFile = (type: 'folder' | 'file', id?: any) => {
      client.request({
        path: `${managePath.value}/batch`,
        method: 'DELETE',
        payload: {
          data: Array.isArray(id) ? id : [id],
          type,
        },
      }).then(() => {
        list.refetch()
        selectValues.value = []
      }).catch(() => {
        message.error(t('components.uploadManage.delError') || '')
      })
    }

    const typeDisable = computed<boolean>(() => {
      return !!(props.type && props.type !== 'all')
    })

    return () => (
      <div class={[
        'flex flex-col gap-2',
        !props.page ? 'h-500px max-h-500px' : 'h-full',
      ]}
      >
        <div class={[
          'flex-none flex justify-between items-center border-b border-muted p-3',
          props.handle,
        ]}
        >
          <div class="flex-none">
            <NTabs
              type="segment"
              animated
              size="small"
              tabClass="!px-4"
              defaultValue="all"
              value={form.value.type}
              onUpdateValue={(v) => {
                if (typeDisable.value) {
                  return
                }
                form.value.type = v
                selectValues.value = []
              }}
            >
              <NTab tab={t('components.uploadManage.all')} name="all" disabled={typeDisable.value} />
              <NTab tab={t('components.uploadManage.image')} name="image" disabled={typeDisable.value} />
              <NTab tab={t('components.uploadManage.media')} name="media" disabled={typeDisable.value} />
              <NTab tab={t('components.uploadManage.docs')} name="docs" disabled={typeDisable.value} />
            </NTabs>
          </div>
          <div class="flex gap-2">
            <NButton
              type="default"
              ghost
              onClick={() => {
                dialog.prompt({
                  title: t('components.uploadManage.namePlaceholder') || '',
                  formSchema: [
                    {
                      tag: NInput,
                      attrs: {
                        'v-model:value': 'form.name',
                      },
                    },
                  ],
                }).then((res: any) => {
                  createFolder(res?.name)
                }).catch(() => {})
              }}
              renderIcon={() => <div class="i-tabler:plus"></div>}
            >
              {t('components.button.create')}
            </NButton>
            <NButton
              type="primary"
              ghost
              onClick={() => {
                upload.open()
              }}
              loading={upload.isUploading.value}
              renderIcon={() => <div class="i-tabler:upload"></div>}
            >
              <div class="flex gap-2">
                {t('components.uploadManage.upload')}
                {upload.progress.value.totalPercent > 0 && `(${upload.progress.value.totalPercent}%)`}
              </div>
            </NButton>

            {!props.page && (
              <NButton
                type="default"
                ghost
                onClick={() => {
                  props.onClose?.()
                }}
                renderIcon={() => <div class="i-tabler:x"></div>}
              >

              </NButton>
            )}
          </div>
        </div>

        <div class="flex-1 min-h-1 relative">
          {list.data?.value?.data?.length > 0
            && (
              <NInfiniteScroll
                distance={10}
                onLoad={() => {
                  if (list.hasNextPage.value) {
                    list.fetchNextPage()
                  }
                }}
                scrollbarProps={{
                  contentClass: 'p-4',
                }}
              >
                <div class={[
                  'grid grid-cols-3 md:grid-cols-4 text-sm items-start justify-start',
                  list.data.value?.data?.length >= 4 && !props.page ? ' lg:grid-cols-[repeat(auto-fit,minmax(150px,1fr))]' : 'lg:grid-cols-[repeat(auto-fit,minmax(150px,150px))]',
                ]}
                >
                  {form.value?.folder && form.value?.folder !== list.data.value?.meta?.folder && (
                    <DuxFileManageItem
                      key={`parent-${list.data.value?.meta?.folder}`}
                      type="folder"
                      name={t('components.uploadManage.parentLevel')}
                      page={props.page}
                      onSelect={() => {
                        selectValues.value = []
                        form.value.folder = list.data.value?.meta?.folder
                      }}
                    />
                  )}
                  {list.data.value?.data?.map(item => (
                    <NTooltip placement="bottom" key={`${item.url ? 'file' : 'folder'}-${item.id}`} trigger={item.url ? 'hover' : 'manual'}>
                      {{
                        default: () => item.filesize,
                        trigger: () => (
                          <DuxFileManageItem
                            page={props.page}
                            onContextmenu={(e) => {
                              currentData.value = item
                              showDropdown.value = false
                              nextTick().then(() => {
                                showDropdown.value = true
                                xRef.value = e.clientX
                                yRef.value = e.clientY
                              })
                              e.preventDefault()
                            }}
                            value={!props.page ? !!selectValues.value?.find?.(v => v.id === item.id) : false}
                            type={item.url ? 'file' : 'folder'}
                            mime={item.filetype}
                            name={item.filename}
                            url={item.url}
                            time={item.time}
                            onSelect={(v) => {
                              if (!item.url) {
                                selectValues.value = []
                                list.data.value = undefined
                                form.value.folder = item.id
                                return
                              }

                              if (props.page) {
                                return
                              }

                              if (v) {
                                if (props.multiple) {
                                  selectValues.value?.push(item)
                                }
                                else {
                                  selectValues.value = [item]
                                }
                              }
                              else {
                                if (props.multiple) {
                                  selectValues.value?.splice(selectValues.value?.indexOf(item), 1)
                                }
                                else {
                                  selectValues.value = []
                                }
                              }
                            }}
                          />
                        ),
                      }}
                    </NTooltip>
                  )) }
                </div>
              </NInfiniteScroll>
            )}

          {list.isLoading.value
            ? <NSpin class="h-full absolute w-full inset-0 bg-gray-1/50" />
            : !list.data.value?.data?.length && (
                <div class="size-full flex justify-center items-center text-sm text-gray-6">
                  <div class="flex flex-col  items-center">
                    <div class="w-26 mb-2">
                      <DuxDrawEmpty />
                    </div>
                    <div class="text-base">{t('components.uploadManage.empty')}</div>
                    <div class="text-sm text-muted">{t('components.uploadManage.emptyDesc')}</div>
                    {form.value?.folder && form.value?.folder !== list.data.value?.meta?.folder && (
                      <div class="text-xs text-gray-6">
                        <NButton
                          type="default"
                          ghost
                          onClick={() => {
                            selectValues.value = []
                            form.value.folder = list.data.value?.meta?.folder
                          }}
                        >
                          {t('components.uploadManage.back')}
                        </NButton>
                      </div>
                    )}
                  </div>
                </div>
              )}
        </div>

        <NDropdown
          x={xRef.value}
          y={yRef.value}
          placement="bottom-start"
          trigger="manual"
          show={showDropdown.value}
          onClickoutside={() => {
            showDropdown.value = false
          }}
          onUpdateShow={(value) => {
            if (!value) {
              currentData.value = undefined
            }
          }}
          onSelect={(v) => {
            const itemData = cloneDeep(currentData.value)
            showDropdown.value = false
            switch (v) {
              case 'download':
                download.url(itemData?.url)
                break
              case 'rename':
                dialog.prompt({
                  title: t('components.uploadManage.namePlaceholder'),
                  formSchema: [
                    {
                      tag: NInput,
                      attrs: {
                        'v-model:value': 'form.name',
                      },
                    },
                  ],
                  defaultValue: {
                    name: itemData?.filename || itemData?.name,
                  },
                }).then((res: any) => {
                  renameFile(itemData?.type, res?.name, itemData?.id)
                })
                break
              case 'delete':
                dialog.confirm({
                  title: t('components.uploadManage.delTitle'),
                  content: t('components.uploadManage.delDesc'),
                }).then(() => {
                  deleteFile(itemData?.type, itemData?.id)
                })
                break
            }
          }}
          options={[
            currentData.value?.url && {
              label: t('components.button.download'),
              key: 'download',
              icon: () => <div class="i-tabler:download"></div>,
            },
            {
              label: t('components.button.rename'),
              key: 'rename',
              icon: () => <div class="i-tabler:cursor-text"></div>,
            },
            {
              label: t('components.button.delete'),
              key: 'delete',
              icon: () => <div class="i-tabler:trash"></div>,
            },
          ].filter(v => v)}
        />

        {!props.page && (
          <div class="flex justify-end gap-2 border-t border-muted p-3">
            <div>
              {selectValues.value?.length > 0 && (
                <NButton
                  type="error"
                  secondary
                  onClick={() => {
                    dialog.confirm({
                      title: t('components.uploadManage.delTitle'),
                      content: t('components.uploadManage.delDesc'),
                    }).then(() => {
                      deleteFile('file', selectValues.value?.map(v => v.id))
                    })
                  }}
                >
                  {t('components.button.delete')}
                </NButton>
              )}
            </div>
            <div>
              <NButton
                type="primary"
                disabled={!selectValues.value?.length}
                onClick={() => {
                  props.onConfirm?.(selectValues.value)
                }}
              >
                {t('components.button.select')}
                (
                {selectValues.value?.length || 0}
                )
              </NButton>
            </div>
          </div>
        )}
      </div>
    )
  },
})

export default DuxFileManage
