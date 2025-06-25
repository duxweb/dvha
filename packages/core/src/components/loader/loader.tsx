import { defineComponent } from 'vue'
import { DuxException } from '../status'
import { DuxRemoteRender } from './remote'

export default defineComponent({
  name: 'DuxLoaderRemote',
  setup(_props) {

    return () => (
      <div class="app-remote-loader">
        <DuxException>
          <DuxRemoteRender />
        </DuxException>
      </div>
    )
  },
})
