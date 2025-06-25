import clsx from 'clsx'
import { defineComponent, ref } from 'vue'

export const DuxCollapsePanel = defineComponent({
  name: 'DuxCollapsePanel',
  props: {
    title: String,
    desc: String,
    defaultShow: Boolean,
    highlight: Boolean,
  },
  setup(props, { slots }) {
    const show = ref(!!props.defaultShow)
    return () => (
      <div class={clsx([
        'border rounded-sm',
        props.highlight ? 'border-primary' : 'border-muted',
      ])}
      >
        <div class={clsx([
          'px-4 py-3 flex justify-between items-center',
          props.highlight ? 'bg-primary/10' : 'bg-gray/5',
        ])}
        >
          <div class="flex gap-2 items-start">
            <div class="pt-0.5">
              {slots.suffix?.()}
            </div>
            <div class="flex flex-col">
              <div class="font-medium text-base">{props?.title}</div>
              {props?.desc && <div class="text-muted">{props.desc}</div>}
            </div>
          </div>
          <div
            class={clsx([
              'p-2 rounded-full text-primary cursor-pointer',
              props.highlight ? 'bg-primary/10' : 'bg-gray/5',
            ])}
            onClick={() => show.value = !show.value}
          >
            <div
              class={clsx([
                'i-tabler:arrow-down size-4 transition-all',
                !show.value ? 'rotate-180' : '',
              ])}
            >
            </div>
          </div>
        </div>
        <div
          class={clsx('transition-all overflow-hidden', {
            'max-h-0': !show.value,
            'max-h-500': show.value,
          })}
        >
          <div class="p-4">
            {slots.default?.()}
          </div>
        </div>
      </div>
    )
  },
})
