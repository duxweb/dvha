# useJson

`useJson` 是一个强大的 JSON Schema 渲染器，能够将 JSON 配置动态渲染为 Vue 组件。支持响应式数据绑定、全局上下文传递、Vue 指令语法和自定义适配器扩展。

## 功能特点

- 🚀 **动态渲染** - 将 JSON 配置实时渲染为 Vue 组件
- 📊 **响应式绑定** - 完整支持 Vue 响应式数据双向绑定
- 🎯 **指令支持** - 支持 v-if、v-show、v-for、v-model、v-on 等 Vue 指令
- 🌐 **全局上下文** - 支持传递全局数据和函数，可在 JSON 中直接调用
- 📝 **表达式解析** - 安全的字符串表达式解析，支持复杂逻辑运算
- 🧩 **组件映射** - 灵活的组件注册和映射机制
- 🔧 **适配器系统** - 可扩展的适配器架构，支持自定义指令处理
- 🎪 **插槽支持** - 完整的 Vue 插槽系统支持
- ⚡ **性能优化** - 智能的节点处理和上下文传递机制
- 📦 **类型安全** - 完整的 TypeScript 类型定义

## 接口定义

```typescript
// 基础节点接口
interface JsonSchemaNode {
  tag: string | Component
  attrs?: Record<string, any>
  children?: string | JsonSchemaNode | JsonSchemaNode[]
  slots?: Record<string, any>
}

// JSON Schema 数据类型
export type JsonSchemaData = JsonSchemaNode[] | Ref<JsonSchemaNode[]>

// Hook 参数接口
interface UseJsonSchemaProps extends JsonAdaptorOptions {
  data: JsonSchemaData
  components?: Record<string, any>
  context?: Record<string, any> | Ref<Record<string, any>>
  adaptors?: IJsonAdaptor[]
}

// Hook 返回值接口
interface UseJsonSchemaReturn {
  render: Component
}

// 适配器接口
interface IJsonAdaptor {
  name: string
  priority: number
  process: (node: JsonSchemaNode, props: Record<string, any>) => IJsonAdaptorResult | null
}

// 适配器结果接口
interface IJsonAdaptorResult {
  props: Record<string, any>
  skip?: boolean
  nodes?: JsonSchemaNode[]
}
```

## 使用方法

```js
import { useJsonSchema } from '@duxweb/dvha-core'

const { render } = useJsonSchema({
  data: schema,
  context: globalData,
  components: componentMap
})
```

## 基本示例

```vue
<script setup>
import { useJsonSchema } from '@duxweb/dvha-core'
import { NButton, NCard, NInput } from 'naive-ui'
import { computed, ref } from 'vue'

// 响应式数据
const formData = ref({
  name: '张三',
  age: 25,
  isVip: true
})

// 工具函数
const utils = {
  formatAge: age => `${age}岁`,
  validateName: name => name.length >= 2
}

// JSON Schema 配置
const schema = computed(() => [
  {
    tag: 'n-card',
    attrs: {
      title: '用户信息'
    },
    children: [
      {
        tag: 'n-input',
        attrs: {
          'v-model:value': [formData.value, 'name'],
          'placeholder': '请输入姓名'
        }
      },
      {
        tag: 'div',
        attrs: {
          'v-if': 'utils.validateName(data.name)'
        },
        children: '姓名有效：{{data.name}}'
      },
      {
        tag: 'n-button',
        attrs: {
          'type': 'primary',
          '@click': () => {
            formData.value.age++
          }
        },
        children: '年龄 +1 (当前: {{utils.formatAge(data.age)}})'
      }
    ]
  }
])

// 渲染器配置
const { render } = useJsonSchema({
  data: schema,
  context: {
    data: formData,
    utils
  },
  components: {
    'n-card': NCard,
    'n-input': NInput,
    'n-button': NButton
  }
})
</script>

<template>
  <component :is="render" />
</template>
```

## 参数说明

| 参数         | 类型                                              | 必需 | 说明                 |
| ------------ | ------------------------------------------------- | ---- | -------------------- |
| `data`       | `JsonSchemaNode[] \| Ref<JsonSchemaNode[]>`       | ✅   | JSON Schema 配置数据 |
| `components` | `Record<string, any>`                             | ❌   | 组件映射表           |
| `context`    | `Record<string, any> \| Ref<Record<string, any>>` | ❌   | 全局上下文数据和函数 |
| `adaptors`   | `IJsonAdaptor[]`                                  | ❌   | 自定义适配器列表     |

