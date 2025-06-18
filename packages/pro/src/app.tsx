import { DuxAppProvider } from '@duxweb/dvha-core'
import { NLoadingBarProvider } from 'naive-ui'
import { defineComponent, provide, ref } from 'vue'
import { RouterView } from 'vue-router'
import { DuxLoading } from './pages/loading'

export const DuxApp = defineComponent({
  name: 'DuxApp',
  props: {
  },
  setup() {
    const pageLoading = ref(true)
    provide('pageLoading', pageLoading)

    return () => (
      <NLoadingBarProvider>
        {pageLoading.value && <DuxLoading />}
        <DuxAppProvider>
          <RouterView />
        </DuxAppProvider>
      </NLoadingBarProvider>
    )
  },
})
