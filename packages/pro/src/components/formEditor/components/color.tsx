import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PageEditorComponent, PageEditorJsonProps } from '../../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NColorPicker, NSwitch } from 'naive-ui'
import { defineComponent } from 'vue'
import { WidgetEditorSettingCard } from '../../designEditor'
import { DuxFormItem } from '../../form'
import { DuxFormEditorItem, DuxFormEditorRule } from '../base'

const Comp = defineComponent({
  name: 'FormEditorColor',
  props: {
    options: Object,
  },
  setup(props) {
    const attr = props.options?.attr
    return () => (
      <DuxFormItem label={props.options?.label} description={props.options?.desc}>
        <div class="flex-1">
          <NColorPicker {...attr} />
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
        tag: 'n-color-picker',
        attrs: {
          ...options?.attr,
          'v-model:value': [model, options?.name],
        },
      },
    ],
  }
}

const Setting = defineComponent({
  name: 'FormEditorColorSetting',
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

          <DuxFormItem label={t('components.formEditor.common.disabled')} labelPlacement="left">
            <div class="flex flex-1 justify-end">
              <NSwitch v-model:value={data.value.attr.disabled} />
            </div>
          </DuxFormItem>
          <DuxFormItem label={t('components.formEditor.color.showAlpha')} labelPlacement="left">
            <div class="flex flex-1 justify-end">
              <NSwitch v-model:value={data.value.attr.showAlpha} />
            </div>
          </DuxFormItem>

        </WidgetEditorSettingCard>
        <DuxFormEditorRule v-model:value={data.value.rule} />
      </div>
    )
  },
})

export function duxFormEditorColor(t): PageEditorComponent {
  return {
    name: 'dux-color',
    icon: 'i-tabler:palette',
    label: t('components.formEditor.color.label'),
    group: 'form',
    component: props => <Comp {...props} />,
    setting: props => <Setting {...props} />,
    settingDefault: {
      label: t('components.formEditor.color.label'),
      name: 'color',
      attr: {
        showAlpha: true,
      },
      rule: [],
    },
    json: Json,
  }
}
