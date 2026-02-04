# 异步(远程)菜单

DVHA 框架支持从远程服务器动态获取菜单数据，实现菜单的动态配置和权限控制。

## 功能特点

- 🌐 **远程获取** - 从服务器动态加载菜单配置
- 🔄 **实时更新** - 支持菜单的实时更新和变更
- 🔐 **权限控制** - 基于用户权限动态显示菜单
- 🔧 **灵活配置** - 支持复杂的菜单结构和元数据
- 📱 **本地合并** - 远程菜单与本地菜单自动合并
- ⚡ **缓存机制** - 避免重复请求，提升性能
- 🛡️ **错误处理** - 远程菜单加载失败时的降级处理

## 基础配置

### 启用远程菜单

```js
const adminManage = {
  name: 'admin',
  title: '管理后台',

  // 远程菜单API路径
  apiRoutePath: '/api/admin/menus',

  // 数据提供者（必需）
  dataProvider: {
    default: {
      custom: async (options, manage, auth) => {
        const response = await fetch(options.path, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${auth.token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return await response.json()
      }
    },
  },

  // 本地菜单（可选，会与远程菜单合并）
  menus: [
    {
      name: 'dashboard',
      label: '仪表盘',
      path: 'dashboard',
      icon: 'dashboard',
      sort: 0,  // 确保在远程菜单之前显示
      component: () => import('./pages/Dashboard.vue')
    }
  ]
}
```

### API 响应格式

远程菜单API需要返回符合以下格式的数据：

```json
{
  "data": [
    {
      "name": "users",
      "label": "用户管理",
      "path": "users",
      "icon": "users",
      "sort": 1,
      "meta": {
        "permissions": ["user.read"]
      }
    },
    {
      "name": "system",
      "label": "系统管理",
      "icon": "system",
      "sort": 2
    },
    {
      "name": "system.settings",
      "label": "系统设置",
      "path": "system/settings",
      "parent": "system",
      "sort": 1,
      "meta": {
        "permissions": ["system.admin"]
      }
    }
  ]
}
```

## 数据提供者配置

### 基础数据提供者

```js
const dataProvider = {
  custom: async (options, manage, auth) => {
    const { path, method = 'GET', headers = {}, ...config } = options

    // 构建完整的请求URL
    const apiBase = manage?.config?.apiBasePath || ''
    const baseUrl = 'http://localhost:3000'
    const url = path.startsWith('http') ? path : `${baseUrl}${apiBase}${path}`

    // 默认headers
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${auth?.token || ''}`,
      ...headers
    }

    const response = await fetch(url, {
      method,
      headers: defaultHeaders,
      ...config
    })

    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`)
    }

    return await response.json()
  }
}
```

## 菜单结构定义

### 完整菜单项

```json
{
  "name": "user.management",
  "label": "用户管理",
  "path": "users",
  "icon": "users",
  "sort": 10,
  "parent": null,
  "hidden": false,
  "loader": null,
  "meta": {
    "permissions": ["user.read", "user.write"],
    "roles": ["admin", "manager"],
    "title": "用户管理 - 系统后台",
    "keepAlive": true,
    "breadcrumb": ["首页", "用户管理"],
    "badge": {
      "text": "New",
      "color": "red"
    }
  }
}
```

### 多级菜单

```json
{
  "data": [
    {
      "name": "system",
      "label": "系统管理",
      "icon": "system",
      "sort": 1
    },
    {
      "name": "system.users",
      "label": "用户管理",
      "path": "system/users",
      "parent": "system",
      "icon": "users",
      "sort": 1
    },
    {
      "name": "system.roles",
      "label": "角色管理",
      "path": "system/roles",
      "parent": "system",
      "icon": "roles",
      "sort": 2
    },
    {
      "name": "system.permissions",
      "label": "权限管理",
      "path": "system/permissions",
      "parent": "system",
      "icon": "permissions",
      "sort": 3
    }
  ]
}
```

### 外部链接菜单

```json
{
  "name": "external.docs",
  "label": "帮助文档",
  "path": "https://docs.example.com",
  "icon": "help",
  "loader": "iframe",
  "sort": 100,
  "meta": {
    "external": true,
    "target": "_blank"
  }
}
```

## 权限控制

### 基于权限的菜单

