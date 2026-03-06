---
layout: home
title: DVHA
titleTemplate: 少编译、更灵活的 Vue 中后台框架

hero:
  name: DVHA
  text: 少编译，更轻地做后台
  tagline: Less Build, More Delivery
  subtitle: 少编译 • 多管理端 • 远程页面 • JSON Schema
  mockUrl: "dux.cn"
  image:
    src: /images/hero.png
  actions:
    - theme: brand
      text: 快速开始
      link: /guide/started
    - theme: alt
      text: 什么是 DVHA
      link: /guide/overview
    - theme: alt
      text: 在 GitHub 查看
      link: https://github.com/duxweb/dvha
      target: _blank

features:
  - icon: bolt
    color: blue
    title: 开发更轻
    details: 很多场景下不必反复编译，远程页面、异步菜单、JSON Schema 都可以按需接入
  - icon: building-library
    color: green
    title: 多管理端内建
    details: 一个项目可同时支持 admin、merchant、user 等多个后台，各自独立配置
  - icon: squares-2x2
    color: purple
    title: 不绑死 UI
    details: 不强绑某个 UI 库，可自由组合 Naive UI、Element Plus 或业务组件
  - icon: queue-list
    color: orange
    title: 后台场景友好
    details: 登录、权限、菜单、路由、列表、表单等中后台高频能力可直接复用
  - icon: cloud-arrow-down
    color: indigo
    title: 动态扩展能力
    details: 支持远程页面、异步菜单、JSON Schema，让后台页面接入方式更灵活
  - icon: puzzle-piece
    color: amber
    title: 易扩展
    details: 配置清晰，适合长期维护，也适合逐步扩展成更复杂的后台系统

featuresConfig:
  title: 为什么 DVHA 更轻
  description: 重点不是堆更多模板，而是尽量减少编译、减少重复配置、减少多后台开发负担
  extraSection:
    title: 适合什么项目
    description: 特别适合页面多、角色多、管理端多，还希望保持开发轻量的中后台项目
    tags:
      - Vue 3
      - 少编译
      - 多管理端
      - 配置驱动
      - 远程页面
      - JSON Schema

quickStart:
  badge: 快速上手
  title: 快速开始
  subtitle: 几步完成基础接入
  description: 安装核心包并创建最小配置
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
      description: "配置管理端、provider 与基础能力"
      code: "import { createDux } from '@duxweb/dvha-core'"
    - step: "03"
      icon: "rocket-launch"
      color: "purple"
      title: "开始开发"
      description: "按需接入菜单、页面、远程组件或 JSON Schema"
      code: "pnpm dev"
  helpText: "想先理解 DVHA 到底适合什么场景？"
  helpLink: "/guide/overview"
  helpLinkText: "什么是 DVHA"
---
