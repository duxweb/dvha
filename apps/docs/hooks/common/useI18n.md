# useI18n

`useI18n` hook 用于在组件中访问国际化功能，提供文本翻译、语言切换等能力。

## 功能特点

- 🌍 **文本翻译** - 提供文本翻译功能
- 🔄 **语言切换** - 支持动态切换应用语言
- 📍 **语言获取** - 获取当前激活的语言
- 🏪 **状态管理** - 自动管理语言状态持久化
- 🎯 **依赖注入** - 自动获取管理端的国际化提供者
- 📱 **响应式** - 语言状态变化响应式更新

## 接口关系

该hook通过管理端配置获取国际化提供者，不直接调用外部接口。

```typescript
// 国际化提供者接口
interface I18nProvider {
  t: (key: string, options?: any, defaultMessage?: string) => string
  changeLocale: (lang: string, options?: any) => Promise<any>
  getLocale: () => string
}
```

## 使用方法

```typescript
import { useI18n } from '@duxweb/dvha-core'

const { t, changeLocale, getLocale } = useI18n()
```

## 参数说明

该hook无需参数。

## 返回值

| 字段           | 类型                                                              | 说明             |
| -------------- | ----------------------------------------------------------------- | ---------------- |
| `t`            | `(key: string, options?: any, defaultMessage?: string) => string` | 翻译函数         |
| `changeLocale` | `(lang: string) => Promise<any>`                                  | 语言切换函数     |
| `getLocale`    | `() => string`                                                    | 获取当前语言函数 |

## 基本翻译

```typescript
import { useI18n } from '@duxweb/dvha-core'

const { t } = useI18n()

// 基本翻译
const welcomeText = t('welcome') // "欢迎"

// 带参数的翻译
const greetingText = t('hello', { name: 'John' }) // "你好 John"

// 带默认值的翻译
const unknownText = t('unknown.key', null, '默认文本') // "默认文本"

// 嵌套键值翻译
const profileText = t('user.profile.name') // "用户姓名"
```

## 语言切换

```typescript
import { useI18n } from '@duxweb/dvha-core'

const { changeLocale, getLocale } = useI18n()

// 获取当前语言
const currentLang = getLocale()
console.log('当前语言:', currentLang) // "zh-CN"

// 切换到英文
async function switchToEnglish() {
  try {
    await changeLocale('en-US')
    console.log('语言已切换到英文')
  }
  catch (error) {
    console.error('语言切换失败:', error)
  }
}

// 切换到中文
async function switchToChinese() {
  try {
    await changeLocale('zh-CN')
    console.log('语言已切换到中文')
  }
  catch (error) {
    console.error('语言切换失败:', error)
  }
}
```

## 组件中使用

```vue
<script setup lang="ts">
import { useI18n } from '@duxweb/dvha-core'
import { computed, ref } from 'vue'

const { t, changeLocale, getLocale } = useI18n()

// 响应式数据
const userName = ref('张三')
const itemCount = ref(5)

// 可用语言列表
const languages = [
  { code: 'zh-CN', name: '中文' },
  { code: 'en-US', name: 'English' },
  { code: 'ja-JP', name: '日本語' }
]

// 当前语言
const currentLang = computed(() => getLocale())

// 切换语言
async function switchLanguage(langCode: string) {
  try {
    await changeLocale(langCode)
    console.log(`语言已切换到: ${langCode}`)
  }
  catch (error) {
    console.error('语言切换失败:', error)
  }
}

// 业务操作
function saveData() {
  console.log(t('message.saveSuccess'))
}

function cancelAction() {
  console.log(t('message.actionCancelled'))
}
</script>

<template>
  <div class="language-demo">
    <h1>{{ t('page.title') }}</h1>
    <p>{{ t('page.description') }}</p>

    <div class="user-info">
      <label>{{ t('user.name') }}:</label>
      <span>{{ userName }}</span>
    </div>

    <div class="actions">
      <button @click="saveData">
        {{ t('common.save') }}
      </button>
      <button @click="cancelAction">
        {{ t('common.cancel') }}
      </button>
    </div>

    <div class="language-switcher">
      <button
        v-for="lang in languages"
        :key="lang.code"
        :class="{ active: currentLang === lang.code }"
        @click="switchLanguage(lang.code)"
      >
        {{ lang.name }}
      </button>
    </div>

    <!-- 动态消息示例 -->
    <div class="messages">
      <p>{{ t('message.welcome', { name: userName }) }}</p>
      <p>{{ t('message.itemCount', { count: itemCount }) }}</p>
    </div>
  </div>
</template>
```

