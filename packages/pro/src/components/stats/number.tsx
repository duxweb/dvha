import type { PropType } from 'vue'
import { defineComponent } from 'vue'

export const DuxStatsNumber = defineComponent({
  name: 'DuxStatsNumber',
  props: {
    title: {
      type: String,
      default: '',
    },
    subtitle: {
      type: String,
      default: '',
    },
    value: {
      type: [Number, String],
      default: 0,
    },
    change: {
      type: Number,
      default: 0,
    },
    changeType: {
      type: String as PropType<'up' | 'down'>,
      default: 'up',
    },
  },
  setup(props) {
    const formatValue = (value: number | string) => {
      if (typeof value === 'number') {
        return value.toLocaleString()
      }
      return value
    }

    const getChangeIcon = (type?: 'up' | 'down') => {
      if (type === 'up') {
        return '▲'
      }
      if (type === 'down') {
        return '▼'
      }
      return ''
    }

    const getChangeColor = (type?: 'up' | 'down') => {
      if (type === 'up') {
        return 'text-success'
      }
      if (type === 'down') {
        return 'text-error'
      }
      return 'text-muted'
    }

    return () => (
      <div class="flex flex-col gap-1">
        <div class="flex items-baseline justify-between">
          <h3 class="text-sm text-muted">
            {props.title}
          </h3>

        </div>

        <div class="text-2xl font-bold text-default">
          {formatValue(props.value)}
        </div>

        <div class="flex flex-row gap-2 items-center text-sm">
          {props.subtitle && (
            <span class=" text-muted">
              {props.subtitle}
            </span>
          )}

          {props.change !== undefined && (
            <div class={[
              'flex items-center gap-1',
              getChangeColor(props.changeType),
            ]}
            >
              <span class="text-xs">
                {getChangeIcon(props.changeType)}
              </span>
              <span>
                {Math.abs(props.change)}
                %
              </span>
            </div>
          )}
        </div>

      </div>
    )
  },
})
