import { useI18n } from '@duxweb/dvha-core'
import { defineComponent } from 'vue'
import { DuxDrawEmptyForm } from '../components/draw'
import { DuxPageStatus } from './pageStatus'

export const DuxPageEmpty = defineComponent({
  name: 'DuxPageEmpty',
  props: {
    title: String,
    desc: String,
  },
  setup(props) {
    const { t } = useI18n()
    return () => (
      <DuxPageStatus title={props.title || t('pages.empty.title')} desc={props.desc || t('pages.empty.desc')}>
        <DuxDrawEmptyForm />
      </DuxPageStatus>
    )
  },
})
