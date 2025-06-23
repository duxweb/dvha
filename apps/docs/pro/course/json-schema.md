# JSON Schema 动态表单

本教程将教你如何使用 DVHA Pro 的 JSON Schema 渲染器来创建动态表单和界面，实现配置驱动的前端开发。

## 📋 前置条件

- 已完成 [第一个页面](/pro/course/start) 教程
- 了解 JSON 和 Vue 基础概念
- 理解响应式编程思想

## 🎯 目标效果

完成本教程后，你将能够：
- 🎨 使用 JSON 配置动态生成表单
- 📊 实现数据驱动的界面渲染
- 🔄 掌握响应式数据绑定
- 🎪 使用条件渲染和循环渲染

## 💡 JSON Schema 特点

DVHA Pro 的 JSON Schema 渲染器具有以下特点：

- **配置驱动**：通过 JSON 配置生成复杂界面
- **响应式绑定**：完整支持 Vue 响应式数据
- **指令支持**：支持 v-if、v-for、v-model 等指令
- **组件映射**：灵活的组件注册机制

## 🔧 第一步：基础动态表单

创建 `src/pages/json-schema/basic.vue` 页面，实现基础动态表单：

```vue
<script setup>
import { useJsonSchema } from '@duxweb/dvha-core'
import { DuxCard } from '@duxweb/dvha-pro'
import { NButton, NForm, NFormItem, NInput, NSelect } from 'naive-ui'
import { computed, ref } from 'vue'

// 表单数据
const formData = ref({
  name: '',
  email: '',
  department: '',
  position: ''
})

// 部门选项
const departments = ref([
  { label: '技术部', value: 'tech' },
  { label: '产品部', value: 'product' },
  { label: '运营部', value: 'operation' },
  { label: '市场部', value: 'marketing' }
])

// JSON Schema 配置
const formSchema = computed(() => [
  {
    tag: 'n-card',
    attrs: {
      title: '员工信息表单'
    },
    children: [
      {
        tag: 'n-form',
        attrs: {
          'model': formData.value,
          'label-placement': 'left',
          'label-width': 100
        },
        children: [
          {
            tag: 'n-form-item',
            attrs: {
              label: '姓名',
              path: 'name'
            },
            children: [
              {
                tag: 'n-input',
                attrs: {
                  'v-model:value': [formData.value, 'name'],
                  'placeholder': '请输入姓名'
                }
              }
            ]
          },
          {
            tag: 'n-form-item',
            attrs: {
              label: '邮箱',
              path: 'email'
            },
            children: [
              {
                tag: 'n-input',
                attrs: {
                  'v-model:value': [formData.value, 'email'],
                  'placeholder': '请输入邮箱'
                }
              }
            ]
          },
          {
            tag: 'n-form-item',
            attrs: {
              label: '部门',
              path: 'department'
            },
            children: [
              {
                tag: 'n-select',
                attrs: {
                  'v-model:value': [formData.value, 'department'],
                  'options': departments.value,
                  'placeholder': '请选择部门'
                }
              }
            ]
          },
          {
            tag: 'n-form-item',
            children: [
              {
                tag: 'n-button',
                attrs: {
                  'type': 'primary',
                  '@click': () => {
                    console.log('表单数据:', formData.value)
                  }
                },
                children: '提交表单'
              }
            ]
          }
        ]
      }
    ]
  }
])

// 渲染器
const { render } = useJsonSchema({
  data: formSchema,
  context: {
    form: formData,
    departments
  },
  components: {
    'n-card': DuxCard,
    'n-form': NForm,
    'n-form-item': NFormItem,
    'n-input': NInput,
    'n-select': NSelect,
    'n-button': NButton
  }
})
</script>

<template>
  <div class="p-6">
    <component :is="render" />

    <!-- 表单数据预览 -->
    <DuxCard title="表单数据" class="mt-6">
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </DuxCard>
  </div>
</template>
```

## 🔄 第二步：条件渲染表单

创建 `src/pages/json-schema/conditional.vue` 页面，实现条件渲染：

