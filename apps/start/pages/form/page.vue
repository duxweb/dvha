<script setup lang="ts">
import { DuxCard, DuxFormItem, DuxFormLayout, DuxPageForm } from '@duxweb/dvha-pro'
import { NInput, NInputNumber, NRadio, NRadioGroup, NSelect, NUpload, NUploadDragger } from 'naive-ui'
import { ref } from 'vue'

const props = defineProps<{
  id?: string | number
}>()

const model = ref({
  // 基本信息
  title: '新产品',
  subtitle: '',
  category: null,
  tags: [],
  isPublished: true,
  publishDate: null,

  // 详细信息
  price: 0,
  stock: 100,
  discount: 0,
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

  // 其他设置
  deliveryMethod: 'express',
  description: '',
  remarks: '',

  // 排序
  sort: 0,
})

const categoryOptions = [
  { label: '电子产品', value: 'electronics' },
  { label: '服装', value: 'clothing' },
  { label: '食品', value: 'food' },
  { label: '书籍', value: 'books' },
]

const tagOptions = [
  { label: '新品', value: 'new' },
  { label: '热销', value: 'hot' },
  { label: '促销', value: 'sale' },
  { label: '限量', value: 'limited' },
]
</script>

<template>
  <DuxPageForm :id="props.id" title="产品管理" :data="model" path="product">
    <div class="flex flex-col gap-2">
      <!-- 基本信息卡片 -->
      <DuxCard
        title="基本信息"
        description="请填写产品的基本信息"
        header-bordered
      >
        <DuxFormLayout label-placement="top" class="grid grid-cols-2 gap-6 p-2">
          <DuxFormItem label="产品名称" path="title" rule="required">
            <NInput v-model:value="model.title" placeholder="请输入产品名称" />
          </DuxFormItem>

          <DuxFormItem label="副标题" path="subtitle">
            <NInput v-model:value="model.subtitle" placeholder="请输入副标题" />
          </DuxFormItem>

          <DuxFormItem label="产品分类" path="category" rule="required">
            <NSelect v-model:value="model.category" :options="categoryOptions" placeholder="请选择产品分类" />
          </DuxFormItem>

          <DuxFormItem label="产品标签" path="tags">
            <NSelect v-model:value="model.tags" :options="tagOptions" multiple placeholder="请选择产品标签" />
          </DuxFormItem>
        </DuxFormLayout>
      </DuxCard>

      <!-- 价格与库存卡片 -->
      <DuxCard
        title="价格与库存"
        description="请设置产品价格和库存信息"
        header-bordered
      >
        <DuxFormLayout label-placement="top" class="grid grid-cols-3 gap-6 p-2">
          <DuxFormItem label="价格" path="price" rule="required|numeric">
            <NInputNumber v-model:value="model.price" :min="0" :precision="2" style="width: 100%" />
          </DuxFormItem>

          <DuxFormItem label="库存" path="stock" rule="required|integer">
            <NInputNumber v-model:value="model.stock" :min="0" :precision="0" style="width: 100%" />
          </DuxFormItem>

          <DuxFormItem label="折扣" path="discount">
            <NInputNumber v-model:value="model.discount" :min="0" :max="100" :precision="0" style="width: 100%" />
          </DuxFormItem>
        </DuxFormLayout>
      </DuxCard>

      <!-- 规格参数卡片 -->
      <DuxCard
        title="规格参数"
        description="请填写产品的规格参数"
        header-bordered
      >
        <DuxFormLayout label-placement="top" class="grid grid-cols-3 gap-6 p-2">
          <DuxFormItem label="重量(kg)" path="weight">
            <NInputNumber v-model:value="model.weight" :min="0" :precision="2" style="width: 100%" />
          </DuxFormItem>

          <DuxFormItem label="长度(cm)" path="size.length">
            <NInputNumber v-model:value="model.size.length" :min="0" :precision="1" style="width: 100%" />
          </DuxFormItem>

          <DuxFormItem label="宽度(cm)" path="size.width">
            <NInputNumber v-model:value="model.size.width" :min="0" :precision="1" style="width: 100%" />
          </DuxFormItem>

          <DuxFormItem label="高度(cm)" path="size.height">
            <NInputNumber v-model:value="model.size.height" :min="0" :precision="1" style="width: 100%" />
          </DuxFormItem>
        </DuxFormLayout>
      </DuxCard>

      <!-- 产品图片卡片 -->
      <DuxCard
        title="产品图片"
        description="请上传产品图片"
        header-bordered
      >
        <DuxFormLayout label-placement="top" class="grid grid-cols-1 gap-2 p-2">
          <DuxFormItem label="产品图片" path="images">
            <NUpload multiple>
              <NUploadDragger>
                <div class="flex flex-col items-center justify-center py-6">
                  <div class="i-tabler:upload text-3xl text-green-500 mb-2" />
                  <p>点击或拖拽文件到此区域上传</p>
                  <p class="text-xs text-muted mt-1">
                    支持JPG、PNG格式，单张不超过2MB
                  </p>
                </div>
              </NUploadDragger>
            </NUpload>
          </DuxFormItem>
        </DuxFormLayout>
      </DuxCard>

      <!-- 配送信息卡片 -->
      <DuxCard
        title="配送信息"
        description="请设置配送相关信息"
        header-bordered
      >
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 p-2">
          <div>
            <DuxFormLayout label-placement="top" class="grid grid-cols-1 gap-2">
              <DuxFormItem label="配送方式" path="deliveryMethod">
                <NRadioGroup v-model:value="model.deliveryMethod">
                  <div class="flex flex-col gap-2">
                    <NRadio value="express">
                      <div class="flex items-center gap-2">
                        <div class="i-tabler:truck text-lg text-primary" />
                        <span>快递</span>
                      </div>
                    </NRadio>
                    <NRadio value="self">
                      <div class="flex items-center gap-2">
                        <div class="i-tabler:shopping-bag text-lg text-primary" />
                        <span>自提</span>
                      </div>
                    </NRadio>
                    <NRadio value="delivery">
                      <div class="flex items-center gap-2">
                        <div class="i-tabler:motorbike text-lg text-primary" />
                        <span>同城配送</span>
                      </div>
                    </NRadio>
                  </div>
                </NRadioGroup>
              </DuxFormItem>
            </DuxFormLayout>
          </div>

          <div>
            <DuxFormLayout label-placement="top" class="grid grid-cols-1 gap-2">
              <DuxFormItem label="联系人" path="contactName">
                <NInput v-model:value="model.contactName" placeholder="请输入联系人姓名" />
              </DuxFormItem>

              <DuxFormItem label="联系电话" path="contactPhone">
                <NInput v-model:value="model.contactPhone" placeholder="请输入联系电话" />
              </DuxFormItem>
            </DuxFormLayout>
          </div>
        </div>
      </DuxCard>
    </div>
  </DuxPageForm>
</template>

<style scoped>
</style>
