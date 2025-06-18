import { useI18n } from '@duxweb/dvha-core'
import { defineComponent } from 'vue'
import { DuxDrawEmptyForm } from '../components/draw'
import { DuxPageStatus } from './pageStatus'

export const DuxPageLoading = defineComponent({
  name: 'DuxPageLoading',
  props: {},
  setup() {
    const { t } = useI18n()
    return () => (
      <DuxPageStatus title={t('pages.loading.title')} desc={t('pages.loading.desc')}>
        <DuxDrawEmptyForm />
      </DuxPageStatus>
    )
  },
})
