# 多管理端

DVHA 框架支持在同一应用中运行多个独立的管理端，每个管理端可以有独立的认证、数据、路由和主题系统。

## 设计理念

- 🔐 **隔离性** - 各管理端间数据和权限完全隔离
- 🎯 **专业性** - 每个管理端专注于特定的业务场景
- 🔄 **独立性** - 每个管理端可独立开发、部署和维护
- 🛠️ **可扩展性** - 可以轻松添加新的管理端
- 🎨 **差异化** - 每个管理端可以有独特的界面和体验

## 架构选择指南

根据不同的业务需求和技术背景，选择最适合的API架构模式：

| 架构模式 | 适用场景 | 优势 | 劣势 | 推荐指数 |
|---------|---------|------|------|----------|
| **统一API** | • 中小型项目<br>• 业务关联度高<br>• 团队规模较小 | • 简单易维护<br>• 统一版本管理<br>• 成本较低 | • 性能瓶颈<br>• 部署耦合 | ⭐⭐⭐ |
| **分布式API** | • 大型企业应用<br>• 业务域独立<br>• 多团队协作 | • 完全隔离<br>• 独立优化<br>• 技术栈灵活 | • 运维复杂<br>• 数据一致性 | ⭐⭐⭐⭐ |
| **微服务架构** | • 复杂企业系统<br>• 高并发场景<br>• 多语言栈 | • 最佳扩展性<br>• 故障隔离<br>• 独立部署 | • 复杂度最高<br>• 服务治理 | ⭐⭐⭐⭐⭐ |
| **混合架构** | • 渐进式演进<br>• 部分独立需求<br>• 平衡型项目 | • 平衡复杂度<br>• 渐进演进<br>• 灵活配置 | • 设计复杂<br>• 需要规划 | ⭐⭐⭐⭐ |
| **API网关** | • 统一入口需求<br>• 安全要求高<br>• 流量控制 | • 统一管理<br>• 安全控制<br>• 负载均衡 | • 单点风险<br>• 网关复杂 | ⭐⭐⭐⭐ |

### 快速决策树

```
开始
  ↓
业务是否高度相关？
  ├─ 是 → 团队规模小于10人？
  │     ├─ 是 → 【统一API架构】
  │     └─ 否 → 【API网关模式】
  │
  └─ 否 → 是否需要独立部署？
        ├─ 是 → 团队技术能力强？
        │     ├─ 是 → 【微服务架构】
        │     └─ 否 → 【分布式API架构】
        │
        └─ 否 → 是否为现有系统升级？
              ├─ 是 → 【混合架构】
              └─ 否 → 【统一API架构】
```

### 数据隔离级别选择

| 隔离级别 | 安全性 | 复杂度 | 成本 | 适用行业 |
|---------|--------|--------|------|----------|
| **逻辑隔离** | ⭐⭐⭐ | ⭐⭐ | ⭐⭐ | 一般企业应用 |
| **API级隔离** | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐ | 电商、教育 |
| **服务级隔离** | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐ | 大型互联网 |
| **数据库级隔离** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | 金融、医疗 |

## API架构策略

DVHA 框架支持多种API架构模式，可以根据业务需求和技术架构选择最合适的方案。

### 统一API架构

所有管理端共享一个统一的API服务，适合小型到中型应用。

