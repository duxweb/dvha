import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PageEditorComponent, PageEditorJsonProps } from '../../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NInputNumber, NSlider, NSwitch } from 'naive-ui'
import { defineComponent } from 'vue'
import { WidgetEditorSettingCard } from '../../designEditor'
import { DuxFormItem } from '../../form'
import { DuxFormEditorItem, DuxFormEditorRule } from '../base/base'

const Comp = defineComponent({
  props: {
    options: Object,
  },
  setup(props) {
    return () => (
      <DuxFormItem label={props.options?.label} description={props.options?.desc}>
        <NSlider {...props.options?.attr} />
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
        tag: 'n-slider',
        attrs: {
          ...options?.attr,
          'v-model:value': [model, options?.name],
        },
      },
    ],
  }
}

const Setting = defineComponent({
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

          <DuxFormItem label={t('components.formEditor.common.disabled')} labelPlacement="left">
            <div class="flex flex-1 justify-end">
              <NSwitch v-model:value={data.value.attr.disabled} />
            </div>
          </DuxFormItem>

        </WidgetEditorSettingCard>

        <WidgetEditorSettingCard title={t('components.formEditor.options')}>

          <DuxFormItem label={t('components.formEditor.sider.step')}>
            <NInputNumber v-model:value={data.value.attr.step} />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.sider.min')}>
            <NInputNumber v-model:value={data.value.attr.min} />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.sider.max')}>
            <NInputNumber v-model:value={data.value.attr.max} />
          </DuxFormItem>

        </WidgetEditorSettingCard>

        <DuxFormEditorRule v-model:value={data.value.rule} />
      </div>
    )
  },
})

export function duxFormEditorSider(t): PageEditorComponent {
  return {
    name: 'sider',
    icon: 'i-tabler:separator',
    label: t('components.formEditor.sider.name'),
    group: 'form',
    component: props => <Comp {...props} />,
    setting: props => <Setting {...props} />,
    settingDefault: {
      label: t('components.formEditor.sider.name'),
      name: 'sider',
      attr: {
        step: 1,
        min: 0,
        max: 100,
      },
      rule: [],
    },
    json: Json,
  }
}
