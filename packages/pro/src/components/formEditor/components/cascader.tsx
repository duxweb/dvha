import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PageEditorComponent, PageEditorJsonProps } from '../../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NButton, NCascader, NSwitch } from 'naive-ui'
import { defineComponent } from 'vue'
import { useModal } from '../../../hooks/modal'
import { WidgetEditorSettingCard } from '../../designEditor'
import { DuxFormItem } from '../../form'
import { DuxFormEditorItem, DuxFormEditorRule } from '../base'

const Comp = defineComponent({
  name: 'FormEditorCascader',
  props: {
    options: Object,
  },
  setup(props) {
    return () => (
      <DuxFormItem label={props.options?.label} description={props.options?.desc}>
        <NCascader {...props.options?.attr} />
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
        tag: 'n-cascader',
        attrs: {
          ...options?.attr,
          'v-model:value': [model, options?.name],
        },
      },
    ],
  }
}

const Setting = defineComponent({
  name: 'FormEditorCascaderSetting',
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

          <DuxFormItem label={t('components.formEditor.common.multiple')} labelPlacement="left">
            <div class="flex flex-1 justify-end">
              <NSwitch v-model:value={data.value.attr.multiple} />
            </div>
          </DuxFormItem>
          <DuxFormItem label={t('components.formEditor.common.cascade')} labelPlacement="left">
            <div class="flex flex-1 justify-end">
              <NSwitch v-model:value={data.value.attr.cascade} />
            </div>
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.showPath')} labelPlacement="left">
            <div class="flex flex-1 justify-end">
              <NSwitch v-model:value={data.value.attr.showPath} />
            </div>
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.disabled')} labelPlacement="left">
            <div class="flex flex-1 justify-end">
              <NSwitch v-model:value={data.value.attr.disabled} />
            </div>
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.clearable')} labelPlacement="left">
            <div class="flex flex-1 justify-end">
              <NSwitch v-model:value={data.value.attr.clearable} />
            </div>
          </DuxFormItem>

        </WidgetEditorSettingCard>

        <WidgetEditorSettingCard title={t('components.formEditor.common.optionData')}>
          <NButton
            block
            dashed
            renderIcon={() => <div class="i-tabler:edit"></div>}
            onClick={() => {
              modal.show({
                title: t('components.formEditor.common.dataEdit'),
                component: () => import('../base/json'),
                componentProps: {
                  desc: t('components.formEditor.cascader.optionDesc'),
                  value: JSON.stringify(data.value.attr.options, null, 2),
                  onChange: (value) => {
                    try {
                      data.value.attr.options = JSON.parse(value)
                    }
                    catch {}
                  },
                },
              })
            }}
          >
            {t('components.formEditor.common.dataEdit')}
          </NButton>

        </WidgetEditorSettingCard>

        <DuxFormEditorRule v-model:value={data.value.rule} />
      </div>
    )
  },
})

export function duxFormEditorCascader(t): PageEditorComponent {
  return {
    name: 'dux-cascader',
    icon: 'i-tabler:list-tree',
    label: t('components.formEditor.cascader.label'),
    group: 'select',
    component: props => <Comp {...props} />,
    setting: props => <Setting {...props} />,
    settingDefault: {
      label: t('components.formEditor.cascader.label'),
      name: 'cascader',
      attr: {
        options: [],
        clearable: true,
      },
      rule: [],
    },
    json: Json,
  }
}
