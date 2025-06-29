import { defineComponent } from 'vue'

export const PanelItem = defineComponent({
  name: 'PanelItem',
  props: {
    title: {
      type: String,
      required: true,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class="flex flex-col gap-1">
        <div class="text-muted text-sm">
          {props.title}
        </div>
        <div>
          {slots.default?.()}
        </div>
      </div>
    )
  },
})