```vue
<script setup>
import { useJsonSchema } from '@duxweb/dvha-core'
import { DuxCard } from '@duxweb/dvha-pro'
import { NButton, NCheckbox, NForm, NFormItem, NInput, NSelect, NSwitch } from 'naive-ui'
import { computed, ref } from 'vue'

// 表单数据
const formData = ref({
  userType: 'employee',
  isVip: false,
  name: '',
  companyName: '',
  vipLevel: '',
  showAdvanced: false
})

// VIP 等级选项
const vipLevels = ref([
  { label: '银卡', value: 'silver' },
  { label: '金卡', value: 'gold' },
  { label: '钻石卡', value: 'diamond' }
])

// JSON Schema 配置
const conditionalSchema = computed(() => [
  {
    tag: 'n-card',
    attrs: {
      title: '条件渲染表单'
    },
    children: [
      {
        tag: 'n-form',
        attrs: {
          'model': formData.value,
          'label-placement': 'left',
          'label-width': 120
        },
        children: [
          // 用户类型选择
          {
            tag: 'n-form-item',
            attrs: {
              label: '用户类型'
            },
            children: [
              {
                tag: 'n-select',
                attrs: {
                  'v-model:value': [formData.value, 'userType'],
                  'options': [
                    { label: '员工', value: 'employee' },
                    { label: '企业客户', value: 'company' }
                  ]
                }
              }
            ]
          },

          // 员工姓名（仅员工显示）
          {
            tag: 'n-form-item',
            attrs: {
              'label': '姓名',
              'v-if': 'form.userType === "employee"'
            },
            children: [
              {
                tag: 'n-input',
                attrs: {
                  'v-model:value': [formData.value, 'name'],
                  'placeholder': '请输入姓名'
                }
              }
            ]
          },

          // 公司名称（仅企业客户显示）
          {
            tag: 'n-form-item',
            attrs: {
              'label': '公司名称',
              'v-if': 'form.userType === "company"'
            },
            children: [
              {
                tag: 'n-input',
                attrs: {
                  'v-model:value': [formData.value, 'companyName'],
                  'placeholder': '请输入公司名称'
                }
              }
            ]
          },

          // VIP 开关
          {
            tag: 'n-form-item',
            attrs: {
              label: '是否VIP'
            },
            children: [
              {
                tag: 'n-switch',
                attrs: {
                  'v-model:value': [formData.value, 'isVip']
                }
              }
            ]
          },

          // VIP 等级（仅VIP显示）
          {
            tag: 'n-form-item',
            attrs: {
              'label': 'VIP等级',
              'v-if': 'form.isVip'
            },
            children: [
              {
                tag: 'n-select',
                attrs: {
                  'v-model:value': [formData.value, 'vipLevel'],
                  'options': vipLevels.value,
                  'placeholder': '请选择VIP等级'
                }
              }
            ]
          },

          // 高级设置开关
          {
            tag: 'n-form-item',
            attrs: {
              label: '高级设置'
            },
            children: [
              {
                tag: 'n-checkbox',
                attrs: {
                  'v-model:checked': [formData.value, 'showAdvanced']
                },
                children: '显示高级选项'
              }
            ]
          },

          // 高级选项（条件显示）
          {
            tag: 'div',
            attrs: {
              'v-if': 'form.showAdvanced'
            },
            children: [
              {
                tag: 'n-form-item',
                attrs: {
                  label: '备注'
                },
                children: [
                  {
                    tag: 'n-input',
                    attrs: {
                      type: 'textarea',
                      placeholder: '请输入备注信息'
                    }
                  }
                ]
              }
            ]
          },

          // 提交按钮
          {
            tag: 'n-form-item',
            children: [
              {
                tag: 'n-button',
                attrs: {
                  'type': 'primary',
                  '@click': () => {
                    console.log('表单数据:', formData.value)
                  }
                },
                children: '提交表单'
              }
            ]
          }
        ]
      }
    ]
  }
])

// 渲染器
const { render } = useJsonSchema({
  data: conditionalSchema,
  context: {
    form: formData,
    vipLevels
  },
  components: {
    'n-card': DuxCard,
    'n-form': NForm,
    'n-form-item': NFormItem,
    'n-input': NInput,
    'n-select': NSelect,
    'n-switch': NSwitch,
    'n-checkbox': NCheckbox,
    'n-button': NButton
  }
})
</script>

<template>
  <div class="p-6">
    <component :is="render" />

    <!-- 表单数据预览 -->
    <DuxCard title="表单数据" class="mt-6">
      <pre>{{ JSON.stringify(formData, null, 2) }}</pre>
    </DuxCard>
  </div>
</template>
```

