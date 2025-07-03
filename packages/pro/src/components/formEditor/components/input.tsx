import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PageEditorComponent, PageEditorJsonProps } from '../../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NCheckbox, NInput, NInputNumber, NSelect } from 'naive-ui'
import { defineComponent } from 'vue'
import { WidgetEditorSettingCard } from '../../designEditor'
import { DuxFormItem } from '../../form'
import { DuxFormEditorItem, DuxFormEditorRule } from '../base/base'

const Comp = defineComponent({
  name: 'FormEditorInput',
  props: {
    options: Object,
  },
  setup(props) {
    return () => (
      <DuxFormItem label={props.options?.label} description={props.options?.desc}>
        <NInput {...props.options?.attr} inputProps={{ autocomplete: 'new-password' }} />
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
        tag: 'n-input',
        attrs: {
          ...options?.attr,
          'v-model:value': [model, options?.name],
        },
      },
    ],
  }
}

const Setting = defineComponent({
  name: 'FormEditorInputSetting',
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
          <DuxFormItem label={t('components.formEditor.common.inputType')}>
            <NSelect
              v-model:value={data.value.attr.type}
              options={[
                { label: t('components.formEditor.input.types.text'), value: 'text' },
                { label: t('components.formEditor.input.types.textarea'), value: 'textarea' },
                { label: t('components.formEditor.input.types.password'), value: 'password' },
              ]}
            />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.placeholder')}>
            <NInput
              v-model:value={data.value.attr.placeholder}
            />
          </DuxFormItem>
          <DuxFormItem label={t('components.formEditor.common.minLength')}>
            <NInputNumber
              v-model:value={data.value.attr.minlength}
            />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.maxLength')}>
            <NInputNumber
              v-model:value={data.value.attr.maxlength}
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
              <NCheckbox
                label={t('components.formEditor.common.showCount')}
                v-model:checked={data.value.attr.showCount}
              />
            </div>
          </DuxFormItem>

        </WidgetEditorSettingCard>
        <DuxFormEditorRule v-model:value={data.value.rule} />
      </div>
    )
  },
})

export function duxFormEditorInput(t): PageEditorComponent {
  return {
    name: 'dux-input',
    icon: 'i-tabler:cursor-text',
    label: t('components.formEditor.input.label'),
    group: 'form',
    component: props => <Comp {...props} />,
    setting: props => <Setting {...props} />,
    settingDefault: {
      label: t('components.formEditor.input.label'),
      name: 'text',
      attr: {
        type: 'text',
      },
      rule: [],
    },
    json: Json,
  }
}
