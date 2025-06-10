import type { IJsonAdaptor } from './types'

export const vOnAdaptor: IJsonAdaptor = {
  name: 'v-on',
  priority: 60,
  process(_node, props) {
    const eventProps: Record<string, any> = {}
    const restProps: Record<string, any> = {}
    let hasEvents = false

    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('@') || key.startsWith('v-on:')) {
        hasEvents = true

        const eventPart = key.startsWith('@') ? key.slice(1) : key.slice(5)
        const [eventName, ...modifiers] = eventPart.split('.')

        if (!eventName) {
          console.warn(`Invalid event name: ${key}`)
          return
        }

        const handlerName = `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`

        const handler = (event: Event, ...args: any[]) => {
          if (modifiers.includes('prevent'))
            event.preventDefault?.()
          if (modifiers.includes('stop'))
            event.stopPropagation?.()
          try {
            if (typeof value === 'function') {
              value(event, ...args)
            }
            else {
              console.warn(`Invalid event handler type: ${typeof value}`)
            }
          }
          catch (error) {
            console.error(`Event handler execution error (${eventName}):`, error)
          }
        }

        eventProps[handlerName] = handler
      }
      else {
        restProps[key] = value
      }
    })

    return hasEvents ? { props: { ...restProps, ...eventProps } } : null
  },
}
