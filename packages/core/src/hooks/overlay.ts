import { useOverlayInject } from "@overlastic/vue"
import { DuxOverlay } from "../components"


export interface UseOverlayProps {
  component?: () => any
  componentProps?: Record<string, any>
}

export const useOverlay = () => {

  const create = useOverlayInject(DuxOverlay)

  const show = (props: UseOverlayProps) => {
    return create(props)
  }

  return {
    show,
  }
}