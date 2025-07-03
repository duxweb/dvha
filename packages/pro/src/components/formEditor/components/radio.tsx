import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PageEditorComponent, PageEditorJsonProps } from '../../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NButton, NInput, NRadio, NRadioGroup, NSwitch } from 'naive-ui'
import { defineComponent } from 'vue'
import { useModal } from '../../../hooks/modal'
import { WidgetEditorSettingCard } from '../../designEditor'
import { DuxFormItem } from '../../form'
import { DuxFormEditorItem, DuxFormEditorRule } from '../base/base'

const Comp = defineComponent({
  name: 'FormEditorRadio',
  props: {
    options: Object,
  },
  setup(props) {
    return () => (
      <DuxFormItem label={props.options?.label} description={props.options?.desc}>
        <NRadioGroup {...props.options?.attr} value={props.options?.attr?.defaultValue}>
          {props.options?.attr?.options?.map((item, index) => <NRadio key={index} value={item.value}>{item.label}</NRadio>)}
        </NRadioGroup>
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
        tag: 'n-radio-group',
        attrs: {
          ...options?.attr,
          'v-model:value': [model, options?.name],
        },
        children: options?.attr?.options?.map((item: any) => ({
          tag: 'n-radio',
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
  name: 'FormEditorRadioSetting',
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
            <NInput
              v-model:value={data.value.attr.defaultValue}
            />
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
                  desc: t('components.formEditor.radio.configDesc'),
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

export function duxFormEditorRadio(t): PageEditorComponent {
  return {
    name: 'dux-radio',
    icon: 'i-tabler:circle-dot',
    label: t('components.formEditor.radio.label'),
    group: 'form',
    component: props => <Comp {...props} />,
    setting: props => <Setting {...props} />,
    settingDefault: {
      label: t('components.formEditor.radio.label'),
      name: 'radio',
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
        defaultValue: '1',
      },
      rule: [],
    },
    json: Json,
  }
}