```js
// 统一API配置 - 所有管理端使用相同的API基础地址
const unifiedApiUrl = 'https://api.example.com'

// 统一数据提供者
const unifiedDataProvider = {
  getList: async (options, manage, auth) => {
    const response = await fetch(`${unifiedApiUrl}${options.path}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Manage-Type': manage.config.name, // 通过Header标识管理端类型
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  },

  create: async (options, manage, auth) => {
    const response = await fetch(`${unifiedApiUrl}${options.path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Manage-Type': manage.config.name,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options.data)
    })
    return await response.json()
  }
  // ... 其他方法
}

const app = createDuxApp({
  // 全局API配置
  apiUrl: unifiedApiUrl,
  dataProvider: unifiedDataProvider, // 全局数据提供者

  manages: [
    {
      name: 'admin',
      title: '系统管理',
      routePrefix: '/admin'
      // 继承全局API配置
    },
    {
      name: 'merchant',
      title: '商家中心',
      routePrefix: '/merchant'
      // 继承全局API配置
    },
    {
      name: 'user',
      title: '用户中心',
      routePrefix: '/user'
      // 继承全局API配置
    }
  ]
})
```

**优势：**
- 简化架构，易于维护
- 统一的API版本管理
- 降低部署和运维成本
- 便于数据共享和一致性保证

**适用场景：**
- 业务关联度较高的管理端
- 团队规模较小的项目
- 对性能要求不是特别高的应用

### 分布式API架构

每个管理端使用独立的API服务，适合大型企业级应用。

```js
// 为每个管理端创建独立的数据提供者
const createDataProvider = (baseUrl, serviceName) => ({
  getList: async (options, manage, auth) => {
    const response = await fetch(`${baseUrl}${options.path}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Service': serviceName,
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  },

  create: async (options, manage, auth) => {
    const response = await fetch(`${baseUrl}${options.path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Service': serviceName,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options.data)
    })
    return await response.json()
  }
  // ... 其他方法
})

const app = createDuxApp({
  manages: [
    // 系统管理端 - 独立的管理API
    {
      name: 'admin',
      title: '系统管理',
      apiUrl: 'https://admin-api.example.com',
      dataProvider: createDataProvider(
        'https://admin-api.example.com',
        'admin-service'
      ),
      routePrefix: '/admin'
    },

    // 商家管理端 - 独立的商家API
    {
      name: 'merchant',
      title: '商家中心',
      apiUrl: 'https://merchant-api.example.com',
      dataProvider: createDataProvider(
        'https://merchant-api.example.com',
        'merchant-service'
      ),
      routePrefix: '/merchant'
    },

    // 用户中心 - 独立的用户API
    {
      name: 'user',
      title: '用户中心',
      apiUrl: 'https://user-api.example.com',
      dataProvider: createDataProvider(
        'https://user-api.example.com',
        'user-service'
      ),
      routePrefix: '/user'
    }
  ]
})
```

**优势：**
- 完全的业务隔离
- 独立的性能优化
- 技术栈多样性
- 团队并行开发

**适用场景：**
- 大型企业级应用
- 业务域相对独立
- 多团队协作开发
- 对性能和可扩展性要求较高

### 微服务架构

基于业务域的API分离，结合服务发现和负载均衡。

```js
// 服务发现配置
const serviceRegistry = {
  'user-service': 'https://user-service.example.com',
  'product-service': 'https://product-service.example.com',
  'order-service': 'https://order-service.example.com',
  'payment-service': 'https://payment-service.example.com',
  'notification-service': 'https://notification-service.example.com'
}

// 微服务数据提供者
const microserviceDataProvider = {
  getList: async (options, manage, auth) => {
    // 根据路径确定目标服务
    const serviceName = getServiceByPath(options.path)
    const serviceUrl = serviceRegistry[serviceName]

    if (!serviceUrl) {
      throw new Error(`Service not found: ${serviceName}`)
    }

    const response = await fetch(`${serviceUrl}${options.path}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Manage-Type': manage.config.name,
        'X-Request-ID': generateRequestId(),
        'Content-Type': 'application/json'
      }
    })

    return await response.json()
  },

  create: async (options, manage, auth) => {
    const serviceName = getServiceByPath(options.path)
    const serviceUrl = serviceRegistry[serviceName]

    const response = await fetch(`${serviceUrl}${options.path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Manage-Type': manage.config.name,
        'X-Request-ID': generateRequestId(),
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(options.data)
    })

    return await response.json()
  }
  // ... 其他方法
}

// 路径到服务的映射
const getServiceByPath = (path) => {
  const pathMappings = {
    '/users': 'user-service',
    '/products': 'product-service',
    '/orders': 'order-service',
    '/payments': 'payment-service',
    '/notifications': 'notification-service'
  }

  for (const [pathPrefix, service] of Object.entries(pathMappings)) {
    if (path.startsWith(pathPrefix)) {
      return service
    }
  }

  return 'default-service'
}

const app = createDuxApp({
  // 共享微服务数据提供者
  dataProvider: microserviceDataProvider,

  manages: [
    {
      name: 'admin',
      title: '系统管理',
      routePrefix: '/admin',
      // 管理端可以访问所有服务
      allowedServices: ['*']
    },
    {
      name: 'merchant',
      title: '商家中心',
      routePrefix: '/merchant',
      // 商家端只能访问特定服务
      allowedServices: [
        'product-service',
        'order-service',
        'notification-service'
      ]
    },
    {
      name: 'user',
      title: '用户中心',
      routePrefix: '/user',
      // 用户端只能访问用户相关服务
      allowedServices: [
        'user-service',
        'order-service',
        'payment-service'
      ]
    }
  ]
})
```

**优势：**
- 业务域清晰分离
- 独立部署和扩展
- 技术栈灵活选择
- 故障隔离能力强

**适用场景：**
- 复杂的企业级系统
- 高并发和高可用要求
- 多语言技术栈
- 微服务架构体系

### 混合架构

核心服务统一，业务服务分离的混合模式。

```js
// 混合架构配置
const hybridConfig = {
  // 核心统一服务
  coreServices: {
    auth: 'https://auth.example.com',
    user: 'https://user.example.com',
    system: 'https://system.example.com'
  },

  // 业务独立服务
  businessServices: {
    admin: 'https://admin-business.example.com',
    merchant: 'https://merchant-business.example.com',
    delivery: 'https://delivery-business.example.com'
  }
}

// 混合数据提供者
const createHybridDataProvider = (manageName) => ({
  getList: async (options, manage, auth) => {
    let serviceUrl

    // 判断是核心服务还是业务服务
    if (isCoreService(options.path)) {
      const serviceName = getCoreService(options.path)
      serviceUrl = hybridConfig.coreServices[serviceName]
    } else {
      serviceUrl = hybridConfig.businessServices[manageName]
    }

    const response = await fetch(`${serviceUrl}${options.path}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Manage-Type': manage.config.name,
        'Content-Type': 'application/json'
      }
    })

    return await response.json()
  }
  // ... 其他方法
})

