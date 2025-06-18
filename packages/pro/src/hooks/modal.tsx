import type { UseOverlayProps } from '@duxweb/dvha-core'
import { useOverlay } from '@duxweb/dvha-core'

export interface UseModalProps extends UseOverlayProps {
  title?: string
  width?: number | string
  draggable?: boolean
}

export function useModal() {
  const overlay = useOverlay()

  const show = (props: UseModalProps) => {
    return overlay.show({
      component: () => import('../components/modal/modal'),
      componentProps: props,
      mask: !props.draggable,
    })
  }

  return {
    show,
  }
}
