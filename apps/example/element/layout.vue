<script setup lang="ts">
import { useRouter } from 'vue-router'
import { DuxLogo, DuxTabRouterView, useMenu } from '@duxweb/dvha-core'

import { useElmTab, TreeMenu } from '@duxweb/dvha-elementui'
import 'element-plus/dist/index.css'

const { data, active, crumbs } = useMenu({})
const { props: tabsProps, tabs } = useElmTab()
const router = useRouter()

const handleMenuClick = (menu) => {
  router.push(menu.path)
}

</script>

<style>
body,
html {
  margin: 0;
  padding: 0;
}
</style>

<template>
  <div class="h-screen w-screen flex ">
    <div class="flex-none border-r-solid border-1 border-gray-2">

      <el-menu
        :default-active="active"
        class="border-none! flex flex-col h-full"
        :collapse="true"
        background-color="#333"
        text-color="#ccc"
        active-text-color="#1689F8"
      >
          <div class="flex items-center p-3 my-2">
            <DuxLogo highlight="fill-blue-600" :dark="true" />
          </div>
          <div class="flex-1 h-auto">
            <TreeMenu
              :menu-items="data"
              :on-menu-click="handleMenuClick"
            />
          </div>
          <div class="flex-none flex flex-col items-center gap-2 py-4">
          <el-avatar
            :size="38"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
        </div>
      </el-menu>

    </div>
    <div class="flex-1 w-auto flex flex-col ">
      <div class="flex flex-col bg-gray-1">

        <el-breadcrumb separator="/" class="p-4">
          <el-breadcrumb-item :to="{ path: '/elm' }">
            <div class="i-tabler:home"></div>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-for="crumb in crumbs" :key="crumb.path" :to="{ path: crumb.path }" >
            {{ crumb.label }}
          </el-breadcrumb-item>
        </el-breadcrumb>

        <el-tabs
          type="card"
          v-bind="tabsProps"
          closable
        >
          <el-tab-pane
            v-for="tab in tabs"
            :key="tab.path"
            :label="tab.label"
            :name="tab.path"
            :closable="!tab.meta?.lock"
            class="mb-0"

          />
        </el-tabs>


      </div>
      <div class="flex-1 h-auto">
      <DuxTabRouterView />
    </div>
    </div>
  </div>
</template>

<style>
.el-tabs__header {
  padding-left: 10px;
  padding-right: 10px;
  margin: 0;
}
.el-tabs--card>.el-tabs__header .el-tabs__item.is-active {
  background-color: #fff;
}
</style>