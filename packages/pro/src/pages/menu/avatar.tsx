import type { DropdownOption } from 'naive-ui'
import type { VNodeChild } from 'vue'
import { useGetAuth, useI18n, useLogout, useManage, useTheme } from '@duxweb/dvha-core'
import { NDropdown } from 'naive-ui'
import { computed, defineComponent } from 'vue'
import { useRouter } from 'vue-router'
import { DuxAvatar } from '../../components'
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
    const { t } = useI18n()
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
        label: t(item.label || '', {}, item.label),
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

    const auth = useGetAuth()

    const options = computed(() => [
      {
        key: 'header',
        type: 'render',
        render: () => (
          <div class="flex gap-2 px-3 pb-1 pt-1 items-center ">
            <DuxAvatar round size={28} src={auth.info?.avatar} />
            <div class="flex flex-col">
              <div class="text-sm font-medium">{auth.info?.nickname}</div>
              <div class="text-xs text-muted">{auth.info?.username}</div>
            </div>
          </div>
        ),
      },
      {
        type: 'divider',
      },
      ...userMenu.value,
      {
        label: t('components.menu.language'),
        key: 'locale',
        icon: () => iconRender('i-tabler:language'),
        children: [
          ...(i18n.getLocales() || []).map(locale => ({
            label: () => labelCheckRender(t(`locale.${locale}`), i18n.getLocale() === locale),
            key: `locale.${locale}`,
          })),
        ],
      },
      {
        label: t('components.menu.color'),
        key: 'color',
        icon: () => iconRender('i-tabler:palette'),
        children: [
          {
            label: () => (
              <div class="flex gap-2 items-center w-30">
                <div class="size-2 rounded-full" style={{ backgroundColor: `rgb(var(--ui-color-primary))` }}></div>
                <div>{t('components.menu.primaryColor')}</div>
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
                <div>{t('components.menu.neutralColor')}</div>
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
        label: t('components.menu.theme'),
        key: 'theme',
        icon: () => iconRender('i-tabler:brightness-half'),
        children: [
          {
            label: () => labelCheckRender(t('components.menu.followSystem'), mode.value === 'auto'),
            key: 'theme.auto',
          },
          {
            label: () => labelCheckRender(t('components.menu.lightMode'), mode.value === 'light'),
            key: 'theme.light',
          },
          {
            label: () => labelCheckRender(t('components.menu.darkMode'), mode.value === 'dark'),
            key: 'theme.dark',
          },
        ],
      },
      {
        type: 'divider',
      },
      {
        label: t('components.menu.logout'),
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
              <DuxAvatar class="group-hover:shadow-lg" round size={28} src={auth.info?.avatar} />
            ),
            default: () => (
              <div class="flex flex-col">
                <div class="text-sm font-medium">{auth.info?.nickname}</div>
                <div class="text-xs text-muted">{auth.info?.username}</div>
              </div>
            ),

          }}

        </DuxMenuButton>

      </NDropdown>
    )
  },
})
