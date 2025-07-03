import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PageEditorComponent, PageEditorJsonProps } from '../../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { DuxMention } from '@duxweb/dvha-naiveui'
import { useVModel } from '@vueuse/core'
import { NInput, NSwitch } from 'naive-ui'
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
        <DuxMention {...props.options?.attr} />
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
        tag: 'dux-mention',
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

          <DuxFormItem label={t('components.formEditor.common.clearable')} labelPlacement="left">
            <div class="flex flex-1 justify-end">
              <NSwitch v-model:value={data.value.attr.clearable} />
            </div>
          </DuxFormItem>

        </WidgetEditorSettingCard>

        <WidgetEditorSettingCard title={t('components.formEditor.options')}>

          <DuxFormItem label={t('components.formEditor.mentionAsync.path')}>
            <NInput v-model:value={data.value.attr.path} />
          </DuxFormItem>
          <DuxFormItem label={t('components.formEditor.mentionAsync.labelField')}>
            <NInput v-model:value={data.value.attr.labelField} />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.mentionAsync.valueField')}>
            <NInput v-model:value={data.value.attr.valueField} />
          </DuxFormItem>

        </WidgetEditorSettingCard>

        <DuxFormEditorRule v-model:value={data.value.rule} />
      </div>
    )
  },
})

export function duxFormEditorMentionAsync(t): PageEditorComponent {
  return {
    name: 'mention-async',
    icon: 'i-tabler:at',
    label: t('components.formEditor.mentionAsync.name'),
    group: 'async',
    component: props => <Comp {...props} />,
    setting: props => <Setting {...props} />,
    settingDefault: {
      label: t('components.formEditor.mentionAsync.name'),
      name: 'mentionAsync',
      attr: {
        path: '',
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
