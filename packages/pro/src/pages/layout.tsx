import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import { DuxGlobalLayout } from './layout/global'

export const DuxLayout = defineComponent({
  name: 'DuxLayout',
  setup() {
    return () => (
      <DuxGlobalLayout>
        <RouterView />
      </DuxGlobalLayout>
    )
  },
})
