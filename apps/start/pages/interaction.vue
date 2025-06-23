<script setup lang="ts">
import { DuxCard, DuxPage, useDialog, useDrawer, useModal } from '@duxweb/dvha-pro'
import {
  NAlert,
  NButton,
  NDropdown,
  NInput,
  NPopconfirm,
  NPopover,
  NSwitch,
  NTooltip,
  useLoadingBar,
  useMessage,
  useDialog as useNaiveDialog,
  useNotification,
} from 'naive-ui'
import { h } from 'vue'

// 基础数据（已删除不使用的变量）

// NaiveUI 交互 hooks
const message = useMessage()
const notification = useNotification()
const naiveDialog = useNaiveDialog()
const loadingBar = useLoadingBar()

// Pro 库交互 hooks
const modal = useModal()
const dialog = useDialog()
const drawer = useDrawer()

// 消息通知方法
function showMessage(type: 'info' | 'success' | 'warning' | 'error') {
  const messages = {
    info: '这是一条信息消息',
    success: '操作成功！',
    warning: '请注意这个警告',
    error: '操作失败，请重试',
  }
  message[type](messages[type])
}

// 通知方法
function showNotification(type: 'info' | 'success' | 'warning' | 'error') {
  const notifications = {
    info: { title: '信息通知', content: '这是一条信息通知，用于展示一般性信息' },
    success: { title: '成功通知', content: '操作已成功完成，数据已保存' },
    warning: { title: '警告通知', content: '请注意，某些操作可能存在风险' },
    error: { title: '错误通知', content: '操作失败，请检查网络连接或联系管理员' },
  }
  notification[type](notifications[type])
}

// NaiveUI 对话框
function showNaiveDialog(type: 'info' | 'success' | 'warning' | 'error') {
  const dialogs = {
    info: { title: '信息对话框', content: '这是一个信息对话框，用于展示重要信息' },
    success: { title: '成功对话框', content: '操作成功完成！' },
    warning: { title: '警告对话框', content: '请确认是否继续此操作？' },
    error: { title: '错误对话框', content: '发生了错误，请重试或联系技术支持' },
  }
  naiveDialog[type](dialogs[type])
}

// 加载条
function showLoadingBar() {
  loadingBar.start()
  setTimeout(() => {
    loadingBar.finish()
  }, 2000)
}

function showErrorLoadingBar() {
  loadingBar.start()
  setTimeout(() => {
    loadingBar.error()
  }, 2000)
}

// Pro Modal 示例
function showModal() {
  modal.show({
    title: '异步框示例',
    width: '600px',
    component: () => import('./form/modal.vue'),
    componentProps: {
      message: '这是一个 Pro 模态框示例',
    },
  })
}

function showSimpleModal() {
  modal.show({
    title: '简单内容模态框',
    width: '500px',
    component: () => Promise.resolve({
      setup() {
        return () => h('div', { class: 'p-6' }, [
          h('h3', { class: 'text-lg font-semibold mb-4' }, '模态框内容'),
          h('p', { class: 'text-muted mb-4' }, '这是一个简单的模态框内容示例。'),
          h('div', { class: 'flex justify-end gap-2' }, [
            h(NButton, {
              onClick: () => {
                message.success('操作成功')
              },
            }, { default: () => '确定' }),
          ]),
        ])
      },
    }),
  })
}

// Pro Dialog 示例
function showProDialog(type: 'confirm' | 'success' | 'error') {
  const dialogs = {
    confirm: {
      title: '确认操作',
      content: '确定要执行这个操作吗？此操作不可撤销。',
    },
    success: {
      title: '操作成功',
      content: '您的操作已成功完成！',
    },
    error: {
      title: '操作失败',
      content: '操作执行失败，请稍后重试。',
    },
  }

  dialog[type](dialogs[type]).then(() => {
    if (type === 'confirm') {
      message.success('已确认操作')
    }
  }).catch(() => {
    if (type === 'confirm') {
      message.info('已取消操作')
    }
  })
}

function showPromptDialog() {
  dialog.prompt({
    title: '输入信息',
    formSchema: [
      {
        name: 'username',
        label: '用户名',
        tag: NInput,
        required: true,
        placeholder: '请输入用户名',
      },
      {
        name: 'email',
        label: '邮箱',
        tag: NInput,
        required: true,
        placeholder: '请输入邮箱地址',
      },
    ],
  }).then((result) => {
    message.success(`用户名: ${result.username}, 邮箱: ${result.email}`)
  }).catch(() => {
    message.info('已取消输入')
  })
}

