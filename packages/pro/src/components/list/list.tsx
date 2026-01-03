import type { SlotsType } from 'vue'
import { computed, defineComponent, ref } from 'vue'
import { DuxListLayout } from '../layout/list'

export interface ListPageSlotProps {
  item: Record<string, any>
  isChecked: (id: string | number) => boolean
  toggleChecked: (id: string | number) => void
}

export const DuxListPage = defineComponent({
  name: 'DuxListPage',
  props: {
    title: {
      type: String,
      default: '',
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
    default: (props: ListPageSlotProps) => any
    bottom: () => any
    tools: () => any
    actions: () => any
    sideLeft: () => any
    sideRight: () => any
  }>,
  setup(props, { slots, expose }) {
    const listLayoutRef = ref()
    
    const listProps = computed(() => {
      const { ...rest } = props
      return {
        ...rest,
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
              class="flex flex-col gap-3"
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