// 核心服务判断
const isCoreService = (path) => {
  const corePathPrefixes = ['/auth', '/users', '/system', '/settings']
  return corePathPrefixes.some(prefix => path.startsWith(prefix))
}

const app = createDuxApp({
  manages: [
    {
      name: 'admin',
      title: '系统管理',
      dataProvider: createHybridDataProvider('admin'),
      routePrefix: '/admin'
    },
    {
      name: 'merchant',
      title: '商家中心',
      dataProvider: createHybridDataProvider('merchant'),
      routePrefix: '/merchant'
    }
  ]
})
```

**优势：**
- 核心功能统一管理
- 业务功能独立发展
- 平衡了复杂度和灵活性
- 便于渐进式架构演进

**适用场景：**
- 从单体向微服务演进
- 部分业务需要独立部署
- 核心功能相对稳定
- 业务功能快速迭代

### API网关模式

通过API网关统一入口，内部路由到不同服务。

```js
// API网关配置
const gatewayConfig = {
  gatewayUrl: 'https://gateway.example.com',
  routes: {
    admin: '/admin-service',
    merchant: '/merchant-service',
    user: '/user-service',
    common: '/common-service'
  }
}

// 网关数据提供者
const gatewayDataProvider = {
  getList: async (options, manage, auth) => {
    // 通过网关路由到具体服务
    const servicePath = gatewayConfig.routes[manage.config.name] || gatewayConfig.routes.common
    const fullUrl = `${gatewayConfig.gatewayUrl}${servicePath}${options.path}`

    const response = await fetch(fullUrl, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Manage-Type': manage.config.name,
        'X-Client-Version': '1.0.0',
        'Content-Type': 'application/json'
      }
    })

    return await response.json()
  }
  // ... 其他方法
}

