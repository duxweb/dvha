import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'DuxIframe',
  setup(_props) {
    const route = useRoute()
    return () => (
      <iframe src={route.meta?.src as string} class="h-full w-full"></iframe>
    )
  },
})
