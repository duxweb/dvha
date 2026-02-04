---
layout: home
title: DVHA
titleTemplate: 基于 Vue 的无头中后台框架

hero:
  name: DVHA
  text: 基于 Vue 的无头中后台框架
  tagline: Headless Admin for Vue
  subtitle: 灵活组合 • 多管理端 • 数据驱动
  mockUrl: "dux.cn"
  image:
    src: /images/hero.png    # 图片路径
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/started
    - theme: alt
      text: 配置说明
      link: /guide/config
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/duxweb/dvha
      target: _blank

features:
  - icon: squares-2x2
    color: blue
    title: 无头框架
    details: 不绑定 UI 库，可自由组合 Element Plus、Naive UI 等 Vue 生态
  - icon: building-library
    color: green
    title: 多管理端
    details: 内置多管理端配置，支持不同路由前缀与独立配置
  - icon: hook
    color: purple
    title: 数据 Hooks
    details: 提供列表、详情、增删改、无限滚动等常用数据能力
  - icon: shield-check
    color: orange
    title: 认证与权限
    details: 认证提供者与权限检查可扩展，配合路由元信息使用
  - icon: Lang
    color: indigo
    title: 国际化
    details: 内置 i18n provider 与切换能力
  - icon: puzzle-piece
    color: amber
    title: Pro 组件生态
    details: 可选 Pro 包提供页面与组件集合

featuresConfig:
  title: 为什么选择 DVHA
  description: 以配置驱动和可扩展能力为核心的中后台基础框架
  extraSection:
    title: 立即开始
    description: 按指南快速完成基础接入与管理端配置
    tags:
      - Vue 3
      - Headless
      - 多管理端
      - 数据 Hooks
      - 认证与权限
      - i18n

quickStart:
  badge: 快速上手
  title: 快速开始
  subtitle: 几步完成接入
  description: 安装核心包并创建基础配置
  steps:
    - step: "01"
      icon: "arrow-down-tray"
      color: "blue"
      title: "安装核心包"
      description: "安装 dvha-core"
      code: "pnpm add @duxweb/dvha-core"
    - step: "02"
      icon: "cog-8-tooth"
      color: "green"
      title: "创建配置"
      description: "使用 createDux 初始化"
      code: "import { createDux } from '@duxweb/dvha-core'"
    - step: "03"
      icon: "rocket-launch"
      color: "purple"
      title: "启动项目"
      description: "运行本地开发"
      code: "pnpm dev"
  helpText: "需要更详细的步骤？查看快速开始"
  helpLink: "/guide/started"
  helpLinkText: "快速开始"
---
