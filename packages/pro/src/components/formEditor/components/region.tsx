import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PageEditorComponent, PageEditorJsonProps } from '../../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NCheckbox, NInput } from 'naive-ui'
import { defineComponent } from 'vue'
import { WidgetEditorSettingCard } from '../../designEditor'
import { DuxFormItem } from '../../form'
import { DuxLevel } from '../../level'
import { DuxFormEditorItem, DuxFormEditorRule } from '../base/base'

const Comp = defineComponent({
  name: 'FormRegion',
  props: {
    options: Object,
  },
  setup(props) {
    return () => (
      <DuxFormItem label={props.options?.label} description={props.options?.desc}>
        <DuxLevel {...props.options?.attr} />
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
        tag: 'dux-level',
        attrs: {
          ...options?.attr,
          'v-model:value': [model, options?.name],
        },
      },
    ],
  }
}

const Setting = defineComponent({
  name: 'FormRegionSetting',
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

        <WidgetEditorSettingCard title={t('components.formEditor.config')}>

          <DuxFormItem label={t('components.formEditor.region.Path')}>
            <NInput v-model:value={data.value.attr.path} />
          </DuxFormItem>
          <DuxFormItem label={t('components.formEditor.region.labelField')}>
            <NInput v-model:value={data.value.attr.labelField} />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.region.valueField')}>
            <NInput v-model:value={data.value.attr.valueField} />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.status')}>
            <div class="w-full grid grid-cols-2">
              <NCheckbox
                label={t('components.formEditor.common.disabled')}
                v-model:checked={data.value.attr.disabled}
              />
            </div>
          </DuxFormItem>

        </WidgetEditorSettingCard>

        <DuxFormEditorRule v-model:value={data.value.rule} />
      </div>
    )
  },
})

export function duxFormEditorRegion(t): PageEditorComponent {
  return {
    name: 'region',
    icon: 'i-tabler:directions',
    label: t('components.formEditor.region.name'),
    group: 'select',
    component: props => <Comp {...props} />,
    setting: props => <Setting {...props} />,
    settingDefault: {
      label: t('components.formEditor.region.name'),
      name: 'region',
      attr: {
        path: '/region',
        valueField: 'id',
        labelField: 'name',
      },
      rule: [],
    },
    json: Json,
  }
}
