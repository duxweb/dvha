import type { SlotsType } from 'vue'
import { useElementSize, useWindowSize, watchDebounced } from '@vueuse/core'
import { computed, defineComponent, ref, toRef } from 'vue'
import { DuxListLayout } from '../layout/list'

export interface CardPageSlotProps {
  item: Record<string, any>
  isChecked: (id: string | number) => boolean
  toggleChecked: (id: string | number) => void
}

export const DuxCardPage = defineComponent({
  name: 'DuxCardPage',
  props: {
    title: {
      type: String,
      default: '',
    },
    colWidth: {
      type: Number,
      default: 320,
    },
    rows: {
      type: Number,
      default: 4,
    },
    maxRows: {
      type: Number,
      default: 10,
    },
    sideLeftTitle: {
      type: String,
      default: '',
    },
    sideRightTitle: {
      type: String,
      default: '',
    },
  },
  extends: DuxListLayout,
  slots: Object as SlotsType<{
    default: (props: CardPageSlotProps) => any
    bottom: () => any
    tools: () => any
    actions: () => any
    sideLeft: () => any
    sideRight: () => any
  }>,
  setup(props, { slots, expose }) {
    // 网格容器引用
    const gridContainerRef = ref<HTMLElement>()
    const listLayoutRef = ref()
    const { width } = useElementSize(gridContainerRef)
    const { width: windowWidth } = useWindowSize()

    // 计算网格样式
    const minColumnWidth = computed(() => {
      return props.colWidth || 320
    })

    // 计算网格条目数的函数
    const getGridItemCount = (containerWidth = 0) => {
      const actualWidth = containerWidth || windowWidth.value || 1024
      const minColWidth = props.colWidth || 320
      const baseRows = props.rows || 4
      const maxRows = props.maxRows || 10
      const gap = 0.25 * 16 * 3

      // 计算当前列数
      const cols = Math.max(1, Math.floor((actualWidth + gap) / (minColWidth + gap)))

      const standardScreenWidth = 1920
      const baseColumns = Math.floor((standardScreenWidth + gap) / (minColWidth + gap))
      const idealTotal = baseColumns * baseRows

      const adaptiveRows = Math.ceil(idealTotal / cols)

      const finalRows = Math.min(Math.max(adaptiveRows, baseRows), maxRows)

      return cols * finalRows
    }

    const pagination = toRef(props.pagination && typeof props.pagination === 'object'
      ? props.pagination
      : {
          page: 1,
          pageSize: getGridItemCount(),
        })

    watchDebounced([width], () => {
      if (props.pagination && typeof props.pagination === 'object') {
        return
      }

      const newPageSize = getGridItemCount(width.value)
      if (newPageSize === pagination.value.pageSize) {
        return
      }

      pagination.value.pageSize = newPageSize
      pagination.value.page = 1
    }, { debounce: 300 })

    const listProps = computed(() => {
      const { maxRows, rows, colWidth, ...rest } = props
      return {
        ...rest,
        pagination: pagination.value,
      }
    })

    expose({
      list: listLayoutRef,
    })

    return () => (
      <DuxListLayout ref={listLayoutRef} {...listProps.value}>
        {{
          default: result => (
            <div

              class="grid gap-3"
              style={{
                'grid-template-columns': `repeat(auto-fill, minmax(${minColumnWidth.value}px, 1fr))`,
                'justify-content': 'flex-start',
              }}
            >
              {result.list.value.map(item => slots?.default?.({
                item,
                isChecked: result.isChecked,
                toggleChecked: result.toggleChecked,
              }))}
            </div>
          ),
          actions: slots.actions,
          tools: slots.tools,
          bottom: slots.bottom,
          sideLeft: slots.sideLeft,
          sideRight: slots.sideRight,
        }}
      </DuxListLayout>
    )
  },
})
