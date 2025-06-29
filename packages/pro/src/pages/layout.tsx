import { defineComponent } from 'vue'
import { RouterView, useRouter } from 'vue-router'
import { DuxGlobalLayout } from './layout/global'

export const DuxLayout = defineComponent({
  name: 'DuxLayout',
  setup() {
    const router = useRouter()
    console.log(router.getRoutes())
    return () => (
      <DuxGlobalLayout>
        <RouterView />
      </DuxGlobalLayout>
    )
  },
})
