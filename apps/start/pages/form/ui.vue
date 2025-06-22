<script setup lang="ts">
import { DuxCard, DuxFormItem, DuxFormLayout, DuxPageForm } from '@duxweb/dvha-pro'
import {
  NAutoComplete,
  NButton,
  NCascader,
  NCheckbox,
  NCheckboxGroup,
  NColorPicker,
  NDatePicker,
  NDynamicInput,
  NDynamicTags,
  NInput,
  NInputNumber,
  NMention,
  NRadio,
  NRadioGroup,
  NRate,
  NSelect,
  NSlider,
  NSwitch,
  NTimePicker,
  NTransfer,
  NTreeSelect,
  NUpload,
  NUploadDragger,
} from 'naive-ui'
import { ref } from 'vue'

// Props 定义
const props = defineProps<{
  id?: string | number
}>()

// 表单数据模型
const model = ref({
  // 基础输入
  input: '示例文本',
  inputPassword: '',
  inputNumber: 100,
  textarea: '这是多行文本输入框的示例内容\n支持换行显示',

  // 选择器
  select: 'option1',
  multiSelect: ['option1', 'option2'],
  autoComplete: '',
  cascader: null,
  treeSelect: null,

  // 选择控件
  radio: 'option1',
  checkbox: true,
  checkboxGroup: ['option1', 'option3'],
  switch: true,

  // 日期时间
  date: null,
  dateRange: null,
  datetime: null,
  time: null,
  timeRange: null,

  // 数值控件
  slider: 50,
  sliderRange: [20, 80],
  rate: 4,
  color: '#18a058',

  // 文件上传
  fileList: [],

  // 穿梭框
  transfer: ['option1'],

  // 动态控件
  dynamicInput: ['项目一', '项目二'],
  dynamicTags: ['标签一', '标签二', '标签三'],

  // 提及
  mention: '@张三 你好',
})

const selectOptions = [
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' },
  { label: '选项四', value: 'option4' },
]

const radioOptions = [
  { label: '单选一', value: 'option1' },
  { label: '单选二', value: 'option2' },
  { label: '单选三', value: 'option3' },
]

const checkboxOptions = [
  { label: '复选一', value: 'option1' },
  { label: '复选二', value: 'option2' },
]

const cascaderOptions = [
  {
    label: '四川省',
    value: 'sichuan',
    children: [
      {
        label: '成都市',
        value: 'chengdu',
        children: [
          { label: '青羊区', value: 'qingyang' },
          { label: '锦江区', value: 'jinjiang' },
        ],
      },
    ],
  },
]

const treeSelectOptions = [
  {
    label: '技术部门',
    key: 'tech',
    children: [
      { label: '前端组', key: 'frontend' },
      { label: '后端组', key: 'backend' },
    ],
  },
]

const transferOptions = [
  { label: '选项一', value: 'option1' },
  { label: '选项二', value: 'option2' },
  { label: '选项三', value: 'option3' },
]

const autoCompleteOptions = [
  '张三',
  '李四',
  '王五',
]

const mentionOptions = [
  { label: '张三', value: '张三' },
  { label: '李四', value: '李四' },
]

function handleUpload({ fileList }) {
  model.value.fileList = fileList
  return false
}
</script>

