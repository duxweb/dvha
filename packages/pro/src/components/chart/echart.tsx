import { computed, defineComponent } from 'vue'
import VChart from 'vue-echarts'
import { useEchartType } from '../../hooks'

export const DuxChart = defineComponent({
  name: 'DuxChart',
  props: {
    height: {
      type: String,
      default: '50px',
    },
    min: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String,
      default: 'bar',
    },
    option: {
      type: Object,
      default: {},
    },
    class: {
      type: String,
      default: '',
    },
  },
  extends: VChart,
  setup(props) {
    const chartProps = computed(() => {
      const { min, height, option, ...rest } = props
      return rest
    })

    const { option: chartOption } = useEchartType(props.type, {
      min: props.min,
      ...props.option,
    })

    return () => (
      <VChart
        style={{
          minHeight: props.height,
        }}
        {...chartProps.value}
        option={chartOption.value}
        autoresize
        theme="default"
        initOptions={{ renderer: 'svg' }}
      />
    )
  },
})
