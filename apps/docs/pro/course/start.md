# 第一个页面

核心步骤：

1. 在管理端配置中添加路由与菜单。
2. 创建页面组件并在路由中引用。

示例（节选）：

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
