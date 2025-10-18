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
      return (
        props.src
          ? (
              <NImage
                {...props}
                src={props.src}
              >
                {{
                  placeholder: () => <DuxPlaceholder width={props.width} height={props.height} />,
                }}
              </NImage>
            )
          : h(DuxPlaceholder, { width: props.width, height: props.height })
      )
    }
  },
})
