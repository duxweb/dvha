import clsx from 'clsx'
import { defineComponent } from 'vue'

export const DuxLogoIcon = defineComponent({
  name: 'DuxLogoIcon',
  props: {
    highlight: { type: String, default: 'fill-primary' },
  },
  setup(props) {
    return () => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 202.97 197.7"
        class={clsx([
          props.highlight,
        ])}
      >
        <path d="M170,94.52l-35.9-20.73-24.34,14,11.62,6.71a5,5,0,0,1,0,8.66L32.5,154.52a5,5,0,0,1-7.5-4.33V99.61a6.44,6.44,0,0,1,0-1.52V47.51a5,5,0,0,1,7.5-4.33l35,20.23,24.32-14L7.5.68A5,5,0,0,0,0,5V192.69A5,5,0,0,0,7.5,197L170,103.18A5,5,0,0,0,170,94.52Z" />
        <path d="M32.93,103.18l35.9,20.73,24.34-14-11.62-6.71a5,5,0,0,1,0-8.66l88.92-51.34a5,5,0,0,1,7.5,4.33V98.09a6.44,6.44,0,0,1,0,1.52v50.58a5,5,0,0,1-7.5,4.33l-35-20.23-24.32,14L195.47,197a5,5,0,0,0,7.5-4.33V5a5,5,0,0,0-7.5-4.33L32.93,94.52A5,5,0,0,0,32.93,103.18Z" />
      </svg>
    )
  },
})
