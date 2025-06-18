import type { PropType } from 'vue'
import clsx from 'clsx'
import { ceil } from 'lodash-es'
import { defineComponent } from 'vue'

export interface DuxDashboardQuickItemProps {
  icon?: string
  title?: string
  color?: 'primary' | 'info' | 'success' | 'warning' | 'error'
  onClick?: () => void
}

export const DuxDashboardQuickItem = defineComponent({
  name: 'DuxDashboardQuickItem',
  props: {
    icon: String,
    title: String,
    color: String as PropType<'primary' | 'info' | 'success' | 'warning' | 'error'>,
    onClick: Function as PropType<() => void>,
  },
  setup(props) {
    return () => (
      <div class="flex flex-col justify-center items-center ">
        <div
          class="flex flex-col gap-1  justify-center items-center p-2 pb-1 hover:bg-elevated cursor-pointer"
          onClick={props?.onClick}
        >
          <div class={clsx([
            'p-1 rounded flex justify-center items-center text-white',
            `bg-${props.color || 'primary'}`,
          ])}
          >
            <div class={clsx([
              'size-7',
              props.icon,
            ])}
            />
          </div>
          <div class="text-muted">
            {props.title}
          </div>
        </div>
      </div>
    )
  },
})

export const DuxDashboardQuick = defineComponent({
  name: 'DuxDashboardQuick',
  props: {
    data: Array as PropType<Array<DuxDashboardQuickItemProps>>,
    col: {
      type: Number,
      default: 6,
    },
  },
  setup(props, { slots }) {
    const colors = ['primary', 'info', 'success', 'warning', 'error']

    return () => (
      <div class={clsx([
        'grid gap-2',
        `grid-cols-${ceil(props.col / 2)}`,
        `xl:grid-cols-${props.col}`,
      ])}
      >
        {props.data?.map((item, key) => {
          const color = colors[key % colors.length]
          return (
            <DuxDashboardQuickItem
              icon={item?.icon}
              title={item?.title}
              color={color as any}
              onClick={item?.onClick}
              key={key}
            />
          )
        })}
        {slots.default?.()}
      </div>
    )
  },
})
