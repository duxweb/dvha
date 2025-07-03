import type { PropType } from 'vue'
import type { PageEditorData } from '../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { defineComponent, ref } from 'vue'
import { DuxModalPage } from '../modal'
import { DuxFormRenderer } from './renderer'

export const DuxFormPreview = defineComponent({
  name: 'DuxFormPreview',
  props: {
    data: {
      type: Array as PropType<PageEditorData[]>,
      default: () => [],
    },
    config: {
      type: Object as PropType<Record<string, any>>,
      default: () => ({}),
    },
  },
  setup(props) {
    const { t } = useI18n()
    const formData = ref({})

    return () => (
      <DuxModalPage title={t('common.preview')}>
        <DuxFormRenderer
          v-model:value={formData.value}
          data={props.data}
          config={props.config}
        />
      </DuxModalPage>
    )
  },
})

export default DuxFormPreview
