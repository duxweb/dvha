import type { JsonSchemaNode } from '@duxweb/dvha-core'
import type { PageEditorComponent } from '../editor/hook'
import { useI18n } from '@duxweb/dvha-core'
import { useVModel } from '@vueuse/core'
import clsx from 'clsx'
import { NFormItem, NInputNumber } from 'naive-ui'
import { computed, defineComponent } from 'vue'
import { DuxGrid } from '../../layout'
import { DuxWidgetEditorPreview } from '../editor/preview'
import { WidgetEditorSettingCard } from '../editor/setting'

const WidgetEditorGrid = defineComponent({
  name: 'WidgetEditorGrid',
  props: {
    options: Object,
    children: {
      type: Array,
      default: [],
    },
    onChildren: Function,
  },
  setup(props) {
    const colCount = computed(() => props.options?.col || 2)

    const gridChildren = computed(() => {
      const currentChildren = [...(props.children || [])]
      const count = colCount.value

      // 确保有足够的列位置且每个位置都是数组
      while (currentChildren.length < count) {
        currentChildren.push([])
      }

      for (let i = 0; i < count; i++) {
        if (!Array.isArray(currentChildren[i])) {
          currentChildren[i] = []
        }
      }

      return currentChildren
    })

    return () => (
      <DuxGrid cols={colCount.value} spac={props.options?.spac}>
        {gridChildren.value.map((cellChildren, index) => {
          const children = cellChildren as any[]
          return (
            <div
              key={index}
              class={clsx({
                'rounded border border-dashed border-accented': !children?.length,
              })}
            >
              <DuxWidgetEditorPreview
                modelValue={children}
                onUpdate={(v) => {
                  const newChildren = [...gridChildren.value]
                  newChildren[index] = v
                  props.onChildren?.(newChildren)
                }}
              />
            </div>
          )
        })}
      </DuxGrid>
    )
  },
})

const WidgetEditorGridSetting = defineComponent({
  name: 'WidgetEditorGridSetting',
  props: {
    value: {
      type: Object,
      default: () => ({
        col: 2,
        spac: 2,
      }),
    },
  },
  setup(props, { emit }) {
    const { t } = useI18n()
    const data = useVModel(props, 'value', emit)

    return () => (
      <WidgetEditorSettingCard title={t('components.designEditor.grid.title')} icon="i-tabler:grid-4x4">
        <NFormItem label={t('components.designEditor.grid.columns')} path="col">
          <NInputNumber
            v-model:value={data.value.col}
            min={1}
            max={12}
            placeholder={t('components.designEditor.grid.columnsPlaceholder')}
          />
        </NFormItem>
        <NFormItem label={t('components.designEditor.grid.spacing')} path="spac">
          <NInputNumber
            v-model:value={data.value.spac}
            min={0}
            max={100}
            placeholder={t('components.designEditor.grid.spacingPlaceholder')}
          />
        </NFormItem>
      </WidgetEditorSettingCard>
    )
  },
})

function FormEditorGridJson(props?: Record<string, any>): JsonSchemaNode {
  const { children, convertToJsonSchema } = props || {}

  // 处理 grid 的二维数组 children 结构
  let processedChildren: JsonSchemaNode[] = []
  if (children?.length && convertToJsonSchema) {
    // grid 的 children 是二维数组，每个元素代表一列的组件
    processedChildren = children.flatMap((columnChildren: any[]) => {
      if (Array.isArray(columnChildren)) {
        return convertToJsonSchema(columnChildren)
      }
      return []
    })
  }

  return {
    tag: 'dux-grid',
    attrs: {
      cols: props?.options?.col || 2,
      spac: props?.options?.spac || 2,
    },
    children: processedChildren,
  }
}

export function duxFormEditorGrid(t): PageEditorComponent {
  return {
    name: 'dux-grid',
    icon: 'i-tabler:grid-4x4',
    label: t('components.designEditor.grid.label'),
    description: t('components.designEditor.grid.description') || '',
    group: 'layout',
    nested: true,
    component: props => <WidgetEditorGrid {...props} />,
    setting: props => <WidgetEditorGridSetting {...props} />,
    settingDefault: {
      col: 2,
      spac: 2,
    },
    json: FormEditorGridJson,
  }
}
