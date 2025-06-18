import type { PropType } from 'vue'
import { NCarousel } from 'naive-ui'
import { defineComponent } from 'vue'

export interface DuxCarouselData {
  src: string
  onClick: () => void
}

export const DuxCarousel = defineComponent({
  name: 'DuxCarousel',
  props: {
    height: {
      type: Number,
      default: 200,
    },
    data: Array as PropType<Array<DuxCarouselData | string>>,
  },
  setup(props) {
    return () => (
      <NCarousel
        draggable
        class="rounded-sm shadow-sm"
        style={{ height: `${props.height}px` }}
      >
        {props?.data?.map((item, key) => (
          <img
            key={key}
            class="w-full object-cover"
            style={{ height: `${props.height}px` }}
            src={typeof item === 'string' ? item : item.src}
            onClick={typeof item === 'string' ? undefined : item?.onClick}
          />
        ))}
      </NCarousel>
    )
  },
})
