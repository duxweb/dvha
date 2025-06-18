import { defineAsyncComponent, defineComponent } from 'vue'
import { useRoute } from 'vue-router'
import { useRouteStore } from '../../../stores'
import { sfcLoader } from './loader'

export const DuxRemoteRender = defineComponent({
  name: 'DuxRemoteRender',
  setup(_props) {
    const route = useRoute()
    const routeStore = useRouteStore()
    const info = routeStore.searchRouteName(route.name as string)

    const AsyncComp = defineAsyncComponent({
      loader: sfcLoader(info?.meta?.path),
    })

    return () => <AsyncComp />
  },
})