## 返回值

| 字段     | 类型        | 说明         |
| -------- | ----------- | ------------ |
| `render` | `Component` | Vue 渲染组件 |

## 响应式数据绑定

### v-model 双向绑定

```javascript
const formData = ref({
  username: '',
  password: '',
  rememberMe: false
})

const schema = [
  {
    tag: 'n-input',
    attrs: {
      'v-model:value': [formData.value, 'username'],
      'placeholder': '用户名'
    }
  },
  {
    tag: 'n-input',
    attrs: {
      'v-model:value': [formData.value, 'password'],
      'type': 'password',
      'placeholder': '密码'
    }
  },
  {
    tag: 'n-checkbox',
    attrs: {
      'v-model:checked': [formData.value, 'rememberMe']
    },
    children: '记住我'
  }
]
```

### 传递数据和函数

```javascript
const globalContext = {
  // 响应式数据
  user: userInfo,
  config: appConfig,

  // 工具函数
  utils: {
    format: {
      date: date => new Date(date).toLocaleDateString(),
      currency: amount => `¥${amount.toFixed(2)}`
    },
    validate: {
      email: email => /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email),
      required: value => !!value
    }
  },

  // 业务逻辑函数
  business: {
    hasPermission: (user, action) => user.permissions.includes(action),
    calculateDiscount: (price, level) => price * discountRates[level]
  }
}

const { render } = useJsonSchema({
  data: schema,
  context: globalContext
})
```

### 在 Schema 中使用

```javascript
const schema = [
  {
    tag: 'div',
    attrs: {
      'v-if': 'business.hasPermission(user, "edit")'
    },
    children: [
      {
        tag: 'p',
        children: '欢迎，{{user.name}}！'
      },
      {
        tag: 'p',
        children: '会员等级：{{user.level}}'
      },
      {
        tag: 'p',
        children: '折扣价格：{{utils.format.currency(business.calculateDiscount(product.price, user.level))}}'
      }
    ]
  }
]
```

## 表达式语法

支持完整的 JavaScript 表达式语法：

```javascript
// 属性访问
'user.profile.avatar'

// 数组操作
'items.length > 0'
'tags.includes("important")'

// 函数调用
'utils.formatDate(createdAt)'
'validator.check(formData)'

// 逻辑运算
'isAdmin && hasPermission'
'age >= 18 || hasParentConsent'

// 比较运算
'status === "active"'
'score > 90'

// 三元运算
'isVip ? "VIP用户" : "普通用户"'

// 数学运算
'price * quantity'
'(subtotal + tax) * discount'
```

## 插槽支持

完整支持 Vue 插槽系统：

```javascript
const schema = [
  {
    tag: 'n-card',
    attrs: {
      title: '用户信息'
    },
    slots: {
      default: [
        {
          tag: 'p',
          children: '这是默认插槽内容'
        }
      ],
      header: {
        tag: 'div',
        attrs: {
          class: 'custom-header'
        },
        children: '自定义头部'
      },
      footer: slotProps => [
        {
          tag: 'div',
          children: `页脚信息: ${slotProps.info}`
        }
      ]
    }
  }
]
```

## Vue 指令支持

### 条件渲染

```javascript
const schema = [
  {
    tag: 'div',
    attrs: {
      'v-if': 'user.isAdmin'
    },
    children: '管理员专用内容'
  },
  {
    tag: 'div',
    attrs: {
      'v-show': 'showDetails'
    },
    children: '详细信息'
  }
]
```

### 循环渲染

```javascript
const schema = [
  {
    tag: 'div',
    attrs: {
      'v-for': 'items',
      'key': 'item.id'
    },
    children: '{{item.name}} - {{item.price}}'
  },
  // 使用对象格式指定变量名
  {
    tag: 'li',
    attrs: {
      'v-for': {
        list: 'categories',
        item: 'category',
        index: 'idx'
      }
    },
    children: '{{idx}}: {{category.title}}'
  }
]
```

### 事件处理

```javascript
const actions = {
  handleClick: (event, item) => {
    console.log('点击事件:', event, item)
  },
  handleSubmit: (formData) => {
    console.log('提交数据:', formData)
  }
}

const schema = [
  {
    tag: 'n-button',
    attrs: {
      '@click': event => actions.handleClick(event, currentItem.value)
    },
    children: '点击我'
  },
  {
    tag: 'n-button',
    attrs: {
      '@click': 'actions.handleSubmit(formData)'
    },
    children: '提交表单'
  }
]
```

## 动态表单示例

