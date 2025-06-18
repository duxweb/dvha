import { useI18n } from '@duxweb/dvha-core'
import { NButton } from 'naive-ui'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DuxDrawEmpty } from '../components'
import { DuxPageStatus } from './pageStatus'

export const DuxPage404 = defineComponent({
  name: 'DuxPage404',

  setup(_props) {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()

    function refreshRoute() {
      router.push({ path: route.path, query: { ...route.query, t: Date.now() } })
    }

    return () => (
      <DuxPageStatus title={t('pages.404.title')} desc={t('pages.404.desc')}>
        {{
          default: () => <div><DuxDrawEmpty /></div>,
          action: () => (
            <NButton onClick={refreshRoute} renderIcon={() => <div class="n-icon i-tabler:refresh" />}>
              {t('components.button.refresh')}
            </NButton>
          ),
        }}
      </DuxPageStatus>
    )
  },
})

DuxPage404.displayName = 'DuxPage404'