function showNodeDialog() {
  dialog.node({
    title: '自定义内容对话框',
    render: () => h('div', { class: 'p-4' }, [
      h('div', { class: 'mb-4' }, [
        h('h4', { class: 'text-base font-medium mb-2' }, '自定义内容'),
        h('p', { class: 'text-sm text-muted' }, '这是一个包含自定义 Vue 节点的对话框。'),
      ]),
      h('div', { class: 'grid grid-cols-2 gap-4' }, [
        h('div', { class: 'p-3 bg-blue-50 rounded' }, [
          h('div', { class: 'text-sm font-medium text-blue-800' }, '信息卡片'),
          h('div', { class: 'text-xs text-blue-600 mt-1' }, '这是一个信息卡片'),
        ]),
        h('div', { class: 'p-3 bg-green-50 rounded' }, [
          h('div', { class: 'text-sm font-medium text-green-800' }, '状态卡片'),
          h('div', { class: 'text-xs text-green-600 mt-1' }, '状态正常'),
        ]),
      ]),
    ]),
  }).then(() => {
    message.success('对话框已确认')
  })
}

// Pro Drawer 示例
function showDrawer() {
  drawer.show({
    title: '抽屉示例',
    width: '400px',
    component: () => Promise.resolve({
      setup() {
        return () => h('div', { class: 'p-6' }, [
          h('h3', { class: 'text-lg font-semibold mb-4' }, '抽屉内容'),
          h('p', { class: 'text-muted mb-4' }, '这是一个 Pro 抽屉组件示例。'),
          h('div', { class: 'space-y-3' }, [
            h('div', { class: 'flex items-center justify-between p-3 rounded' }, [
              h('span', { class: 'text-sm' }, '设置项 1'),
              h(NSwitch, { defaultValue: true }),
            ]),
            h('div', { class: 'flex items-center justify-between p-3 rounded' }, [
              h('span', { class: 'text-sm' }, '设置项 2'),
              h(NSwitch, { defaultValue: false }),
            ]),
            h('div', { class: 'flex items-center justify-between p-3 rounded' }, [
              h('span', { class: 'text-sm' }, '设置项 3'),
              h(NSwitch, { defaultValue: true }),
            ]),
          ]),
        ])
      },
    }),
  })
}

// 下拉菜单选项
const dropdownOptions = [
  {
    label: '编辑',
    key: 'edit',
  },
  {
    label: '复制',
    key: 'copy',
  },
  {
    label: '删除',
    key: 'delete',
  },
]

function handleDropdownSelect(key: string) {
  message.info(`选择了: ${key}`)
}

// 确认操作
function handleConfirm() {
  message.success('确认操作')
}

function handleCancel() {
  message.info('取消操作')
}
</script>

