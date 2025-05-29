import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'DVHA',
  description: '一个基于 Vue 且不含 UI 的中后台框架',
  base: '/dvha/',
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/guide/started' },
      { text: '社区', link: '/community' },
    ],

    sidebar: [
      {
        text: '指引',
        items: [
          { text: '概况', link: '/guide/overview' },
          { text: '快速开始', link: '/guide/started' },
          { text: '初始化项目', link: '/guide/init' },
          { text: '项目配置', link: '/guide/config' },
        ],
      },
      {
        text: '提供者',
        items: [
          { text: '数据提供者', link: '/providers/data' },
          { text: '认证提供者', link: '/providers/auth' },
          { text: '国际化提供者', link: '/providers/i18n' },
        ],
      },
      {
        text: '数据操作',
        items: [
          { text: '数据查询 (useList)', link: '/hooks/data/useList' },
          { text: '获取单条 (useOne)', link: '/hooks/data/useOne' },
          { text: '获取多条 (useMany)', link: '/hooks/data/useMany' },
          { text: '无限列表 (useInfiniteList)', link: '/hooks/data/useInfiniteList' },
          { text: '数据创建 (useCreate)', link: '/hooks/data/useCreate' },
          { text: '数据更新 (useUpdate)', link: '/hooks/data/useUpdate' },
          { text: '数据删除 (useDelete)', link: '/hooks/data/useDelete' },
          { text: '自定义查询 (useCustom)', link: '/hooks/data/useCustom' },
          { text: '自定义操作 (useCustomMutation)', link: '/hooks/data/useCustomMutation' },
          { text: '缓存失效 (useInvalidate)', link: '/hooks/data/useInvalidate' },
          { text: '选择器 (useSelect)', link: '/hooks/data/useSelect' },
          { text: '表单处理 (useForm)', link: '/hooks/data/useForm' },
          { text: '导出数据 (useExport)', link: '/hooks/data/useExport' },
        ],
      },
      {
        text: '认证操作',
        items: [
          { text: '用户登录 (useLogin)', link: '/hooks/auth/useLogin' },
          { text: '用户登出 (useLogout)', link: '/hooks/auth/useLogout' },
          { text: '认证检查 (useCheck)', link: '/hooks/auth/useCheck' },
          { text: '用户注册 (useRegister)', link: '/hooks/auth/useRegister' },
          { text: '忘记密码 (useForgotPassword)', link: '/hooks/auth/useForgotPassword' },
          { text: '重置密码 (useUpdatePassword)', link: '/hooks/auth/useUpdatePassword' },
          { text: '错误处理 (useError)', link: '/hooks/auth/useError' },
          { text: '获取认证信息 (useGetAuth)', link: '/hooks/auth/useGetAuth' },
          { text: '判断登录状态 (useIsLogin)', link: '/hooks/auth/useIsLogin' },
          { text: '权限检查 (useCan)', link: '/hooks/auth/useCan' },
        ],
      },
      {
        text: '常用操作',
        items: [
          { text: '配置信息 (useConfig)', link: '/hooks/common/useConfig' },
          { text: '主题管理 (useTheme)', link: '/hooks/common/useTheme' },
          { text: '数据客户端 (useClient)', link: '/hooks/common/useClient' },
          { text: '弹窗 (useOverlay)', link: '/hooks/common/useOverlay' },
          { text: '国际化 (useI18n)', link: '/hooks/common/useI18n' },
        ],
      },
      {
        text: '菜单路由',
        items: [
          { text: '路由配置', link: '/router/config' },
          { text: '菜单配置', link: '/router/menu' },
          { text: '路由跳转', link: '/router/redirect' },
          { text: '异步(远程)菜单', link: '/router/async' },
          { text: '菜单方法 (useMenu)', link: '/hooks/common/useMenu' },
        ],
      },
      {
        text: '管理端',
        items: [
          { text: '管理端配置', link: '/manage/overview' },
          { text: '多管理端', link: '/manage/multiple' },
          { text: '管理端方法 (useManage)', link: '/hooks/common/useManage' },
        ],
      },
      {
        text: '标签页',
        items: [
          { text: '标签组件', link: '/tabs/component' },
          { text: '标签页方法 (useTabs)', link: '/tabs/useTabs' },
        ],
      },
    ],

    socialLinks: [
      { icon: 'github', link: 'https://github.com/duxweb/dvha' },
    ],
  },
})
