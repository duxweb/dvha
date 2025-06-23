<script setup lang="ts">
import { DuxSelect, DuxTreeSelect } from '@duxweb/dvha-naiveui'
// @ts-expect-error - DuxFileManage 组件导入
import { DuxAiEditor, DuxCard, DuxDynamicData, DuxDynamicSelect, DuxFileManage, DuxFileUpload, DuxFormItem, DuxFormLayout, DuxImageCrop, DuxImageUpload, DuxLevel, DuxPageForm, DuxSelectCard, useDownload } from '@duxweb/dvha-pro'
import { NButton, NInput, NInputNumber, NProgress, NSelect } from 'naive-ui'
import { ref } from 'vue'

// Props 定义
const props = defineProps<{
  id?: string | number
}>()

// 下载功能
const { file: downloadFile, loading: downloadLoading, progress: downloadProgress } = useDownload()

// 下载示例函数
function handleDownload() {
  // 这里使用一个示例下载地址，实际使用时替换为真实的API路径
  downloadFile(
    'files/sample.pdf', // API路径
    { version: '1.0' }, // 查询参数
    undefined, // 内容类型（自动检测）
    'sample-document.pdf', // 自定义文件名
    (progress) => {
      downloadProgress.value = progress
    },
  )
}

// 表单数据模型
const model = ref({
  // 数据选择组件
  user: null,
  category: null,
  region: ['四川省', '成都市', '青羊区'],

  // 上传组件
  avatar: '',
  images: [],
  files: [] as any[],

  // 编辑器
  description: '<p>这是富文本编辑器的示例内容，支持 AI 辅助编辑功能。</p><p>你可以尝试各种富文本格式。</p>',

  // 卡片选择
  cardSelect: null as string | null,

  // 动态数据
  tableData: [
    { name: '商品A', price: 299.99, category: '电子产品', desc: '高质量的电子产品' },
    { name: '商品B', price: 159.50, category: '生活用品', desc: '实用的生活必需品' },
    { name: '商品C', price: 89.90, category: '办公用品', desc: '提高工作效率的好帮手' },
  ],

  // 动态选择
  selectedUsers: [],
})

// 卡片选择配置
const cardSelectOptions = [
  {
    value: 'basic',
    label: '基础版',
    description: '适合个人用户使用，包含基础功能',
    icon: 'i-tabler:user',
    iconColor: 'primary',
  },
  {
    value: 'pro',
    label: '专业版',
    description: '适合企业用户，功能更加丰富',
    icon: 'i-tabler:briefcase',
    iconColor: 'success',
  },
  {
    value: 'enterprise',
    label: '企业版',
    description: '大型企业定制解决方案',
    icon: 'i-tabler:building',
    iconColor: 'warning',
  },
  {
    value: 'ultimate',
    label: '旗舰版',
    description: '最全面的功能集合，无限制使用',
    icon: 'i-tabler:crown',
    iconColor: 'error',
  },
]

// DuxDynamicData 列配置
const dynamicDataColumns = [
  {
    key: 'name',
    title: '商品名称',
    width: 200,
    schema: {
      tag: NInput,
      attrs: {
        'v-model:value': 'row.name',
        'placeholder': '请输入商品名称',
      },
    },
  },
  {
    key: 'price',
    title: '价格',
    width: 150,
    copy: true,
    schema: {
      tag: NInputNumber,
      attrs: {
        'v-model:value': 'row.price',
        'min': 0,
        'precision': 2,
        'style': { width: '100%' },
        'placeholder': '请输入价格',
      },
    },
  },
  {
    key: 'category',
    title: '分类',
    width: 150,
    schema: {
      tag: NSelect,
      attrs: {
        'v-model:value': 'row.category',
        'options': [
          { label: '电子产品', value: '电子产品' },
          { label: '生活用品', value: '生活用品' },
          { label: '办公用品', value: '办公用品' },
          { label: '运动户外', value: '运动户外' },
        ],
        'placeholder': '请选择分类',
      },
    },
  },
  {
    key: 'desc',
    title: '描述',
    width: 300,
    schema: {
      tag: NInput,
      attrs: {
        'v-model:value': 'row.desc',
        'type': 'textarea',
        'rows': 2,
        'placeholder': '请输入商品描述',
      },
    },
  },
]

// DuxDynamicSelect 显示列配置
const dynamicSelectColumns = [
  {
    key: 'nickname',
    title: '用户名',
    width: 150,
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200,
  },
  {
    key: 'role',
    title: '角色',
    width: 100,
  },
]

// DuxDynamicSelect 表格列配置
const userTableColumns = [
  {
    key: 'id',
    title: 'ID',
    width: 80,
  },
  {
    key: 'nickname',
    title: '用户名',
    width: 150,
  },
  {
    key: 'email',
    title: '邮箱',
    width: 200,
  },
  {
    key: 'role',
    title: '角色',
    width: 100,
  },
  {
    key: 'created_at',
    title: '创建时间',
    width: 180,
  },
]
</script>

