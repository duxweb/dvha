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

// Hook 参数接口
interface UseJsonSchemaProps {
  data: JsonSchemaNode[] | Ref<JsonSchemaNode[]>
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
```

## 使用方法

```js
import { useJson } from '@duxweb/dvha-core'

const { render } = useJson({
  data: schema,
  context: globalData,
  components: componentMap
})
```

## 基本示例

```vue
<script setup>
import { useJson } from '@duxweb/dvha-core'
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
const { render } = useJson({
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

| 字段     | 类型        | 说明              |
| -------- | ----------- | ----------------- |
| `render` | `Component` | 可渲染的 Vue 组件 |

## Vue 指令支持

### v-if / v-else / v-else-if

支持条件渲染，可以使用字符串表达式或直接传值：

```javascript
// 字符串表达式
{
  tag: 'div',
  attrs: {
    'v-if': 'user.role === "admin"',
    'v-else-if': 'user.role === "editor"'
  }
}

// 直接传值
{
  tag: 'div',
  attrs: {
    'v-if': user.value.isActive,
    'v-else': true
  }
}
```

### v-show

控制元素显示隐藏：

```javascript
{
  tag: 'div',
  attrs: {
    'v-show': 'config.debug'
  },
  children: '调试信息'
}
```

### v-for

循环渲染元素：

```javascript
// 数组循环
{
  tag: 'div',
  children: [
    {
      tag: 'span',
      attrs: {
        'v-for': 'items'
      },
      children: '{{item.name}}'
    }
  ]
}

// 字符串表达式
{
  tag: 'li',
  attrs: {
    'v-for': 'item in products'
  },
  children: '{{item.title}} - ¥{{item.price}}'
}

// 带索引
{
  tag: 'div',
  attrs: {
    'v-for': {
      list: 'categories',
      item: 'category',
      index: 'idx'
    }
  },
  children: '{{idx + 1}}. {{category.name}}'
}
```

### v-model

双向数据绑定：

```javascript
{
  tag: 'n-input',
  attrs: {
    'v-model:value': [formData.value, 'username']
  }
}

// 自定义 getter/setter
{
  tag: 'n-input',
  attrs: {
    'v-model:value': [
      () => String(formData.value.age),
      (val) => { formData.value.age = Number(val) }
    ]
  }
}
```

### v-on (事件处理)

绑定事件处理器：

```javascript
{
  tag: 'n-button',
  attrs: {
    '@click': () => handleClick(),
    '@click.stop': (e) => e.preventDefault()
  },
  children: '点击按钮'
}
```

## 文本插值

支持在文本内容中使用插值表达式：

```javascript
{
  tag: 'p',
  children: '用户 {{user.name}} 的积分是 {{user.points}}'
}

{
  tag: 'div',
  attrs: {
    title: '当前时间：{{utils.formatDate(now)}}'
  },
  children: '鼠标悬停查看时间'
}
```

## 全局上下文

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

const { render } = useJson({
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
{
  tag: 'n-card',
  attrs: {
    title: '卡片标题'
  },
  children: '默认插槽内容',
  slots: {
    // 具名插槽
    header: () => ({
      tag: 'div',
      children: '自定义头部'
    }),

    // 作用域插槽
    footer: (slotProps) => ({
      tag: 'div',
      children: `页脚 - ${slotProps.info}`
    }),

    // 动态插槽
    action: () => [
      {
        tag: 'n-button',
        attrs: { type: 'primary' },
        children: '确定'
      },
      {
        tag: 'n-button',
        children: '取消'
      }
    ]
  }
}
```

## 组件映射

灵活的组件注册方式：

```javascript
import { NButton, NCard, NInput } from 'naive-ui'
import CustomComponent from './CustomComponent.vue'

const { render } = useJson({
  data: schema,
  components: {
    // UI 库组件
    'n-button': NButton,
    'n-input': NInput,
    'n-card': NCard,

    // 自定义组件
    'custom-component': CustomComponent,

    // 函数式组件
    'my-component': (props, { slots }) => {
      return h('div', { class: 'my-component' }, slots.default?.())
    }
  }
})
```

## 自定义适配器

扩展新的指令处理：

```javascript
const customAdaptor = {
  name: 'v-custom',
  priority: 80,
  process(node, props) {
    const customValue = node.attrs?.['v-custom']
    if (!customValue)
      return null

    // 自定义处理逻辑
    const processedProps = { ...props }
    delete processedProps['v-custom']

    return {
      props: processedProps,
      // skip: boolean,      // 是否跳过渲染
      // nodes: JsonSchemaNode[]  // 返回新的节点列表
    }
  }
}

const { render } = useJson({
  data: schema,
  adaptors: [customAdaptor]
})
```

## 复杂示例

一个完整的表单渲染示例：

```vue
<script setup>
import { useJson } from '@duxweb/dvha-core'
import { NButton, NCard, NForm, NFormItem, NInput, NSelect } from 'naive-ui'
import { computed, ref } from 'vue'

// 表单数据
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
                tag: 'n-input',
                attrs: {
                  'v-model:value': [
                    () => String(formData.value.age),
                    (val) => { formData.value.age = Number(val) || 0 }
                  ],
                  'type': 'number',
                  'placeholder': '请输入年龄'
                }
              },
              {
                tag: 'div',
                attrs: {
                  'v-if': 'form.age > 0',
                  'style': 'margin-top: 4px; color: #666;'
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
                  'options': options.value.cities,
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
                tag: 'n-select',
                attrs: {
                  'v-model:value': [formData.value, 'interests'],
                  'options': options.value.interests,
                  'multiple': true,
                  'placeholder': '请选择兴趣爱好'
                }
              },
              {
                tag: 'div',
                attrs: {
                  'v-if': 'form.interests.length > 0',
                  'style': 'margin-top: 4px; color: #666;'
                },
                children: '已选择：{{utils.formatInterests(form.interests)}}'
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
                  'disabled': '!validators.required(form.username) || !validators.email(form.email) || !validators.minAge(form.age)',
                  '@click': () => {
                    console.log('提交表单:', formData.value)
                  }
                },
                children: '提交注册'
              }
            ]
          }
        ]
      }
    ]
  }
])

// 渲染器
const { render } = useJson({
  data: formSchema,
  context: {
    form: formData,
    options,
    validators,
    utils
  },
  components: {
    'n-card': NCard,
    'n-form': NForm,
    'n-form-item': NFormItem,
    'n-input': NInput,
    'n-select': NSelect,
    'n-button': NButton
  }
})
</script>

<template>
  <component :is="render" />
</template>
```

## 注意事项

1. **表达式安全性**：所有字符串表达式都通过 AST 解析，避免了 `eval` 的安全风险
2. **响应式数据**：自动处理 Vue 响应式数据的解包，确保数据变化能触发重新渲染
3. **上下文作用域**：v-for 等指令会创建局部作用域，内层可以访问外层上下文
4. **组件注册**：确保使用的组件都已在 components 中注册
5. **性能优化**：大量数据渲染时建议使用 computed 包装 schema 配置

## 最佳实践

1. **配置分离**：将 JSON Schema 配置独立管理，便于维护和复用
2. **函数封装**：将复杂的业务逻辑封装为函数，通过 context 传递
3. **类型定义**：为 schema 配置定义 TypeScript 类型，提高开发体验
4. **适配器复用**：常用的自定义指令封装为适配器，便于项目间复用
5. **错误处理**：在表达式中添加适当的错误处理和默认值
