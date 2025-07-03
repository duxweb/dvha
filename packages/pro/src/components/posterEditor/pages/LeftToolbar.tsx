import type { PropType } from 'vue'
import { NButton, NTooltip } from 'naive-ui'
import { defineComponent } from 'vue'
import { elementConfigs } from '../elements'

export interface LeftToolbarProps {
  onAddElement: (type: string) => void
  canvasWidth: number
  canvasHeight: number
}

export const LeftToolbar = defineComponent({
  name: 'LeftToolbar',
  props: {
    onAddElement: {
      type: Function as PropType<(type: string) => void>,
      required: true,
    },
    canvasWidth: {
      type: Number,
      required: true,
    },
    canvasHeight: {
      type: Number,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class="p-4 bg-default border-r border-default flex flex-col gap-6">
        {elementConfigs.map(config => (
          <NTooltip>
            {{
              default: () => config.name,
              trigger: () => (
                <NButton
                  key={config.type}
                  text
                  size='large'
                  onClick={() => props.onAddElement(config.type)}
                >
                  {{
                    icon: () => <div class={config.icon} />,
                  }}
                </NButton>
              ),
            }}
          </NTooltip>

        ))}
      </div>
    )
  },
})
