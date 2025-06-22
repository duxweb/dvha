import { get } from 'lodash-es'
import { NImage } from 'naive-ui'
import { h } from 'vue'
import { DuxPlaceholder } from '../../components'

export interface UseTableColumnImageProps {
  key?: string
  imageWidth?: number
  imageHeight?: number
}

export function useTableColumnImage() {
  const render = (props: UseTableColumnImageProps) => {
    return (rowData: Record<string, any>, _rowIndex: number) => {
      let value = get(rowData, props.key || '') || []
      value = Array.isArray(value) ? value : [value]

      return (
        <div class="flex flex-wrap gap-2">
          {value.length > 0
            ? value.map((item, index) => (
                <NImage
                  key={index}
                  src={item}
                  width={props.imageWidth}
                  height={props.imageHeight}
                  objectFit="cover"
                  fallbackSrc="data:image/svg+xml;base64,"
                >
                  {{
                    placeholder: () => h(DuxPlaceholder, {
                      width: props.imageWidth || 40,
                      height: props.imageHeight || 40,
                    }),
                    error: () => h(DuxPlaceholder, {
                      width: props.imageWidth || 40,
                      height: props.imageHeight || 40,
                    }),
                  }}
                </NImage>
              ))
            : (
                <DuxPlaceholder height={40} />
              )}
        </div>
      )
    }
  }

  return {
    render,
  }
}
