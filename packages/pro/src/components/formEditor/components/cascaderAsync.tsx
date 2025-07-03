import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PageEditorComponent, PageEditorJsonProps } from '../../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { DuxCascader } from '@duxweb/dvha-naiveui'
import { useVModel } from '@vueuse/core'
import { NInput, NSwitch } from 'naive-ui'
import { defineComponent } from 'vue'
import { WidgetEditorSettingCard } from '../../designEditor'
import { DuxFormItem } from '../../form'
import { DuxFormEditorItem, DuxFormEditorRule } from '../base'

const Comp = defineComponent({
  name: 'FormEditorCascaderAsync',
  props: {
    options: Object,
  },
  setup(props) {
    return () => (
      <DuxFormItem label={props.options?.label} description={props.options?.desc}>
        <DuxCascader {...props.options?.attr} />
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
        tag: 'dux-cascader',
        attrs: {
          ...options?.attr,
          'v-model:value': [model, options?.name],
        },
      },
    ],
  }
}

const Setting = defineComponent({
  name: 'FormEditorCascaderAsyncSetting',
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

        <WidgetEditorSettingCard title={t('components.formEditor.common.dataConfig')}>

          <DuxFormItem label={t('components.formEditor.cascaderAsync.dataApi')}>
            <NInput v-model:value={data.value.attr.url} placeholder={t('components.formEditor.cascaderAsync.apiPlaceholder')} />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.labelField')}>
            <NInput v-model:value={data.value.attr.labelField} />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.valueField')}>
            <NInput v-model:value={data.value.attr.valueField} />
          </DuxFormItem>

        </WidgetEditorSettingCard>

        <DuxFormEditorRule v-model:value={data.value.rule} />
      </div>
    )
  },
})

export function duxFormEditorCascaderAsync(t): PageEditorComponent {
  return {
    name: 'dux-cascader-async',
    icon: 'i-tabler:list-tree',
    label: t('components.formEditor.cascaderAsync.label'),
    group: 'async',
    component: props => <Comp {...props} />,
    setting: props => <Setting {...props} />,
    settingDefault: {
      label: t('components.formEditor.cascaderAsync.label'),
      name: 'cascaderAsync',
      attr: {
        url: '',
        valueField: 'id',
        labelField: 'title',
        clearable: true,
        pagination: true,
      },
      rule: [],
    },
    json: Json,
  }
}
