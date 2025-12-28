import type { ManipulateType } from 'dayjs'
import type { DatePickerProps } from 'naive-ui'
import type { PropType } from 'vue'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import dayjs from 'dayjs'
import { NDatePicker } from 'naive-ui'
import { computed, defineComponent, ref } from 'vue'

export type DateRangeValue = [number, number] | null

export type DuxDateUnit = 'minutes' | 'hours' | 'days'

export interface DuxDateTagOption {
  key?: string | number
  label?: string
  num?: number
  unit?: DuxDateUnit
  value?: DateRangeValue
  range?: () => DateRangeValue
  disabled?: boolean
}

function resolveRange(option: DuxDateTagOption): DateRangeValue {
  if (typeof option.range === 'function')
    return option.range()
  if (option.value)
    return option.value
  if (option.num && option.unit) {
    const end = option.unit === 'days'
      ? dayjs().endOf('day')
      : dayjs()
    const unit = toManipulateUnit(option.unit)
    const start = option.unit === 'days'
      ? end.subtract(option.num - 1, unit).startOf('day')
      : end.subtract(option.num, unit)
    return [start.valueOf(), end.valueOf()]
  }
  return null
}

function toManipulateUnit(unit: DuxDateUnit): ManipulateType {
  switch (unit) {
    case 'minutes':
      return 'minute'
    case 'hours':
      return 'hour'
    default:
      return 'day'
  }
}

const baseOptionClasses = [
  'inline-flex items-center justify-center px-3 py-1.5 rounded-md text-sm transition-colors duration-150 cursor-pointer select-none',
]

function makeOptionClasses(checked: boolean, disabled: boolean) {
  return [
    ...baseOptionClasses,
    checked
      ? 'text-primary  bg-primary/10'
      : 'text-default bg-transparent hover:text-primary',
    disabled && 'opacity-50 cursor-not-allowed',
  ]
}

const defaultOptions: DuxDateTagOption[] = [
  { key: '3d', num: 3, unit: 'days' },
  { key: '7d', num: 7, unit: 'days' },
  { key: '30d', num: 30, unit: 'days' },
]

function optionKey(option: DuxDateTagOption) {
  if (option.key !== undefined)
    return option.key
  if (option.label)
    return option.label
  if (option.unit && option.num !== undefined)
    return `${option.unit}-${option.num}`
  if (option.value)
    return `value-${option.value.join('-')}`
  return JSON.stringify(option)
}

function optionLabel(option: DuxDateTagOption, t: (path: string, args?: Record<string, any>) => string | undefined) {
  if (option.label)
    return option.label
  if (option.unit && option.num !== undefined && option.key) {
    const keyMap: Record<string | number, string> = {
      '3d': 'components.dateTag.recentThreeDays',
      '7d': 'components.dateTag.recentSevenDays',
      '30d': 'components.dateTag.recentThirtyDays',
    }
    if (keyMap[option.key])
      return t(keyMap[option.key])
  }
  if (option.unit && option.num !== undefined) {
    const unitMap: Record<DuxDateUnit, string> = {
      minutes: 'components.dateTag.recentMinutes',
      hours: 'components.dateTag.recentHours',
      days: 'components.dateTag.recentDays',
    }
    return t(unitMap[option.unit], { num: option.num })
  }
  return ''
}

export const DuxDateTag = defineComponent({
  name: 'DuxDateTag',
  props: {
    options: {
      type: Array as PropType<DuxDateTagOption[]>,
      default: () => defaultOptions,
    },
    value: {
      type: [Array, null] as PropType<DateRangeValue>,
      default: null,
    },
    defaultValue: {
      type: [Array, null] as PropType<DateRangeValue>,
      default: null,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    datePickerProps: {
      type: Object as PropType<Partial<DatePickerProps>>,
      default: undefined,
    },
    onUpdateValue: {
      type: Function as PropType<(value: DateRangeValue) => void>,
      default: undefined,
    },
  },
  emits: ['update:value', 'change'],
  setup(props, { emit }) {
    const { t } = useI18n()
    const model = useVModel(props, 'value', emit, {
      defaultValue: props.defaultValue,
    })
    const activeKey = ref<string | number | null>(null)

    const resolvedOptions = computed(() => props.options || defaultOptions)

    const applyRange = (range: DateRangeValue, key: string | number | null, triggerEvent = true) => {
      model.value = range
      activeKey.value = key
      if (triggerEvent) {
        props.onUpdateValue?.(range)
        emit('change', range)
      }
    }

    const handleOptionClick = (option: DuxDateTagOption) => {
      if (props.disabled || option.disabled)
        return
      const nextRange = resolveRange(option)
      applyRange(nextRange, optionKey(option))
    }

    const handlePickerUpdate = (range: DateRangeValue) => {
      applyRange(range, null)
    }

    return () => (
      <div class="flex gap-3">
        <div class="min-w-50">
          <NDatePicker
            class="w-full"
            type="daterange"
            value={model.value ?? null}
            clearable
            disabled={props.disabled}
            onUpdateValue={handlePickerUpdate}
            {...props.datePickerProps}
          />
        </div>
        <div class="flex flex-wrap gap-2">
          {resolvedOptions.value.map((option) => {
            const key = optionKey(option)
            const checked = activeKey.value === key
            const disabled = props.disabled || option.disabled || false
            return (
              <div
                key={String(key)}
                class={makeOptionClasses(checked, disabled)}
                onClick={() => handleOptionClick(option)}
              >
                {optionLabel(option, t)}
              </div>
            )
          })}
        </div>
      </div>
    )
  },
})
