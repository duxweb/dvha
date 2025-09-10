import type { PropType } from 'vue'
import { computed, defineComponent } from 'vue'

export const DuxCard = defineComponent({
  name: 'DuxCard',
  props: {
    size: {
      type: String as PropType<'none' | 'small' | 'medium' | 'large'>,
      default: 'none',
    },
    headerSize: {
      type: String as PropType<'none' | 'small' | 'medium' | 'large'>,
      default: 'medium',
    },
    footerSize: {
      type: String as PropType<'none' | 'small' | 'medium' | 'large'>,
      default: 'medium',
    },
    contentSize: {
      type: String as PropType<'none' | 'small' | 'medium' | 'large'>,
      default: 'medium',
    },
    divide: {
      type: Boolean,
      default: false,
    },
    headerClass: {
      type: String,
      default: '',
    },
    footerClass: {
      type: String,
      default: '',
    },
    contentClass: {
      type: String,
      default: '',
    },
    title: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    bordered: {
      type: Boolean,
      default: false,
    },
    shadow: {
      type: Boolean,
      default: true,
    },
    rounded: {
      type: Boolean,
      default: true,
    },
    headerBordered: {
      type: Boolean,
      default: false,
    },
    footerBordered: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String as PropType<'default' | 'elevated' | 'inverted'>,
      default: 'default',
    },
  },
  setup(props, { slots }) {
    const computedSize = (size: string) => {
      switch (size) {
        case 'small':
          return 'px-3 py-2'
        case 'large':
          return 'px-6 py-5'
        case 'medium':
          return 'px-4 py-3'
        case 'none':
        default:
          return ''
      }
    }

    const sizeClass = computed(() => {
      return computedSize(props.size)
    })
    const headerSizeClass = computed(() => {
      return computedSize(props.headerSize)
    })
    const footerSizeClass = computed(() => {
      return computedSize(props.footerSize)
    })
    const contentSizeClass = computed(() => {
      return computedSize(props.contentSize)
    })

    const typeClass = computed(() => {
      switch (props.type) {
        case 'elevated':
          return 'bg-elevated'
        case 'inverted':
          return 'bg-inverted'
        default:
          return 'bg-default dark:bg-muted/80'
      }
    })

    return () => (
      <div class={[
        'flex flex-col dark:border dark:border-muted/80',
        props.rounded && 'rounded',
        props.divide && 'divide-y divide-muted',
        props.shadow && 'shadow-xs',
        props.bordered && 'border border-muted',
        typeClass.value,
        sizeClass.value,
      ]}
      >
        {slots.header
          && (
            <div class={[
              headerSizeClass.value,
              props.headerClass,
              props.headerBordered || props.divide ? 'border-b border-muted' : 'pb-0',
            ]}
            >
              {slots.header?.()}
            </div>
          )}

        {props.title && (
          <div class={[
            'flex justify-between items-center',
            headerSizeClass.value,
            props.headerBordered || props.divide ? 'border-b border-muted' : 'pb-0',
            props.headerClass,
          ]}
          >
            <div class="flex flex-col">
              <div class="text-base">
                {props.title}
              </div>
              {props.description && (
                <div class="text-sm text-muted">
                  {props.description}
                </div>
              )}
            </div>
            {slots.headerExtra?.()}
          </div>
        )}
        <div class={['flex-1 min-h-0', (props.title || slots.header || slots.footer) && contentSizeClass.value, props.contentClass]}>
          {slots.default?.()}
        </div>
        {slots.footer && (
          <div class={[footerSizeClass.value, props.footerClass, props.footerBordered && 'border-t border-muted']}>
            {slots.footer?.()}
          </div>
        )}
      </div>
    )
  },
})
