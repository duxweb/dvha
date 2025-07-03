import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PageEditorComponent, PageEditorJsonProps } from '../../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NButton, NCheckbox, NCheckboxGroup, NDynamicInput, NSwitch } from 'naive-ui'
import { defineComponent } from 'vue'
import { useModal } from '../../../hooks/modal'
import { WidgetEditorSettingCard } from '../../designEditor'
import { DuxFormItem } from '../../form'
import { DuxFormEditorItem, DuxFormEditorRule } from '../base'

const Comp = defineComponent({
  name: 'FormEditorCheckbox',
  props: {
    options: Object,
  },
  setup(props) {
    return () => (
      <DuxFormItem label={props.options?.label} description={props.options?.desc}>
        <NCheckboxGroup {...props.options?.attr} value={props.options?.attr?.defaultValue}>
          {props.options?.attr?.options?.map((item, index) => <NCheckbox key={index} value={item.value}>{item.label}</NCheckbox>)}
        </NCheckboxGroup>

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
        tag: 'n-checkbox-group',
        attrs: {
          ...options?.attr,
          'v-model:value': [model, options?.name],
        },
        children: options?.attr?.options?.map((item: any) => ({
          tag: 'n-checkbox',
          attrs: {
            value: item.value,
          },
          children: [item.label],
        })) || [],
      },
    ],
  }
}

const Setting = defineComponent({
  name: 'FormEditorCheckboxSetting',
  props: {
    value: {
      type: Object,
      default: {},
    },
  },
  setup(props, { emit }) {
    const data = useVModel(props, 'value', emit)
    const modal = useModal()
    const { t } = useI18n()

    return () => (
      <div class="">

        <DuxFormEditorItem v-model:value={props.value} />

        <WidgetEditorSettingCard title={t('components.formEditor.common.componentConfig')}>

          <DuxFormItem label={t('components.formEditor.common.defaultValue')}>
            <NDynamicInput v-model:value={data.value.attr.defaultValue} />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.disabled')} labelPlacement="left">
            <div class="flex flex-1 justify-end">
              <NSwitch v-model:value={data.value.attr.disabled} />
            </div>
          </DuxFormItem>

        </WidgetEditorSettingCard>

        <WidgetEditorSettingCard title={t('components.formEditor.common.optionConfig')}>

          <NButton
            block
            dashed
            renderIcon={() => <div class="i-tabler:edit"></div>}
            onClick={() => {
              modal.show({
                title: t('components.formEditor.common.dataConfig'),
                component: () => import('../base/options'),
                componentProps: {
                  desc: t('components.formEditor.checkbox.configDesc'),
                  value: data.value.attr.options,
                  onChange: (value) => {
                    data.value.attr.options = value
                  },
                  options: [
                    {
                      label: t('components.formEditor.common.optionLabel'),
                      value: 'label',
                    },
                    {
                      label: t('components.formEditor.common.optionValue'),
                      value: 'value',
                    },
                  ],
                },

              })
            }}
          >
            {t('components.formEditor.common.dataConfig')}
          </NButton>

        </WidgetEditorSettingCard>

        <DuxFormEditorRule v-model:value={data.value.rule} />
      </div>
    )
  },
})

export function duxFormEditorCheckbox(t): PageEditorComponent {
  return {
    name: 'dux-checkbox',
    icon: 'i-tabler:square-check',
    label: t('components.formEditor.checkbox.label'),
    group: 'form',
    component: props => <Comp {...props} />,
    setting: props => <Setting {...props} />,
    settingDefault: {
      label: t('components.formEditor.checkbox.label'),
      name: 'checkbox',
      attr: {
        options: [
          {
            label: 'option 1',
            value: '1',
          },
          {
            label: 'option 2',
            value: '2',
          },
        ],
        defaultValue: [],
      },
      rule: [],
    },
    json: Json,
  }
}
