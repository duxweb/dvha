# 权限管理与路由守卫

权限判断依赖 `authProvider.can` 与路由 `meta.authorization`。

```ts
const authProvider = {
  // ...
  can: (name, _params, _manage, auth) => {
    if (!auth?.permission)
      return true
    if (Array.isArray(auth.permission))
      return auth.permission.includes(name)
    if (typeof auth.permission === 'object')
      return auth.permission[name] !== false
    return true
  },
}
```
