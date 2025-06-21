import type { DropdownOption } from 'naive-ui'
import type { VNodeChild } from 'vue'
import { useI18n, useLogout, useManage, useTheme } from '@duxweb/dvha-core'
import { NAvatar, NDropdown } from 'naive-ui'
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import DuxMenuButton from './button'

export default defineComponent({
  name: 'DuxMenuAvatar',
  props: {
    collapsed: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const i18n = useI18n()
    const router = useRouter()
    const { config, getRoutePath } = useManage()
    const { mutate: logout } = useLogout()
    const { mode, primaryColors, neutralColors, colorMapping, setColor, setMode } = useTheme()

    const labelCheckRender = (inner: VNodeChild, checked?: boolean) => {
      return (
        <div class="flex gap-2 items-center w-30">
          <div class="flex-1 min-w-0">{inner}</div>
          <div>
            {checked && <div class="i-tabler:check"></div>}
          </div>
        </div>
      )
    }

    const iconRender = (icon: string) => {
      return <div class={`${icon} size-4`} />
    }

    const userMenu = computed(() => {
      const menu = config.userMenus?.map(item => ({
        label: item.label,
        key: item.key,
        icon: () => iconRender(item.icon),
        path: item.path,
      }))

      return menu?.length > 0
        ? [
            ...menu,
            {
              type: 'divider',
            },
          ]
        : []
    })

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
      ...userMenu.value,
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

    function handleSelect(key: string, item: DropdownOption) {
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
          logout()
          break
        default:
          if (!item?.path) {
            return
          }
          router.push(getRoutePath(item.path as string))
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
        <DuxMenuButton collapsed={props.collapsed}>
          {{
            icon: () => (
              <NAvatar class="group-hover:shadow-lg" round size={28} src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg" />
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
