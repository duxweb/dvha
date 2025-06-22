import { useFileDialog } from '@vueuse/core'
import { NButton } from 'naive-ui'
import { defineComponent, ref, watch } from 'vue'
import { VueCropper } from 'vue-cropper'
import { DuxModalPage } from '../modal'

export const DuxImageCropModal = defineComponent({
  props: {
    value: String,
    onConfirm: Function,
  },
  setup(props) {
    const cropper = ref<any>()

    const value = ref(props.value || '')

    const { open, files } = useFileDialog({
      accept: 'image/*',
    })

    watch(files, (files) => {
      if (files && files.length > 0) {
        const file = files[0]
        const blob = new Blob([file], { type: file.type })
        value.value = URL.createObjectURL(blob)
      }
    })

    const onSelect = () => {
      open()
    }

    return () => (
      <DuxModalPage title="裁剪">
        {{
          default: () => (
            <div class="h-100">
              <VueCropper
                ref={cropper}
                img={value.value}
                autoCrop={true}
                centerBox={true}
                canMove={false}
                fixed={true}
                outputType="png"
                mode="contain"
              >
              </VueCropper>
            </div>
          ),
          footer: () => (
            <div class="flex-1 flex justify-between items-center">
              <div class="flex items-center gap-2">
                <NButton
                  type="primary"
                  secondary
                  onClick={() => {
                    onSelect()
                  }}
                >
                  选择
                </NButton>

                <NButton
                  secondary
                  onClick={() => {
                    cropper.value.changeScale(1)
                  }}
                >
                  <div class="i-tabler:zoom-in"></div>
                </NButton>

                <NButton
                  secondary
                  onClick={() => {
                    cropper.value.changeScale(-1)
                  }}
                >
                  <div class="i-tabler:zoom-out"></div>
                </NButton>

                <NButton
                  secondary
                  onClick={() => {
                    cropper.value.rotateLeft()
                  }}
                >
                  <div class="i-tabler:rotate"></div>
                </NButton>

                <NButton
                  secondary
                  onClick={() => {
                    cropper.value.rotateRight()
                  }}
                >
                  <div class="i-tabler:rotate-clockwise"></div>
                </NButton>
              </div>

              <NButton
                type="primary"
                onClick={() => {
                  cropper.value.getCropBlob((data) => {
                    props.onConfirm?.(data)
                  })
                }}
              >
                确认
              </NButton>
            </div>
          ),
        }}
      </DuxModalPage>
    )
  },
})
