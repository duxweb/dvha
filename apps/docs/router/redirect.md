# 路由跳转

推荐使用 `useManage().getRoutePath` 生成带管理端前缀的路径。

## 基础示例

```ts
import { useRouter } from 'vue-router'
import { useManage } from '@duxweb/dvha-core'

const router = useRouter()
const manage = useManage()

router.push(manage.getRoutePath('users'))
```

## getRoutePath 行为

`getRoutePath` 会统一拼接管理端前缀：

```ts
// manage.routePrefix === '/admin'
manage.getRoutePath('users')   // /admin/users
manage.getRoutePath('/users')  // /admin/users
manage.getRoutePath('')        // /admin/
```

如需跳转到其他管理端，请传入对应的 `useManage(name)`：

```ts
const admin = useManage('admin')
const company = useManage('company')

router.push(company.getRoutePath('home'))
```
