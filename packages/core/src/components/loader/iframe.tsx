import { defineComponent } from 'vue'
import { useRoute } from 'vue-router'

export default defineComponent({
  name: 'DuxLoaderIframe',
  setup(_props) {
    const route = useRoute()
    return () => (
      <iframe src={route.meta?.url as string} style={{ width: '100%', height: '100%', border: 'none' }}></iframe>
    )
  },
})