const app = createDuxApp({
  // 所有管理端共享网关数据提供者
  dataProvider: gatewayDataProvider,

  manages: [
    {
      name: 'admin',
      title: '系统管理',
      routePrefix: '/admin'
    },
    {
      name: 'merchant',
      title: '商家中心',
      routePrefix: '/merchant'
    }
  ]
})
```

**优势：**
- 统一的访问入口
- 集中的安全控制
- 负载均衡和限流
- 服务发现和路由

**适用场景：**
- 需要统一的API管理
- 安全要求较高
- 需要流量控制
- 多服务协调场景

## 典型应用场景

### 企业级应用

```js
const app = createDuxApp({
  defaultManage: 'admin',
  manages: [
    // 系统管理端 - 超级管理员使用
    {
      name: 'admin',
      title: '系统管理',
      routePrefix: '/admin',
      authProvider: adminAuthProvider,
      dataProvider: adminDataProvider
    },

    // 企业管理端 - 企业管理员使用
    {
      name: 'enterprise',
      title: '企业管理',
      routePrefix: '/enterprise',
      authProvider: enterpriseAuthProvider,
      dataProvider: enterpriseDataProvider
    },

    // 部门管理端 - 部门负责人使用
    {
      name: 'department',
      title: '部门管理',
      routePrefix: '/dept',
      authProvider: departmentAuthProvider,
      dataProvider: departmentDataProvider
    },

    // 员工中心 - 普通员工使用
    {
      name: 'employee',
      title: '员工中心',
      routePrefix: '/employee',
      authProvider: employeeAuthProvider,
      dataProvider: employeeDataProvider
    }
  ]
})
```

### 电商平台

```js
const app = createDuxApp({
  defaultManage: 'platform',
  manages: [
    // 平台管理端 - 平台运营人员
    {
      name: 'platform',
      title: '平台管理',
      routePrefix: '/platform',
      authProvider: platformAuthProvider,
      dataProvider: platformDataProvider,
      menus: [
        { name: 'dashboard', label: '平台概览', path: 'dashboard' },
        { name: 'merchants', label: '商家管理', path: 'merchants' },
        { name: 'categories', label: '分类管理', path: 'categories' },
        { name: 'orders', label: '订单监控', path: 'orders' }
      ]
    },

    // 商家管理端 - 商家使用
    {
      name: 'merchant',
      title: '商家中心',
      routePrefix: '/merchant',
      authProvider: merchantAuthProvider,
      dataProvider: merchantDataProvider,
      register: true,
      forgotPassword: true,
      menus: [
        { name: 'dashboard', label: '店铺概览', path: 'dashboard' },
        { name: 'products', label: '商品管理', path: 'products' },
        { name: 'orders', label: '订单管理', path: 'orders' },
        { name: 'finance', label: '财务中心', path: 'finance' }
      ]
    },

    // 用户中心 - 消费者使用
    {
      name: 'user',
      title: '用户中心',
      routePrefix: '/user',
      authProvider: userAuthProvider,
      dataProvider: userDataProvider,
      register: true,
      forgotPassword: true,
      menus: [
        { name: 'profile', label: '个人资料', path: 'profile' },
        { name: 'orders', label: '我的订单', path: 'orders' },
        { name: 'addresses', label: '收货地址', path: 'addresses' },
        { name: 'wallet', label: '我的钱包', path: 'wallet' }
      ]
    },

    // 配送管理端 - 物流人员使用
    {
      name: 'delivery',
      title: '配送管理',
      routePrefix: '/delivery',
      authProvider: deliveryAuthProvider,
      dataProvider: deliveryDataProvider,
      menus: [
        { name: 'dashboard', label: '配送概览', path: 'dashboard' },
        { name: 'routes', label: '配送路线', path: 'routes' },
        { name: 'drivers', label: '配送员管理', path: 'drivers' },
        { name: 'vehicles', label: '车辆管理', path: 'vehicles' }
      ]
    }
  ]
})
```

### SaaS平台

```js
const app = createDuxApp({
  defaultManage: 'admin',
  manages: [
    // SaaS管理端 - 平台管理员
    {
      name: 'admin',
      title: 'SaaS管理',
      routePrefix: '/admin',
      authProvider: adminAuthProvider,
      dataProvider: adminDataProvider,
      menus: [
        { name: 'dashboard', label: '平台概览', path: 'dashboard' },
        { name: 'tenants', label: '租户管理', path: 'tenants' },
        { name: 'billing', label: '计费管理', path: 'billing' },
        { name: 'monitoring', label: '系统监控', path: 'monitoring' }
      ]
    },

    // 租户管理端 - 企业管理员
    {
      name: 'tenant',
      title: '企业管理',
      routePrefix: '/tenant',
      authProvider: tenantAuthProvider,
      dataProvider: tenantDataProvider,
      menus: [
        { name: 'dashboard', label: '企业概览', path: 'dashboard' },
        { name: 'users', label: '用户管理', path: 'users' },
        { name: 'settings', label: '企业设置', path: 'settings' },
        { name: 'billing', label: '账单管理', path: 'billing' }
      ]
    },

    // 工作台 - 普通用户
    {
      name: 'workspace',
      title: '工作台',
      routePrefix: '/workspace',
      authProvider: workspaceAuthProvider,
      dataProvider: workspaceDataProvider,
      menus: [
        { name: 'dashboard', label: '工作台', path: 'dashboard' },
        { name: 'projects', label: '项目管理', path: 'projects' },
        { name: 'tasks', label: '任务管理', path: 'tasks' },
        { name: 'profile', label: '个人设置', path: 'profile' }
      ]
    }
  ]
})
```

## 数据隔离策略

基于选择的API架构，DVHA提供多种数据隔离实现方案，确保不同管理端间的数据安全和隔离。

### 基于统一API的数据隔离

在统一API架构下，通过业务逻辑层面实现数据隔离。

```js
// 基于管理端类型的数据过滤
const unifiedDataProvider = {
  getList: async (options, manage, auth) => {
    const response = await fetch(`${apiUrl}${options.path}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Manage-Type': manage.config.name,
        'X-Tenant-ID': auth.tenantId, // 租户隔离
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    // 客户端数据过滤（可选的额外安全层）
    return filterDataByManageType(data, manage.config.name)
  }
}

// 数据过滤函数
const filterDataByManageType = (data, manageType) => {
  if (manageType === 'user') {
    // 用户端只能看到自己的数据
    return data.filter(item => item.userId === auth.userId)
  } else if (manageType === 'merchant') {
    // 商家端只能看到自己店铺的数据
    return data.filter(item => item.merchantId === auth.merchantId)
  }
  // 管理端可以看到所有数据
  return data
}
```

### 基于分布式API的数据隔离

在分布式API架构下，通过物理隔离实现最高级别的数据安全。

```js
// 完全独立的数据库和API服务
const createIsolatedDataProvider = (config) => ({
  getList: async (options, manage, auth) => {
    // 每个管理端连接到独立的API服务
    const response = await fetch(`${config.apiUrl}${options.path}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Database': config.database, // 指定数据库
        'X-Schema': config.schema,     // 指定模式
        'Content-Type': 'application/json'
      }
    })
    return await response.json()
  }
})