```json
{
  "data": [
    {
      "name": "users",
      "label": "用户管理",
      "path": "users",
      "icon": "users",
      "meta": {
        "permissions": ["user.read"]  // 需要用户读取权限
      }
    },
    {
      "name": "admin",
      "label": "系统管理",
      "icon": "admin",
      "meta": {
        "roles": ["admin"]  // 仅管理员可见
      }
    },
    {
      "name": "reports",
      "label": "报表中心",
      "path": "reports",
      "icon": "chart",
      "meta": {
        "permissions": ["report.read"],
        "roles": ["admin", "manager"]  // 需要权限且角色匹配
      }
    }
  ]
}
```

### 条件显示菜单

```json
{
  "name": "vip.features",
  "label": "VIP功能",
  "path": "vip",
  "icon": "vip",
  "meta": {
    "conditions": {
      "userLevel": "vip",
      "subscriptionActive": true
    }
  }
}
```

## 服务端实现示例

### Node.js + Express

```js
// 菜单路由处理
app.get('/api/admin/menus', authenticateToken, async (req, res) => {
  try {
    const user = req.user
    const userPermissions = await getUserPermissions(user.id)
    const userRoles = await getUserRoles(user.id)

    // 获取所有菜单
    const allMenus = await getMenusFromDatabase()

    // 根据用户权限过滤菜单
    const filteredMenus = allMenus.filter(menu => {
      // 检查权限
      if (menu.meta?.permissions) {
        const hasPermission = menu.meta.permissions.some(
          permission => userPermissions.includes(permission)
        )
        if (!hasPermission) return false
      }

      // 检查角色
      if (menu.meta?.roles) {
        const hasRole = menu.meta.roles.some(
          role => userRoles.includes(role)
        )
        if (!hasRole) return false
      }

      return true
    })

    res.json({
      data: filteredMenus.sort((a, b) => (a.sort || 0) - (b.sort || 0))
    })
  } catch (error) {
    res.status(500).json({ error: 'Failed to load menus' })
  }
})
```

### Laravel PHP

```php
<?php

class MenuController extends Controller
{
    public function getMenus(Request $request)
    {
        $user = $request->user();
        $permissions = $user->permissions->pluck('name')->toArray();
        $roles = $user->roles->pluck('name')->toArray();

        $menus = Menu::where('active', true)
            ->orderBy('sort')
            ->get()
            ->filter(function ($menu) use ($permissions, $roles) {
                // 检查权限
                if ($menu->permissions) {
                    $menuPermissions = json_decode($menu->permissions, true);
                    if (!array_intersect($menuPermissions, $permissions)) {
                        return false;
                    }
                }

                // 检查角色
                if ($menu->roles) {
                    $menuRoles = json_decode($menu->roles, true);
                    if (!array_intersect($menuRoles, $roles)) {
                        return false;
                    }
                }

                return true;
            });

        return response()->json([
            'data' => $menus->values()
        ]);
    }
}
```

## 错误处理

### 客户端错误处理

框架会自动处理远程菜单加载失败的情况：

```js
// 在 DuxAppProvider 中的错误处理
if (manage.config?.apiRoutePath) {
  try {
    await manage.config.dataProvider?.custom({
      path: manage.config.apiRoutePath,
      meta: {
        timeout: 5000,
      }
    }, manage, authStore.getUser(manageName)).then((res) => {
      routeStore.appendRoutes(formatMenus(res.data || []))
    })
  } catch (error) {
    console.error('Failed to load remote menus:', error)
    // 继续使用本地菜单
  }
}
```



## 最佳实践

1. **性能优化**
   - 使用适当的缓存策略
   - 设置合理的请求超时时间
   - 避免频繁的菜单更新

2. **安全考虑**
   - 在服务端进行权限验证
   - 不要在前端存储敏感的权限信息
   - 使用HTTPS传输菜单数据

3. **用户体验**
   - 提供菜单加载状态提示
   - 设计合理的降级方案
   - 避免菜单频繁闪烁变化

4. **错误处理**
   - 实现完善的错误处理机制
   - 提供有意义的错误提示
   - 记录详细的错误日志

## 注意事项

- **数据格式**: 确保远程菜单数据符合 `IMenu` 接口规范
- **权限验证**: 在服务端进行权限验证，前端验证仅用于显示
- **性能考虑**: 合理使用缓存，避免过度请求
- **错误处理**: 实现降级方案，确保系统在网络异常时可用
- **安全性**: 使用HTTPS和token认证保护菜单接口
- **兼容性**: 远程菜单与本地菜单的合并要考虑名称冲突
