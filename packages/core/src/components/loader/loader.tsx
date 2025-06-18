import { defineComponent, h, Suspense } from 'vue'
import { useManage } from '../../hooks'
import { DuxException } from '../status'
import { DuxRemoteRender } from './remote'

export default defineComponent({
  name: 'DuxLoaderRemote',
  setup(_props) {
    const { config } = useManage()

    const renderLoading = () => {
      const loadingComponent = config.components?.loading
      if (!loadingComponent) {
        return null
      }
      return h(loadingComponent)
    }

    return () => (
      <div class="app-remote-loader">
        <DuxException>
          <Suspense>
            {{
              default: () => <DuxRemoteRender />,
              fallback: () => renderLoading(),
            }}
          </Suspense>
        </DuxException>
      </div>
    )
  },
})
