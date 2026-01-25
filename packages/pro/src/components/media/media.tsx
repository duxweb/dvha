import type { PropType, VNodeChild } from 'vue'
import { useResizeObserver } from '@vueuse/core'
import clsx from 'clsx'
import { NImageGroup, NTooltip } from 'naive-ui'
import { computed, defineComponent, nextTick, ref, watch } from 'vue'
import { DuxAvatar } from '../widget'
import { DuxImage } from '../widget/image'

export const DuxMedia = defineComponent({
  name: 'DuxMedia',
  props: {
    title: String,
    avatar: Boolean,
    // Support string(s) for default image/avatar rendering, or VNode / render fn for custom image area.
    image: [String, Array, Object, Function] as PropType<string | string[] | VNodeChild | (() => VNodeChild)>,
    desc: [String, Array<string>],
    extend: String,
    onClick: Function,
    imageWidth: {
      type: Number,
      default: 42,
    },
    imageHeight: {
      type: Number,
      default: 42,
    },
  },
  setup(props, { slots }) {
    const images = computed(() => {
      if (typeof props.image === 'string')
        return [props.image]
      if (Array.isArray(props.image))
        return props.image as string[]
      return []
    })
    const desc = computed(() => {
      return Array.isArray(props.desc) ? props.desc : props.desc !== undefined ? [props.desc] : []
    })

    const isCustomImage = computed(() => typeof props.image === 'function' || (props.image && typeof props.image === 'object' && !Array.isArray(props.image)))
    const hasAvatarArea = computed(() => isCustomImage.value || Boolean(props.avatar) || images.value.length > 0)

    const hasDesc = computed(() => Boolean(desc.value?.length) || Boolean(slots.desc))
    const titleRef = ref<HTMLElement | null>(null)
    const titleEllipsis = ref(false)

    const updateTitleEllipsis = async () => {
      await nextTick()
      const el = titleRef.value
      if (!el) {
        titleEllipsis.value = false
        return
      }
      // Single-line ellipsis uses width overflow; multi-line clamp uses height overflow.
      titleEllipsis.value = hasDesc.value
        ? el.scrollWidth > el.clientWidth
        : el.scrollHeight > el.clientHeight
    }

    watch([() => props.title, hasDesc], updateTitleEllipsis, { immediate: true })
    useResizeObserver(titleRef, updateTitleEllipsis)

    return () => (
      <div class="flex gap-2 items-center">
        {slots?.image && <div class="flex-none flex items-center gap-2">{slots?.image?.()}</div>}

        {hasAvatarArea.value && (
          <div class="flex-none flex items-center gap-2">
            {isCustomImage.value
              ? (typeof props.image === 'function' ? (props.image as any)() : props.image)
              : props.avatar
                ? (
                    <>
                      {images.value.length > 0
                        ? images.value.map((item, key) => (
                            <DuxAvatar key={key} src={item} round size={props.imageWidth} />
                          ))
                        : <DuxAvatar round size={props.imageWidth} />}
                    </>
                  )
                : (
                    <NImageGroup>
                      { images.value.map((item, key) => (
                        <DuxImage key={key} src={item} class="rounded" objectFit="cover" width={props.imageWidth} height={props.imageHeight} />
                      ))}
                    </NImageGroup>
                  )}
          </div>
        )}
        <div class="flex-1 flex flex-col min-w-0">
          <div class="flex gap-2 items-center">
            {slots.prefix?.()}
            {(props.title || slots.default) && (
              <NTooltip
                trigger="hover"
                disabled={!props.title || !titleEllipsis.value}
              >
                {{
                  default: () => props.title,
                  trigger: () => (
                    <div
                      ref={titleRef}
                      onClick={() => props.onClick?.()}
                      class={clsx([
                        'transition-all',
                        hasDesc.value ? 'truncate' : 'break-words',
                        props?.onClick && 'hover:text-primary cursor-pointer',
                      ])}
                      style={!hasDesc.value
                        ? {
                            display: '-webkit-box',
                            overflow: 'hidden',
                            WebkitBoxOrient: 'vertical',
                            WebkitLineClamp: 2,
                          }
                        : undefined}
                    >
                      {props.title || slots.default?.()}
                    </div>
                  ),
                }}
              </NTooltip>
            )}
          </div>
          {(desc?.value.length > 0 || slots.desc) && (
            <div class="text-sm text-muted flex flex-col gap-0">
              {desc?.value.map?.((item, key) => <div key={key} class="truncate">{item !== '' ? item : '-'}</div>)}
              {slots.desc?.() }
            </div>
          )}
        </div>
        {props?.extend && <div class="flex-none flex items-center gap-2 text-gray-7">{props?.extend}</div>}
        {slots?.extend && <div class="flex-none flex items-center gap-2 text-gray-7">{slots?.extend?.()}</div>}
      </div>
    )
  },
})
