import type { DropdownOption } from 'naive-ui'
import type { PropType, SlotsType, VNodeChild } from 'vue'
import clsx from 'clsx'
import { NButton, NDropdown } from 'naive-ui'
import { defineComponent } from 'vue'

export type DuxCardItemColor =
  | 'primary'
  | 'info'
  | 'success'
  | 'warning'
  | 'error'
  | 'slate'
  | 'gray'
  | 'zinc'
  | 'neutral'
  | 'stone'
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'purple'
  | 'fuchsia'
  | 'pink'
  | 'rose'

export interface DuxCardItemMenuItem {
  label: string
  key: string | number
  icon?: string
  disabled?: boolean
  onClick?: (item: DuxCardItemMenuItem) => void
}

export interface DuxCardItemExtendItem {
  label: string
  value?: VNodeChild
  desc?: string
  align?: 'left' | 'center' | 'right'
}

const colorMap: Record<DuxCardItemColor, { icon: string, iconBg: string, border: string, action: string }> = {
  primary: {
    icon: 'text-primary',
    iconBg: 'bg-primary/15',
    border: 'hover:border-primary',
    action: 'bg-primary/10 text-primary',
  },
  info: {
    icon: 'text-info',
    iconBg: 'bg-info/15',
    border: 'hover:border-info',
    action: 'bg-info/10 text-info',
  },
  success: {
    icon: 'text-success',
    iconBg: 'bg-success/15',
    border: 'hover:border-success',
    action: 'bg-success/10 text-success',
  },
  warning: {
    icon: 'text-warning',
    iconBg: 'bg-warning/15',
    border: 'hover:border-warning',
    action: 'bg-warning/10 text-warning',
  },
  error: {
    icon: 'text-error',
    iconBg: 'bg-error/15',
    border: 'hover:border-error',
    action: 'bg-error/10 text-error',
  },
  slate: {
    icon: 'text-slate-500',
    iconBg: 'bg-slate-500/15',
    border: 'hover:border-slate-500',
    action: 'bg-slate-500/10 text-slate-500',
  },
  gray: {
    icon: 'text-gray-500',
    iconBg: 'bg-gray-500/15',
    border: 'hover:border-gray-500',
    action: 'bg-gray-500/10 text-gray-500',
  },
  zinc: {
    icon: 'text-zinc-500',
    iconBg: 'bg-zinc-500/15',
    border: 'hover:border-zinc-500',
    action: 'bg-zinc-500/10 text-zinc-500',
  },
  neutral: {
    icon: 'text-neutral-500',
    iconBg: 'bg-neutral-500/15',
    border: 'hover:border-neutral-500',
    action: 'bg-neutral-500/10 text-neutral-500',
  },
  stone: {
    icon: 'text-stone-500',
    iconBg: 'bg-stone-500/15',
    border: 'hover:border-stone-500',
    action: 'bg-stone-500/10 text-stone-500',
  },
  red: {
    icon: 'text-red-500',
    iconBg: 'bg-red-500/15',
    border: 'hover:border-red-500',
    action: 'bg-red-500/10 text-red-500',
  },
  orange: {
    icon: 'text-orange-500',
    iconBg: 'bg-orange-500/15',
    border: 'hover:border-orange-500',
    action: 'bg-orange-500/10 text-orange-500',
  },
  amber: {
    icon: 'text-amber-500',
    iconBg: 'bg-amber-500/15',
    border: 'hover:border-amber-500',
    action: 'bg-amber-500/10 text-amber-500',
  },
  yellow: {
    icon: 'text-yellow-500',
    iconBg: 'bg-yellow-500/15',
    border: 'hover:border-yellow-500',
    action: 'bg-yellow-500/10 text-yellow-500',
  },
  lime: {
    icon: 'text-lime-500',
    iconBg: 'bg-lime-500/15',
    border: 'hover:border-lime-500',
    action: 'bg-lime-500/10 text-lime-500',
  },
  green: {
    icon: 'text-green-500',
    iconBg: 'bg-green-500/15',
    border: 'hover:border-green-500',
    action: 'bg-green-500/10 text-green-500',
  },
  emerald: {
    icon: 'text-emerald-500',
    iconBg: 'bg-emerald-500/15',
    border: 'hover:border-emerald-500',
    action: 'bg-emerald-500/10 text-emerald-500',
  },
  teal: {
    icon: 'text-teal-500',
    iconBg: 'bg-teal-500/15',
    border: 'hover:border-teal-500',
    action: 'bg-teal-500/10 text-teal-500',
  },
  cyan: {
    icon: 'text-cyan-500',
    iconBg: 'bg-cyan-500/15',
    border: 'hover:border-cyan-500',
    action: 'bg-cyan-500/10 text-cyan-500',
  },
  sky: {
    icon: 'text-sky-500',
    iconBg: 'bg-sky-500/15',
    border: 'hover:border-sky-500',
    action: 'bg-sky-500/10 text-sky-500',
  },
  blue: {
    icon: 'text-blue-500',
    iconBg: 'bg-blue-500/15',
    border: 'hover:border-blue-500',
    action: 'bg-blue-500/10 text-blue-500',
  },
  indigo: {
    icon: 'text-indigo-500',
    iconBg: 'bg-indigo-500/15',
    border: 'hover:border-indigo-500',
    action: 'bg-indigo-500/10 text-indigo-500',
  },
  violet: {
    icon: 'text-violet-500',
    iconBg: 'bg-violet-500/15',
    border: 'hover:border-violet-500',
    action: 'bg-violet-500/10 text-violet-500',
  },
  purple: {
    icon: 'text-purple-500',
    iconBg: 'bg-purple-500/15',
    border: 'hover:border-purple-500',
    action: 'bg-purple-500/10 text-purple-500',
  },
  fuchsia: {
    icon: 'text-fuchsia-500',
    iconBg: 'bg-fuchsia-500/15',
    border: 'hover:border-fuchsia-500',
    action: 'bg-fuchsia-500/10 text-fuchsia-500',
  },
  pink: {
    icon: 'text-pink-500',
    iconBg: 'bg-pink-500/15',
    border: 'hover:border-pink-500',
    action: 'bg-pink-500/10 text-pink-500',
  },
  rose: {
    icon: 'text-rose-500',
    iconBg: 'bg-rose-500/15',
    border: 'hover:border-rose-500',
    action: 'bg-rose-500/10 text-rose-500',
  },
}