const app = createDuxApp({
  manages: [
    {
      name: 'admin',
      dataProvider: createIsolatedDataProvider({
        apiUrl: 'https://admin-api.example.com',
        database: 'admin_db',
        schema: 'admin_schema'
      })
    },
    {
      name: 'merchant',
      dataProvider: createIsolatedDataProvider({
        apiUrl: 'https://merchant-api.example.com',
        database: 'merchant_db',
        schema: 'merchant_schema'
      })
    }
  ]
})
```

### 基于微服务的数据隔离

在微服务架构下，通过服务边界和数据域隔离。

```js
// 微服务数据隔离策略
const microserviceDataProvider = {
  getList: async (options, manage, auth) => {
    const serviceName = getServiceByPath(options.path)

    // 检查管理端是否有权限访问该服务
    if (!hasServiceAccess(manage.config.name, serviceName)) {
      throw new Error(`管理端 ${manage.config.name} 无权限访问 ${serviceName}`)
    }

    const serviceUrl = serviceRegistry[serviceName]
    const response = await fetch(`${serviceUrl}${options.path}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Manage-Type': manage.config.name,
        'X-Service-Domain': getServiceDomain(serviceName),
        'X-Data-Scope': getDataScope(manage.config.name, serviceName),
        'Content-Type': 'application/json'
      }
    })

    return await response.json()
  }
}

// 服务访问权限控制
const hasServiceAccess = (manageName, serviceName) => {
  const serviceAccessMap = {
    admin: ['*'], // 管理端可以访问所有服务
    merchant: ['product-service', 'order-service', 'merchant-service'],
    user: ['user-service', 'order-service'],
    delivery: ['delivery-service', 'order-service']
  }

  const allowedServices = serviceAccessMap[manageName] || []
  return allowedServices.includes('*') || allowedServices.includes(serviceName)
}

// 数据范围控制
const getDataScope = (manageName, serviceName) => {
  const scopeMap = {
    'admin': 'global',     // 全局数据访问
    'merchant': 'tenant',  // 租户级数据访问
    'user': 'personal',    // 个人数据访问
    'delivery': 'regional' // 区域数据访问
  }

  return scopeMap[manageName] || 'limited'
}
```

### 数据库级别隔离

针对最高安全要求的场景，实现物理数据库隔离。

```js
// 数据库级别隔离配置
const databaseConfigs = {
  admin: {
    host: 'admin-db.example.com',
    port: 5432,
    database: 'admin_system',
    user: 'admin_user',
    password: 'admin_pass',
    ssl: true
  },
  merchant: {
    host: 'merchant-db.example.com',
    port: 5432,
    database: 'merchant_system',
    user: 'merchant_user',
    password: 'merchant_pass',
    ssl: true
  },
  user: {
    host: 'user-db.example.com',
    port: 5432,
    database: 'user_system',
    user: 'user_user',
    password: 'user_pass',
    ssl: true
  }
}

// 为不同管理端创建独立的数据库连接
const createDatabaseProvider = (dbConfig) => ({
  getList: async (options, manage, auth) => {
    const db = await createConnection(dbConfig)
    try {
      // 使用独立的数据库连接查询
      const result = await db.query(
        buildQuery(options.path, options.filters),
        options.params
      )
      return result.rows
    } finally {
      await db.close()
    }
  },

  create: async (options, manage, auth) => {
    const db = await createConnection(dbConfig)
    try {
      const result = await db.query(
        buildInsertQuery(options.path, options.data),
        Object.values(options.data)
      )
      return result.rows[0]
    } finally {
      await db.close()
    }
  }
})

const app = createDuxApp({
  manages: [
    {
      name: 'admin',
      dataProvider: createDatabaseProvider(databaseConfigs.admin)
    },
    {
      name: 'merchant',
      dataProvider: createDatabaseProvider(databaseConfigs.merchant)
    },
    {
      name: 'user',
      dataProvider: createDatabaseProvider(databaseConfigs.user)
    }
  ]
})
```

### 租户级别隔离

在SaaS模式下，通过租户ID实现多租户数据隔离。

```js
// 多租户数据隔离
const createMultiTenantDataProvider = (baseUrl) => ({
  getList: async (options, manage, auth) => {
    // 确保所有请求都包含租户信息
    const tenantId = auth.tenantId || manage.config.defaultTenantId

    if (!tenantId) {
      throw new Error('缺少租户ID，无法访问数据')
    }

    const response = await fetch(`${baseUrl}${options.path}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Tenant-ID': tenantId,
        'X-Manage-Type': manage.config.name,
        'X-Data-Isolation': 'tenant', // 明确指定隔离级别
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    // 客户端再次验证数据属于正确的租户
    validateTenantData(data, tenantId)

    return data
  },

  create: async (options, manage, auth) => {
    const tenantId = auth.tenantId || manage.config.defaultTenantId

    // 自动添加租户ID到创建的数据中
    const dataWithTenant = {
      ...options.data,
      tenantId: tenantId,
      createdBy: auth.userId,
      createdFrom: manage.config.name
    }

    const response = await fetch(`${baseUrl}${options.path}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-Tenant-ID': tenantId,
        'X-Manage-Type': manage.config.name,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(dataWithTenant)
    })

    return await response.json()
  }
})

// 租户数据验证
const validateTenantData = (data, expectedTenantId) => {
  if (Array.isArray(data)) {
    data.forEach(item => {
      if (item.tenantId && item.tenantId !== expectedTenantId) {
        throw new Error('数据租户ID不匹配，可能存在数据泄露')
      }
    })
  } else if (data.tenantId && data.tenantId !== expectedTenantId) {
    throw new Error('数据租户ID不匹配，可能存在数据泄露')
  }
}
```

### API级别隔离

通过不同的API端点实现业务隔离。

```js
// API级别的路径隔离
const createApiIsolatedProvider = (config) => ({
  getList: async (options, manage, auth) => {
    // 根据管理端类型选择不同的API路径前缀
    const apiPath = getApiPath(manage.config.name, options.path)

    const response = await fetch(`${config.baseUrl}${apiPath}`, {
      headers: {
        'Authorization': `Bearer ${auth.token}`,
        'X-API-Version': config.apiVersion,
        'X-Source': manage.config.name,
        'Content-Type': 'application/json'
      }
    })

    return await response.json()
  }
})

// 根据管理端类型生成API路径
const getApiPath = (manageName, originalPath) => {
  const pathPrefixes = {
    admin: '/admin/api',
    merchant: '/merchant/api',
    user: '/user/api',
    delivery: '/delivery/api'
  }

  const prefix = pathPrefixes[manageName] || '/common/api'
  return `${prefix}${originalPath}`
}

// 应用配置
const app = createDuxApp({
  manages: [
    {
      name: 'admin',
      dataProvider: createApiIsolatedProvider({
        baseUrl: 'https://api.example.com',
        apiVersion: 'v1'
      })
    },
    {
      name: 'merchant',
      dataProvider: createApiIsolatedProvider({
        baseUrl: 'https://api.example.com',
        apiVersion: 'v1'
      })
    }
  ]
})
```

## 认证隔离策略

### 独立认证系统

```js
// 每个管理端使用完全独立的认证系统
const createAuthProvider = (authConfig) => ({
  login: async (params, manage) => {
    const response = await fetch(`${authConfig.baseUrl}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        manage: manage.config.name
      })
    })
    return await response.json()
  },

  check: async (params, manage) => {
    const response = await fetch(`${authConfig.baseUrl}/check`, {
      headers: {
        'Authorization': `Bearer ${params.token}`,
        'X-Manage': manage.config.name
      }
    })
    return await response.json()
  }
})

