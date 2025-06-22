import { useManage, useUpload } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { useMessage } from 'naive-ui'
import { defineComponent } from 'vue'
import { useModal } from '../../hooks'
import { DuxAvatar } from '../widget'

export const DuxImageCrop = defineComponent({
  name: 'DuxImageCrop',
  props: {
    defaultValue: {
      type: String,
      default: '',
    },
    value: {
      type: String,
      default: '',
    },
    path: {
      type: String,
      default: '',
    },
    circle: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { emit }) {
    const data = useVModel(props, 'value', emit, {
      passive: true,
      defaultValue: props.defaultValue || '',
    })
    const { config } = useManage()
    const modal = useModal()
    const message = useMessage()
    const upload = useUpload({
      path: props.path || config.apiPath?.upload || 'upload',
      autoUpload: true,
      onSuccess: (res) => {
        data.value = res.data?.url
        message.success('上传成功')
      },
      onError: (error) => {
        message.error(error.message || '上传失败')
      },
    })
    return () => (
      <div
        class={[
          'relative size-80px overflow-hidden group',
          props.circle && 'rounded-full',
        ]}
        onClick={() => {
          modal.show({
            component: () => import('./imageCropModal').then(m => m.DuxImageCropModal),
            componentProps: {
              value: data.value,
              onConfirm: (value: string) => {
                data.value = value
              },
            },
          })?.then?.((file) => {
            if (!file) {
              return
            }
            file.name = 'image.png'
            file.mime = 'image/png'
            upload.addFiles([file], 'blob')
          }).catch(() => {
          })
        }}
      >
        <DuxAvatar src={data.value} circle={props.circle} size={80} />
        <div class="absolute size-full bg-gray-900/30 items-center justify-center inset-0 cursor-pointer hidden z-1 group-hover:flex">
          <div class="i-tabler:pencil size-4 text-white/90"></div>
        </div>
      </div>
    )
  },
})
