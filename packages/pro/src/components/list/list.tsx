import type { SlotsType } from 'vue'
import { computed, defineComponent } from 'vue'
import { DuxListLayout } from '../layout/list'

export interface ListPageSlotProps {
  item: Record<string, any>
  isChecked: (id: string | number) => boolean
  toggleChecked: (id: string | number) => void
}

export const DuxListPage = defineComponent({
  name: 'DuxListPage',
  props: {

  },
  extends: DuxListLayout,
  slots: Object as SlotsType<{
    default: (props: ListPageSlotProps) => any
    bottom: () => any
    tools: () => any
    actions: () => any
  }>,
  setup(props, { slots }) {
    const listProps = computed(() => {
      const { ...rest } = props
      return {
        ...rest,
      }
    })

    return () => (
      <DuxListLayout {...listProps.value}>
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
        }}
      </DuxListLayout>
    )
  },
})
