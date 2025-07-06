import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PageEditorComponent, PageEditorJsonProps } from '../../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NCheckbox, NInputNumber } from 'naive-ui'
import { defineComponent } from 'vue'
import { WidgetEditorSettingCard } from '../../designEditor'
import { DuxFormItem } from '../../form'
import { DuxImageUpload } from '../../upload'
import { DuxFormEditorItem, DuxFormEditorRule } from '../base/base'

const Comp = defineComponent({
  name: 'FormEditorImageUpload',
  props: {
    options: Object,
  },
  setup(props) {
    return () => (
      <DuxFormItem label={props.options?.label} description={props.options?.desc}>
        <DuxImageUpload {...props.options?.attr} />
      </DuxFormItem>
    )
  },
})

function Json(props?: PageEditorJsonProps): JsonSchemaNode {
  const { options, model } = props || {}

  return {
    tag: 'dux-form-item',
    attrs: {
      label: options?.label,
      description: options?.desc,
    },
    children: [
      {
        tag: 'dux-image-upload',
        attrs: {
          ...options?.attr,
          'v-model:value': [model, options?.name],
        },
      },
    ],
  }
}

const Setting = defineComponent({
  name: 'FormEditorImageUploadSetting',
  props: {
    value: {
      type: Object,
      default: {},
    },
  },
  setup(props, { emit }) {
    const data = useVModel(props, 'value', emit)
    const { t } = useI18n()

    return () => (
      <div class="">
        <DuxFormEditorItem v-model:value={props.value} />

        <WidgetEditorSettingCard title={t('components.formEditor.common.componentConfig')}>
          <DuxFormItem label={t('components.formEditor.common.maxCount')}>
            <NInputNumber
              v-model:value={data.value.attr.maxNum}
              min={1}
              placeholder={t('components.formEditor.imageUpload.maxNumPlaceholder')}
            />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.imageUpload.maxSize')}>
            <NInputNumber
              v-model:value={data.value.attr.maxSize}
              min={0}
              placeholder={t('components.formEditor.imageUpload.maxSizePlaceholder')}
            />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.status')}>
            <div class="w-full grid grid-cols-2">
              <NCheckbox
                label={t('components.formEditor.common.multiple')}
                v-model:checked={data.value.attr.multiple}
              />
              <NCheckbox
                label={t('components.formEditor.imageUpload.manager')}
                v-model:checked={data.value.attr.manager}
              />
            </div>
          </DuxFormItem>
        </WidgetEditorSettingCard>

        <DuxFormEditorRule v-model:value={data.value.rule} />
      </div>
    )
  },
})

export function duxFormEditorImageUpload(t): PageEditorComponent {
  return {
    name: 'dux-image-upload',
    icon: 'i-tabler:photo',
    label: t('components.formEditor.imageUpload.label'),
    group: 'form',
    component: props => <Comp {...props} />,
    setting: props => <Setting {...props} />,
    settingDefault: {
      label: t('components.formEditor.imageUpload.label'),
      name: 'images',
      attr: {
        maxSize: 5,
        multiple: false,
        manager: false,
      },
      rule: [],
    },
    json: Json,
  }
}