```javascript
const formData = ref({
  username: '',
  email: '',
  age: 18,
  city: '',
  interests: []
})

// 选项数据
const options = ref({
  cities: [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
    { label: '广州', value: 'guangzhou' }
  ],
  interests: [
    { label: '编程', value: 'coding' },
    { label: '音乐', value: 'music' },
    { label: '运动', value: 'sports' }
  ]
})

// 验证器
const validators = {
  required: value => !!value,
  email: email => /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email),
  minAge: age => age >= 18
}

// 工具函数
const utils = {
  getAgeStatus: age => age >= 18 ? '成年' : '未成年',
  formatInterests: interests => interests.join(', ')
}

// 表单配置
const formSchema = computed(() => [
  {
    tag: 'n-card',
    attrs: {
      title: '用户注册表单'
    },
    children: [
      {
        tag: 'n-form',
        attrs: {
          'model': formData.value,
          'label-width': '100px'
        },
        children: [
          {
            tag: 'n-form-item',
            attrs: {
              label: '用户名',
              path: 'username'
            },
            children: [
              {
                tag: 'n-input',
                attrs: {
                  'v-model:value': [formData.value, 'username'],
                  'placeholder': '请输入用户名'
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
              },
              {
                tag: 'div',
                attrs: {
                  'v-if': 'form.email && !validators.email(form.email)',
                  'style': 'color: red; font-size: 12px; margin-top: 4px;'
                },
                children: '邮箱格式不正确'
              }
            ]
          },
          {
            tag: 'n-form-item',
            attrs: {
              label: '年龄',
              path: 'age'
            },
            children: [
              {
                tag: 'n-input-number',
                attrs: {
                  'v-model:value': [formData.value, 'age'],
                  'min': 1,
                  'max': 120
                }
              },
              {
                tag: 'div',
                attrs: {
                  style: 'margin-top: 4px; font-size: 12px;'
                },
                children: '状态：{{utils.getAgeStatus(form.age)}}'
              }
            ]
          },
          {
            tag: 'n-form-item',
            attrs: {
              label: '城市',
              path: 'city'
            },
            children: [
              {
                tag: 'n-select',
                attrs: {
                  'v-model:value': [formData.value, 'city'],
                  'options': 'options.cities',
                  'placeholder': '请选择城市'
                }
              }
            ]
          },
          {
            tag: 'n-form-item',
            attrs: {
              label: '兴趣爱好',
              path: 'interests'
            },
            children: [
              {
                tag: 'n-checkbox-group',
                attrs: {
                  'v-model:value': [formData.value, 'interests']
                },
                children: [
                  {
                    tag: 'n-space',
                    children: [
                      {
                        tag: 'n-checkbox',
                        attrs: {
                          'v-for': 'options.interests',
                          'key': 'item.value',
                          'value': 'item.value'
                        },
                        children: '{{item.label}}'
                      }
                    ]
                  }
                ]
              },
              {
                tag: 'div',
                attrs: {
                  'v-if': 'form.interests.length > 0',
                  'style': 'margin-top: 4px; font-size: 12px;'
                },
                children: '已选择：{{utils.formatInterests(form.interests)}}'
              }
            ]
          },
          {
            tag: 'n-form-item',
            children: [
              {
                tag: 'n-space',
                children: [
                  {
                    tag: 'n-button',
                    attrs: {
                      'type': 'primary',
                      '@click': 'handleSubmit'
                    },
                    children: '提交'
                  },
                  {
                    tag: 'n-button',
                    attrs: {
                      '@click': 'handleReset'
                    },
                    children: '重置'
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

const { render } = useJsonSchema({
  data: formSchema,
  context: {
    form: formData,
    options,
    validators,
    utils,
    handleSubmit: () => {
      console.log('提交表单:', formData.value)
    },
    handleReset: () => {
      formData.value = {
        username: '',
        email: '',
        age: 18,
        city: '',
        interests: []
      }
    }
  },
  components: {
    'n-card': NCard,
    'n-form': NForm,
    'n-form-item': NFormItem,
    'n-input': NInput,
    'n-input-number': NInputNumber,
    'n-select': NSelect,
    'n-checkbox-group': NCheckboxGroup,
    'n-checkbox': NCheckbox,
    'n-button': NButton,
    'n-space': NSpace
  }
})
```

## 自定义适配器