const app = createDuxApp({
  manages: [
    {
      name: 'admin',
      authProvider: createAuthProvider({
        baseUrl: 'https://admin-auth.example.com'
      })
    },
    {
      name: 'merchant',
      authProvider: createAuthProvider({
        baseUrl: 'https://merchant-auth.example.com'
      })
    }
  ]
})
```

### 统一认证中心

```js
// 使用统一的认证中心，通过角色和权限区分
const unifiedAuthProvider = {
  login: async (params, manage) => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...params,
        manage_type: manage.config.name
      })
    })

    const result = await response.json()

    // 检查用户是否有权限访问当前管理端
    if (!result.user.manages.includes(manage.config.name)) {
      return {
        success: false,
        message: '无权限访问此管理端'
      }
    }

    return result
  }
}
```

## 权限隔离策略

### 基于角色的权限控制

```js
// 不同管理端定义不同的角色体系
const rolePermissions = {
  admin: {
    'super_admin': ['*'],
    'system_admin': ['user.read', 'user.write', 'system.read'],
    'auditor': ['user.read', 'log.read']
  },

  merchant: {
    'shop_owner': ['product.*', 'order.*', 'finance.read'],
    'shop_manager': ['product.read', 'order.read', 'order.write'],
    'shop_staff': ['product.read', 'order.read']
  },

  user: {
    'vip_user': ['profile.*', 'order.*', 'wallet.*'],
    'normal_user': ['profile.*', 'order.read']
  }
}

