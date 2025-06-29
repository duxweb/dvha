<script setup lang="ts">
import type { UploadFileInfo } from 'naive-ui'
import { NButton, NColorPicker, NInputNumber, NUpload } from 'naive-ui'
import { reactive } from 'vue'

interface CanvasSettings {
  width: number
  height: number
  backgroundColor: string
  backgroundImage: string | null
}

const props = defineProps<{
  initialSettings?: Partial<CanvasSettings>
}>()

const emit = defineEmits<{
  updateSettings: [settings: CanvasSettings]
}>()

const settings = reactive<CanvasSettings>({
  width: 750,
  height: 500,
  backgroundColor: '#ffffff',
  backgroundImage: null,
  ...props.initialSettings,
})

function onWidthChange(value: number | null) {
  if (value !== null) {
    settings.width = value
  }
}

function onHeightChange(value: number | null) {
  if (value !== null) {
    settings.height = value
  }
}

function onBackgroundColorChange(value: string) {
  settings.backgroundColor = value
}

function onBackgroundImageChange({ file }: { file: UploadFileInfo }) {
  if (file.file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      settings.backgroundImage = e.target?.result as string
    }
    reader.readAsDataURL(file.file)
  }
}

function clearBackgroundImage() {
  settings.backgroundImage = null
}

function applySettings() {
  emit('updateSettings', { ...settings })
}

function resetSettings() {
  settings.width = 750
  settings.height = 500
  settings.backgroundColor = '#ffffff'
  settings.backgroundImage = null
}
</script>

<template>
  <div class="p-4 space-y-4">
    <div>
      <label class="block text-sm font-medium mb-2">画布宽度</label>
      <NInputNumber
        v-model:value="settings.width"
        :min="100"
        :max="2000"
        :step="50"
        placeholder="画布宽度"
        @update:value="onWidthChange"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">画布高度</label>
      <NInputNumber
        v-model:value="settings.height"
        :min="100"
        :max="2000"
        :step="50"
        placeholder="画布高度"
        @update:value="onHeightChange"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">背景颜色</label>
      <NColorPicker
        v-model:value="settings.backgroundColor"
        :modes="['hex', 'rgb']"
        :show-alpha="true"
        @update:value="onBackgroundColorChange"
      />
    </div>

    <div>
      <label class="block text-sm font-medium mb-2">背景图片</label>
      <div class="space-y-2">
        <NUpload
          :max="1"
          accept="image/*"
          :show-file-list="false"
          @change="onBackgroundImageChange"
        >
          <NButton dashed block>
            <template #icon>
              <div class="i-tabler:upload" />
            </template>
            上传背景图片
          </NButton>
        </NUpload>

        <div v-if="settings.backgroundImage" class="flex items-center justify-between bg-gray-50 p-2 rounded">
          <span class="text-sm text-gray-600">已选择背景图片</span>
          <NButton text @click="clearBackgroundImage">
            <template #icon>
              <div class="i-tabler:x" />
            </template>
          </NButton>
        </div>
      </div>
    </div>

    <div class="flex gap-2 pt-4">
      <NButton type="primary" @click="applySettings">
        应用设置
      </NButton>
      <NButton @click="resetSettings">
        重置
      </NButton>
    </div>
  </div>
</template>
