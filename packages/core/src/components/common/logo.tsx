import clsx from 'clsx'
import { defineComponent } from 'vue'

export const DuxLogo = defineComponent({
  name: 'DuxLogo',
  props: {
    dark: { type: Boolean, default: false },
    highlight: { type: String, default: 'fill-primary' },
  },
  setup(props) {
    return () => (
      <svg
        class="w-auto h-full"
        viewBox="0 0 400.893 121.787"
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          transform="translate(-6545.000000, -3038.106602) translate(6345.000000, 2899.000000) translate(200.000000, 132.393398)"
          fill-rule="nonzero"
          stroke="none"
          stroke-width="1"
          fill="none"
        >
          <path
            d="M0 62.607v50c0 8.284 6.716 15 15 15s15-6.716 15-15v-50c0-8.285-6.716-15-15-15s-15 6.715-15 15z"
            class={clsx([
              props.dark ? 'fill-white/90' : 'fill-black dark:fill-white/90',
            ])}
          />
          <path
            d="M60 7.607c33.137 0 60 26.863 60 60s-26.863 60-60 60h-5c-8.284 0-15-6.716-15-15 0-8.285 6.716-15 15-15h5c16.57 0 30-13.432 30-30 0-16.57-13.43-30-30-30H15c-8.284 0-15-6.716-15-15 0-8.285 6.716-15 15-15h45z"
            class={clsx([
              props.dark ? 'fill-white/90' : 'fill-black dark:fill-white/90',
            ])}
          />
          <path
            d="M201 7.607c33.137 0 60 26.863 60 60s-26.863 60-60 60h-46c-8.284 0-15-6.716-15-15 0-8.285 6.716-15 15-15h46c16.57 0 30-13.432 30-30 0-16.57-13.43-30-30-30h-45.5c-8.284 0-15-6.716-15-15 0-8.285 6.716-15 15-15H201z"
            class={clsx([
              props.dark ? 'fill-white/90' : 'fill-black dark:fill-white/90',
            ])}
            transform="translate(200.500000, 67.606602) rotate(90.000000) translate(-200.500000, -67.606602) "
          />
          <g transform="translate(279.106602, 6.713203)">
            <path
              d="M25.607 4.393 52.893 31.68c5.858 5.858 5.858 15.356 0 21.213-5.857 5.858-15.355 5.858-21.213 0L4.393 25.607c-5.857-5.858-5.857-15.356 0-21.214 5.858-5.857 15.356-5.857 21.214 0zm91.786 0c5.858 5.858 5.858 15.356 0 21.214L90.107 52.893c-5.858 5.858-15.356 5.858-21.214 0-5.857-5.857-5.857-15.355 0-21.213L96.18 4.393c5.858-5.857 15.356-5.857 21.213 0zm-64.5 64.5c5.858 5.858 5.858 15.356 0 21.214l-27.286 27.286c-5.858 5.858-15.356 5.858-21.214 0-5.857-5.857-5.857-15.355 0-21.213L31.68 68.893c5.858-5.857 15.356-5.857 21.213 0z"
              class={clsx([
                props.dark ? 'fill-white/90' : 'fill-black dark:fill-white/90',
              ])}
            />
            <path
              d="m90.107 68.893 27.286 27.287c5.858 5.858 5.858 15.356 0 21.213-5.857 5.858-15.355 5.858-21.213 0L68.893 90.107c-5.857-5.858-5.857-15.356 0-21.214 5.858-5.857 15.356-5.857 21.214 0z"
              class={clsx([
                props.highlight,
              ])}
            />
          </g>
        </g>
      </svg>
    )
  },
})
