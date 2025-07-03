import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NInput } from 'naive-ui'
import { defineComponent } from 'vue'
import { WidgetEditorSettingCard } from '../../designEditor'
import { DuxFormItem } from '../../../components'

export const DuxFormEditorItem = defineComponent({
  name: 'DuxFormEditorItem',
  props: {
    value: {
      type: Object,
      default: [],
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const data = useVModel(props, 'value', emit)

    return () => (
      <WidgetEditorSettingCard title={t('components.formEditor.componentConfig')}>
        <DuxFormItem label={t('components.formEditor.common.label')} path="label">
          <NInput
            v-model:value={data.value.label}
          />
        </DuxFormItem>
        <DuxFormItem label={t('components.formEditor.common.name')}>
          <NInput
            v-model:value={data.value.name}
          />
        </DuxFormItem>
        <DuxFormItem label={t('components.formEditor.common.desc')}>
          <NInput
            v-model:value={data.value.desc}
          />
        </DuxFormItem>
      </WidgetEditorSettingCard>
    )
  },
})

export const DuxFormEditorRule = defineComponent({
  name: 'FormEditorInput',
  props: {
    value: {
      type: Array,
      default: [],
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const data = useVModel(props, 'value', emit)

    return () => (
      <WidgetEditorSettingCard title={t('components.formEditor.validation')}>
        <NInput
          v-model:value={data.value}
        />
      </WidgetEditorSettingCard>
    )
  },
})
