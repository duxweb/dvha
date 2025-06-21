<script setup lang="ts">
import { DuxSelect, DuxTreeSelect, useNaiveUpload } from '@duxweb/dvha-naiveui'
import { DuxCard, DuxFormItem, DuxFormLayout, DuxPageForm, DuxSelectCard } from '@duxweb/dvha-pro'
import { NButton, NDivider, NInput, NInputNumber, NRadio, NRadioGroup, NSpace, NStatistic, NTag, NText, NUpload, NUploadDragger } from 'naive-ui'
import { computed, ref } from 'vue'

// Props 定义
const props = defineProps<{
  id?: string | number
}>()

// 表单数据模型
const model = ref({
  // 基本信息
  title: '新产品',
  subtitle: '',
  user: null,
  tags: [],
  category: null,
  isPublished: true,
  publishDate: null,
  status: 'draft',

  // 价格与库存
  price: 0,
  stock: 100,
  discount: 0,

  // 规格参数
  weight: 0,
  size: {
    length: 0,
    width: 0,
    height: 0,
  },

  // 联系方式
  contactName: '',
  contactEmail: '',
  contactPhone: '',

  // 配送设置
  deliveryMethod: 'express',
  description: '',
  remarks: '',

  // 排序
  sort: 0,
})

// 上传配置
const { request } = useNaiveUpload({
  path: 'upload',
})

// 计算属性
const totalValue = computed(() => model.value.price * model.value.stock)
const statusColor = computed(() => {
  switch (model.value.status) {
    case 'published': return 'success'
    case 'draft': return 'warning'
    default: return 'default'
  }
})

const productType = ref('physical')

const productTypeOptions = [
  {
    value: 'physical',
    label: '实物商品',
    description: '物流发货',
    icon: 'i-tabler:truck',
    iconColor: 'primary',
  },
  {
    value: 'virtual',
    label: '虚拟商品',
    description: '无需物流',
    icon: 'i-tabler:shopping-bag',
    iconColor: 'error',
  },
  {
    value: 'card',
    label: '电子卡券',
    description: '无需物流',
    icon: 'i-tabler:credit-card',
    iconColor: 'pink',
  },
  {
    value: 'food',
    label: '茶饮烘焙',
    description: '同城送或自提',
    icon: 'i-tabler:motorbike',
    iconColor: 'success',
  },
]
</script>

