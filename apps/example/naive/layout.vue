<script setup lang="ts">
import type { GlobalThemeOverrides, MenuOption } from 'naive-ui'
import { DuxLogo, DuxTabRouterView, useI18n, useOverlay, useTheme } from '@duxweb/dvha-core'
import { useNaiveMenu, useNaiveTab } from '@duxweb/dvha-naiveui'
import { OverlaysProvider } from '@overlastic/vue'
import { darkTheme, lightTheme, NIcon } from 'naive-ui'
import { computed, h, onMounted } from 'vue'

import 'element-plus/dist/index.css'

const { options, active } = useNaiveMenu({})
const { props: tabsProps, tabs } = useNaiveTab()

const { mode, isDark, toggle, cssInit, setColor, getSceneColor, getSemanticColor } = useTheme()

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
    label: '色调',
    key: 'colors',
    icon: () => renderIcon('i-tabler:palette'),
    children: [
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-red-500' }),
          h('span', {}, 'Red'),
        ]),
        key: 'red',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-orange-500' }),
          h('span', {}, 'Orange'),
        ]),
        key: 'orange',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-amber-500' }),
          h('span', {}, 'Amber'),
        ]),
        key: 'amber',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-yellow-500' }),
          h('span', {}, 'Yellow'),
        ]),
        key: 'yellow',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-lime-500' }),
          h('span', {}, 'Lime'),
        ]),
        key: 'lime',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-green-500' }),
          h('span', {}, 'Green'),
        ]),
        key: 'green',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-emerald-500' }),
          h('span', {}, 'Emerald'),
        ]),
        key: 'emerald',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-teal-500' }),
          h('span', {}, 'Teal'),
        ]),
        key: 'teal',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-cyan-500' }),
          h('span', {}, 'Cyan'),
        ]),
        key: 'cyan',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-sky-500' }),
          h('span', {}, 'Sky'),
        ]),
        key: 'sky',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-blue-500' }),
          h('span', {}, 'Blue'),
        ]),
        key: 'blue',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-indigo-500' }),
          h('span', {}, 'Indigo'),
        ]),
        key: 'indigo',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-violet-500' }),
          h('span', {}, 'Violet'),
        ]),
        key: 'violet',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-purple-500' }),
          h('span', {}, 'Purple'),
        ]),
        key: 'purple',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-fuchsia-500' }),
          h('span', {}, 'Fuchsia'),
        ]),
        key: 'fuchsia',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-pink-500' }),
          h('span', {}, 'Pink'),
        ]),
        key: 'pink',
      },
      {
        group: 'colors',
        label: () => h('div', { class: 'flex items-center gap-2' }, [
          h('div', { class: 'w-4 h-4 bg-base-rose-500' }),
          h('span', {}, 'Rose'),
        ]),
        key: 'rose',
      },
    ],
  },
  {
    label: '灰阶',
    key: 'gray',
    icon: () => renderIcon('i-tabler:palette'),
    children: [
      {
        group: 'gray',
        label: 'gray',
        key: 'gray',
      },
      {
        group: 'gray',
        label: 'slate',
        key: 'slate',
      },
      {
        group: 'gray',
        label: 'zinc',
        key: 'zinc',
      },
      {
        group: 'gray',
        label: 'neutral',
        key: 'neutral',
      },
      {
        group: 'gray',
        label: 'stone',
        key: 'stone',
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

  if (option.group === 'gray') {
    setColor('gray', option.key as string)
  }

  if (option.group === 'colors') {
    setColor('primary', option.key as string)
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

onMounted(() => {
  cssInit()
})

const themeOverrides = computed<GlobalThemeOverrides>(() => {
  return {
    common: {
      // UI 色彩变量 - 主题色
      primaryColor: getSceneColor('primary'),
      primaryColorHover: getSceneColor('primary', 'hover'),
      primaryColorPressed: getSceneColor('primary', 'pressed'),
      primaryColorSuppl: getSceneColor('primary'),

      // UI 色彩变量 - 信息色
      infoColor: getSceneColor('info'),
      infoColorHover: getSceneColor('info', 'hover'),
      infoColorPressed: getSceneColor('info', 'pressed'),
      infoColorSuppl: getSceneColor('info'),

      // UI 色彩变量 - 成功色
      successColor: getSceneColor('success'),
      successColorHover: getSceneColor('success', 'hover'),
      successColorPressed: getSceneColor('success', 'pressed'),
      successColorSuppl: getSceneColor('success'),

      // UI 色彩变量 - 警告色
      warningColor: getSceneColor('warning'),
      warningColorHover: getSceneColor('warning', 'hover'),
      warningColorPressed: getSceneColor('warning', 'pressed'),
      warningColorSuppl: getSceneColor('warning'),

      // UI 色彩变量 - 错误色
      errorColor: getSceneColor('error'),
      errorColorHover: getSceneColor('error', 'hover'),
      errorColorPressed: getSceneColor('error', 'pressed'),
      errorColorSuppl: getSceneColor('error'),

      // UI 文字色彩 - 使用语义颜色
      textColorBase: getSemanticColor('text', 'base'),
      textColor1: getSemanticColor('text', 'highlighted'),
      textColor2: getSemanticColor('text', 'toned'),
      textColor3: getSemanticColor('text', 'muted'),
      textColorDisabled: getSemanticColor('text', 'dimmed'),

      // UI 背景色彩 - 使用语义颜色
      bodyColor: getSemanticColor('bg', 'base'),
      cardColor: getSemanticColor('bg', 'elevated'),
      modalColor: getSemanticColor('bg', 'elevated'),
      popoverColor: getSemanticColor('bg', 'elevated'),
      tableColor: getSemanticColor('bg', 'muted'),
      inputColor: getSemanticColor('bg', 'muted'),
      actionColor: getSemanticColor('bg', 'muted'),
      hoverColor: getSemanticColor('bg', 'accented'),

      // UI 边框色彩 - 使用语义颜色
      borderColor: getSemanticColor('border', 'base'),
      dividerColor: getSemanticColor('border', 'muted'),

      // 占位符和图标色彩
      placeholderColor: getSemanticColor('text', 'muted'),
      iconColor: getSemanticColor('text', 'muted'),
    },
  }
})
</script>

<template>
  <n-config-provider :theme="isDark ? darkTheme : lightTheme" :theme-overrides="themeOverrides">
    <n-message-provider>
      <OverlaysProvider>
        <div class="h-screen w-screen flex">
          <div class="bg-gray-100 dark:bg-gray-900 rounded flex flex-col gap-2 py-3 px-1 flex-none">
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

            <div class="flex-1 h-auto overflow-y-auto">
              <DuxTabRouterView />
            </div>
          </div>
        </div>
      </OverlaysProvider>
    </n-message-provider>
  </n-config-provider>
</template>

<style>
html {
  background-color: rgb(var(--ui-bg));
}
html.dark {
  color-scheme: dark;
}
</style>
