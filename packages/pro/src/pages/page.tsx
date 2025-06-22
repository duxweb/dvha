import type { PropType } from 'vue'
import type { UseActionItem } from '../hooks/table/types'
import { NScrollbar } from 'naive-ui'
import { defineComponent, ref } from 'vue'

export const DuxPage = defineComponent({
  name: 'DuxPage',
  props: {
    padding: {
      type: Boolean,
      default: true,
    },
    actions: {
      type: Array as PropType<UseActionItem[]>,
      default: () => [],
    },
    card: {
      type: Boolean,
      default: true,
    },
    scrollbar: {
      type: Boolean,
      default: true,
    },
  },
  setup(props, { slots }) {
    // 滚动状态
    const isScrolled = ref(false)

    // 监听滚动事件
    const handleScroll = (e: Event) => {
      const target = e.target as HTMLElement
      isScrolled.value = target.scrollTop > 0
    }

    return () => {
      const cardClass = props.card ? 'bg-default dark:bg-muted rounded-md shadow-xs lg:dark:border lg:dark:border-muted' : ''
      const paddingClass = props.card && props.padding ? 'p-3' : ''
      const scrollClass = !props.scrollbar ? 'h-full' : ''

      const content = (
        <div class="h-full flex-1 flex gap-2 relative">
          <div class={`z-1 absolute top-0 left-0 w-full h-10 bg-linear-to-b from-[color-mix(in_oklch,theme(colors.primary.DEFAULT),white_95%)] dark:from-[color-mix(in_oklch,theme(colors.primary.DEFAULT),theme(colors.gray.950)_95%)] to-transparent pointer-events-none transition-opacity duration-300 ${isScrolled.value ? 'opacity-100' : 'opacity-0'}`} />
          {slots?.sideLeft?.()}
          {props.scrollbar
            ? (
                <NScrollbar
                  class={[cardClass, 'flex-1 min-w-0']}
                  contentClass={`${paddingClass} ${scrollClass}`}
                  onScroll={handleScroll}
                >
                  {slots.default?.()}
                </NScrollbar>
              )
            : (
                <div class={`${cardClass} ${paddingClass} ${scrollClass} flex-1 min-w-0`}>
                  {slots.default?.()}
                </div>
              )}
          {slots?.sideRight?.()}
        </div>
      )

      return content
    }
  },
})