## 高级用法

### 条件翻译

```typescript
import { useI18n } from '@duxweb/dvha-core'

const { t, getLocale } = useI18n()

// 根据语言显示不同内容
function getFormattedDate(date: Date) {
  const currentLang = getLocale()

  if (currentLang === 'zh-CN') {
    return date.toLocaleDateString('zh-CN')
  }
  else if (currentLang === 'en-US') {
    return date.toLocaleDateString('en-US')
  }

  return date.toLocaleDateString()
}

// 条件性翻译
function getStatusText(status: string) {
  const baseKey = `status.${status}`
  const fallbackText = status.charAt(0).toUpperCase() + status.slice(1)

  return t(baseKey, null, fallbackText)
}
```

### 复数处理

```typescript
import { useI18n } from '@duxweb/dvha-core'

const { t } = useI18n()

// 处理复数形式
function getItemCountText(count: number) {
  return t('message.itemCount', { count }, `${count} items`)
}

// 使用示例
console.log(getItemCountText(0)) // "没有项目"
console.log(getItemCountText(1)) // "1 个项目"
console.log(getItemCountText(5)) // "5 个项目"
```

### 动态键值

```typescript
import { useI18n } from '@duxweb/dvha-core'

const { t } = useI18n()

// 动态生成翻译键值
function getFieldLabel(fieldName: string) {
  return t(`form.${fieldName}.label`, null, fieldName)
}

function getErrorMessage(field: string, errorType: string) {
  return t(`validation.${field}.${errorType}`, null, `${field} ${errorType} error`)
}

// 使用示例
const nameLabel = getFieldLabel('name') // "姓名"
const emailError = getErrorMessage('email', 'required') // "邮箱不能为空"
```

## 表单验证集成

```vue
<script setup lang="ts">
import { useI18n } from '@duxweb/dvha-core'
import { reactive, ref } from 'vue'

const { t } = useI18n()

const form = reactive({
  name: '',
  email: ''
})

const errors = ref<Record<string, string>>({})

// 获取字段错误信息
function getFieldError(field: string) {
  const errorType = errors.value[field]
  if (!errorType)
    return ''

  return t(`validation.${field}.${errorType}`, { field: t(`form.${field}.label`) }, `${field} validation error`)
}

// 表单验证
function validateForm() {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = 'required'
  }

  if (!form.email.trim()) {
    errors.value.email = 'required'
  }
  else if (!isValidEmail(form.email)) {
    errors.value.email = 'invalid'
  }

  return Object.keys(errors.value).length === 0
}

// 提交表单
function submitForm() {
  if (validateForm()) {
    console.log(t('message.formSubmitSuccess'))
  }
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email)
}
</script>

<template>
  <form @submit.prevent="submitForm">
    <div class="field">
      <label>{{ t('form.name.label') }}</label>
      <input
        v-model="form.name"
        :placeholder="t('form.name.placeholder')"
        :class="{ error: errors.name }"
      >
      <span v-if="errors.name" class="error-text">
        {{ getFieldError('name') }}
      </span>
    </div>

    <div class="field">
      <label>{{ t('form.email.label') }}</label>
      <input
        v-model="form.email"
        type="email"
        :placeholder="t('form.email.placeholder')"
        :class="{ error: errors.email }"
      >
      <span v-if="errors.email" class="error-text">
        {{ getFieldError('email') }}
      </span>
    </div>

    <button type="submit">
      {{ t('common.submit') }}
    </button>
  </form>
</template>
```

## 错误处理

