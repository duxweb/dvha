import { defineComponent, onErrorCaptured, ref } from 'vue'
import { useRoute } from 'vue-router'

export const DuxException = defineComponent({
  name: 'DuxException',
  setup(_props, { slots }) {
    const data = ref<Record<string, any> | null>(null)
    const route = useRoute()

    onErrorCaptured((err) => {
      console.error(err)
      if (!route.name) {
        data.value = {
          title: '404',
          desc: 'Page not found',
        }
      }
      else {
        data.value = {
          title: '500',
          desc: err?.message || 'Internal Server Error',
        }
      }
      return false
    })

    return () => data.value
      ? (
          <div>
            <h1>{data.value?.title || 'Unknown'}</h1>
            <p>{data.value?.desc || 'Unknown Description'}</p>
            <p>Use config.components.exception to configure the exception layout</p>
          </div>
        )
      : slots.default?.()
  },
})