## 🔁 第三步：循环渲染列表

创建 `src/pages/json-schema/loop.vue` 页面，实现循环渲染：

```vue
<script setup>
import { useJsonSchema } from '@duxweb/dvha-core'
import { DuxCard } from '@duxweb/dvha-pro'
import { NButton, NForm, NFormItem, NInput, NSpace, NTag } from 'naive-ui'
import { computed, ref } from 'vue'

// 数据
const listData = ref({
  tags: ['Vue', 'React', 'Angular', 'Svelte'],
  users: [
    { id: 1, name: '张三', role: 'admin' },
    { id: 2, name: '李四', role: 'user' },
    { id: 3, name: '王五', role: 'moderator' }
  ],
  newTag: '',
  newUser: { name: '', role: 'user' }
})

// 添加标签
function addTag() {
  if (listData.value.newTag.trim()) {
    listData.value.tags.push(listData.value.newTag.trim())
    listData.value.newTag = ''
  }
}

// 删除标签
function removeTag(index) {
  listData.value.tags.splice(index, 1)
}

// 添加用户
function addUser() {
  if (listData.value.newUser.name.trim()) {
    listData.value.users.push({
      id: Date.now(),
      name: listData.value.newUser.name,
      role: listData.value.newUser.role
    })
    listData.value.newUser = { name: '', role: 'user' }
  }
}

// JSON Schema 配置
const loopSchema = computed(() => [
  {
    tag: 'n-card',
    attrs: {
      title: '循环渲染示例'
    },
    children: [
      // 标签列表
      {
        tag: 'div',
        attrs: {
          class: 'mb-6'
        },
        children: [
          {
            tag: 'h3',
            attrs: {
              class: 'mb-3'
            },
            children: '技能标签'
          },
          {
            tag: 'n-space',
            children: [
              {
                tag: 'n-tag',
                attrs: {
                  'v-for': listData.value.tags,
                  'type': 'primary',
                  'closable': true,
                  '@close': index => removeTag(index)
                },
                children: '{{item}}'
              }
            ]
          },
          {
            tag: 'div',
            attrs: {
              class: 'mt-3'
            },
            children: [
              {
                tag: 'n-input',
                attrs: {
                  'v-model:value': [listData.value, 'newTag'],
                  'placeholder': '输入新标签',
                  'style': 'width: 200px; margin-right: 8px;',
                  '@keyup.enter': addTag
                }
              },
              {
                tag: 'n-button',
                attrs: {
                  'type': 'primary',
                  '@click': addTag
                },
                children: '添加标签'
              }
            ]
          }
        ]
      },

      // 用户列表
      {
        tag: 'div',
        children: [
          {
            tag: 'h3',
            attrs: {
              class: 'mb-3'
            },
            children: '用户列表'
          },
          {
            tag: 'div',
            attrs: {
              class: 'space-y-2'
            },
            children: [
              {
                tag: 'div',
                attrs: {
                  'v-for': {
                    list: listData.value.users,
                    item: 'user',
                    index: 'index'
                  },
                  'class': 'p-3 border rounded flex justify-between items-center'
                },
                children: [
                  {
                    tag: 'div',
                    children: [
                      {
                        tag: 'span',
                        attrs: {
                          class: 'font-medium'
                        },
                        children: '{{user.name}}'
                      },
                      {
                        tag: 'n-tag',
                        attrs: {
                          size: 'small',
                          type: 'user.role === "admin" ? "error" : user.role === "moderator" ? "warning" : "info"',
                          class: 'ml-2'
                        },
                        children: '{{user.role}}'
                      }
                    ]
                  },
                  {
                    tag: 'n-button',
                    attrs: {
                      'size': 'small',
                      'type': 'error',
                      '@click': () => {
                        const index = listData.value.users.findIndex(u => u.id === user.id)
                        if (index > -1)
                          listData.value.users.splice(index, 1)
                      }
                    },
                    children: '删除'
                  }
                ]
              }
            ]
          },

          // 添加用户表单
          {
            tag: 'div',
            attrs: {
              class: 'mt-4 p-4 bg-gray-50 rounded'
            },
            children: [
              {
                tag: 'h4',
                attrs: {
                  class: 'mb-3'
                },
                children: '添加新用户'
              },
              {
                tag: 'n-form',
                attrs: {
                  inline: true
                },
                children: [
                  {
                    tag: 'n-form-item',
                    attrs: {
                      label: '姓名'
                    },
                    children: [
                      {
                        tag: 'n-input',
                        attrs: {
                          'v-model:value': [listData.value.newUser, 'name'],
                          'placeholder': '请输入姓名'
                        }
                      }
                    ]
                  },
                  {
                    tag: 'n-form-item',
                    children: [
                      {
                        tag: 'n-button',
                        attrs: {
                          'type': 'primary',
                          '@click': addUser
                        },
                        children: '添加用户'
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  }
])

// 渲染器
const { render } = useJsonSchema({
  data: loopSchema,
  context: {
    data: listData,
    addTag,
    removeTag,
    addUser
  },
  components: {
    'n-card': DuxCard,
    'n-space': NSpace,
    'n-tag': NTag,
    'n-input': NInput,
    'n-button': NButton,
    'n-form': NForm,
    'n-form-item': NFormItem
  }
})
</script>

<template>
  <div class="p-6">
    <component :is="render" />
  </div>
</template>
```

