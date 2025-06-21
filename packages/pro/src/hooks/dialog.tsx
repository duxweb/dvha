import type { JsonSchemaData } from '@duxweb/dvha-core'
import type { VNode } from 'vue'
import { useOverlayInject } from '@overlastic/vue'
import { DuxDialog } from '../components'

export interface UseDialogResult {
  confirm: (props: UseDialogProps) => Promise<any>
  success: (props: UseDialogProps) => Promise<any>
  error: (props: UseDialogProps) => Promise<any>
  node: (props: UseDialogProps) => Promise<any>
  prompt: (props: UseDialogProps) => Promise<any>
}
export interface UseDialogProps {
  title?: string
  content?: string
  type?: 'confirm' | 'error' | 'success' | 'prompt' | 'node'
  formSchema?: JsonSchemaData
  render?: () => VNode
}

export function useDialog(): UseDialogResult {
  const create = useOverlayInject(DuxDialog)

  const show = (props: UseDialogProps) => {
    return create(props)
  }

  const confirm = (props: UseDialogProps) => {
    return show({ ...props, type: 'confirm' })
  }
  const success = (props: UseDialogProps) => {
    return show({ ...props, type: 'success' })
  }
  const error = (props: UseDialogProps) => {
    return show({ ...props, type: 'error' })
  }
  const prompt = (props: UseDialogProps) => {
    return show({ ...props, type: 'prompt' })
  }
  const node = (props: UseDialogProps) => {
    return show({ ...props, type: 'node' })
  }

  return {
    confirm,
    success,
    error,
    prompt,
    node,
  }
}
