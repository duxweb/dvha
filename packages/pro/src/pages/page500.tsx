import { useI18n } from '@duxweb/dvha-core'
import { NButton } from 'naive-ui'
import { defineComponent } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { DuxPageStatus } from './pageStatus'

export const DuxPage500 = defineComponent({
  name: 'DuxPage500',
  setup(_props) {
    const route = useRoute()
    const router = useRouter()
    const { t } = useI18n()

    function refreshRoute() {
      router.push({ path: route.path, query: { ...route.query, t: Date.now() } })
    }

    return () => (
      <DuxPageStatus title={t('pages.500.title')} desc={t('pages.500.desc')}>
        {{
          default: () => <div><dux-draw-error /></div>,
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