```typescript
import { useI18n } from '@duxweb/dvha-core'

const { t, changeLocale } = useI18n()

// 安全的翻译函数
function safeTranslate(key: string, options?: any, defaultMessage?: string) {
  try {
    return t(key, options, defaultMessage || key)
  }
  catch (error) {
    console.warn(`Translation failed for key: ${key}`, error)
    return defaultMessage || key
  }
}

// 安全的语言切换
async function safeChangeLocale(lang: string) {
  try {
    await changeLocale(lang)
    return true
  }
  catch (error) {
    console.error(`Failed to change locale to: ${lang}`, error)
    return false
  }
}

// 使用示例
const welcomeText = safeTranslate('welcome', null, 'Welcome')

async function handleLanguageChange(newLang: string) {
  const success = await safeChangeLocale(newLang)
  if (success) {
    console.log(t('message.languageChanged'))
  }
  else {
    console.log(t('message.languageChangeFailed'))
  }
}
```

## 与其他 Hook 结合

```typescript
import { useConfig, useI18n, useManage } from '@duxweb/dvha-core'

const { t, changeLocale, getLocale } = useI18n()
const config = useConfig()
const manage = useManage()

// 结合配置信息
function getAppTitle() {
  const configTitle = config.title
  const translatedTitle = t('app.title', null, configTitle)
  return translatedTitle || configTitle || 'App'
}

// 结合管理端信息
function getManageTitle() {
  const manageTitle = manage.config?.title
  const translatedTitle = t(`manage.${manage.config?.name}.title`, null, manageTitle)
  return translatedTitle || manageTitle || 'Management'
}

// 获取支持的语言列表
function getSupportedLanguages() {
  const defaultLangs = ['zh-CN', 'en-US']
  const manageLangs = manage.config?.i18nProvider?.supportedLocales || []
  const configLangs = config.supportedLanguages || []

  return [...new Set([...defaultLangs, ...manageLangs, ...configLangs])]
}
```

## 性能优化

```typescript
import { useI18n } from '@duxweb/dvha-core'
import { computed, watchEffect } from 'vue'

const { t, getLocale } = useI18n()

// 缓存常用翻译
const translations = computed(() => ({
  common: {
    save: t('common.save'),
    cancel: t('common.cancel'),
    confirm: t('common.confirm'),
    delete: t('common.delete')
  },
  user: {
    profile: t('user.profile'),
    settings: t('user.settings')
  }
}))

// 监听语言变化
watchEffect(() => {
  const currentLang = getLocale()
  document.documentElement.lang = currentLang

  // 更新页面标题
  const title = t('page.title', null, 'DVHA App')
  document.title = title
})

// 预加载翻译
function preloadTranslations(keys: string[]) {
  return keys.reduce((acc, key) => {
    acc[key] = t(key)
    return acc
  }, {} as Record<string, string>)
}
```

## 最佳实践

### 1. 翻译键值命名规范

```typescript
// 推荐的命名规范
const translations = {
  // 页面相关
  'page.home.title': '首页',
  'page.user.profile': '用户资料',

  // 组件相关
  'component.table.empty': '暂无数据',
  'component.pagination.total': '共 {total} 条',

  // 表单相关
  'form.field.required': '{field}不能为空',
  'form.field.invalid': '{field}格式不正确',

  // 操作相关
  'action.save.success': '保存成功',
  'action.delete.confirm': '确定要删除吗？'
}
```

### 2. 统一的翻译管理

```typescript
// i18n/index.ts
import { useI18n } from '@duxweb/dvha-core'

export function createI18nHelpers() {
  const { t, changeLocale, getLocale } = useI18n()

  return {
    // 通用翻译
    common: {
      save: () => t('common.save'),
      cancel: () => t('common.cancel'),
      confirm: () => t('common.confirm'),
      delete: () => t('common.delete')
    },

    // 消息翻译
    message: {
      success: (action: string) => t('message.success', { action }),
      error: (message: string) => t('message.error', { message }),
      confirm: (action: string) => t('message.confirm', { action })
    },

    // 表单翻译
    form: {
      required: (field: string) => t('form.required', { field }),
      invalid: (field: string) => t('form.invalid', { field })
    },

    // 语言操作
    locale: {
      change: changeLocale,
      get: getLocale
    }
  }
}
```

::: tip 小提示

- 使用描述性的键值名称，避免缩写
- 保持翻译文本简洁明了
- 为动态内容提供合理的默认值
- 定期检查和清理未使用的翻译键值
- 考虑使用翻译管理工具来提高效率
  :::