```javascript
// 自定义权限适配器
const permissionAdaptor = {
  name: 'permission',
  priority: 10,
  process: (node, props) => {
    const permission = props['v-permission']
    if (permission) {
      const hasPermission = checkUserPermission(permission)
      if (!hasPermission) {
        return { props, skip: true } // 跳过渲染
      }
      // 移除权限属性
      const { 'v-permission': _, ...restProps } = props
      return { props: restProps }
    }
    return null
  }
}

// 自定义加载适配器
const loadingAdaptor = {
  name: 'loading',
  priority: 5,
  process: (node, props) => {
    const loading = props['v-loading']
    if (loading) {
      return {
        props,
        nodes: [
          {
            tag: 'n-spin',
            attrs: { show: loading },
            children: [node]
          }
        ]
      }
    }
    return null
  }
}

const { render } = useJsonSchema({
  data: schema,
  adaptors: [permissionAdaptor, loadingAdaptor]
})
```

## 完整应用示例

```vue
<script setup lang="ts">
import { useJsonSchema } from '@duxweb/dvha-core'
import {
  NAlert,
  NButton,
  NCard,
  NCheckbox,
  NInput,
  NSelect,
  NSpace,
  NSwitch,
  NTag
} from 'naive-ui'
import { computed, reactive } from 'vue'

// 应用状态
const appState = reactive({
  user: {
    name: '张三',
    role: 'admin',
    permissions: ['read', 'write', 'delete']
  },
  settings: {
    theme: 'light',
    notifications: true,
    language: 'zh-CN'
  },
  data: {
    products: [
      { id: 1, name: '产品A', price: 100, status: 'active' },
      { id: 2, name: '产品B', price: 200, status: 'inactive' }
    ],
    categories: ['电子产品', '服装', '图书']
  }
})

// 业务逻辑
const business = {
  hasPermission: permission => appState.user.permissions.includes(permission),
  formatPrice: price => `¥${price.toFixed(2)}`,
  getStatusColor: status => status === 'active' ? 'success' : 'error',
  getStatusText: status => status === 'active' ? '启用' : '禁用'
}

// 事件处理
const actions = {
  toggleTheme: () => {
    appState.settings.theme = appState.settings.theme === 'light' ? 'dark' : 'light'
  },
  editProduct: (product) => {
    console.log('编辑产品:', product)
  },
  deleteProduct: (product) => {
    const index = appState.data.products.findIndex(p => p.id === product.id)
    if (index > -1) {
      appState.data.products.splice(index, 1)
    }
  },
  addProduct: () => {
    const newProduct = {
      id: Date.now(),
      name: `产品${appState.data.products.length + 1}`,
      price: Math.floor(Math.random() * 500) + 50,
      status: 'active'
    }
    appState.data.products.push(newProduct)
  }
}

// 动态 Schema
const appSchema = computed(() => [
  {
    tag: 'div',
    attrs: {
      class: 'app-container'
    },
    children: [
      // 标题栏
      {
        tag: 'n-card',
        attrs: {
          title: `欢迎，${appState.user.name}`,
          class: 'header-card'
        },
        children: [
          {
            tag: 'n-space',
            attrs: {
              justify: 'space-between'
            },
            children: [
              {
                tag: 'div',
                children: [
                  {
                    tag: 'n-tag',
                    attrs: {
                      type: 'info'
                    },
                    children: `角色：${appState.user.role}`
                  }
                ]
              },
              {
                tag: 'n-space',
                children: [
                  {
                    tag: 'n-switch',
                    attrs: {
                      'v-model:value': [appState.settings, 'notifications']
                    }
                  },
                  {
                    tag: 'span',
                    children: '通知'
                  },
                  {
                    tag: 'n-button',
                    attrs: {
                      '@click': actions.toggleTheme
                    },
                    children: `切换到 ${appState.settings.theme === 'light' ? '暗色' : '亮色'} 主题`
                  }
                ]
              }
            ]
          }
        ]
      },

      // 产品管理
      {
        tag: 'n-card',
        attrs: {
          'title': '产品管理',
          'class': 'content-card',
          'v-if': 'business.hasPermission("read")'
        },
        children: [
          {
            tag: 'div',
            attrs: {
              'class': 'product-actions',
              'v-if': 'business.hasPermission("write")'
            },
            children: [
              {
                tag: 'n-button',
                attrs: {
                  'type': 'primary',
                  '@click': actions.addProduct
                },
                children: '添加产品'
              }
            ]
          },
          {
            tag: 'div',
            attrs: {
              class: 'product-list'
            },
            children: [
              {
                tag: 'div',
                attrs: {
                  'v-for': {
                    list: 'appState.data.products',
                    item: 'product',
                    index: 'index'
                  },
                  'key': 'product.id',
                  'class': 'product-item'
                },
                children: [
                  {
                    tag: 'n-card',
                    attrs: {
                      size: 'small'
                    },
                    children: [
                      {
                        tag: 'n-space',
                        attrs: {
                          justify: 'space-between',
                          align: 'center'
                        },
                        children: [
                          {
                            tag: 'div',
                            children: [
                              {
                                tag: 'h4',
                                children: '{{product.name}}'
                              },
                              {
                                tag: 'p',
                                children: '价格：{{business.formatPrice(product.price)}}'
                              }
                            ]
                          },
                          {
                            tag: 'n-space',
                            attrs: {
                              align: 'center'
                            },
                            children: [
                              {
                                tag: 'n-tag',
                                attrs: {
                                  type: 'business.getStatusColor(product.status)'
                                },
                                children: '{{business.getStatusText(product.status)}}'
                              },
                              {
                                tag: 'n-space',
                                attrs: {
                                  'v-if': 'business.hasPermission("write")'
                                },
                                children: [
                                  {
                                    tag: 'n-button',
                                    attrs: {
                                      'size': 'small',
                                      '@click': () => actions.editProduct(product)
                                    },
                                    children: '编辑'
                                  },
                                  {
                                    tag: 'n-button',
                                    attrs: {
                                      'size': 'small',
                                      'type': 'error',
                                      '@click': () => actions.deleteProduct(product),
                                      'v-if': 'business.hasPermission("delete")'
                                    },
                                    children: '删除'
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
              },
              {
                tag: 'n-alert',
                attrs: {
                  'v-if': 'appState.data.products.length === 0',
                  'type': 'info'
                },
                children: '暂无产品数据'
              }
            ]
          }
        ]
      },

      // 设置面板
      {
        tag: 'n-card',
        attrs: {
          title: '系统设置',
          class: 'settings-card'
        },
        children: [
          {
            tag: 'div',
            attrs: {
              class: 'setting-item'
            },
            children: [
              {
                tag: 'span',
                children: '当前主题：'
              },
              {
                tag: 'n-tag',
                attrs: {
                  type: appState.settings.theme === 'light' ? 'default' : 'info'
                },
                children: appState.settings.theme === 'light' ? '亮色模式' : '暗色模式'
              }
            ]
          },
          {
            tag: 'div',
            attrs: {
              class: 'setting-item'
            },
            children: [
              {
                tag: 'span',
                children: '系统通知：'
              },
              {
                tag: 'n-tag',
                attrs: {
                  type: appState.settings.notifications ? 'success' : 'error'
                },
                children: appState.settings.notifications ? '已开启' : '已关闭'
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
  data: appSchema,
  context: {
    appState,
    business,
    actions
  },
  components: {
    'n-card': NCard,
    'n-button': NButton,
    'n-input': NInput,
    'n-select': NSelect,
    'n-space': NSpace,
    'n-tag': NTag,
    'n-switch': NSwitch,
    'n-checkbox': NCheckbox,
    'n-alert': NAlert
  }
})
</script>

<template>
  <div class="app-demo">
    <component :is="render" />
  </div>
</template>

<style scoped>
.app-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.app-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.content-card,
.settings-card {
  min-height: 200px;
}

.product-actions {
  margin-bottom: 16px;
}

.product-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.product-item {
  transition: transform 0.2s;
}

.product-item:hover {
  transform: translateY(-2px);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.setting-item:last-child {
  border-bottom: none;
}
</style>
```

## 工作流程

1. **数据解析**: 解析 JSON Schema 数据结构
2. **适配器处理**: 按优先级运行自定义适配器
3. **指令解析**: 处理 Vue 指令和表达式
4. **组件映射**: 将标签映射到具体的 Vue 组件
5. **上下文注入**: 注入全局上下文数据和函数
6. **节点渲染**: 递归渲染所有节点
7. **插槽处理**: 处理 Vue 插槽内容
8. **响应式绑定**: 建立数据的响应式连接

## 注意事项

- JSON Schema 中的表达式需要是安全的 JavaScript 表达式
- 组件映射的组件必须是已注册的 Vue 组件
- 上下文数据会被注入到所有子节点中
- v-model 绑定使用数组格式：`[对象, '属性名']`
- 事件处理器可以是函数或表达式字符串
- 适配器按优先级从高到低执行
- 支持嵌套的复杂数据结构
- 表达式中可以访问全局上下文中的所有数据和方法