<template>
  <DuxPageForm
    :id="props.id"
    title="产品管理"
    :data="model"
    path="product"
  >
    <!-- 两栏布局 -->
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-4">
      <!-- 左侧主内容 -->
      <div class="xl:col-span-3 space-y-4">
        <!-- 基本信息 -->
        <DuxCard
          title="基本信息"
          description="填写产品的基本信息"
          header-bordered
        >
          <DuxSelectCard
            v-model="productType"
            :options="productTypeOptions"
            @change="(value) => console.log('选中的商品类型:', value)"
          />

          <DuxFormLayout label-placement="top" class="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DuxFormItem label="产品名称" path="title" rule="required">
              <NInput
                v-model:value="model.title"
                placeholder="请输入产品名称"
                size="large"
              />
            </DuxFormItem>

            <DuxFormItem label="产品副标题" path="subtitle">
              <NInput
                v-model:value="model.subtitle"
                placeholder="请输入产品副标题"
                size="large"
              />
            </DuxFormItem>

            <DuxFormItem label="负责人员" path="user" rule="required">
              <DuxSelect
                v-model:value="model.user"
                path="user"
                label-field="nickname"
                value-field="id"
                avatar-field="avatar"
                desc-field="email"
                placeholder="请选择负责人员"
                size="large"
              />
            </DuxFormItem>

            <DuxFormItem label="产品分类" path="category">
              <DuxTreeSelect
                v-model:value="model.category"
                path="classify"
                label-field="name"
                key-field="id"
                placeholder="请选择产品分类"
                size="large"
              />
            </DuxFormItem>
          </DuxFormLayout>
        </DuxCard>

        <!-- 价格与库存 -->
        <DuxCard
          title="价格与库存"
          description="设置产品价格和库存信息"
          header-bordered
        >
          <DuxFormLayout label-placement="top" class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DuxFormItem label="销售价格" path="price" rule="required|numeric">
              <NInputNumber
                v-model:value="model.price"
                :min="0"
                :precision="2"
                size="large"
                style="width: 100%"
                placeholder="0.00"
              >
                <template #prefix>
                  ¥
                </template>
              </NInputNumber>
            </DuxFormItem>

            <DuxFormItem label="库存数量" path="stock" rule="required|integer">
              <NInputNumber
                v-model:value="model.stock"
                :min="0"
                :precision="0"
                size="large"
                style="width: 100%"
                placeholder="0"
              >
                <template #suffix>
                  件
                </template>
              </NInputNumber>
            </DuxFormItem>

            <DuxFormItem label="折扣百分比" path="discount">
              <NInputNumber
                v-model:value="model.discount"
                :min="0"
                :max="100"
                :precision="0"
                size="large"
                style="width: 100%"
                placeholder="0"
              >
                <template #suffix>
                  %
                </template>
              </NInputNumber>
            </DuxFormItem>
          </DuxFormLayout>
        </DuxCard>

        <!-- 规格参数 -->
        <DuxCard
          title="规格参数"
          description="填写产品的规格参数"
          header-bordered
        >
          <DuxFormLayout label-placement="top" class="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <DuxFormItem label="重量" path="weight">
              <NInputNumber
                v-model:value="model.weight"
                :min="0"
                :precision="2"
                size="large"
                style="width: 100%"
                placeholder="0.00"
              >
                <template #suffix>
                  kg
                </template>
              </NInputNumber>
            </DuxFormItem>

            <DuxFormItem label="长度" path="size.length">
              <NInputNumber
                v-model:value="model.size.length"
                :min="0"
                :precision="1"
                size="large"
                style="width: 100%"
                placeholder="0.0"
              >
                <template #suffix>
                  cm
                </template>
              </NInputNumber>
            </DuxFormItem>

            <DuxFormItem label="宽度" path="size.width">
              <NInputNumber
                v-model:value="model.size.width"
                :min="0"
                :precision="1"
                size="large"
                style="width: 100%"
                placeholder="0.0"
              >
                <template #suffix>
                  cm
                </template>
              </NInputNumber>
            </DuxFormItem>

            <DuxFormItem label="高度" path="size.height">
              <NInputNumber
                v-model:value="model.size.height"
                :min="0"
                :precision="1"
                size="large"
                style="width: 100%"
                placeholder="0.0"
              >
                <template #suffix>
                  cm
                </template>
              </NInputNumber>
            </DuxFormItem>
          </DuxFormLayout>
        </DuxCard>

        <!-- 产品图片 -->
        <DuxCard
          title="产品图片"
          description="上传产品展示图片"
          header-bordered
        >
          <DuxFormItem label="产品图片" path="images">
            <NUpload multiple :custom-request="request">
              <NUploadDragger>
                <div class="text-center py-8">
                  <div class="i-tabler:cloud-upload text-4xl text-primary mb-3" />
                  <div class="text-lg font-medium mb-2">
                    点击或拖拽文件到此区域上传
                  </div>
                  <div class="text-sm text-gray-500">
                    支持 JPG、PNG 格式，单张不超过 2MB
                  </div>
                </div>
              </NUploadDragger>
            </NUpload>
          </DuxFormItem>
        </DuxCard>

        <!-- 配送设置 -->
        <DuxCard
          title="配送设置"
          description="选择配送方式和填写联系信息"
          header-bordered
        >
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 配送方式 -->
            <DuxFormItem label="配送方式" path="deliveryMethod">
              <NRadioGroup v-model:value="model.deliveryMethod" size="large">
                <NSpace vertical>
                  <NRadio value="express">
                    <div class="flex items-center gap-2">
                      <div class="i-tabler:truck text-lg" />
                      <span>快递配送</span>
                    </div>
                  </NRadio>
                  <NRadio value="self">
                    <div class="flex items-center gap-2">
                      <div class="i-tabler:shopping-bag text-lg" />
                      <span>到店自提</span>
                    </div>
                  </NRadio>
                  <NRadio value="delivery">
                    <div class="flex items-center gap-2">
                      <div class="i-tabler:motorbike text-lg" />
                      <span>同城配送</span>
                    </div>
                  </NRadio>
                </NSpace>
              </NRadioGroup>
            </DuxFormItem>

            <!-- 联系方式 -->
            <div class="space-y-4">
              <DuxFormItem label="联系人" path="contactName">
                <NInput
                  v-model:value="model.contactName"
                  placeholder="请输入联系人姓名"
                  size="large"
                />
              </DuxFormItem>

              <DuxFormItem label="联系电话" path="contactPhone">
                <NInput
                  v-model:value="model.contactPhone"
                  placeholder="请输入联系电话"
                  size="large"
                />
              </DuxFormItem>
            </div>
          </div>
        </DuxCard>
      </div>

      <!-- 右侧侧栏 -->
      <div class="xl:col-span-1 space-y-6">
        <!-- 产品预览 -->
        <DuxCard title="产品预览" header-bordered>
          <div class="space-y-4">
            <!-- 产品标题 -->
            <div>
              <NText tag="h4" class="font-medium">
                {{ model.title || '未设置标题' }}
              </NText>
              <NText depth="3" class="text-sm block mt-1">
                {{ model.subtitle || '未设置副标题' }}
              </NText>
            </div>

            <!-- 状态标签 -->
            <NSpace>
              <NTag :type="statusColor" size="small">
                {{ model.status === 'published' ? '已发布' : '草稿' }}
              </NTag>
              <NTag v-if="model.discount > 0" type="error" size="small">
                {{ model.discount }}% OFF
              </NTag>
            </NSpace>

            <NDivider />

            <!-- 价格统计 -->
            <div class="grid grid-cols-1 gap-4">
              <NStatistic label="销售价格" :value="model.price" :precision="2">
                <template #prefix>
                  ¥
                </template>
              </NStatistic>

              <NStatistic label="库存数量" :value="model.stock">
                <template #suffix>
                  件
                </template>
              </NStatistic>

              <NStatistic label="总价值" :value="totalValue" :precision="2">
                <template #prefix>
                  ¥
                </template>
              </NStatistic>
            </div>

            <NDivider />

            <!-- 规格信息 -->
            <div>
              <NText class="text-sm font-medium mb-2 block">
                规格参数
              </NText>
              <div class="grid grid-cols-1 gap-2 text-sm">
                <div class="flex justify-between">
                  <span class="text-gray-500">重量:</span>
                  <span>{{ model.weight || 0 }} kg</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-gray-500">尺寸:</span>
                  <span>{{ model.size.length || 0 }}×{{ model.size.width || 0 }}×{{ model.size.height || 0 }} cm</span>
                </div>
              </div>
            </div>
          </div>
        </DuxCard>

        <!-- 快捷操作 -->
        <DuxCard title="快捷操作" header-bordered>
          <NSpace vertical size="large">
            <NButton type="primary" size="large" block>
              <template #icon>
                <div class="i-tabler:device-floppy" />
              </template>
              保存草稿
            </NButton>

            <NButton type="success" size="large" block>
              <template #icon>
                <div class="i-tabler:send" />
              </template>
              发布产品
            </NButton>

            <NButton size="large" block>
              <template #icon>
                <div class="i-tabler:eye" />
              </template>
              预览效果
            </NButton>
          </NSpace>
        </DuxCard>

        <!-- 帮助信息 -->
        <DuxCard title="小贴士" header-bordered>
          <div class="space-y-3">
            <div class="flex items-start gap-2">
              <div class="i-tabler:bulb text-primary flex-shrink-0 mt-0.5" />
              <NText depth="3" class="text-sm">
                高质量的产品图片能显著提升转化率
              </NText>
            </div>
            <div class="flex items-start gap-2">
              <div class="i-tabler:tag text-primary flex-shrink-0 mt-0.5" />
              <NText depth="3" class="text-sm">
                合理的价格设置有助于产品销售
              </NText>
            </div>
            <div class="flex items-start gap-2">
              <div class="i-tabler:truck text-primary flex-shrink-0 mt-0.5" />
              <NText depth="3" class="text-sm">
                明确的配送方式提升用户体验
              </NText>
            </div>
          </div>
        </DuxCard>
      </div>
    </div>
  </DuxPageForm>
</template>

<style scoped>
/* 简洁的自定义样式 */
</style>