export const DuxCardItem = defineComponent({
  name: 'DuxCardItem',
  props: {
    title: {
      type: String,
      default: '',
    },
    desc: {
      type: String,
      default: '',
    },
    icon: {
      type: String,
      default: '',
    },
    action: {
      type: String,
      default: '',
    },
    color: {
      type: String as PropType<DuxCardItemColor>,
      default: 'primary',
    },
    extends: {
      type: Array as PropType<DuxCardItemExtendItem[]>,
      default: () => [],
    },
    menu: {
      type: Array as PropType<DuxCardItemMenuItem[]>,
      default: () => [],
    },
  },
  emits: ['menuSelect'],
  slots: Object as SlotsType<{
    default: () => any
    action: () => any
    desc: () => any
    footer: () => any
  }>,
  setup(props, { emit, slots }) {
    const color = () => colorMap[props.color || 'primary'] || colorMap.primary

    const menuOptions = () => (props.menu || []).map((item) => {
      const option: DropdownOption = {
        label: item.label,
        key: item.key,
        disabled: item.disabled,
      }
      if (item.icon) {
        option.icon = () => <div class={clsx('size-4', item.icon)} />
      }
      return option
    })

    const handleMenuSelect = (key: string | number) => {
      const item = (props.menu || []).find(v => String(v.key) === String(key))
      if (!item) {
        return
      }
      item.onClick?.(item)
      emit('menuSelect', item)
    }

    return () => (
      <div
        class={clsx(
          'flex flex-col gap-4 rounded p-4 overflow-hidden transition-all bg-container bg-gradient-to-l via-transparent to-transparent border border-muted hover:shadow',
          color().border,
        )}
      >
        <div class="flex items-start justify-between">
          <div class="flex items-center gap-3 min-w-0">
            {props.icon
              ? (
                  <div class={clsx('flex size-10 shrink-0 items-center justify-center rounded-lg', color().iconBg)}>
                    <div class={clsx('text-lg', props.icon, color().icon)} />
                  </div>
                )
              : null}
            <div class="min-w-0">
              <div class="text-base truncate">
                {props.title || '-'}
              </div>
              {slots.desc?.()
                ? (
                    <div class="text-xs text-muted">
                      {slots.desc?.()}
                    </div>
                  )
                : props.desc
                  ? (
                      <div class="text-xs text-muted">
                        {props.desc}
                      </div>
                    )
                  : null}
            </div>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            {slots.action?.() || (props.action
              ? (
                  <div class={clsx('text-xs rounded px-2 py-1', color().action)}>
                    {props.action}
                  </div>
                )
              : null)}
            {props.menu?.length
              ? (
                  <NDropdown
                    trigger="click"
                    placement="bottom-end"
                    options={menuOptions()}
                    onSelect={handleMenuSelect}
                  >
                    <NButton size="small" quaternary circle>
                      {{
                        icon: () => <i class="i-tabler:dots-vertical" />,
                      }}
                    </NButton>
                  </NDropdown>
                )
              : null}
          </div>
        </div>

        {slots.default?.()}

        {props.extends?.length
          ? (
              <div class="grid grid-cols-2 gap-3 text-sm p-3 bg-black/2.5 dark:bg-white/5 rounded-md">
                {props.extends.map((item, index) => (
                  <div
                    key={index}
                    class={clsx(
                      'flex flex-col',
                      {
                        'items-end text-right': item.align === 'right',
                        'items-center text-center': item.align === 'center',
                      },
                    )}
                  >
                    <div class="text-muted truncate">
                      {item.label}
                    </div>
                    <div class="font-medium mt-1 truncate">
                      {item.value ?? item.desc ?? '-'}
                    </div>
                  </div>
                ))}
              </div>
            )
          : null}

        {slots.footer?.()}
      </div>
    )
  },
})
