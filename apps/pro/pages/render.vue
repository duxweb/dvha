<script setup>
import { useJsonSchema } from '@duxweb/dvha-core'
import { NButton, NCard, NCheckbox, NInput, NSelect, NSpace, NSwitch, NTag } from 'naive-ui'
import { computed, ref } from 'vue'
import Page from '../components/pages/page'

const data = ref({
  name: '张三',
  age: 18,
  gender: '男',
  address: '北京市海淀区',
  phone: '12345678901',
  email: 'zhangsan@example.com',
  isMarried: false,
  showDetails: true,
  selectedColor: 'blue',
  interests: ['编程', '阅读', '音乐'],
  counter: 0,
})

const interestOptions = ref([
  { label: '编程', value: '编程' },
  { label: '阅读', value: '阅读' },
  { label: '音乐', value: '音乐' },
  { label: '运动', value: '运动' },
  { label: '旅行', value: '旅行' },
  { label: '摄影', value: '摄影' },
])

const colorOptions = ref([
  { label: '蓝色', value: 'blue' },
  { label: '红色', value: 'red' },
  { label: '绿色', value: 'green' },
  { label: '紫色', value: 'purple' },
])

const testData = ref({
  user: {
    role: 'admin',
    permissions: ['read', 'write', 'delete'],
    settings: {
      theme: 'dark',
      language: 'zh-CN',
    },
  },
  app: {
    version: '1.0.0',
    debug: true,
  },
  numbers: [1, 2, 3, 4, 5],
  config: {
    maxItems: 3,
    showAdvanced: false,
  },
  utils: {
    formatRole: role => `角色：${role}`,
    checkPermission: (permissions, required) => permissions.includes(required),
    multiply: (a, b) => a * b,
  },
  globalFunction: data => `处理数据：${JSON.stringify(data)}`,
  mathFunc: x => x * 2 + 1,
})

