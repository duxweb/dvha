import type { PropType } from 'vue'

import { useI18n } from '@duxweb/dvha-core'
import clsx from 'clsx'
import { NCheckbox, NImage } from 'naive-ui'

import { defineComponent } from 'vue'
import { useDialog } from '../../../hooks'
import { audioSvg, excelSvg, fileSvg, folderSvg, pdfSvg, pptSvg, videoSvg, wordSvg } from '../../../static/images/icon'

export const DuxFileManageItem = defineComponent({
  name: 'DuxFileManageItem',
  props: {
    name: String,
    url: String,
    type: String as PropType<'file' | 'folder'>,
    mime: String,
    time: String,
    value: Boolean,
    onContextmenu: Function as PropType<(e: MouseEvent) => void>,
    onSelect: Function,
  },
  setup(props) {
    const dialog = useDialog()
    const { t } = useI18n()

    // 文件类型映射配置
    const fileTypeConfig = {
      image: {
        check: (mime: string) => mime.startsWith('image/'),
        render: () => (
          <div
            class="size-12 flex items-center justify-center"
            onClick={e => e.stopPropagation()}
          >
            <NImage src={props.url} width={48} height={48} />
          </div>
        ),
      },
      video: {
        check: (mime: string) => mime.startsWith('video/'),
        render: () => (
          <div onClick={(e) => {
            e.stopPropagation()
            dialog.node({
              title: t('components.button.preview'),
              render: () => (
                <div class="flex items-center justify-center">
                  <video class="w-120 max-w-full" controls>
                    <source src={props.url} type={props.mime} />
                  </video>
                </div>
              ),
            })
          }}
          >
            <img src={videoSvg.default} class="size-12" />
          </div>
        ),
      },
      audio: {
        check: (mime: string) => mime.startsWith('audio/'),
        render: () => (
          <div onClick={(e) => {
            e.stopPropagation()
            dialog.node({
              title: t('components.button.preview'),
              render: () => (
                <div class="flex items-center justify-center">
                  <audio class="w-120 max-w-full" controls>
                    <source src={props.url} type={props.mime} />
                  </audio>
                </div>
              ),
            })
          }}
          >
            <img src={audioSvg.default} class="size-12" />
          </div>
        ),
      },
      pdf: {
        check: (mime: string) => mime === 'application/pdf',
        render: () => <img src={pdfSvg.default} class="size-12" />,
      },
      word: {
        check: (mime: string) => [
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
        ].includes(mime),
        render: () => <img src={wordSvg.default} class="size-12" />,
      },
      excel: {
        check: (mime: string) => [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel',
        ].includes(mime),
        render: () => <img src={excelSvg.default} class="size-12" />,
      },
      powerpoint: {
        check: (mime: string) => [
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          'application/vnd.ms-powerpoint',
        ].includes(mime),
        render: () => <img src={pptSvg.default} class="size-12" />,
      },
    }

    // 获取文件图标
    const getFileIcon = () => {
      if (props.type === 'folder') {
        return <img src={folderSvg.default} class="size-12" />
      }

      if (!props.mime) {
        return <img src={fileSvg.default} class="size-12" />
      }

      // 查找匹配的文件类型
      for (const config of Object.values(fileTypeConfig)) {
        if (config.check(props.mime)) {
          return config.render()
        }
      }

      // 默认文件图标
      return <img src={fileSvg.default} class="size-12" />
    }

    return () => (
      <div
        class="flex flex-col items-center justify-center hover:bg-primary/10 cursor-pointer p-2 rounded-sm relative group"
        onContextmenu={props.onContextmenu}
        onClick={() => props.onSelect?.(!props?.value)}
      >
        <div class="mb-2">
          {getFileIcon()}
        </div>

        <div class="truncate w-full text-center">
          {props.name}
        </div>
        <div class={clsx([
          'absolute top-2 right-2',
          props.value ? 'block' : 'hidden group-hover:block',
        ])}
        >
          {props.type === 'file' && <NCheckbox checked={props.value} />}
        </div>
      </div>
    )
  },
})
