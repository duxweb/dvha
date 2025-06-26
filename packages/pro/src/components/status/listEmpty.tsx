import { useI18n } from '@duxweb/dvha-core'
import { defineComponent } from 'vue'
import { DuxDrawEmptyForm } from '../draw'

export const DuxListEmpty = defineComponent({
  name: 'DuxListEmpty',
  props: {
    title: String,
    desc: String,
    bordered: Boolean,
  },
  setup(props) {
    const { t } = useI18n()
    return () => (
      <div class="flex flex-col items-center justify-center gap-2 h-full">
        <DuxDrawEmptyForm class="max-h-120px" />
        <div class="text-lg text-default font-bold">
          { props?.title || t('pages.empty.title') }
        </div>
        <div class="text-muted">
          { props?.desc || t('pages.empty.desc') }
        </div>
      </div>
    )
  },
})