## 🧪 第四步：测试和验证

1. 启动开发服务器
2. 访问不同的示例页面
3. 测试表单交互功能
4. 验证数据绑定是否正确

```bash
# 启动开发服务器
npm run dev

# 访问示例页面
# http://localhost:3000/admin/json-schema/basic
# http://localhost:3000/admin/json-schema/conditional
# http://localhost:3000/admin/json-schema/loop
```

## 💡 高级特性

### 自定义适配器

```typescript
// 权限适配器
const permissionAdaptor = {
  name: 'permission',
  priority: 10,
  process: (node, props) => {
    const permission = props['v-permission']
    if (permission) {
      const hasPermission = checkUserPermission(permission)
      if (!hasPermission) {
        return { props, skip: true }
      }
    }
    return null
  }
}

const { render } = useJsonSchema({
  data: schema,
  adaptors: [permissionAdaptor]
})
```

### 插槽支持

```javascript
const schemaWithSlots = [
  {
    tag: 'n-card',
    attrs: { title: '卡片标题' },
    slots: {
      default: [
        {
          tag: 'p',
          children: '这是默认插槽内容'
        }
      ],
      action: {
        tag: 'n-button',
        attrs: { type: 'primary' },
        children: '操作按钮'
      }
    }
  }
]
```

## 💡 常见问题

::: details 如何处理复杂的数据绑定？
使用数组格式进行双向绑定：`'v-model:value': [对象, '属性名']`
:::

::: details 条件渲染不生效怎么办？
确保表达式语法正确，上下文数据已正确传递。
:::

::: details 如何优化大量数据的渲染性能？
使用 computed 包装 schema，避免不必要的重新渲染。
:::

## 🎯 总结

通过本教程，你学会了：

✅ **基础动态表单** - 使用 JSON 配置生成表单界面
✅ **条件渲染** - 根据数据状态动态显示/隐藏组件
✅ **循环渲染** - 处理列表数据的动态展示

JSON Schema 渲染器为配置驱动开发提供了强大支持，让你能够：
- 🎨 通过配置快速构建复杂界面
- 🔄 实现真正的响应式数据绑定
- 🎪 支持条件渲染和循环渲染
- 📊 适用于低代码平台、动态表单等场景

这为构建灵活、可配置的前端应用提供了强大的技术基础。