<template>
  <DuxPageForm
    :id="props.id"
    title="Dux 高阶组件展示"
    :data="model"
    path="dux-components-demo"
  >
    <div class="flex flex-col gap-4">
      <!-- 数据选择组件 -->
      <DuxCard
        title="数据选择组件"
        description="从后端数据源选择数据的高级组件"
        header-bordered
      >
        <div class="container mx-auto max-w-2xl">
          <DuxFormLayout label-placement="left">
            <DuxFormItem label="用户选择" path="user">
              <DuxSelect
                v-model:value="model.user"
                path="user"
                label-field="nickname"
                value-field="id"
                avatar-field="avatar"
                desc-field="email"
                placeholder="请选择用户"
                clearable
              />
            </DuxFormItem>

            <DuxFormItem label="分类选择" path="category">
              <DuxTreeSelect
                v-model:value="model.category"
                path="classify"
                label-field="name"
                key-field="id"
                placeholder="请选择分类"
                clearable
              />
            </DuxFormItem>

            <DuxFormItem label="地区选择" path="region">
              <DuxLevel
                v-model:value="model.region"
                path="area"
                :max-level="3"
                placeholder="请选择地区"
              />
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 文件上传组件 -->
      <DuxCard
        title="文件上传组件"
        description="支持图片裁剪、多文件上传的高级上传组件"
        header-bordered
      >
        <div class="container mx-auto max-w-2xl">
          <DuxFormLayout label-placement="left">
            <DuxFormItem label="头像裁剪" path="avatar">
              <DuxImageCrop
                v-model:value="model.avatar"
                :aspect-ratio="1"
                upload-path="upload"
              />
            </DuxFormItem>

            <DuxFormItem label="图片上传" path="images">
              <DuxImageUpload
                v-model:value="model.images"
                multiple
                :max="5"
                path="upload"
                manager
              />
            </DuxFormItem>

            <DuxFormItem label="文件上传" path="files">
              <DuxFileUpload
                v-model:value="model.files"
                manager
                multiple
                :max="3"
                accept="*"
                path="upload"
              />
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 富文本编辑器 -->
      <DuxCard
        title="AI 富文本编辑器"
        description="支持 AI 辅助编辑的富文本编辑器"
        header-bordered
      >
        <div class="container mx-auto max-w-4xl">
          <DuxFormLayout label-placement="top">
            <DuxFormItem label="内容编辑" path="description">
              <DuxAiEditor
                v-model:value="model.description"
                :min-height="300"
                placeholder="请输入内容，支持 AI 辅助编辑..."
              />
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 卡片选择组件 -->
      <DuxCard
        title="卡片选择组件"
        description="美观的卡片式选择组件，支持图标和描述"
        header-bordered
      >
        <div class="container mx-auto max-w-4xl">
          <DuxFormLayout label-placement="top">
            <DuxFormItem label="选择套餐" path="cardSelect">
              <DuxSelectCard
                v-model="model.cardSelect"
                max-width="220px"
                :options="cardSelectOptions"
                :columns="2"
              />
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 动态数据组件 -->
      <DuxCard
        title="动态数据组件"
        description="可编辑的动态表格，支持增删改查和拖拽排序"
        header-bordered
      >
        <div class="container mx-auto max-w-6xl">
          <DuxFormLayout label-placement="top" class="space-y-6">
            <DuxFormItem label="商品管理" path="tableData">
              <DuxDynamicData
                v-model:value="model.tableData"
                :columns="dynamicDataColumns"
                :create-action="true"
                :delete-action="true"
                :sort-action="true"
                :create-callback="() => ({ name: '', price: 0, category: '', desc: '' })"
              />
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 动态选择组件 -->
      <DuxCard
        title="动态选择组件"
        description="从数据源动态选择多个项目，支持搜索和筛选"
        header-bordered
      >
        <div class="container mx-auto max-w-4xl">
          <DuxFormLayout label-placement="top">
            <DuxFormItem label="选择用户" path="selectedUsers">
              <DuxDynamicSelect
                v-model:value="model.selectedUsers"
                path="user"
                row-key="id"
                :columns="dynamicSelectColumns"
                :filter-columns="userTableColumns"
                placeholder="点击选择用户"
              />
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 下载进度演示 -->
      <DuxCard
        title="下载进度演示"
        description="展示带进度条的文件下载功能"
        header-bordered
      >
        <div class="container mx-auto max-w-2xl">
          <DuxFormLayout label-placement="top" class="space-y-4">
            <DuxFormItem label="文件下载">
              <div class="space-y-4">
                <div class="flex items-center gap-4">
                  <NButton
                    type="primary"
                    :loading="downloadLoading"
                    @click="handleDownload"
                  >
                    {{ downloadLoading ? '下载中...' : '下载示例文件' }}
                  </NButton>

                  <div v-if="downloadLoading" class="text-sm text-muted">
                    {{ downloadProgress.speedText }} | 剩余 {{ Math.round(downloadProgress.remainingTime || 0) }}s
                  </div>
                </div>

                <div v-if="downloadLoading || downloadProgress.percent > 0" class="space-y-2">
                  <div class="flex justify-between text-sm">
                    <span>下载进度</span>
                    <span>{{ downloadProgress.percent?.toFixed(1) }}%</span>
                  </div>
                  <NProgress
                    :percentage="downloadProgress.percent || 0"
                    :show-indicator="false"
                    status="success"
                  />
                  <div class="flex justify-between text-xs text-muted">
                    <span>{{ downloadProgress.speedText }}</span>
                  </div>
                </div>
              </div>
            </DuxFormItem>
          </DuxFormLayout>
        </div>
      </DuxCard>

      <!-- 文件管理器组件 -->
      <DuxCard
        title="文件管理器组件"
        description="展示文件管理功能"
        header-bordered
      >
        <div class="container mx-auto max-w-4xl">
          <DuxFileManage
            v-model:value="model.files"
            :page="false"
            :max="3"
            accept="*"
            path="uploadManage"
          />
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
