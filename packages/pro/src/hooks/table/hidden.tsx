import { get } from 'lodash-es'
import { defineComponent, ref } from 'vue'

const TableColumnHidden = defineComponent({
  name: 'TableColumnHidden',
  props: {
    value: {
      type: String,
      default: '',
    },
    percent: {
      type: Number,
      default: 30,
    },
  },
  setup(props) {
    const isHidden = ref(true)

    return () => {
      return props.value
        ? (
            <div
              class="flex justify-start items-center gap-1"

            >
              <div class="font-mono">
                {isHidden.value ? hidden(props.value, props.percent) : props.value}
              </div>
              <div
                class={[
                  'cursor-pointer  size-4 text-muted hover:text-primary transition-all duration-150',
                  isHidden.value ? 'i-tabler:eye' : 'i-tabler:eye-off',
                ]}
                onClick={() => {
                  isHidden.value = !isHidden.value
                }}
              />
            </div>
          )
        : '-'
    }
  },
})

export interface UseTableColumnHiddenProps {
  key?: string
  percent?: number
}

export function useTableColumnHidden() {
  const render = (props: UseTableColumnHiddenProps) => {
    return (rowData: Record<string, any>, _rowIndex: number) => {
      const value = get(rowData, props.key || '')

      return (
        <TableColumnHidden value={value} percent={props.percent} />
      )
    }
  }

  return {
    render,
  }
}

function hidden(value: string, percent: number = 30) {
  if (!value || value.length < 4) {
    return value
  }

  const totalLength = value.length
  // 计算需要隐藏的长度
  const hideLength = Math.ceil(totalLength * percent / 100)
  // 计算开始隐藏的位置，尽量在中间位置开始隐藏
  const startHideIndex = Math.floor((totalLength - hideLength) / 2)

  // 构建隐藏后的字符串
  return value.slice(0, startHideIndex) + '*'.repeat(hideLength) + value.slice(startHideIndex + hideLength)
}
