import type { PropType } from 'vue'
import type { TextImageEditorBlock } from './types'
import { useI18n } from '@duxweb/dvha-core'
import clsx from 'clsx'
import { NButton } from 'naive-ui'
import ShortUniqueId from 'short-unique-id'
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import { VueDraggable } from 'vue-draggable-plus'
import { useModal } from '../../hooks'
import { DuxModalPage } from '../modal'
import { useUploadConfig } from '../upload/config'

function safeJsonParseBlocks(value?: string): TextImageEditorBlock[] {
  if (!value)
    return []
  try {
    const data = JSON.parse(value)
    return Array.isArray(data) ? data : []
  }
  catch {
    return []
  }
}

function normalizeBlocks(blocks: TextImageEditorBlock[], makeId: () => string): TextImageEditorBlock[] {
  return (blocks || []).filter(Boolean).map((b: any) => {
    const id = String(b?.id || '') || makeId()
    if (b?.type === 'image') {
      return {
        id,
        type: 'image',
        url: b?.url ? String(b.url) : undefined,
        alt: b?.alt ? String(b.alt) : undefined,
      } satisfies TextImageEditorBlock
    }
    return {
      id,
      type: 'text',
      content: b?.content ? String(b.content) : '',
    } satisfies TextImageEditorBlock
  })
}

const TextImageEditorPreviewModal = defineComponent({
  name: 'DuxTextImageEditorPreviewModal',
  props: {
    title: {
      type: String,
      default: '',
    },
    handle: String,
    blocks: {
      type: Array as PropType<TextImageEditorBlock[]>,
      default: () => [],
    },
    onClose: Function as PropType<() => void>,
  },
  setup(props) {
    return () => (
      <DuxModalPage title={props.title} handle={props.handle} onClose={props.onClose}>
        <div class="max-h-70vh overflow-auto">
          {props.blocks?.length
            ? (
                <div class="flex flex-col gap-4">
                  {props.blocks.map((block) => {
                    if (block.type === 'image') {
                      return (
                        <div key={block.id} class="w-full">
                          {block.url
                            ? <img src={block.url} alt={block.alt || ''} class="w-full h-auto rounded" />
                            : <div class="w-full h-200px bg-muted rounded" />}
                        </div>
                      )
                    }
                    return (
                      <div
                        key={block.id}
                        class="prose prose-sm max-w-none dark:prose-invert"
                        innerHTML={block.content || ''}
                      />
                    )
                  })}
                </div>
              )
            : (
                <div class="h-40 flex items-center justify-center text-muted">
                  {props.title}
                </div>
              )}
        </div>
      </DuxModalPage>
    )
  },
})

