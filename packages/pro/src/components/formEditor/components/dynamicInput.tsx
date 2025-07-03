import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PropType } from 'vue'
import type { PageEditorComponent, PageEditorData, PageEditorJsonProps } from '../../designEditor'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { NDynamicInput, NInputNumber, NSwitch } from 'naive-ui'
import { computed, defineComponent } from 'vue'
import { DuxWidgetEditorPreview, WidgetEditorSettingCard } from '../../designEditor'
import { DuxFormItem } from '../../form'
import { DuxFormEditorItem, DuxFormEditorRule } from '../base/base'

const Comp = defineComponent({
  name: 'FormEditorDynamicInput',
  props: {
    options: {
      type: Object,
      default: () => ({}),
    },
    children: {
      type: Array as PropType<PageEditorData[]>,
      default: () => [],
    },
    onChildren: Function,
  },
  setup(props) {
    const attr = computed(() => props.options?.attr || {})
    const label = computed(() => props.options?.label)

    return () => (
      <DuxFormItem label={label.value} description={props.options?.desc}>
        <div class="flex-1 w-full">
          <NDynamicInput {...attr.value} value={[{}]}>
            {{
              default: () => (
                <DuxWidgetEditorPreview
                  class="w-full flex gap-2 rounded-sm border border-dashed border-muted p-2"
                  modelValue={props.children}
                  onUpdate={props.onChildren}
                />
              ),
            }}
          </NDynamicInput>
        </div>
      </DuxFormItem>
    )
  },
})

function Json(props?: PageEditorJsonProps): JsonSchemaNode {
  const { options, children, model, convertToJsonSchema } = props || {}

  return {
    tag: 'dux-form-item',
    attrs: {
      label: options?.label,
      description: options?.desc,
    },
    children: [
      {
        tag: 'n-dynamic-input',
        attrs: {
          ...options?.attr,
          'v-model:value': [model, options?.name],
          '@create': () => ({}),
        },
        slots: {
          default: ({ value, index }) => {
            return {
              tag: 'div',
              attrs: {
                class: 'flex-1 flex gap-2',
                key: index,
              },
              children: convertToJsonSchema
                ? convertToJsonSchema(children || [], value).map((child) => {
                    if (child && typeof child === 'object' && 'attrs' in child) {
                      const { label, ...restAttrs } = child.attrs || {}
                      return {
                        ...child,
                        attrs: {
                          class: 'w-full',
                          restAttrs,
                        },
                      }
                    }
                    return child
                  })
                : [],
            }
          },
        },
      },
    ],
  }
}

const Setting = defineComponent({
  name: 'FormEditorDynamicInputSetting',
  props: {
    value: {
      type: Object,
      default: () => ({
        attr: {
          min: 0,
          max: 10,
          disabled: false,
        },
        rule: [],
      }),
    },
  },
  setup(props, { emit }) {
    const data = useVModel(props, 'value', emit)
    const { t } = useI18n()

    if (!data.value.attr) {
      data.value.attr = {
        min: 0,
        max: 10,
        disabled: false,
      }
    }

    return () => (
      <div>
        <DuxFormEditorItem v-model:value={data.value} />

        <WidgetEditorSettingCard title={t('components.formEditor.common.componentConfig')}>
          <DuxFormItem label={t('components.formEditor.common.minCount')}>
            <NInputNumber
              v-model:value={data.value.attr.min}
              min={0}
              max={50}
              placeholder={t('components.formEditor.common.minCount')}
            />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.maxCount')}>
            <NInputNumber
              v-model:value={data.value.attr.max}
              min={1}
              max={100}
              placeholder={t('components.formEditor.common.maxCount')}
            />
          </DuxFormItem>

          <DuxFormItem label={t('components.formEditor.common.disabled')} labelPlacement="left">
            <div class="flex flex-1 justify-end">
              <NSwitch v-model:value={data.value.attr.disabled} />
            </div>
          </DuxFormItem>
        </WidgetEditorSettingCard>

        <DuxFormEditorRule v-model:value={data.value.rule} />
      </div>
    )
  },
})

export function duxFormEditorDynamicInput(t): PageEditorComponent {
  return {
    name: 'dux-dynamic-input',
    icon: 'i-tabler:calendar-due',
    label: t('components.formEditor.dynamicInput.label'),
    group: 'form',
    component: props => <Comp {...props} />,
    setting: props => <Setting {...props} />,
    nested: true,
    settingDefault: {
      label: t('components.formEditor.dynamicInput.label'),
      name: 'data',
      attr: {
        min: 0,
        max: 10,
        disabled: false,
      },
      rule: [],
      defaultValue: [],
    },
    json: Json,
  }
}