<template>
  <DuxPage :card="false">
    <div class="max-w-6xl mx-auto p-4">
      <div class="flex flex-col gap-4">
        <!-- Pro 库交互组件 -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <!-- Modal 模态框 -->
          <DuxCard title="Modal 模态框" description="支持异步组件的模态框组件">
            <div class="flex flex-col gap-3">
              <NButton block @click="showModal">
                复杂模态框
              </NButton>
              <NButton block @click="showSimpleModal">
                简单模态框
              </NButton>
            </div>
          </DuxCard>

          <!-- Dialog 对话框 -->
          <DuxCard title="Dialog 对话框" description="Pro 库提供的高级对话框组件">
            <div class="flex flex-col gap-3">
              <NButton block @click="showProDialog('confirm')">
                确认对话框
              </NButton>
              <NButton block @click="showProDialog('success')">
                成功对话框
              </NButton>
              <NButton block @click="showProDialog('error')">
                错误对话框
              </NButton>
              <NButton block @click="showPromptDialog">
                表单对话框
              </NButton>
              <NButton block @click="showNodeDialog">
                自定义对话框
              </NButton>
            </div>
          </DuxCard>

          <!-- Drawer 抽屉 -->
          <DuxCard title="Drawer 抽屉" description="侧边滑出的抽屉组件">
            <div class="flex flex-col gap-3">
              <NButton block @click="showDrawer">
                显示抽屉
              </NButton>
            </div>
          </DuxCard>
        </div>

        <!-- NaiveUI 交互组件 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <!-- 消息通知 -->
          <DuxCard title="消息通知" description="轻量级的消息提示，用于操作反馈">
            <div class="flex flex-col gap-3">
              <NButton type="info" block @click="showMessage('info')">
                信息消息
              </NButton>
              <NButton type="success" block @click="showMessage('success')">
                成功消息
              </NButton>
              <NButton type="warning" block @click="showMessage('warning')">
                警告消息
              </NButton>
              <NButton type="error" block @click="showMessage('error')">
                错误消息
              </NButton>
            </div>
          </DuxCard>

          <!-- 通知 -->
          <DuxCard title="通知" description="显示在页面右上角的通知消息">
            <div class="flex flex-col gap-3">
              <NButton type="info" block @click="showNotification('info')">
                信息通知
              </NButton>
              <NButton type="success" block @click="showNotification('success')">
                成功通知
              </NButton>
              <NButton type="warning" block @click="showNotification('warning')">
                警告通知
              </NButton>
              <NButton type="error" block @click="showNotification('error')">
                错误通知
              </NButton>
            </div>
          </DuxCard>

          <!-- NaiveUI 对话框 -->
          <DuxCard title="NaiveUI 对话框" description="系统级别的对话框组件">
            <div class="flex flex-col gap-3">
              <NButton type="info" block @click="showNaiveDialog('info')">
                信息对话框
              </NButton>
              <NButton type="success" block @click="showNaiveDialog('success')">
                成功对话框
              </NButton>
              <NButton type="warning" block @click="showNaiveDialog('warning')">
                警告对话框
              </NButton>
              <NButton type="error" block @click="showNaiveDialog('error')">
                错误对话框
              </NButton>
            </div>
          </DuxCard>

          <!-- 加载条 -->
          <DuxCard title="加载条" description="页面顶部的加载进度条">
            <div class="flex flex-col gap-3">
              <NButton type="primary" block @click="showLoadingBar">
                显示加载条
              </NButton>
              <NButton type="error" block @click="showErrorLoadingBar">
                显示错误加载条
              </NButton>
            </div>
          </DuxCard>
        </div>

        <!-- 其他交互组件 -->
        <DuxCard title="其他交互组件" description="更多交互式组件示例">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <!-- 确认弹出框 -->
            <div class="flex flex-col gap-2">
              <div class="text-sm font-medium">
                确认弹出框
              </div>
              <NPopconfirm
                @positive-click="handleConfirm"
                @negative-click="handleCancel"
              >
                <template #trigger>
                  <NButton>删除项目</NButton>
                </template>
                确定要删除这个项目吗？
              </NPopconfirm>
            </div>

            <!-- 工具提示 -->
            <div class="flex flex-col gap-2">
              <div class="text-sm font-medium">
                工具提示
              </div>
              <NTooltip trigger="hover">
                <template #trigger>
                  <NButton>悬停查看提示</NButton>
                </template>
                这是一个工具提示，提供额外的信息说明
              </NTooltip>
            </div>

            <!-- 下拉菜单 -->
            <div class="flex flex-col gap-2">
              <div class="text-sm font-medium">
                下拉菜单
              </div>
              <NDropdown
                :options="dropdownOptions"
                @select="handleDropdownSelect"
              >
                <NButton>操作菜单</NButton>
              </NDropdown>
            </div>

            <!-- 弹出框 -->
            <div class="flex flex-col gap-2">
              <div class="text-sm font-medium">
                弹出框
              </div>
              <NPopover trigger="click">
                <template #trigger>
                  <NButton>点击弹出</NButton>
                </template>
                <div class="p-2">
                  <div class="text-sm font-medium mb-2">
                    弹出框内容
                  </div>
                  <div class="text-muted text-xs">
                    这是一个弹出框，可以包含更复杂的内容和交互
                  </div>
                  <div class="mt-2 flex gap-2">
                    <NButton size="small" type="primary">
                      确定
                    </NButton>
                    <NButton size="small">
                      取消
                    </NButton>
                  </div>
                </div>
              </NPopover>
            </div>
          </div>
        </DuxCard>

        <!-- 警告提示 -->
        <DuxCard title="警告提示" description="页面内的警告和提示组件">
          <div class="flex flex-col gap-4">
            <NAlert title="信息提示" type="info">
              这是一个信息提示，用于展示一般性信息
            </NAlert>
            <NAlert title="成功提示" type="success" closable>
              这是一个成功提示，操作已成功完成
            </NAlert>
            <NAlert title="警告提示" type="warning" closable>
              这是一个警告提示，请注意相关风险
            </NAlert>
            <NAlert title="错误提示" type="error" closable>
              这是一个错误提示，操作失败请重试
            </NAlert>
          </div>
        </DuxCard>
      </div>
    </div>
  </DuxPage>
</template>