export const DuxTextImageEditor = defineComponent({
  name: 'DuxTextImageEditor',
  props: {
    value: [String, Array] as PropType<string | TextImageEditorBlock[]>,
    defaultValue: [String, Array] as PropType<string | TextImageEditorBlock[]>,
    onUpdateValue: Function as PropType<(value: string | TextImageEditorBlock[]) => void>,
    description: String,

    editorType: {
      type: String as PropType<'richtext' | 'markdown'>,
      default: 'richtext',
    },
    aiPath: String,
    uploadPath: String,
    uploadHeaders: Object as PropType<Record<string, any>>,
    fileManagerType: {
      type: String as PropType<'all' | 'image' | 'media' | 'docs' | string>,
      default: 'image',
    },
    editorHeight: {
      type: String,
      default: '500px',
    },
    previewHeight: {
      type: String,
      default: '600px',
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const modal = useModal()
    const { uploadPath, managePath, method } = useUploadConfig({
      uploadPath: props.uploadPath,
    })

    const { randomUUID } = new ShortUniqueId({ length: 10 })
    const makeId = () => randomUUID()

    const isUpdatingFromInternal = ref(false)

    const externalValue = computed(() => {
      return props.value === undefined ? props.defaultValue : props.value
    })

    const externalIsArray = computed(() => Array.isArray(externalValue.value))

    const blocks = ref<TextImageEditorBlock[]>(
      normalizeBlocks(
        externalIsArray.value
          ? (externalValue.value as TextImageEditorBlock[] || [])
          : safeJsonParseBlocks(externalValue.value as string),
        makeId,
      ),
    )

    const writeModel = () => {
      if (isUpdatingFromInternal.value)
        return
      isUpdatingFromInternal.value = true
      const outValue = externalIsArray.value
        ? (blocks.value || [])
        : JSON.stringify(blocks.value || [])
      emit('update:value', outValue)
      props.onUpdateValue?.(outValue)
      nextTick(() => {
        isUpdatingFromInternal.value = false
      })
    }

    watch(() => props.value, (v) => {
      if (isUpdatingFromInternal.value)
        return
      blocks.value = normalizeBlocks(
        Array.isArray(v) ? v : safeJsonParseBlocks(v),
        makeId,
      )
    }, { immediate: true })

    watch(blocks, writeModel, { deep: true })

    const emptyHint = computed(() => {
      return props.description
        || t('components.textImageEditor.hint')
        || '点击按钮添加图片或文本，也可以拖拽进行排序'
    })

    const openFileManager = async (multiple = true): Promise<Record<string, any>[] | undefined> => {
      const res = await modal.show({
        title: t('components.uploadManage.title') || t('components.upload.fileManager') || '文件管理器',
        width: '800px',
        component: () => import('../upload/manager'),
        componentProps: {
          path: managePath.value,
          type: props.fileManagerType || 'image',
          multiple,
          uploadParams: {
            path: uploadPath.value,
            accept: props.fileManagerType === 'image' ? 'image/*' : '*/*',
            method: method.value,
          },
        },
      })

      if (!res)
        return
      const items = Array.isArray(res) ? res : [res]
      return items.filter(item => item?.url)
    }

    const addImage = async () => {
      const items = await openFileManager(true)
      if (!items?.length)
        return
      items.forEach((item) => {
        const url = String(item?.url || '')
        if (!url)
          return
        blocks.value.push({
          id: makeId(),
          type: 'image',
          url,
          alt: item?.filename || item?.name,
        })
      })
    }

    const editImage = async (id: string) => {
      const items = await openFileManager(false)
      const item = items?.[0]
      const url = String(item?.url || '')
      if (!url)
        return
      const idx = blocks.value.findIndex(b => b.id === id)
      if (idx < 0)
        return
      const old = blocks.value[idx]
      if (old.type !== 'image')
        return
      blocks.value[idx] = {
        ...old,
        url,
        alt: item?.filename || item?.name,
      }
    }

    const openTextModal = async (initial: string) => {
      const content = await modal.show({
        title: t('components.textImageEditor.editText') || '编辑文本',
        width: '900px',
        component: () => import('./textModal'),
        componentProps: {
          value: initial,
          editorType: props.editorType,
          aiPath: props.aiPath,
          uploadPath: uploadPath.value,
          uploadHeaders: props.uploadHeaders,
          fileManager: true,
          fileManagerType: 'all',
          height: props.editorHeight,
        },
        modalProps: {
          maskClosable: false,
        },
      })
      return typeof content === 'string' ? content : ''
    }

    const addText = async () => {
      const content = await openTextModal('')
      if (!content)
        return
      blocks.value.push({
        id: makeId(),
        type: 'text',
        content,
      })
    }

    const editText = async (id: string) => {
      const idx = blocks.value.findIndex(b => b.id === id)
      if (idx < 0)
        return
      const old = blocks.value[idx]
      if (old.type !== 'text')
        return
      const content = await openTextModal(old.content || '')
      if (!content)
        return
      blocks.value[idx] = {
        ...old,
        content,
      }
    }

    const removeBlock = (id: string) => {
      const idx = blocks.value.findIndex(b => b.id === id)
      if (idx >= 0)
        blocks.value.splice(idx, 1)
    }

    const renderThumb = (block: TextImageEditorBlock) => {
      if (block.type === 'image') {
        return block.url
          ? (
              <img
                src={block.url}
                alt={block.alt || ''}
                class="w-96px h-96px rounded object-cover"
              />
            )
          : <div class="size-96px rounded bg-muted flex items-center justify-center text-muted"><div class="i-tabler:photo size-6" /></div>
      }
      return (
        <div class="size-96px rounded bg-muted flex flex-col items-center justify-center gap-1 text-muted">
          <div class="i-tabler:typography size-6" />
          <div class="text-xs">{t('components.textImageEditor.textLabel') || '文本'}</div>
        </div>
      )
    }

    const openPreviewModal = async () => {
      await modal.show({
        title: t('components.textImageEditor.previewTitle') || t('components.button.preview') || '预览',
        width: '92vw',
        component: TextImageEditorPreviewModal,
        componentProps: {
          blocks: blocks.value,
        },
      })
    }

    return () => (
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4" style={{ height: props.previewHeight }}>
        <div class="flex flex-col gap-3 border border-muted p-4">
          <div class="flex gap-2 flex-none">
            <NButton
              secondary
              onClick={addImage}
              renderIcon={() => <div class="i-tabler:photo-plus size-4" />}
            >
              {t('components.textImageEditor.addImage') || '添加图片'}
            </NButton>
            <NButton
              secondary
              onClick={addText}
              renderIcon={() => <div class="i-tabler:text-plus size-4" />}
            >
              {t('components.textImageEditor.addText') || '添加文本'}
            </NButton>
            <NButton
              class="md:hidden!"
              secondary
              onClick={openPreviewModal}
              renderIcon={() => <div class="i-tabler:eye size-4" />}
            >
              {t('components.textImageEditor.preview') || t('components.button.preview') || '预览'}
            </NButton>
          </div>
          <div class="text-sm text-muted flex-none">{emptyHint.value}</div>

          <VueDraggable
            modelValue={blocks.value}
            v-model={blocks.value}
            animation={150}
            class="grid gap-3 flex-1 min-h-0 overflow-y-auto items-start"
            style={{
              'grid-template-columns': `repeat(auto-fill, minmax(150px, 1fr))`,
            }}
            draggable=".dux-tie-item"
            handle=".dux-tie-handle"
            ghostClass="opacity-60"
          >
            {blocks.value.map((block) => {
              const isImage = block.type === 'image'
              const onEdit = () => (isImage ? editImage(block.id) : editText(block.id))
              return (
                <div
                  key={block.id}
                  class={clsx([
                    'dux-tie-item group relative rounded border border-muted bg-default hover:bg-muted/60 cursor-pointer',
                  ])}
                  onClick={(e) => {
                    // Avoid click when pressing drag handle
                    const el = e.target as HTMLElement
                    if (el?.closest?.('.dux-tie-handle'))
                      return
                    onEdit()
                  }}
                >
                  <div class="p-2 flex items-center justify-center">
                    {renderThumb(block)}
                  </div>

                  <div class="absolute top-1 right-1 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <NButton
                      quaternary
                      circle
                      size="tiny"
                      onClick={(e) => {
                        e.stopPropagation()
                        removeBlock(block.id)
                      }}
                      renderIcon={() => <div class="i-tabler:trash size-4" />}
                    />
                    <NButton
                      quaternary
                      circle
                      size="tiny"
                      class="dux-tie-handle cursor-move"
                      onClick={e => e.stopPropagation()}
                      renderIcon={() => <div class="i-tabler:grip-vertical size-4" />}
                    />
                  </div>
                </div>
              )
            })}
          </VueDraggable>
        </div>

        <div
          class="hidden md:block border border-dashed border-muted rounded bg-default p-4 overflow-auto"
        >
          {blocks.value.length === 0
            ? (
                <div class="h-full flex items-center justify-center text-muted">
                  {t('components.textImageEditor.empty') || '右侧实时预览'}
                </div>
              )
            : (
                <div class="flex flex-col">
                  {blocks.value.map((block) => {
                    if (block.type === 'image') {
                      return (
                        <div key={block.id} class="w-full">
                          {block.url
                            ? <img src={block.url} alt={block.alt || ''} class="w-full h-auto rounded" />
                            : <div class="w-full h-200px bg-muted rounded" />}
                        </div>
                      )
                    }
                    return (
                      <div
                        key={block.id}
                        class="prose prose-sm max-w-none dark:prose-invert"
                        innerHTML={block.content || ''}
                      />
                    )
                  })}
                </div>
              )}
        </div>
      </div>
    )
  },
})
