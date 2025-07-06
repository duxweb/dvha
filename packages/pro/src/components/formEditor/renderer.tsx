import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PropType } from 'vue'
import type { PageEditorComponent, PageEditorData } from '../designEditor'
import { useI18n, useJsonSchema } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import { computed, defineComponent } from 'vue'
import { duxFormEditorGrid } from '../designEditor'
import {
  duxFormEditorAIEditor,
  duxFormEditorCascader,
  duxFormEditorCascaderAsync,
  duxFormEditorCheckbox,
  duxFormEditorColor,
  duxFormEditorDate,
  duxFormEditorDynamicInput,
  duxFormEditorDynamicTags,
  duxFormEditorFileUpload,
  duxFormEditorImageUpload,
  duxFormEditorInput,
  duxFormEditorInputNumber,
  duxFormEditorMentionAsync,
  duxFormEditorRadio,
  duxFormEditorRegion,
  duxFormEditorSelect,
  duxFormEditorSelectAsync,
  duxFormEditorSider,
  duxFormEditorSwitch,
  duxFormEditorTime,
  duxFormEditorTransferAsync,
  duxFormEditorTreeSelect,
  duxFormEditorTreeSelectAsync,
} from './components'

export interface FormData {
  [key: string]: any
}

export interface FormConfig {
  labelPlacement?: 'left' | 'top'
  [key: string]: any
}
export const DuxFormRenderer = defineComponent({
  name: 'DuxFormRenderer',
  props: {
    data: {
      type: Array as PropType<PageEditorData[]>,
      default: () => [],
    },
    value: {
      type: Object as PropType<FormData>,
      default: () => ({}),
    },
    config: {
      type: Object as PropType<FormConfig>,
      default: () => ({}),
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n()

    const componentMap = computed(() => {
      const components: PageEditorComponent[] = [
        duxFormEditorGrid(t),
        duxFormEditorInput(t),
        duxFormEditorInputNumber(t),
        duxFormEditorAIEditor(t),
        duxFormEditorSider(t),
        duxFormEditorDate(t),
        duxFormEditorTime(t),
        duxFormEditorColor(t),
        duxFormEditorCheckbox(t),
        duxFormEditorRadio(t),
        duxFormEditorSwitch(t),
        duxFormEditorDynamicInput(t),
        duxFormEditorDynamicTags(t),
        duxFormEditorImageUpload(t),
        duxFormEditorFileUpload(t),
        duxFormEditorSelect(t),
        duxFormEditorCascader(t),
        duxFormEditorTreeSelect(t),
        duxFormEditorRegion(t),
        duxFormEditorSelectAsync(t),
        duxFormEditorCascaderAsync(t),
        duxFormEditorTreeSelectAsync(t),
        duxFormEditorTransferAsync(t),
        duxFormEditorMentionAsync(t),
      ]

      const map = new Map<string, PageEditorComponent>()
      components.forEach((comp) => {
        map.set(comp.name, comp)
      })
      return map
    })

    const form = useVModel(props, 'value', emit, {
      defaultValue: {},
      deep: true,
    })

    const convertToJsonSchema = (items: PageEditorData[] | PageEditorData[][], model: FormData = form.value): JsonSchemaNode[] => {
      if (items.length > 0 && Array.isArray(items[0])) {
        return (items as PageEditorData[][]).flatMap(childArray =>
          Array.isArray(childArray) ? convertToJsonSchema(childArray, model) : [],
        )
      }

      return (items as PageEditorData[]).map((item) => {
        const { name, options = {} } = item
        const component = componentMap.value.get(name)

        const mergedOptions = {
          ...options,
          attr: {
            ...options.attr,
            readonly: props.readonly || options.attr?.readonly,
            disabled: props.disabled || options.attr?.disabled,
          },
        }

        if (component?.json) {
          return component.json({
            options: mergedOptions,
            children: item.children,
            model,
            convertToJsonSchema,
          })
        }

        const jsonNode: JsonSchemaNode = {
          tag: name,
          attrs: mergedOptions.attr || {},
        }

        if (item.children?.length) {
          jsonNode.children = convertToJsonSchema(item.children, model)
        }

        return jsonNode
      })
    }

    const jsonSchemaData = computed(() => {
      const nodes = convertToJsonSchema(props.data, form.value)
      return [{
        tag: 'dux-form-layout',
        attrs: {
          labelPlacement: props.config?.labelPlacement || 'left',
        },
        children: nodes,
      }]
    })

    const { render: JsonRender } = useJsonSchema({
      data: jsonSchemaData,
      context: {
        form: form.value,
      },
    })

    return () => <JsonRender />
  },
})
