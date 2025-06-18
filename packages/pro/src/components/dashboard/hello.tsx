import type { PropType } from 'vue'
import { defineComponent } from 'vue'

interface DuxDashboardHelloData {
  label: string
  value?: string
  onClick?: () => void
}

export const DuxDashboardHello = defineComponent({
  name: 'DuxDashboardHello',
  props: {
    title: String,
    desc: String,
    data: Array as PropType<Array<DuxDashboardHelloData>>,
  },
  setup(props) {
    return () => (
      <div class="rounded p-6 py-5 flex flex-col md:flex-row gap-4 items-center justify-between bg-primary text-sm text-white overflow-hidden relative border border-primary-6">
        <div class="flex flex-1 flex-col gap-1 text-center md:text-left">
          <div class="text-lg">
            {props.title}
          </div>
          <div class="opacity-70">
            {props.desc}
          </div>
        </div>
        <div class="flex justify-end divide-x divide-white/20">
          {props.data?.map((item, key) => (
            <div key={key} class="flex flex-col justify-center items-center px-4">
              <div>{item.label}</div>
              <div class="text-lg font-bold" onClick={item?.onClick}>
                {item.value || 0}
              </div>
            </div>
          ))}
        </div>

        <div class="absolute top-7 -right-20 rounded-full size-40 bg-white/8"></div>
        <div class="absolute top-0 -right-20 rounded-full size-50 bg-white/8"></div>
        <div class="absolute -top-7 -right-18 rounded-full size-60 bg-white/8"></div>
      </div>
    )
  },
})
