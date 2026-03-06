# 第一个页面

这一页主要讲：**怎么在 DVHA Pro 里加你的第一个业务页面。**

如果你刚把项目跑起来，这通常是最适合开始动手的一步。

## 你要做的事情其实只有两件

1. 把页面接进路由
2. 把页面放进菜单

也就是说：

- 路由解决“页面能不能打开”
- 菜单解决“页面能不能在后台里点到”

## 1. 新建一个页面组件

先创建一个页面文件，比如：

```vue
<!-- src/pages/Hello.vue -->
<template>
  <div>Hello DVHA Pro</div>
</template>
```

## 2. 在管理端里加路由和菜单

```ts
const config = {
  manages: [
    {
      name: 'admin',
      routePrefix: '/admin',
      routes: [
        {
          name: 'admin.hello',
          path: 'hello',
          component: () => import('./pages/Hello.vue'),
        },
      ],
      menus: [
        {
          name: 'hello',
          label: 'Hello',
          path: 'hello',
        },
      ],
    },
  ],
}
```

## 3. 这段配置怎么理解

### `routes`

表示这个管理端里有哪些页面路由。

这里这一段：

```ts
{
  name: 'admin.hello',
  path: 'hello',
  component: () => import('./pages/Hello.vue'),
}
```

意思就是：

- 访问这个路由时
- 打开 `Hello.vue`

### `menus`

表示侧边栏里显示什么菜单。

这里这一段：

```ts
{
  name: 'hello',
  label: 'Hello',
  path: 'hello',
}
```

意思就是：

- 侧边栏显示一个 `Hello` 菜单
- 点击后跳到 `hello` 这个页面

## 4. 最常见的问题

### 菜单能看到，但页面打不开

先检查：

- `routes` 里有没有这个页面
- `component` 路径有没有写对
- `path` 是否一致

### 页面能打开，但菜单里没有

先检查：

- `menus` 里有没有对应项
- 菜单 `path` 是否正确
- 菜单是否被隐藏

## 5. 做完这一步后你应该得到什么

完成后，你应该已经能：

- 在后台菜单里看到一个新页面
- 点击菜单进入这个页面
- 开始往页面里写自己的业务内容

这就意味着，你已经迈过了“项目能跑”和“我能开始做业务”之间最关键的一步。

## 下一步建议

做完第一个页面后，最推荐继续看：

- [`登录与鉴权`](/pro/course/login)
- [`自定义数据接口`](/pro/course/api)
