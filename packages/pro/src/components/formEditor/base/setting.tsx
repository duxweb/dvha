import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NRadio, NRadioGroup } from 'naive-ui'
import { defineComponent } from 'vue'
import { WidgetEditorSettingCard } from '../../designEditor/editor/setting'
import { DuxFormItem } from '../../../components'

export const DuxFormEditorSettingPage = defineComponent({
  name: 'DuxFormEditorSettingPage',
  inheritAttrs: false,
  props: {
    value: {
      type: Object,
      default: () => ({}),
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const model = useVModel(props, 'value', emit)

    return () => (
      <div class="flex flex-col gap-2">
        <WidgetEditorSettingCard title={t('components.formEditor.setting.title')}>
          <DuxFormItem label={t('components.formEditor.common.formDirection')} path="labelPlacement">
            <NRadioGroup
              v-model:value={model.value.labelPlacement}
            >
              <div class='grid grid-cols-2 gap-2'>
              <NRadio value="left">
                {t('components.formEditor.common.leftAlign')}
              </NRadio>
              <NRadio value="top">
                {t('components.formEditor.common.topAlign')}
              </NRadio>
              <NRadio value="setting">
                {t('components.formEditor.common.settingAlign')}
              </NRadio>
              <NRadio value="page">
                {t('components.formEditor.common.pageAlign')}
              </NRadio>
              </div>
            </NRadioGroup>
          </DuxFormItem>
        </WidgetEditorSettingCard>
      </div>
    )
  },
})
