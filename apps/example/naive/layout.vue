<script setup lang="ts">
import type { MenuOption } from 'naive-ui'
import { DuxLogo, DuxTabRouterView, useI18n, useOverlay, useTheme } from '@duxweb/dvha-core'
import { useNaiveMenu, useNaiveTab } from '@duxweb/dvha-naiveui'
import { darkTheme, lightTheme, NIcon } from 'naive-ui'

import { h } from 'vue'

import 'element-plus/dist/index.css'

const { options, active } = useNaiveMenu({})
const { props: tabsProps, tabs } = useNaiveTab()
const { mode, isDark, toggle } = useTheme()

function renderIcon(icon: string) {
  return h(NIcon, null, { default: () => h('div', { class: `${icon} size-4` }) })
}

const toolsOptions: MenuOption[] = [
  {
    label: '设置',
    key: 'setting',
    icon: () => renderIcon('i-tabler:settings'),
  },

  {
    label: '语言',
    key: 'locale',
    icon: () => renderIcon('i-tabler:language'),
    children: [
      {
        group: 'locale',
        label: '中文',
        key: 'zh-CN',
      },
      {
        group: 'locale',
        label: 'English',
        key: 'en-US',
      },
    ],
  },
  {
    label: () => {
      switch (mode.value) {
        case 'light':
          return '亮色'
        case 'dark':
          return '暗色'
        default:
          return '自动'
      }
    },
    key: 'theme',
    icon: () => {
      switch (mode.value) {
        case 'light':
          return renderIcon('i-tabler:sun')
        case 'dark':
          return renderIcon('i-tabler:moon')
        default:
          return renderIcon('i-tabler:brightness-half')
      }
    },
  },

]

const overlay = useOverlay()
const i18n = useI18n()

function handleTools(key: string, option: MenuOption) {
  if (key === 'theme') {
    toggle()
  }

  if (key === 'setting') {
    overlay.show({
      component: () => import('./setting.vue'),
    })
  }

  if (option.group === 'locale') {
    i18n.changeLocale(option.key as string)
  }
}
</script>

<template>
  <n-config-provider :theme="isDark ? darkTheme : lightTheme">
    <div class="h-screen w-screen flex dark:bg-gray-8">
      <div class="bg-gray-1 dark:bg-gray-9 rounded flex flex-col gap-2 py-3 px-1 flex-none">
        <div class="flex items-center justify-center p-2">
          <DuxLogo highlight="fill-green-600" />
        </div>
        <div class="flex-1 w-60px">
          <n-menu :options="options" :value="active" :collapsed="true" :collapsed-width="60" :collapsed-icon-size="20" />
        </div>

        <div class="flex-none w-60px">
          <n-menu :options="toolsOptions" value="home" :collapsed="true" :collapsed-width="64" :collapsed-icon-size="20" @update:value="handleTools" />
        </div>

        <div class="flex-none flex flex-col items-center gap-2">
          <n-avatar
            round
            :size="38"
            src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
          />
        </div>
      </div>
      <div class="flex-1 w-auto m-4 flex flex-col gap-2">
        <div class="flex justify-between items-center">
          <div class="flex flex-col">
            <div class="text-sm text-gray-500">
              {{ i18n.t('overview') }}
            </div>
            <div class="text-2xl font-bold">
              {{ i18n.t('hello') }}
            </div>
          </div>
          <div class="flex items-center gap-2">
            <n-button @click="toggle()">
              主题 {{ mode }}
            </n-button>
          </div>
        </div>

        <n-tabs
          type="card"
          tab-style="min-width: 80px;"
          v-bind="tabsProps"
        >
          <n-tab v-for="tab in tabs" :key="tab.path" :name="tab.path" :closable="!tab.meta?.lock">
            {{ tab.label }}
          </n-tab>
        </n-tabs>

        <DuxTabRouterView />
      </div>
    </div>
  </n-config-provider>
</template>

<style>
html.dark {
  color-scheme: dark;
}
</style>
