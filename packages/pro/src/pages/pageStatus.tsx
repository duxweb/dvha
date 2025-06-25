import { defineComponent } from 'vue'
import { DuxCard } from '../components'

export const DuxPageStatus = defineComponent({
  name: 'DuxPageStatus',
  props: {
    title: String,
    desc: String,
    bordered: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    return () => (
      <DuxCard class="size-full flex items-center justify-center" bordered={props.bordered}>
        <div class="flex flex-col gap-6 justify-center items-center py-10">
          <div class="w-40">
            {slots.default?.()}
          </div>
          <div class="flex flex-col items-center justify-center gap-2">
            <div class="text-lg text-default font-bold">
              { props?.title }
            </div>
            <div class="text-muted">
              { props?.desc }
            </div>
          </div>
          <div class="flex justify-center items-center gap-4">
            {slots.action?.()}
          </div>
        </div>
      </DuxCard>
    )
  },
})
