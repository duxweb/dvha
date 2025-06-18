<script setup lang="ts">
import { DuxFormItem, DuxFormLayout, DuxPanelAlert, DuxPanelCard, DuxSettingForm } from '@duxweb/dvha-pro'
import { NButton, NTabPane } from 'naive-ui'
import { ref } from 'vue'

const form = ref({
  nickname: '',
})
</script>

<template>
  <DuxSettingForm default-tab="account" tabs>
    <NTabPane name="account" tab="账号信息" animated>
      <DuxPanelCard title="个人资料" description="公开的个人资料信息显示">
        <template #actions>
          <NButton secondary type="primary">
            保存资料
          </NButton>
        </template>
        <DuxFormLayout class="p-6 pb-2" divider label-placement="setting" label-align="right">
          <DuxFormItem label="昵称" description="昵称是您在系统中的唯一标识，用于显示和识别。" path="nickname" rule="required">
            <NInput v-model:value="form.nickname" class="w-full" />
          </DuxFormItem>
          <DuxFormItem label="昵称" path="nickname" rule="required">
            <NInput v-model:value="form.nickname" />
          </DuxFormItem>
          <DuxFormItem label="昵称" path="nickname" rule="required">
            <NInput v-model:value="form.nickname" />
          </DuxFormItem>
          <DuxFormItem label="昵称" path="nickname" rule="required">
            <NInput v-model:value="form.nickname" />
          </DuxFormItem>
          <DuxFormItem label="昵称" path="nickname" rule="required">
            <NInput v-model:value="form.nickname" />
          </DuxFormItem>
          <DuxFormItem label="昵称" path="nickname" rule="required">
            <NInput v-model:value="form.nickname" />
          </DuxFormItem>
        </DuxFormLayout>
      </DuxPanelCard>
      <DuxPanelAlert type="error" class="mt-4" title="账号删除" description="您可以删除您的账号，但请注意，删除后将无法恢复。">
        <template #actions>
          <NButton type="error">
            删除账号
          </NButton>
        </template>
      </DuxPanelAlert>
    </NTabPane>
    <NTabPane name="security" tab="安全设置" />
    <NTabPane name="notification" tab="通知设置" />
    <NTabPane name="privacy" tab="隐私设置" />
    <NTabPane name="other" tab="其他设置" />
  </DuxSettingForm>
</template>
