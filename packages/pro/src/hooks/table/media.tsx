import type { VNode } from 'vue'
import { get } from 'lodash-es'
import { DuxMedia } from '../../components'

export interface UseTableColumnMediaProps {
  image?: string | string[] | ((rowData: Record<string, any>) => VNode | string | string[])
  avatar?: boolean
  title?: string | ((rowData: Record<string, any>) => VNode)
  desc?: string | string[] | ((rowData: Record<string, any>) => VNode | string | string[])
  imageWidth?: number
  imageHeight?: number
}

export function useTableColumnMedia() {
  const render = (props: UseTableColumnMediaProps) => {
    return (rowData: Record<string, any>, _rowIndex: number) => {
      const title = typeof props.title === 'function' ? props.title(rowData) : get(rowData, props.title || '')
      const desc = typeof props.desc === 'function' ? props.desc(rowData) : get(rowData, props.desc || '')
      const image = typeof props.image === 'function' ? props.image(rowData) : get(rowData, props.image || '')

      return (
        <DuxMedia
          title={title}
          desc={desc}
          avatar={props.avatar}
          image={image}
          imageWidth={props.imageWidth}
          imageHeight={props.imageHeight}
        />
      )
    }
  }

  return {
    render,
  }
}
