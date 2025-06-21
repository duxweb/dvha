import { defineComponent } from 'vue'
import { DuxMedia } from '../media'
import { DuxCard } from './card'

export const DuxStatsStore = defineComponent({
  name: 'DuxStatsStore',
  props: {
    title: String,
    avatar: String,
    desc: String,
  },
  setup(props, { slots }) {
    return () => (
      <DuxCard divide footerSize="small">
        {{
          header: () => (
            <div class="flex gap-2 items-center">
              <DuxMedia class="flex-1" avatar imageHeight={46} imageWidth={46} image={props.avatar} title={props.title} desc={props.desc} />
              <div>
                {slots.extra?.()}
              </div>
            </div>
          ),
          default: () => (
            <div class="flex flex-col">

              {slots.header
                ? (
                    <div class="flex flex-col bg-muted rounded p-4 text-muted">
                      {slots.header?.()}
                    </div>
                  )
                : null}

              <div class="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2 pt-2">
                {slots.default?.()}
              </div>
            </div>
          ),
          footer: slots.footer,
        }}
      </DuxCard>
    )
  },
})

export const DuxStatsStoreItem = defineComponent({
  name: 'DuxStatsStoreItem',
  props: {
    label: String,
    value: String,
  },
  setup(props) {
    return () => (
      <div class="flex flex-col items-center justify-center">
        <div class="text-lg font-bold">{props.value}</div>
        <div class="text-sm text-muted">{props.label}</div>
      </div>
    )
  },
})
