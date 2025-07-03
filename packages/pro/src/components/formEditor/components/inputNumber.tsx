import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PageEditorComponent, PageEditorJsonProps } from '../../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NCheckbox, NInput, NInputNumber } from 'naive-ui'
import { defineComponent } from 'vue'
import { WidgetEditorSettingCard } from '../../designEditor'
import { DuxFormItem } from '../../form'
import { DuxFormEditorItem, DuxFormEditorRule } from '../base/base'

const Comp = defineComponent({
  name: 'FormEditorInputNumber',
  props: {
    options: Object,
  },
  setup(props) {
    const attr = props.options?.attr
    return () => (
      <DuxFormItem label={props.options?.label} description={props.options?.desc}>
        <div class="flex-1">
          <NInputNumber {...attr}>
            {{
              prefix: attr['v-slot:prefix'] ? () => attr['v-slot:prefix'] : undefined,
              suffix: attr['v-slot:suffix'] ? () => attr['v-slot:suffix'] : undefined,
            }}
          </NInputNumber>
        </div>
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
        tag: 'n-input-number',
        attrs: {
          ...options?.attr,
          'v-model:value': [model, options?.name],
        },
      },
    ],
  }
}

const Setting = defineComponent({
  name: 'FormEditorInputNumberSetting',
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
      <div>
        <DuxFormEditorItem v-model:value={props.value} />

        <WidgetEditorSettingCard title={t('components.formEditor.common.componentConfig')}>

          <DuxFormItem label={t('components.formEditor.common.placeholder')}>
            <NInput
              v-model:value={data.value.attr.placeholder}
            />
          </DuxFormItem>
          <DuxFormItem label={t('components.formEditor.common.minValue')}>
            <NInputNumber
              v-model:value={data.value.attr.min}
            />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.maxValue')}>
            <NInputNumber
              v-model:value={data.value.attr.max}
            />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.prefix')}>
            <NInput
              v-model:value={data.value.attr['v-slot:prefix']}
            />
          </DuxFormItem>
          <DuxFormItem label={t('components.formEditor.common.suffix')}>
            <NInput
              v-model:value={data.value.attr['v-slot:suffix']}
            />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.status')}>
            <div class="w-full grid grid-cols-2">
              <NCheckbox
                label={t('components.formEditor.common.readonly')}
                v-model:checked={data.value.attr.readonly}
              />
              <NCheckbox
                label={t('components.formEditor.common.disabled')}
                v-model:checked={data.value.attr.disabled}
              />
              <NCheckbox
                label={t('components.formEditor.common.clearable')}
                v-model:checked={data.value.attr.clearable}
              />
            </div>
          </DuxFormItem>

        </WidgetEditorSettingCard>

        <DuxFormEditorRule v-model:value={data.value.rule} />
      </div>
    )
  },
})

export function duxFormEditorInputNumber(t): PageEditorComponent {
  return {
    name: 'dux-input-number',
    icon: 'i-tabler:number',
    label: t('components.formEditor.inputNumber.label'),
    group: 'form',
    component: props => <Comp {...props} />,
    setting: props => <Setting {...props} />,
    settingDefault: {
      label: t('components.formEditor.inputNumber.label'),
      name: 'number',
      attr: {
      },
      rule: [],
    },
    json: Json,
  }
}
