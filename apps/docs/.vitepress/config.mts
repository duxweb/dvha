import { defineConfig } from 'vitepress'

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: 'DVHA',
  description: '一个基于 Vue 且不含 UI 的中后台框架',
  base: '/dvha/',
  lastUpdated: true,
  themeConfig: {
    search: {
      provider: 'local',
    },
    lastUpdatedText: '最后更新时间',
    editLink: {
      pattern: 'https://github.com/duxweb/dvha/edit/main/apps/docs/:path',
      text: '在 GitHub 上编辑此页',
    },
    nav: [
      { text: '首页', link: '/' },
      { text: '文档', link: '/guide/started' },
      { text: 'Pro 版本', link: '/pro/' },
      { text: '社区', link: '/community' },
    ],

    sidebar: {
      '/pro/': [
        {
          text: 'Pro 版本',
          items: [
            { text: '产品介绍', link: '/pro/' },
            { text: '快速开始', link: '/pro/getting-started' },
            { text: '安装指南', link: '/pro/installation' },
            { text: '配置说明', link: '/pro/configuration' },
          ],
        },
        // {
        //   text: '组件库',
        //   items: [
        //     { text: '布局组件', link: '/pro/components/layout' },
        //     { text: '表格组件', link: '/pro/components/table' },
        //     { text: '表单组件', link: '/pro/components/form' },
        //     { text: '对话框组件', link: '/pro/components/dialog' },
        //   ],
        // },
        // {
        //   text: 'Hooks',
        //   items: [
        //     { text: '表格增强', link: '/pro/hooks/table' },
        //     { text: '表单处理', link: '/pro/hooks/form' },
        //     { text: '对话框管理', link: '/pro/hooks/dialog' },
        //     { text: '操作增强', link: '/pro/hooks/action' },
        //   ],
        // },
        // {
        //   text: '主题定制',
        //   items: [
        //     { text: '主题配置', link: '/pro/theme/config' },
        //     { text: '颜色系统', link: '/pro/theme/colors' },
        //     { text: '样式定制', link: '/pro/theme/styles' },
        //   ],
        // },
        // {
        //   text: '部署运维',
        //   items: [
        //     { text: '构建部署', link: '/pro/deploy/build' },
        //     { text: '环境配置', link: '/pro/deploy/environment' },
        //     { text: '性能优化', link: '/pro/deploy/optimization' },
        //   ],
        // },
      ],
      '/': [
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
            { text: '批量创建 (useCreateMany)', link: '/hooks/data/useCreateMany' },
            { text: '数据更新 (useUpdate)', link: '/hooks/data/useUpdate' },
            { text: '批量更新 (useUpdateMany)', link: '/hooks/data/useUpdateMany' },
            { text: '数据删除 (useDelete)', link: '/hooks/data/useDelete' },
            { text: '批量删除 (useDeleteMany)', link: '/hooks/data/useDeleteMany' },
            { text: '自定义查询 (useCustom)', link: '/hooks/data/useCustom' },
            { text: '自定义操作 (useCustomMutation)', link: '/hooks/data/useCustomMutation' },
            { text: '缓存失效 (useInvalidate)', link: '/hooks/data/useInvalidate' },
            { text: '选择器 (useSelect)', link: '/hooks/data/useSelect' },
            { text: '树形选择器 (useTree)', link: '/hooks/data/useTree' },
            { text: '导出数据 (useExport)', link: '/hooks/data/useExport' },
            { text: '导入数据 (useImport)', link: '/hooks/data/useImport' },
            { text: '导出 CSV (useExportCsv)', link: '/hooks/data/useExportCsv' },
            { text: '导入 CSV (useImportCsv)', link: '/hooks/data/useImportCsv' },
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
          text: '菜单路由',
          items: [
            { text: '路由配置', link: '/router/config' },
            { text: '菜单配置', link: '/router/menu' },
            { text: '路由跳转', link: '/router/redirect' },
            { text: '异步(远程)菜单', link: '/router/async' },
            { text: '菜单方法 (useMenu)', link: '/hooks/router/useMenu' },
          ],
        },
        {
          text: '高级功能',
          items: [
            { text: '表单处理 (useForm)', link: '/hooks/advanced/useForm' },
            { text: '扩展列表 (useExtendList)', link: '/hooks/advanced/useExtendList' },
            { text: '表单扩展 (useFormExtend)', link: '/hooks/advanced/useFormExtend' },
            { text: '表单验证 (useFormValidate)', link: '/hooks/advanced/useFormValidate' },
            { text: 'JSON 渲染 (useJson)', link: '/hooks/advanced/useJson' },
            { text: '上传 (useUpload)', link: '/hooks/advanced/useUpload' },
          ],
        },
        {
          text: '系统工具',
          items: [
            { text: '配置信息 (useConfig)', link: '/hooks/system/useConfig' },
            { text: '主题管理 (useTheme)', link: '/hooks/system/useTheme' },
            { text: '数据客户端 (useClient)', link: '/hooks/system/useClient' },
            { text: '国际化 (useI18n)', link: '/hooks/system/useI18n' },
            { text: '弹窗 (useOverlay)', link: '/hooks/system/useOverlay' },
          ],
        },
        {
          text: '管理端',
          items: [
            { text: '管理端配置', link: '/manage/overview' },
            { text: '多管理端', link: '/manage/multiple' },
            { text: '管理端方法 (useManage)', link: '/hooks/manage/useManage' },
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
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/duxweb/dvha' },
    ],
  },
})
