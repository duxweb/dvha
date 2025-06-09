import type { DropdownOption } from 'naive-ui'
import type { VNodeChild } from 'vue'
import { useI18n, useTheme } from '@duxweb/dvha-core'
import { NAvatar, NButton, NDropdown } from 'naive-ui'
import { computed, defineComponent, watch } from 'vue'
import { useUI } from '../../../hooks/ui'
import DuxMenuButton from './button'

export default defineComponent({
  name: 'DuxMenuAvatar',
  setup() {
    const i18n = useI18n()
    const { mode, primaryColors, neutralColors, colorMapping, setColor, setMode } = useTheme()
    const { collapsed } = useUI()

    const labelCheckRender = (inner: VNodeChild, checked?: boolean) => {
      return (
        <div class="flex gap-2 items-center w-30">
          <div class="flex-1">{inner}</div>
          <div>
            {checked && <div class="i-tabler:check"></div>}
          </div>
        </div>
      )
    }

    const iconRender = (icon: string) => {
      return <div class={`${icon} size-4`} />
    }

    const options = computed(() => [
      {
        key: 'header',
        type: 'render',
        render: () => (
          <div class="flex gap-2 px-3 pb-1 pt-1 items-center ">
            <NAvatar round size={28} src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
            <div class="flex flex-col">
              <div class="text-sm font-medium">admin</div>
              <div class="text-xs text-muted">admin@example.com</div>
            </div>
          </div>
        ),
      },
      {
        type: 'divider',
      },
      {
        label: '个人资料',
        key: 'profile',
        icon: () => iconRender('i-tabler:user'),
      },
      {
        label: '设置',
        key: 'setting',
        icon: () => iconRender('i-tabler:settings'),
      },
      {
        type: 'divider',
      },
      {
        label: '语言',
        key: 'locale',
        icon: () => iconRender('i-tabler:language'),
        children: [
          {
            label: () => labelCheckRender('中文', i18n.getLocale() === 'zh-CN'),
            key: 'locale.zh-CN',
          },
          {
            label: () => labelCheckRender('English', i18n.getLocale() === 'en-US'),
            key: 'locale.en-US',
          },
        ],
      },
      {
        label: '颜色',
        key: 'color',
        icon: () => iconRender('i-tabler:palette'),
        children: [
          {
            label: () => (
              <div class="flex gap-2 items-center w-30">
                <div class="size-2 rounded-full" style={{ backgroundColor: `rgb(var(--ui-color-primary))` }}></div>
                <div>主题色</div>
              </div>
            ),
            key: 'color.primary',
            children: primaryColors.value?.map(color => ({
              label: () => labelCheckRender((
                <div class="flex gap-2 items-center">
                  <div class="size-2 rounded-full" style={{ backgroundColor: `rgb(var(--base-color-${color}-500))` }}></div>
                  <div>{color}</div>
                </div>
              ), colorMapping.value.primary === color,
              ),
              key: `color.primary.${color}`,
            })),
          },
          {
            label: () => (
              <div class="flex gap-2 items-center w-30">
                <div class="size-2 rounded-full" style={{ backgroundColor: `rgb(var(--ui-color-gray-600))` }}></div>
                <div>中性色</div>
              </div>
            ),
            key: 'color.neutral',
            children: neutralColors.value?.map(color => ({
              label: () => labelCheckRender((
                <div class="flex gap-2 items-center">
                  <div class="size-2 rounded-full" style={{ backgroundColor: `rgb(var(--base-color-${color}-600))` }}></div>
                  <div>{color}</div>
                </div>
              ), colorMapping.value.gray === color,
              ),
              key: `color.neutral.${color}`,
            })),
          },

        ],
      },
      {
        label: '主题',
        key: 'theme',
        icon: () => iconRender('i-tabler:brightness-half'),
        children: [
          {
            label: () => labelCheckRender('跟随系统', mode.value === 'auto'),
            key: 'theme.auto',
          },
          {
            label: () => labelCheckRender('亮色', mode.value === 'light'),
            key: 'theme.light',
          },
          {
            label: () => labelCheckRender('暗色', mode.value === 'dark'),
            key: 'theme.dark',
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        label: '查看文档',
        key: 'link.docs',
        icon: () => iconRender('i-tabler:link'),
      },
      {
        type: 'divider',
      },
      {
        label: '退出登录',
        key: 'logout',
        icon: () => iconRender('i-tabler:logout'),
      },
    ])

    function handleSelect(key: string, _item: DropdownOption) {
      const lastDotIndex = key.lastIndexOf('.')
      const [prefix, suffix] = lastDotIndex === -1
        ? [key, '']
        : [key.substring(0, lastDotIndex), key.substring(lastDotIndex + 1)]

      switch (prefix) {
        case 'locale':
          i18n.changeLocale(suffix)
          break
        case 'color.primary':
          setColor('primary', suffix)
          break
        case 'color.neutral':
          setColor('gray', suffix)
          break
        case 'theme':
          setMode(suffix as 'dark' | 'light' | 'auto')
          break
        case 'logout':
          console.log('退出登录')
          break
        default:
          console.log('未处理的选项:', prefix, suffix)
      }
    }

    return () => (
      <NDropdown
        options={options.value}
        placement="bottom-start"
        trigger="click"
        onSelect={handleSelect}
        width={200}
      >
        <DuxMenuButton quaternary>
          {{
            icon: () => (
              <NAvatar round size={28} src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
            ),
            default: () => (
              <div class="flex flex-col">
                <div class="text-sm font-medium">admin</div>
                <div class="text-xs text-muted">admin@example.com</div>
              </div>
            ),

          }}

        </DuxMenuButton>

      </NDropdown>
    )
  },
})
