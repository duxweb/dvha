import { defineComponent } from 'vue'

export const DuxPlaceholder = defineComponent({
  name: 'DuxPlaceholder',
  props: {
    width: {
      type: [Number, String],
      default: 'auto',
    },
    height: {
      type: [Number, String],
      default: 100,
    },
  },
  setup(props) {
    return () => {
      const style = {
        width: typeof props.width === 'number' ? `${props.width}px` : props.width,
        height: typeof props.height === 'number' ? `${props.height}px` : props.height,
      }

      return (
        <svg viewBox="0 0 100 100" style={style}>
          <rect
            x="1"
            y="1"
            width="98"
            height="98"
            rx="8"
            fill="rgb(var(--ui-color-primary))"
            fill-opacity="0.06"
          />

          <rect
            x="1"
            y="1"
            width="98"
            height="98"
            rx="8"
            fill="none"
            stroke="rgb(var(--ui-color-primary))"
            stroke-opacity="0.25"
            stroke-width="1.5"
            stroke-dasharray="5 5"
          />

          <g
            fill="none"
            stroke="rgb(var(--ui-color-primary))"
            stroke-opacity="0.45"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <rect x="30" y="34" width="40" height="32" rx="3" />
            <circle cx="62" cy="40" r="3" />
            <path d="M34 60 L46 48 L54 56 L58 52 L70 60" />
          </g>
        </svg>
      )
    }
  },
})
