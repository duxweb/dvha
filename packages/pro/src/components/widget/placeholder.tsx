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
        <svg viewBox="0 0 200 120" style={style}>
          <defs>
            <linearGradient id="placeholderBg" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:rgb(var(--ui-color-primary));stop-opacity:0.08" />
              <stop offset="100%" style="stop-color:rgb(var(--ui-color-primary));stop-opacity:0.03" />
            </linearGradient>
          </defs>

          <rect width="200" height="120" fill="url(#placeholderBg)" rx="8" />

          <g fill="rgb(var(--ui-color-primary))" fill-opacity="0.4">
            <circle cx="60" cy="40" r="12" />
            <path d="M 40 70 L 80 70 L 100 50 L 140 70 L 160 50 L 200 70 L 200 120 L 40 120 Z" />
          </g>

          <g fill="rgb(var(--ui-color-primary))" fill-opacity="0.25">
            <circle cx="150" cy="25" r="1.5">
              <animate attributeName="opacity" values="0.25;0.5;0.25" dur="3s" repeatCount="indefinite" />
            </circle>
            <circle cx="170" cy="35" r="1">
              <animate attributeName="opacity" values="0.2;0.4;0.2" dur="4s" repeatCount="indefinite" />
            </circle>
          </g>

          <rect x="40" y="40" width="120" height="1" fill="rgb(var(--ui-color-primary))" fill-opacity="0.15" />
        </svg>
      )
    }
  },
})
