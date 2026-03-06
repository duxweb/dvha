# 权限管理与路由守卫

这一页主要讲：**后台项目里，怎么控制“谁能看什么、谁能进什么页面”。**

当你的项目开始有不同角色时，这一页就很重要了。

## 权限通常管哪几件事

最常见的是：

- 某个用户能不能进某个页面
- 某个菜单该不该显示
- 某个按钮该不该可用

## 最核心的判断位置

最核心的判断通常在 `authProvider.can`。

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

你可以先把它理解成：

- 传进来一个权限名
- 返回这个用户能不能访问

## 路由守卫通常和什么配合

通常会和路由元信息一起配合使用，比如：

- 哪些页面必须登录
- 哪些页面登录前也能访问
- 某些页面是否还要额外权限判断

## 最常见问题

### 用户已经登录，但还是进不去页面

先检查：

- `authProvider.can` 是否返回了 `false`
- 当前权限数据是否正确
- 页面是否额外要求某些权限点

### 菜单和页面权限不一致

先检查：

- 菜单显示逻辑和页面访问逻辑是否用的是同一套权限规则

## 下一步建议

权限做完后，通常就可以继续补更具体的业务能力了，比如：

- [`文件上传与管理`](/pro/course/upload)
- [`JSON Schema 动态表单`](/pro/course/json-schema)
- [`远程组件与微前端`](/pro/course/remote)