const schema = computed(() => [
  {
    tag: 'n-card',
    attrs: {
      title: '全局数据访问测试',
      class: 'mb-4',
    },
    children: [
      {
        tag: 'div',
        attrs: {
          'v-if': 'testData.user.role === "admin"',
          'class': 'p-3 bg-green-50 rounded mb-3',
        },
        children: [
          {
            tag: 'h4',
            attrs: {
              class: 'text-green-600 mb-2',
            },
            children: '🔑 管理员专区',
          },
          {
            tag: 'p',
            children: '当前用户角色：{{testData.user.role}}',
          },
          {
            tag: 'p',
            children: '权限数量：{{testData.user.permissions.length}}',
          },
        ],
      },
      {
        tag: 'div',
        attrs: {
          'v-show': 'testData.app.debug',
          'class': 'p-3 bg-yellow-50 border border-yellow-200 rounded mb-3',
        },
        children: [
          {
            tag: 'h4',
            attrs: {
              class: 'text-yellow-600 mb-2',
            },
            children: '🐛 调试信息',
          },
          {
            tag: 'p',
            children: '应用版本：{{testData.app.version}}',
          },
          {
            tag: 'p',
            children: '主题设置：{{testData.user.settings.theme}}',
          },
          {
            tag: 'p',
            children: '语言设置：{{testData.user.settings.language}}',
          },
        ],
      },
      {
        tag: 'div',
        attrs: {
          'v-if': 'testData.user.permissions.includes("write")',
          'class': 'p-3 bg-blue-50 rounded',
        },
        children: [
          {
            tag: 'h4',
            attrs: {
              class: 'text-blue-600 mb-2',
            },
            children: '✏️ 编辑权限已开启',
          },
          {
            tag: 'n-button',
            attrs: {
              'type': 'primary',
              '@click': () => {
                testData.value.user.role = testData.value.user.role === 'admin' ? 'user' : 'admin'
              },
            },
            children: '切换角色 (当前: {{testData.user.role}})',
          },
        ],
      },
    ],
  },

  {
    tag: 'n-card',
    attrs: {
      title: '函数调用测试',
      class: 'mb-4',
    },
    children: [
      {
        tag: 'div',
        attrs: {
          'v-if': 'testData.utils.checkPermission(testData.user.permissions, "write")',
          'class': 'p-3 bg-green-50 rounded mb-3',
        },
        children: [
          {
            tag: 'h4',
            attrs: {
              class: 'text-green-600 mb-2',
            },
            children: '🔧 函数调用测试',
          },
          {
            tag: 'p',
            children: '{{testData.utils.formatRole(testData.user.role)}}',
          },
          {
            tag: 'p',
            children: '数学计算：2 * 3 = {{testData.utils.multiply(2, 3)}}',
          },
          {
            tag: 'p',
            children: '全局函数调用：{{testData.globalFunction(testData.user)}}',
          },
          {
            tag: 'p',
            children: '数学函数 f(5) = {{testData.mathFunc(5)}}',
          },
        ],
      },
      {
        tag: 'div',
        attrs: {
          'v-if': 'testData.numbers.length > 3',
          'class': 'p-3 bg-blue-50 rounded',
        },
        children: [
          {
            tag: 'p',
            children: '数组长度检查：{{testData.numbers.length}}',
          },
          {
            tag: 'p',
            children: '数组方法：{{testData.numbers.join(", ")}}',
          },
        ],
      },
    ],
  },

  {
    tag: 'n-card',
    attrs: {
      title: '基础信息',
      class: 'mb-4',
    },
    children: [
      {
        tag: 'div',
        attrs: {
          class: 'mb-2',
        },
        children: `姓名：${data.value.name}，年龄：${data.value.age}岁`,
      },
      {
        tag: 'n-space',
        attrs: {
          vertical: true,
          size: 'medium',
        },
        children: [
          {
            tag: 'n-input',
            attrs: {
              'v-model:value': [data.value, 'name'],
              'placeholder': '请输入姓名',
            },
            slots: {
              prefix: () => ({
                tag: 'span',
                children: '👤',
              }),
            },
          },
          {
            tag: 'n-input',
            attrs: {
              'v-model:value': [
                () => String(data.value.age),
                (val) => { data.value.age = Number(val) || 0 },
              ],
              'placeholder': '请输入年龄',
              'type': 'number',
            },
            slots: {
              prefix: () => ({
                tag: 'span',
                children: '🎂',
              }),
            },
          },
        ],
      },
    ],
  },

  {
    tag: 'n-card',
    attrs: {
      title: '条件渲染示例 (v-if/v-else)',
      class: 'mb-4',
    },
    children: [
      {
        tag: 'n-switch',
        attrs: {
          'v-model:value': [data.value, 'showDetails'],
        },
        children: '显示详细信息',
      },
      {
        tag: 'div',
        attrs: {
          'v-if': data.value.showDetails,
          'class': 'mt-3 p-3 bg-blue-50 rounded',
        },
        children: [
          {
            tag: 'h4',
            children: '详细信息',
          },
          {
            tag: 'p',
            children: `地址：${data.value.address}`,
          },
          {
            tag: 'p',
            children: `电话：${data.value.phone}`,
          },
          {
            tag: 'p',
            children: `邮箱：${data.value.email}`,
          },
        ],
      },
      {
        tag: 'div',
        attrs: {
          'v-else': true,
          'class': 'mt-3 p-3 bg-gray-100 rounded text-gray-500',
        },
        children: '详细信息已隐藏',
      },
    ],
  },

  {
    tag: 'n-card',
    attrs: {
      title: 'v-show 显示隐藏示例',
      class: 'mb-4',
    },
    children: [
      {
        tag: 'n-checkbox',
        attrs: {
          'v-model:checked': [data.value, 'isMarried'],
        },
        children: '已婚',
      },
      {
        tag: 'div',
        attrs: {
          'v-show': data.value.isMarried,
          'class': 'mt-2 p-2 bg-pink-50 rounded',
        },
        children: '💑 恭喜！已婚人士可享受特殊福利',
      },
    ],
  },

  {
    tag: 'n-card',
    attrs: {
      title: 'v-for 循环渲染示例',
      class: 'mb-4',
    },
    children: [
      {
        tag: 'h4',
        attrs: {
          class: 'mb-2',
        },
        children: '兴趣爱好：',
      },
      {
        tag: 'n-space',
        children: [
          {
            tag: 'n-tag',
            attrs: {
              'v-for': data.value.interests,
              'type': 'info',
              'round': true,
            },
            children: '{{item}}',
          },
        ],
      },
      {
        tag: 'div',
        attrs: {
          class: 'mt-3',
        },
        children: '选择更多兴趣：',
      },
      {
        tag: 'n-select',
        attrs: {
          'v-model:value': [data.value, 'interests'],
          'options': interestOptions.value,
          'multiple': true,
          'placeholder': '选择兴趣爱好',
          'class': 'mt-2',
        },
      },
    ],
  },

  // v-on 事件处理示例
  {
    tag: 'n-card',
    attrs: {
      title: 'v-on 事件处理示例',
      class: 'mb-4',
    },
    children: [
      {
        tag: 'div',
        attrs: {
          class: 'mb-3',
        },
        children: `计数器：${data.value.counter}`,
      },
      {
        tag: 'n-space',
        children: [
          {
            tag: 'n-button',
            attrs: {
              '@click': () => data.value.counter++,
              'type': 'primary',
            },
            children: '增加',
          },
          {
            tag: 'n-button',
            attrs: {
              '@click': () => data.value.counter--,
              'type': 'default',
            },
            children: '减少',
          },
          {
            tag: 'n-button',
            attrs: {
              '@click': () => data.value.counter = 0,
              'type': 'warning',
            },
            children: '重置',
          },
          {
            tag: 'n-button',
            attrs: {
              '@click.stop': (e) => {
                e.preventDefault()
                // 查看当前计数值
                data.value.name = `${data.value.name} (计数:${data.value.counter})`
              },
              'type': 'info',
            },
            children: '查看 (阻止冒泡)',
          },
        ],
      },
    ],
  },

  // 文本插值示例
  {
    tag: 'n-card',
    attrs: {
      title: '文本插值示例',
      class: 'mb-4',
    },
    children: [
      {
        tag: 'n-select',
        attrs: {
          'v-model:value': [data.value, 'selectedColor'],
          'options': colorOptions.value,
          'placeholder': '选择颜色',
          'class': 'mb-3',
        },
      },
      {
        tag: 'div',
        attrs: {
          class: `p-3 rounded bg-${data.value.selectedColor}-100 border-${data.value.selectedColor}-300 border`,
        },
        children: `您选择的颜色是：${data.value.selectedColor}`,
      },
    ],
  },

  // 综合示例：条件 + 循环 + 事件
  {
    tag: 'n-card',
    attrs: {
      title: '综合示例',
      class: 'mb-4',
    },
    children: [
      {
        tag: 'div',
        attrs: {
          'v-if': data.value.age >= 18,
        },
        children: [
          {
            tag: 'h4',
            attrs: {
              class: 'text-green-600 mb-2',
            },
            children: '🎉 成年人专区',
          },
          {
            tag: 'div',
            attrs: {
              'v-if': data.value.interests.length > 0,
            },
            children: [
              {
                tag: 'p',
                children: '您的兴趣标签：',
              },
              {
                tag: 'div',
                attrs: {
                  class: 'flex gap-2 flex-wrap',
                },
                children: [
                  {
                    tag: 'n-tag',
                    attrs: {
                      'v-for': data.value.interests,
                      'type': 'success',
                      'round': true,
                    },
                    children: '{{item}}',
                  },
                ],
              },
            ],
          },
          {
            tag: 'div',
            attrs: {
              'v-else': true,
              'class': 'text-gray-500',
            },
            children: '还没有添加兴趣爱好哦~',
          },
        ],
      },
      {
        tag: 'div',
        attrs: {
          'v-else': true,
          'class': 'text-orange-600',
        },
        children: '👶 未成年用户，部分功能受限',
      },
    ],
  },

  // slot 插槽示例
  {
    tag: 'n-card',
    attrs: {
      title: '插槽示例',
      class: 'mb-4',
    },
    children: [
      {
        tag: 'n-input',
        attrs: {
          'v-model:value': [data.value, 'phone'],
          'placeholder': '请输入手机号',
        },
        slots: {
          prefix: () => ({
            tag: 'n-tag',
            attrs: {
              size: 'small',
              type: 'info',
            },
            children: '📱',
          }),
          suffix: () => ({
            tag: 'n-button',
            attrs: {
              'size': 'small',
              '@click': () => {
                if (data.value.phone.length === 11) {
                  data.value.email = '验证通过✅'
                }
                else {
                  data.value.email = '请输入11位手机号❌'
                }
              },
            },
            children: '验证',
          }),
        },
      },
    ],
  },

  // 数字显示示例
  {
    tag: 'n-card',
    attrs: {
      title: '动态数字显示',
      class: 'mb-4',
    },
    children: [
      {
        tag: 'div',
        attrs: {
          class: 'mb-3',
        },
        children: `当前计数：${data.value.counter}`,
      },
      {
        tag: 'n-space',
        attrs: {
          class: 'mb-3',
        },
        children: [
          {
            tag: 'n-button',
            attrs: {
              '@click': () => data.value.counter++,
              'type': 'primary',
              'size': 'small',
            },
            children: '+1',
          },
          {
            tag: 'n-button',
            attrs: {
              '@click': () => data.value.counter += 5,
              'type': 'info',
              'size': 'small',
            },
            children: '+5',
          },
          {
            tag: 'n-button',
            attrs: {
              '@click': () => data.value.counter -= 1,
              'type': 'warning',
              'size': 'small',
            },
            children: '-1',
          },
          {
            tag: 'n-button',
            attrs: {
              '@click': () => data.value.counter = Math.max(0, data.value.counter - 5),
              'type': 'error',
              'size': 'small',
            },
            children: '-5',
          },
        ],
      },
      {
        tag: 'div',
        attrs: {
          class: 'p-3 bg-gray-50 rounded',
        },
        children: [
          {
            tag: 'p',
            attrs: {
              class: 'mb-2 text-sm text-gray-600',
            },
            children: '动态计算结果：',
          },
          {
            tag: 'n-tag',
            attrs: {
              type: 'primary',
              size: 'large',
            },
            children: `${data.value.counter}² = ${data.value.counter * data.value.counter}`,
          },
          {
            tag: 'div',
            attrs: {
              class: 'mt-2',
            },
            children: [
              {
                tag: 'n-tag',
                attrs: {
                  type: 'success',
                  class: 'mr-2',
                },
                children: `✕2 = ${data.value.counter * 2}`,
              },
              {
                tag: 'n-tag',
                attrs: {
                  type: 'warning',
                },
                children: `÷2 = ${(data.value.counter / 2).toFixed(1)}`,
              },
            ],
          },
        ],
      },
    ],
  },

  // v-for 数字列表示例
  {
    tag: 'n-card',
    attrs: {
      title: 'v-for 数字列表示例',
      class: 'mb-4',
    },
    children: [
      {
        tag: 'p',
        attrs: {
          class: 'mb-2',
        },
        children: '数字 1-5 的列表：',
      },
      {
        tag: 'n-space',
        children: [
          {
            tag: 'n-tag',
            attrs: {
              'v-for': [1, 2, 3, 4, 5],
              'type': 'primary',
              'round': true,
            },
            children: 'Number: {{item}}',
          },
        ],
      },
      {
        tag: 'div',
        attrs: {
          class: 'mt-3',
        },
        children: '使用对象格式的 v-for：',
      },
      {
        tag: 'n-space',
        children: [
          {
            tag: 'n-tag',
            attrs: {
              'v-for': {
                list: ['红色', '绿色', '蓝色'],
                item: 'color',
                index: 'idx',
              },
              'type': 'info',
            },
            children: '{{idx}}: {{color}}',
          },
        ],
      },
    ],
  },
])

const { render } = useJsonSchema({
  data: schema,
  context: { testData },
  components: {
    'n-input': NInput,
    'n-button': NButton,
    'n-select': NSelect,
    'n-switch': NSwitch,
    'n-card': NCard,
    'n-space': NSpace,
    'n-tag': NTag,
    'n-checkbox': NCheckbox,
  },
})
</script>

<template>
  <Page>
    <div class="max-w-4xl mx-auto p-4">
      <h1 class="text-2xl font-bold mb-6 text-center">
        useJsonSchema 适配器测试页面
      </h1>
      <component :is="render" />
    </div>
  </Page>
</template>

<style scoped>
</style>
