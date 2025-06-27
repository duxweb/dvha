import { useManage } from '@duxweb/dvha-core'
import { useTableColumnColor } from './color'
import { useTableColumnCopy } from './copy'
import { useTableColumnHidden } from './hidden'
import { useTableColumnImage } from './image'
import { useTableColumnInput } from './input'
import { useTableColumnMap } from './map'
import { useTableColumnMedia } from './media'
import { useTableColumnStatus } from './status'
import { useTableColumnSwitch } from './switch'

export interface UseTableColumnProps {
  rowKey?: string
  path?: string | ((rowData: Record<string, any>) => string)
}

export function useTableColumn(props?: UseTableColumnProps) {
  const { getPath } = useManage()

  const path = props?.path || getPath()
  const rowKey = props?.rowKey || 'id'

  const columnMedia = useTableColumnMedia()
  const columnImage = useTableColumnImage()
  const columnSwitch = useTableColumnSwitch({
    path,
    rowKey,
  })

  const columnStatus = useTableColumnStatus()
  const columnColor = useTableColumnColor()
  const columnMap = useTableColumnMap()
  const columnInput = useTableColumnInput({
    path,
    rowKey,
  })
  const columnCopy = useTableColumnCopy()
  const columnHidden = useTableColumnHidden()

  return {
    renderMedia: columnMedia.render,
    renderImage: columnImage.render,
    renderSwitch: columnSwitch.render,
    renderStatus: columnStatus.render,
    renderMap: columnMap.render,
    renderInput: columnInput.render,
    renderCopy: columnCopy.render,
    renderHidden: columnHidden.render,
    renderColor: columnColor.render,
  }
}
