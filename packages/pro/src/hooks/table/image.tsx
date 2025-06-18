import { get } from 'lodash-es'
import { NImage } from 'naive-ui'
import placeholder from '../../static/images/placeholder.png'

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
          {value.map((item, index) => (
            <NImage key={index} src={item} width={props.imageWidth} height={props.imageHeight} fallbackSrc={placeholder} objectFit="cover" />
          ))}
        </div>
      )
    }
  }

  return {
    render,
  }
}
