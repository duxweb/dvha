import { NImage } from 'naive-ui'
import { defineComponent, h } from 'vue'
import { DuxPlaceholder } from './placeholder'

export const DuxImage = defineComponent({
  name: 'DuxImage',
  props: {
  },
  extends: NImage,
  setup(props) {
    return () => {
      const sizeClass = `size-${props.height}px`

      const image = (
        <svg viewBox="0 0 100 100" class={sizeClass}>
          <circle cx="50" cy="50" r="50" fill="rgb(var(--ui-color-primary))" fill-opacity="0.1" />
          <g fill="rgb(var(--ui-color-primary))" fill-opacity="0.65">
            <circle cx="50" cy="36" r="14" />
            <path d="M 50 54 C 30 54 15 69 15 87 L 15 100 L 85 100 L 85 87 C 85 69 70 54 50 54 Z" />
          </g>

          <g fill="rgb(var(--ui-color-primary))" fill-opacity="0.3">
            <circle cx="20" cy="20" r="1.5">
              <animate attributeName="r" values="1.5;2.5;1.5" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="80" cy="25" r="1">
              <animate attributeName="r" values="1;2;1" dur="4s" repeatCount="indefinite" />
            </circle>
          </g>
        </svg>
      )

      return (
        props.src
          ? (
              <NImage
                {...props}
                src={props.src}
              >
                {{
                  placeholder: () => <DuxPlaceholder width={props.width} height={props.height} />,
                  error: () => <DuxPlaceholder width={props.width} height={props.height} />,
                }}
              </NImage>
            )
          : h(image)
      )
    }
  },
})
