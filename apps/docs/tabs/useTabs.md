# 标签页方法 (useTabStore)

标签页状态由 `useTabStore` 提供。

## 使用方法

```ts
import { useTabStore } from '@duxweb/dvha-core'

const tabStore = useTabStore()
```

## 返回值

| 字段 | 类型 | 说明 |
| --- | --- | --- |
| `current` | `Ref<string \| undefined>` | 当前标签路径 |
| `tabs` | `Ref<IMenu[]>` | 标签列表 |
| `isTab` | `(path: string) => boolean` | 是否已存在 |
| `addTab` | `(item: IMenu, cb?: (item: IMenu) => void) => void` | 添加标签 |
| `delTab` | `(path: string, cb?: (item: IMenu) => void) => void` | 删除标签 |
| `changeTab` | `(path: string, cb?: (item: IMenu) => void) => void` | 切换标签 |
| `delOther` | `(path: string, cb?: () => void) => void` | 关闭其他 |
| `delLeft` | `(path: string, cb?: () => void) => void` | 关闭左侧 |
| `delRight` | `(path: string, cb?: () => void) => void` | 关闭右侧 |
| `lockTab` | `(path: string) => void` | 锁定/解锁 |
| `clearTab` | `() => void` | 清空全部 |

## 示例

```ts
import { useRouter } from 'vue-router'
import { useTabStore } from '@duxweb/dvha-core'

const router = useRouter()
const tab = useTabStore()

tab.addTab({ name: 'users', label: '用户', path: '/admin/users' }, (item) => {
  router.push(item.path || '')
})
```