<template>
  <DuxPageForm
    :id="props.id"
    title="Naive UI 表单组件展示"
    :data="model"
    path="naive-ui-demo"
  >
    <div class="flex flex-col gap-4">
      <!-- 基础输入组件 -->
      <DuxCard
        title="基础输入组件"
        description="文本输入、数字输入等基础输入控件"
        header-bordered
      >
        <div class="container mx-auto max-w-2xl">
          <DuxFormLayout label-placement="left">
            <DuxFormItem label="文本输入" path="input">
              <NInput
                v-model:value="model.input"
                placeholder="请输入文本"
                clearable
              />
            </DuxFormItem>

            <DuxFormItem label="密码输入" path="inputPassword">
              <NInput
                v-model:value="model.inputPassword"
                type="password"
                placeholder="请输入密码"
                show-password-on="mousedown"
                clearable
              />
            </DuxFormItem>

            <DuxFormItem label="数字输入" path="inputNumber">
              <NInputNumber
                v-model:value="model.inputNumber"
                :min="0"
                :max="1000"
                :precision="0"
                style="width: 100%"
                placeholder="请输入数字"
              />
            </DuxFormItem>

            <DuxFormItem label="多行文本" path="textarea">
              <NInput
                v-model:value="model.textarea"
                type="textarea"
                :rows="4"
                placeholder="请输入多行文本"
                show-count
                :maxlength="200"
              />
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 选择器组件 -->
      <DuxCard
        title="选择器组件"
        description="下拉选择、级联选择、自动完成等选择控件"
        header-bordered
      >
        <div class="container mx-auto max-w-2xl">
          <DuxFormLayout label-placement="left">
            <DuxFormItem label="单选下拉" path="select">
              <NSelect
                v-model:value="model.select"
                :options="selectOptions"
                placeholder="请选择单个选项"
                clearable
              />
            </DuxFormItem>

            <DuxFormItem label="多选下拉" path="multiSelect">
              <NSelect
                v-model:value="model.multiSelect"
                :options="selectOptions"
                multiple
                placeholder="请选择多个选项"
                clearable
              />
            </DuxFormItem>

            <DuxFormItem label="自动完成" path="autoComplete">
              <NAutoComplete
                v-model:value="model.autoComplete"
                :options="autoCompleteOptions"
                placeholder="输入姓名搜索"
                clearable
              />
            </DuxFormItem>

            <DuxFormItem label="级联选择" path="cascader">
              <NCascader
                v-model:value="model.cascader"
                :options="cascaderOptions"
                placeholder="请选择地区"
                clearable
                expand-trigger="hover"
              />
            </DuxFormItem>

            <DuxFormItem label="树选择" path="treeSelect">
              <NTreeSelect
                v-model:value="model.treeSelect"
                :options="treeSelectOptions"
                placeholder="请选择部门"
                clearable
              />
            </DuxFormItem>

            <DuxFormItem label="穿梭框" path="transfer">
              <NTransfer
                v-model:value="model.transfer"
                :options="transferOptions"
                style="width: 100%"
              />
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 选择控件 -->
      <DuxCard
        title="选择控件"
        description="单选、复选、开关等选择控件"
        header-bordered
      >
        <div class="container mx-auto max-w-2xl">
          <DuxFormLayout label-placement="left">
            <DuxFormItem label="单选按钮" path="radio">
              <NRadioGroup v-model:value="model.radio">
                <div class="flex flex-col gap-2">
                  <NRadio
                    v-for="option in radioOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </NRadio>
                </div>
              </NRadioGroup>
            </DuxFormItem>

            <DuxFormItem label="复选框组" path="checkboxGroup">
              <NCheckboxGroup v-model:value="model.checkboxGroup">
                <div class="flex flex-col gap-2">
                  <NCheckbox
                    v-for="option in checkboxOptions"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </NCheckbox>
                </div>
              </NCheckboxGroup>
            </DuxFormItem>

            <DuxFormItem label="单个复选框" path="checkbox">
              <NCheckbox v-model:checked="model.checkbox">
                我同意用户协议和隐私政策
              </NCheckbox>
            </DuxFormItem>

            <DuxFormItem label="开关" path="switch">
              <NSwitch v-model:value="model.switch">
                <template #checked>
                  开启
                </template>
                <template #unchecked>
                  关闭
                </template>
              </NSwitch>
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 日期时间组件 -->
      <DuxCard
        title="日期时间组件"
        description="日期选择、时间选择等时间相关控件"
        header-bordered
      >
        <div class="container mx-auto max-w-2xl">
          <DuxFormLayout label-placement="left">
            <DuxFormItem label="日期选择" path="date">
              <NDatePicker
                v-model:value="model.date"
                type="date"
                placeholder="请选择日期"
                style="width: 100%"
                clearable
              />
            </DuxFormItem>

            <DuxFormItem label="时间选择" path="time">
              <NTimePicker
                v-model:value="model.time"
                placeholder="请选择时间"
                style="width: 100%"
                clearable
              />
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 数值控件 -->
      <DuxCard
        title="数值控件"
        description="滑块、评分、颜色选择等数值控件"
        header-bordered
      >
        <div class="container mx-auto max-w-2xl">
          <DuxFormLayout label-placement="left">
            <DuxFormItem label="滑块" path="slider">
              <div class="flex items-center gap-4">
                <NSlider v-model:value="model.slider" :min="0" :max="100" style="flex: 1" />
                <span class="text-sm text-gray-500 w-12">{{ model.slider }}</span>
              </div>
            </DuxFormItem>

            <DuxFormItem label="评分" path="rate">
              <NRate v-model:value="model.rate" allow-half />
            </DuxFormItem>

            <DuxFormItem label="颜色选择" path="color">
              <NColorPicker v-model:value="model.color" :modes="['hex', 'rgb', 'hsl']" />
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 文件上传 -->
      <DuxCard
        title="文件上传"
        description="文件上传控件"
        header-bordered
      >
        <div class="container mx-auto max-w-2xl">
          <DuxFormLayout label-placement="left">
            <DuxFormItem label="文件上传" path="fileList">
              <NUpload
                v-model:file-list="model.fileList"
                multiple
                :max="5"
                @change="handleUpload"
              >
                <NButton>选择文件</NButton>
              </NUpload>
            </DuxFormItem>

            <DuxFormItem label="拖拽上传" path="fileList">
              <NUpload
                v-model:file-list="model.fileList"
                multiple
                directory-dnd
                @change="handleUpload"
              >
                <NUploadDragger />
              </NUpload>
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 动态控件 -->
      <DuxCard
        title="动态控件"
        description="动态输入、动态标签、提及等高级控件"
        header-bordered
      >
        <div class="container mx-auto max-w-2xl">
          <DuxFormLayout label-placement="left">
            <DuxFormItem label="动态输入" path="dynamicInput">
              <NDynamicInput
                v-model:value="model.dynamicInput"
                placeholder="点击添加项目"
              />
            </DuxFormItem>

            <DuxFormItem label="动态标签" path="dynamicTags">
              <NDynamicTags
                v-model:value="model.dynamicTags"
                :max="10"
              />
            </DuxFormItem>

            <DuxFormItem label="提及功能" path="mention">
              <NMention
                v-model:value="model.mention"
                :options="mentionOptions"
                type="textarea"
                :rows="3"
                placeholder="输入 @ 可以提及用户"
              />
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 表单数据预览 -->
      <DuxCard
        title="表单数据预览"
        description="实时显示当前表单数据"
        header-bordered
      >
        <pre class="bg-gray-50 dark:bg-gray-800 p-4 rounded text-sm overflow-auto max-h-96">{{ JSON.stringify(model, null, 2) }}</pre>
      </DuxCard>
    </div>
  </DuxPageForm>
</template>

<style scoped>
/* 自定义样式 */
</style>
