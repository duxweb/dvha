import { useOverlayInject } from '@overlastic/vue'
import { DuxOverlay } from '../components'

export interface UseOverlayProps {
  component?: () => any
  componentProps?: Record<string, any>
  mask?: boolean
  maskClosable?: boolean
  duration?: number
  zIndex?: number
}

export function useOverlay() {
  const create = useOverlayInject(DuxOverlay)

  const show = (props: UseOverlayProps) => {
    return create(props)
  }

  return {
    show,
  }
}
