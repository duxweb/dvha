import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PageEditorComponent, PageEditorJsonProps } from '../../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NDatePicker, NSelect, NSwitch } from 'naive-ui'
import { defineComponent } from 'vue'
import { WidgetEditorSettingCard } from '../../designEditor'
import { DuxFormItem } from '../../form'
import { DuxFormEditorItem, DuxFormEditorRule } from '../base/base'

const Comp = defineComponent({
  name: 'FormEditorDate',
  props: {
    options: Object,
  },
  setup(props) {
    const attr = props.options?.attr
    return () => (
      <DuxFormItem label={props.options?.label} description={props.options?.desc}>
        <div class="flex-1">
          <NDatePicker {...attr} />
        </div>
      </DuxFormItem>
    )
  },
})

function Json(props?: PageEditorJsonProps): JsonSchemaNode {
  const { options, model } = props || {}

  // 根据日期类型设置相应的 value-format
  const getValueFormat = (type: string) => {
    switch (type) {
      case 'date':
        return 'yyyy-MM-dd'
      case 'datetime':
        return 'yyyy-MM-dd HH:mm:ss'
      case 'daterange':
        return 'yyyy-MM-dd'
      case 'datetimerange':
        return 'yyyy-MM-dd HH:mm:ss'
      case 'month':
        return 'yyyy-MM'
      case 'monthrange':
        return 'yyyy-MM'
      case 'year':
        return 'yyyy'
      case 'yearrange':
        return 'yyyy'
      case 'quarter':
        return 'yyyy-[Q]Q'
      case 'quarterrange':
        return 'yyyy-[Q]Q'
      case 'week':
        return 'yyyy-[W]WW'
      default:
        return 'yyyy-MM-dd'
    }
  }

  const dateType = options?.attr?.type || 'date'
  const valueFormat = getValueFormat(dateType)

  return {
    tag: 'dux-form-item',
    attrs: {
      label: options?.label,
      description: options?.desc,
    },
    children: [
      {
        tag: 'n-date-picker',
        attrs: {
          ...options?.attr,
          'v-model:formatted-value': [model, options?.name],
          'value-format': valueFormat,
        },
      },
    ],
  }
}

const Setting = defineComponent({
  name: 'FormEditorDateSetting',
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

          <DuxFormItem label={t('components.formEditor.date.dateType')}>

            <NSelect
              v-model:value={data.value.attr.type}
              options={[
                {
                  label: t('components.formEditor.date.date'),
                  value: 'date',
                },
                {
                  label: t('components.formEditor.date.daterange'),
                  value: 'daterange',
                },
                {
                  label: t('components.formEditor.date.datetime'),
                  value: 'datetime',
                },
                {
                  label: t('components.formEditor.date.datetimerange'),
                  value: 'datetimerange',
                },
                {
                  label: t('components.formEditor.date.month'),
                  value: 'month',
                },
                {
                  label: t('components.formEditor.date.monthrange'),
                  value: 'monthrange',
                },
                {
                  label: t('components.formEditor.date.year'),
                  value: 'year',
                },
                {
                  label: t('components.formEditor.date.yearrange'),
                  value: 'yearrange',
                },
                {
                  label: t('components.formEditor.date.quarter'),
                  value: 'quarter',
                },
                {
                  label: t('components.formEditor.date.quarterrange'),
                  value: 'quarterrange',
                },
                {
                  label: t('components.formEditor.date.week'),
                  value: 'week',
                },
              ]}
            />

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
        <DuxFormEditorRule v-model:value={data.value.rule} />
      </div>
    )
  },
})

export function duxFormEditorDate(t: any): PageEditorComponent {
  return {
    name: 'dux-date',
    icon: 'i-tabler:calendar-due',
    label: t('components.formEditor.date.label'),
    group: 'form',
    component: props => <Comp {...props} />,
    setting: props => <Setting {...props} />,
    settingDefault: {
      label: t('components.formEditor.date.label'),
      name: 'date',
      attr: {
        type: 'date',
      },
      rule: [],
    },
    json: Json,
  }
}