// 在菜单配置中使用权限控制
const adminMenus = [
  {
    name: 'users',
    label: '用户管理',
    path: 'users',
    meta: {
      permissions: ['user.read']
    }
  }
]
```

### 基于管理端的权限控制

```js
// 权限检查中间件
const checkManagePermission = (manage, user) => {
  const userManages = user.manages || []

  if (!userManages.includes(manage.config.name)) {
    throw new Error(`用户无权限访问 ${manage.config.name} 管理端`)
  }

  return true
}

// 在数据提供者中使用
const secureDataProvider = {
  getList: async (options, manage, auth) => {
    checkManagePermission(manage, auth)

    // 继续执行数据获取逻辑
    const response = await fetch(`/api/${manage.config.name}${options.path}`)
    return await response.json()
  }
}
```

## 主题差异化

### 独立主题配置

```js
const app = createDuxApp({
  manages: [
    // 管理端 - 专业深色主题
    {
      name: 'admin',
      title: '系统管理',
      theme: {
        logo: '/admin-logo.png',
        darkLogo: '/admin-logo-dark.png',
        banner: '/admin-banner.jpg',
        primaryColor: '#1890ff',
        darkMode: true
      }
    },

    // 商家端 - 活力橙色主题
    {
      name: 'merchant',
      title: '商家中心',
      theme: {
        logo: '/merchant-logo.png',
        banner: '/merchant-banner.jpg',
        primaryColor: '#ff6600',
        darkMode: false
      }
    },

    // 用户端 - 温馨绿色主题
    {
      name: 'user',
      title: '用户中心',
      theme: {
        logo: '/user-logo.png',
        banner: '/user-banner.jpg',
        primaryColor: '#52c41a',
        darkMode: false
      }
    }
  ]
})
```

### 动态主题切换

```vue
<template>
  <div :class="themeClass">
    <!-- 管理端内容 -->
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useManage, useTheme } from '@duxweb/dvha-core'

const manage = useManage()
const { theme } = useTheme()

const themeClass = computed(() => {
  return `manage-${manage.config.name} theme-${theme.value}`
})
</script>

<style scoped>
.manage-admin {
  --primary-color: #1890ff;
  --bg-color: #001529;
}

.manage-merchant {
  --primary-color: #ff6600;
  --bg-color: #fff;
}

.manage-user {
  --primary-color: #52c41a;
  --bg-color: #f0f2f5;
}
</style>
```

## 部署策略

### 单应用部署

```bash
# 构建包含所有管理端的单一应用
npm run build

# 部署到单一域名，通过路由前缀区分
# example.com/admin   - 系统管理端
# example.com/merchant - 商家管理端
# example.com/user     - 用户中心
```

### 独立应用部署

```js
// 为每个管理端构建独立的应用
// admin.config.js
export default {
  manages: [
    {
      name: 'admin',
      title: '系统管理',
      routePrefix: '/', // 根路径
      // ... 其他配置
    }
  ]
}

