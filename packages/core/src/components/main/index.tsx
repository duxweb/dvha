import type { PropType } from 'vue'
import type { IConfig } from '@/types'
import { defineComponent, h, provide, ref } from 'vue'
import { RouterView } from 'vue-router'

export default defineComponent({
  name: 'Dux',
  props: {
    config: {
      type: Object as PropType<IConfig>,
      required: true,
    },
  },
  setup(props, { slots }) {
    // 定义全局配置
    provide('dux.config', props.config)

    // 定义路由

    return () => (
      <RouterView />
    )
  },
})