// merchant.config.js
export default {
  manages: [
    {
      name: 'merchant',
      title: '商家中心',
      routePrefix: '/', // 根路径
      // ... 其他配置
    }
  ]
}
```

```bash
# 分别构建和部署
npm run build:admin   # 构建管理端应用
npm run build:merchant # 构建商家端应用

# 部署到不同子域名
# admin.example.com    - 系统管理端
# merchant.example.com - 商家管理端
# user.example.com     - 用户中心
```

### 微前端部署

```js
// 使用微前端架构，每个管理端作为独立的微应用
const microApps = [
  {
    name: 'admin',
    entry: 'https://admin.example.com',
    activeRule: '/admin'
  },
  {
    name: 'merchant',
    entry: 'https://merchant.example.com',
    activeRule: '/merchant'
  },
  {
    name: 'user',
    entry: 'https://user.example.com',
    activeRule: '/user'
  }
]
```

## 开发模式

### 独立开发

```bash
# 团队结构
admin-team/          # 系统管理端团队
├── src/
├── package.json
└── vite.config.js

merchant-team/       # 商家端团队
├── src/
├── package.json
└── vite.config.js

user-team/          # 用户端团队
├── src/
├── package.json
└── vite.config.js
```

### 共享开发

```bash
# 共享代码库结构
packages/
├── core/           # DVHA核心包
├── shared/         # 共享组件和工具
├── admin/          # 管理端代码
├── merchant/       # 商家端代码
└── user/          # 用户端代码

apps/
├── admin/          # 管理端应用
├── merchant/       # 商家端应用
└── user/          # 用户端应用
```

## 管理端通信

### 跨管理端导航

```js
// 管理端选择器组件
const ManageSelector = {
  setup() {
    const router = useRouter()
    const currentManage = useManage()

    const switchToManage = (manageName) => {
      const manage = useManage(manageName)

      // 检查用户是否有权限访问目标管理端
      if (hasAccessToManage(manageName)) {
        router.push(manage.getRoutePath(''))
      } else {
        // 重新登录或显示错误
        router.push(manage.getRoutePath('login'))
      }
    }

    return { switchToManage }
  }
}
```

### 数据共享

```js
// 跨管理端数据共享
const sharedDataProvider = {
  getSharedData: async (type) => {
    const response = await fetch(`/api/shared/${type}`)
    return await response.json()
  }
}

// 在不同管理端中使用共享数据
const { data: notifications } = useCustom({
  path: '/shared/notifications',
  dataProvider: sharedDataProvider
})
```


## 注意事项

### 架构相关
- **API选择**: 根据业务复杂度和团队能力选择合适的API架构模式
- **数据一致性**: 在分布式API架构下要特别注意跨服务的数据一致性
- **服务治理**: 微服务架构需要完善的服务监控、熔断、限流等治理机制
- **网络延迟**: 分布式架构会增加网络调用，需考虑延迟对用户体验的影响

### 安全相关
- **跨域安全**: 多API端点部署时需要正确配置CORS策略
- **令牌管理**: 不同管理端的认证令牌应该有适当的作用域限制
- **数据加密**: 敏感数据在传输和存储时都应该加密
- **访问控制**: 实施基于角色和资源的细粒度访问控制

### 性能相关
- **缓存策略**: 统一API下的缓存失效策略需要考虑多管理端的影响
- **负载均衡**: 分布式API需要合理的负载均衡策略
- **数据库连接**: 数据库级隔离会增加连接数，需要合理的连接池配置
- **监控指标**: 建立完善的性能监控指标和告警机制

### 开发维护
- **版本兼容**: 不同管理端和API服务间的版本兼容性管理
- **测试策略**: 多管理端环境下的集成测试和端到端测试策略
- **文档管理**: 维护各个API服务和管理端的文档同步
- **团队协作**: 制定清晰的团队协作和代码共享规范

### 运维部署
- **环境一致**: 确保开发、测试、生产环境的配置一致性
- **容灾备份**: 分布式架构下的数据备份和容灾恢复策略
- **日志聚合**: 多服务环境下的日志收集和分析策略
- **配置管理**: 统一的配置中心管理多个服务的配置

### 业务相关
- **用户体验**: 避免用户在不同管理端间迷失方向
- **数据迁移**: 架构升级时的数据迁移和业务连续性保证
- **业务隔离**: 确保不同管理端的业务逻辑完全独立
- **审计合规**: 满足不同业务域的审计和合规要求