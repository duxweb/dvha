import type { Canvas, FabricObject } from 'fabric'
import type { ComputedRef, Ref } from 'vue'
import type { AlignType, CanvasData, ElementConfig, ElementData } from '../elements/types'
import { useThrottleFn } from '@vueuse/core'
import { Canvas as FabricCanvas } from 'fabric'
import { computed, markRaw, nextTick, ref, watch } from 'vue'
import { getElementConfig } from '../elements'

interface PosterEditorOptions {
  width?: number
  height?: number
  backgroundColor?: string
}

export interface PosterEditorReturn {
  initCanvas: (element: HTMLCanvasElement, container?: HTMLElement) => void
  destroy: () => void
  setCallbacks: (callbacks: { onDataChange: (data: string) => void }) => void
  addElement: (type: string, customProps?: Record<string, any>) => Promise<string | undefined>
  deleteSelectedElements: () => void
  updateElementProperty: (elementId: string, key: string, value: any) => void
  alignElements: (alignType: AlignType) => void
  canMoveUp: ComputedRef<boolean>
  canMoveDown: ComputedRef<boolean>
  canMoveToFront: ComputedRef<boolean>
  canMoveToBack: ComputedRef<boolean>
  clearCanvas: () => void
  loadData: (data: string) => void
  updateData: () => void
  canvas: Ref<any>
  canvasData: Ref<CanvasData>
  selectedElements: Ref<FabricObject[]>
  canvasScale: Ref<number>
  currentElement: ComputedRef<FabricObject | null>
  currentElementData: ComputedRef<ElementData | null>
  currentElementConfig: ComputedRef<ElementConfig | null>
  hasMultipleSelection: ComputedRef<boolean>
  clearSelection: () => void
  updateCanvasSize: () => void
  setupAutoResize: (container: HTMLElement) => () => void
  getSelectedElementProperty: (key: string) => any
  selectedElementsData: ComputedRef<ElementData[]>
  syncAllFabricObjectsToData: () => void
  updateCanvasSettings: (width: number, height: number) => void
  updateCanvasBackground: (color: string) => void
  saveData: () => void
  exportJson: () => void
}

export function usePosterEditor(options: PosterEditorOptions = {}): PosterEditorReturn {
  const canvas = ref<Canvas | null>(null)
  const canvasElement = ref<HTMLCanvasElement | null>(null)
  const canvasData = ref<CanvasData>({
    width: options.width || 750,
    height: options.height || 1000,
    backgroundColor: options.backgroundColor || '#ffffff',
    elements: [],
  })
  const selectedElements = ref<any[]>([])
  const isUpdating = ref(false)
  const canvasScale = ref(1)
  const containerWidth = ref(0)
  const containerHeight = ref(0)

  let onDataChange: (data: string) => void = () => {}
  let elementIdCounter = 0
  const generateElementId = () => `element_${++elementIdCounter}`

  const updateData = () => {
    if (isUpdating.value)
      return
    isUpdating.value = true
    nextTick(() => {
      onDataChange(JSON.stringify(canvasData.value))
      isUpdating.value = false
    })
  }

  const syncAllFabricObjectsToData = () => {
    if (!canvas.value)
      return

    const fabricObjects = canvas.value.getObjects()
    const newElements: any[] = []

    fabricObjects.forEach((fabricObject: any) => {
      const elementId = fabricObject.elementId
      if (!elementId)
        return

      const existingElement = canvasData.value.elements.find(el => el.id === elementId)
      if (!existingElement)
        return

      const elementConfig = getElementConfig(existingElement.type)
      if (!elementConfig)
        return

      const updatedProps = elementConfig.getPropsFromFabricObject(fabricObject)
      newElements.push({
        ...existingElement,
        ...updatedProps,
        id: existingElement.id,
        type: existingElement.type,
      })
    })

    canvasData.value.elements = newElements
  }

  const throttledSyncAllData = useThrottleFn(() => {
    syncAllFabricObjectsToData()
    updateData()
  }, 100)

  const handleSelectionChange = () => {
    if (!canvas.value)
      return
    const activeObjects = canvas.value.getActiveObjects()
    const activeObject = canvas.value.getActiveObject()

    if (activeObjects.length > 0) {
      selectedElements.value = [...activeObjects]
    }
    else if (activeObject) {
      selectedElements.value = [activeObject]
    }
    else {
      selectedElements.value = []
    }
  }

  const handleSelectionClear = () => {
    selectedElements.value = []
  }

  const handleObjectModified = (e: any) => {
    if (!e.target)
      return

    const obj = e.target
    const elementId = (obj as any).elementId
    const elementData = canvasData.value.elements.find((el: any) => el.id === elementId)
    const elementType = elementData?.type
    const scaleX = obj.scaleX || 1
    const scaleY = obj.scaleY || 1

    if (scaleX !== 1 || scaleY !== 1) {
      if (elementType === 'circle') {
        const maxScale = Math.max(scaleX, scaleY)
        const newRadius = Math.round((obj.radius || 50) * maxScale)
        obj.set({ radius: newRadius, scaleX: 1, scaleY: 1 })
      }
      else {
        const newWidth = Math.round(obj.width * scaleX)
        const newHeight = Math.round(obj.height * scaleY)
        obj.set({ width: newWidth, height: newHeight, scaleX: 1, scaleY: 1 })
      }
      obj.setCoords()
    }

    // 确保数据同步
    throttledSyncAllData()
  }

  const handleObjectScaling = (e: any) => {
    const obj = e.target
    if (!obj)
      return

    const elementId = (obj as any).elementId
    if (!elementId)
      return

    const elementData = canvasData.value.elements.find((el: any) => el.id === elementId)
    if (!elementData)
      return

    if (elementData.type === 'circle') {
      const scale = Math.max(obj.scaleX || 1, obj.scaleY || 1)
      obj.set({ scaleX: scale, scaleY: scale })
      obj.setCoords()
    }

    if (elementData.type === 'rect') {
      const corner = obj.__corner
      const isCornerDrag = corner && ['tl', 'tr', 'bl', 'br'].includes(corner)

      if (isCornerDrag) {
        const scale = Math.max(Math.abs(obj.scaleX || 1), Math.abs(obj.scaleY || 1))
        obj.set({
          scaleX: obj.scaleX >= 0 ? scale : -scale,
          scaleY: obj.scaleY >= 0 ? scale : -scale,
        })
        obj.setCoords()
      }
    }
  }

  const bindCanvasEvents = () => {
    if (!canvas.value)
      return

    canvas.value.on('selection:created', handleSelectionChange)
    canvas.value.on('selection:updated', handleSelectionChange)
    canvas.value.on('selection:cleared', handleSelectionClear)
    canvas.value.on('mouse:down', () => setTimeout(handleSelectionChange, 10))
    canvas.value.on('mouse:up', () => setTimeout(handleSelectionChange, 10))
    canvas.value.on('object:modified', handleObjectModified)
    canvas.value.on('object:scaling', handleObjectScaling)
    canvas.value.on('path:created', throttledSyncAllData)

    // 统一的数据同步事件监听
    canvas.value.on('object:moving', throttledSyncAllData)
    canvas.value.on('object:rotating', throttledSyncAllData)
    canvas.value.on('object:skewing', throttledSyncAllData)
    canvas.value.on('object:added', throttledSyncAllData)
    canvas.value.on('object:removed', throttledSyncAllData)

    ;(canvas.value as any).on('custom:text:changed', (e: any) => {
      if (e.target && e.newText !== undefined) {
        const elementId = (e.target as any).elementId
        if (elementId) {
          // 数据同步通过统一的事件监听自动触发
          throttledSyncAllData()
        }
      }
    })
  }

  const updateCanvasSize = () => {
    if (!canvas.value)
      return

    const currentScale = canvasScale.value || 1
    canvas.value.setZoom(currentScale)
    canvas.value.setDimensions({
      width: canvasData.value.width * currentScale,
      height: canvasData.value.height * currentScale,
    })
    canvas.value.backgroundColor = canvasData.value.backgroundColor
    canvas.value.renderAll()
    canvas.value.getObjects().forEach(obj => obj.setCoords())
  }

  const setupAutoResize = (container: HTMLElement) => {
    const updateScale = () => {
      const containerRect = container.getBoundingClientRect()
      containerWidth.value = containerRect.width - 40
      containerHeight.value = containerRect.height - 40

      const scaleX = containerWidth.value / canvasData.value.width
      const scaleY = containerHeight.value / canvasData.value.height
      const scale = Math.min(scaleX, scaleY, 1)

      canvasScale.value = scale

      if (canvas.value) {
        canvas.value.setZoom(scale)
        canvas.value.setDimensions({
          width: canvasData.value.width * scale,
          height: canvasData.value.height * scale,
        })
        canvas.value.renderAll()
        canvas.value.getObjects().forEach(obj => obj.setCoords())
      }
    }

    nextTick(updateScale)
    const resizeObserver = new ResizeObserver(updateScale)
    resizeObserver.observe(container)
    return () => resizeObserver.disconnect()
  }

  const alignToCanvas = (obj: any, alignType: AlignType) => {
    const canvasWidth = canvasData.value.width
    const canvasHeight = canvasData.value.height
    const objBounds = obj.getBoundingRect()

    switch (alignType) {
      case 'center-horizontal':
        obj.set('left', Math.round(obj.left + (canvasWidth / 2 - objBounds.left - objBounds.width / 2)))
        break
      case 'center-vertical':
        obj.set('top', Math.round(obj.top + (canvasHeight / 2 - objBounds.top - objBounds.height / 2)))
        break
      case 'center-both':
        obj.set({
          left: Math.round(obj.left + (canvasWidth / 2 - objBounds.left - objBounds.width / 2)),
          top: Math.round(obj.top + (canvasHeight / 2 - objBounds.top - objBounds.height / 2)),
        })
        break
      case 'move-up':
        canvas.value?.bringObjectForward(obj)
        break
      case 'move-down':
        canvas.value?.sendObjectBackwards(obj)
        break
      case 'move-to-front':
        canvas.value?.bringObjectToFront(obj)
        break
      case 'move-to-back':
        canvas.value?.sendObjectToBack(obj)
        break
    }
    obj.setCoords()
    canvas.value?.renderAll()
  }

  const distributeElementsHorizontally = (objects: any[]) => {
    if (objects.length < 3)
      return

    const sortedObjects = [...objects].sort((a, b) => a.getBoundingRect().left - b.getBoundingRect().left)
    const firstBounds = sortedObjects[0].getBoundingRect()
    const lastBounds = sortedObjects[sortedObjects.length - 1].getBoundingRect()
    const totalSpace = (lastBounds.left + lastBounds.width) - firstBounds.left
    const totalObjectsWidth = sortedObjects.reduce((sum, obj) => sum + obj.getBoundingRect().width, 0)
    const gap = (totalSpace - totalObjectsWidth) / (sortedObjects.length - 1)
    let currentX = firstBounds.left + firstBounds.width + gap

    for (let i = 1; i < sortedObjects.length - 1; i++) {
      const obj = sortedObjects[i]
      const objBounds = obj.getBoundingRect()
      obj.set('left', Math.round(obj.left + (currentX - objBounds.left)))
      currentX += objBounds.width + gap
    }
  }

  const distributeElementsVertically = (objects: any[]) => {
    if (objects.length < 3)
      return

    const sortedObjects = [...objects].sort((a, b) => a.getBoundingRect().top - b.getBoundingRect().top)
    const firstBounds = sortedObjects[0].getBoundingRect()
    const lastBounds = sortedObjects[sortedObjects.length - 1].getBoundingRect()
    const totalSpace = (lastBounds.top + lastBounds.height) - firstBounds.top
    const totalObjectsHeight = sortedObjects.reduce((sum, obj) => sum + obj.getBoundingRect().height, 0)
    const gap = (totalSpace - totalObjectsHeight) / (sortedObjects.length - 1)
    let currentY = firstBounds.top + firstBounds.height + gap

    for (let i = 1; i < sortedObjects.length - 1; i++) {
      const obj = sortedObjects[i]
      const objBounds = obj.getBoundingRect()
      obj.set('top', Math.round(obj.top + (currentY - objBounds.top)))
      currentY += objBounds.height + gap
    }
  }

  const alignMultipleElements = (objects: any[], alignType: AlignType) => {
    if (objects.length < 2)
      return

    const allBounds = objects.map(obj => obj.getBoundingRect())
    const minLeft = Math.min(...allBounds.map(b => b.left))
    const maxRight = Math.max(...allBounds.map(b => b.left + b.width))
    const minTop = Math.min(...allBounds.map(b => b.top))
    const maxBottom = Math.max(...allBounds.map(b => b.top + b.height))
    const groupCenterX = (minLeft + maxRight) / 2
    const groupCenterY = (minTop + maxBottom) / 2

    switch (alignType) {
      case 'left':
        objects.forEach((obj) => {
          const objBounds = obj.getBoundingRect()
          obj.set('left', Math.round(obj.left + (minLeft - objBounds.left)))
        })
        break
      case 'right':
        objects.forEach((obj) => {
          const objBounds = obj.getBoundingRect()
          obj.set('left', Math.round(obj.left + (maxRight - objBounds.left - objBounds.width)))
        })
        break
      case 'top':
        objects.forEach((obj) => {
          const objBounds = obj.getBoundingRect()
          obj.set('top', Math.round(obj.top + (minTop - objBounds.top)))
        })
        break
      case 'bottom':
        objects.forEach((obj) => {
          const objBounds = obj.getBoundingRect()
          obj.set('top', Math.round(obj.top + (maxBottom - objBounds.top - objBounds.height)))
        })
        break
      case 'center-horizontal':
        objects.forEach((obj) => {
          const objBounds = obj.getBoundingRect()
          const objCenterX = objBounds.left + objBounds.width / 2
          obj.set('left', Math.round(obj.left + (groupCenterX - objCenterX)))
        })
        break
      case 'center-vertical':
        objects.forEach((obj) => {
          const objBounds = obj.getBoundingRect()
          const objCenterY = objBounds.top + objBounds.height / 2
          obj.set('top', Math.round(obj.top + (groupCenterY - objCenterY)))
        })
        break
      case 'distribute-horizontal':
        distributeElementsHorizontally(objects)
        break
      case 'distribute-vertical':
        distributeElementsVertically(objects)
        break
    }

    objects.forEach(obj => obj.setCoords())
    canvas.value?.renderAll()
  }

  // 初始化画布
  const initCanvas = (element: HTMLCanvasElement, container?: HTMLElement) => {
    canvasElement.value = element

    // 创建Fabric画布
    canvas.value = markRaw(new FabricCanvas(element, {
      selection: true,
      preserveObjectStacking: true,
      uniformScaling: false,
      uniScaleKey: 'shiftKey',
      altActionKey: 'altKey',
    }))

    // 绑定事件
    bindCanvasEvents()

    // 设置初始尺寸
    updateCanvasSize()

    // 如果提供了容器，设置自适应
    if (container) {
      setupAutoResize(container)
    }

    return canvas.value
  }

  const addElement = async (type: string, customProps: Record<string, any> = {}) => {
    const elementConfig = getElementConfig(type)
    if (!elementConfig || !canvas.value)
      return

    const elementId = generateElementId()

    const centerX = canvasData.value.width / 2
    const centerY = canvasData.value.height / 2

    const elementProps = {
      ...elementConfig.defaultProps,
      left: Math.round(centerX - (elementConfig.defaultProps.width || 100) / 2),
      top: Math.round(centerY - (elementConfig.defaultProps.height || 50) / 2),
      ...customProps,
      id: elementId,
    }

    const fabricObject = await elementConfig.createFabricObject(elementProps)
    if (!fabricObject) {
      return
    }

    ;(fabricObject as any).elementId = elementId

    canvas.value.add(fabricObject)
    fabricObject.setCoords()
    canvas.value.setActiveObject(fabricObject)
    canvas.value.renderAll()

    const elementData = elementProps as any
    canvasData.value.elements.push(elementData)
    // 数据更新通过事件监听自动触发

    return elementId
  }

  // 删除选中元素
  const deleteSelectedElements = () => {
    if (!canvas.value || selectedElements.value.length === 0) {
      return
    }

    // 获取当前选中的对象
    const activeObjects = canvas.value.getActiveObjects()

    activeObjects.forEach((obj) => {
      const elementId = (obj as any).elementId
      if (elementId) {
        // 从数据中删除
        const index = canvasData.value.elements.findIndex(el => el.id === elementId)
        if (index !== -1) {
          canvasData.value.elements.splice(index, 1)
        }
      }
      // 从画布删除
      canvas.value?.remove(obj)
    })

    // 清除选择状态
    canvas.value.discardActiveObject()
    selectedElements.value = []
    canvas.value.renderAll()
    // 数据更新通过事件监听自动触发
  }

  const clearSelection = () => {
    canvas.value?.discardActiveObject()
    canvas.value?.renderAll()
  }

  const updateElementProperty = (elementId: string, key: string, value: any) => {
    const elementIndex = canvasData.value.elements.findIndex(el => el.id === elementId)
    if (elementIndex === -1)
      return

    const element = canvasData.value.elements[elementIndex]
    const elementConfig = getElementConfig(element.type)
    if (!elementConfig)
      return

    canvasData.value.elements[elementIndex] = {
      ...element,
      [key]: value,
    }

    const fabricObject = canvas.value?.getObjects().find(obj => (obj as any).elementId === elementId)
    if (fabricObject && elementConfig.onPropsChange) {
      elementConfig.onPropsChange(canvasData.value.elements[elementIndex], fabricObject)
      fabricObject.setCoords()
      canvas.value?.renderAll()
    }

    // 数据更新通过事件监听自动触发
  }

  const canMoveUp = computed(() => {
    if (selectedElements.value.length !== 1 || canvasData.value.elements.length <= 1)
      return false
    const activeObject = selectedElements.value[0]
    const elementId = (activeObject as any).elementId
    if (!elementId)
      return false
    const currentIndex = canvasData.value.elements.findIndex(el => el.id === elementId)
    return currentIndex !== -1 && currentIndex < canvasData.value.elements.length - 1
  })

  const canMoveDown = computed(() => {
    if (selectedElements.value.length !== 1 || canvasData.value.elements.length <= 1)
      return false
    const activeObject = selectedElements.value[0]
    const elementId = (activeObject as any).elementId
    if (!elementId)
      return false
    const currentIndex = canvasData.value.elements.findIndex(el => el.id === elementId)
    return currentIndex > 0
  })

  const canMoveToFront = computed(() => {
    if (selectedElements.value.length !== 1 || canvasData.value.elements.length <= 1)
      return false
    const activeObject = selectedElements.value[0]
    const elementId = (activeObject as any).elementId
    if (!elementId)
      return false
    const currentIndex = canvasData.value.elements.findIndex(el => el.id === elementId)
    return currentIndex !== -1 && currentIndex < canvasData.value.elements.length - 1
  })

  const canMoveToBack = computed(() => {
    if (selectedElements.value.length !== 1 || canvasData.value.elements.length <= 1)
      return false
    const activeObject = selectedElements.value[0]
    const elementId = (activeObject as any).elementId
    if (!elementId)
      return false
    const currentIndex = canvasData.value.elements.findIndex(el => el.id === elementId)
    return currentIndex > 0
  })

  const alignElements = (alignType: AlignType) => {
    const activeObjects = canvas.value?.getActiveObjects() || []

    if (activeObjects.length === 1) {
      alignToCanvas(activeObjects[0], alignType)

      // 同步层级移动到数据数组
      if (['move-up', 'move-down', 'move-to-front', 'move-to-back'].includes(alignType)) {
        const elementId = (activeObjects[0] as any).elementId
        if (elementId) {
          const currentIndex = canvasData.value.elements.findIndex(el => el.id === elementId)
          if (currentIndex !== -1) {
            const element = canvasData.value.elements[currentIndex]
            canvasData.value.elements.splice(currentIndex, 1)

            switch (alignType) {
              case 'move-up':
                canvasData.value.elements.splice(Math.min(currentIndex + 1, canvasData.value.elements.length), 0, element)
                break
              case 'move-down':
                canvasData.value.elements.splice(Math.max(currentIndex - 1, 0), 0, element)
                break
              case 'move-to-front':
                canvasData.value.elements.push(element)
                break
              case 'move-to-back':
                canvasData.value.elements.unshift(element)
                break
            }
          }
        }
      }
    }
    else if (activeObjects.length > 1) {
      alignMultipleElements(activeObjects, alignType)
    }

    // 数据更新通过事件监听自动触发
  }

  const clearCanvas = () => {
    if (!canvas.value)
      return
    canvas.value.clear()
    canvasData.value.elements = []
    selectedElements.value = []
    // 数据更新通过事件监听自动触发
  }

  const loadData = (data: string) => {
    try {
      const parsedData = JSON.parse(data) as CanvasData
      canvasData.value = {
        width: parsedData.width || 750,
        height: parsedData.height || 1000,
        backgroundColor: parsedData.backgroundColor || '#ffffff',
        elements: parsedData.elements || [],
      }

      if (canvas.value) {
        canvas.value.clear()
        canvas.value.setDimensions({
          width: canvasData.value.width,
          height: canvasData.value.height,
        })
        canvas.value.backgroundColor = canvasData.value.backgroundColor

        const loadPromises = canvasData.value.elements.map(async (elementData) => {
          const elementConfig = getElementConfig(elementData.type)
          if (!elementConfig)
            return

          const fabricObject = await elementConfig.createFabricObject(elementData)
          if (fabricObject) {
            ;(fabricObject as any).elementId = elementData.id
            canvas.value?.add(fabricObject)
          }
        })

        Promise.all(loadPromises).then(() => {
          updateCanvasSize()
          canvas.value?.renderAll()
          // 加载完成后手动触发一次数据更新
          updateData()
        })
      }
    }
    catch (error) {
      console.error('Failed to load data:', error)
    }
  }

  const setCallbacks = (callbacks: { onDataChange: (data: string) => void }) => {
    onDataChange = callbacks.onDataChange
  }

  const destroy = () => {
    if (canvas.value) {
      canvas.value.dispose()
      canvas.value = null
    }
  }

  const currentElement = computed(() => {
    return selectedElements.value.length === 1 ? selectedElements.value[0] : null
  })

  const currentElementData = computed(() => {
    if (!currentElement.value)
      return null
    const elementId = (currentElement.value as any).elementId
    return canvasData.value.elements.find(el => el.id === elementId) || null
  })

  const currentElementConfig = computed(() => {
    if (!currentElementData.value)
      return null
    return getElementConfig(currentElementData.value.type)
  })

  const hasMultipleSelection = computed(() => {
    return selectedElements.value.length > 1
  })

  // 获取选中元素的属性值（从 Vue 数据中获取，而不是从 Fabric 对象）
  const getSelectedElementProperty = (key: string) => {
    if (!currentElementData.value)
      return undefined
    return currentElementData.value[key]
  }

  // 获取所有选中元素的数据
  const selectedElementsData = computed(() => {
    return selectedElements.value.map((obj) => {
      const elementId = (obj as any).elementId
      return canvasData.value.elements.find(el => el.id === elementId)
    }).filter((item): item is ElementData => Boolean(item))
  })

  // 更新画布设置
  const updateCanvasSettings = (width: number, height: number) => {
    canvasData.value.width = width
    canvasData.value.height = height

    if (canvas.value) {
      canvas.value.setDimensions({ width, height })
      updateCanvasSize()
      canvas.value.renderAll()
    }

    updateData()
  }

  // 更新画布背景颜色
  const updateCanvasBackground = (color: string) => {
    canvasData.value.backgroundColor = color

    if (canvas.value) {
      canvas.value.backgroundColor = color
      canvas.value.renderAll()
    }

    updateData()
  }

  // 保存数据
  const saveData = () => {
    syncAllFabricObjectsToData()
    updateData()
    // 保存数据逻辑
  }

  // 导出 JSON
  const exportJson = () => {
    syncAllFabricObjectsToData()
    const dataStr = JSON.stringify(canvasData.value, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `poster-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  watch(
    canvasData,
    () => {
      throttledSyncAllData()
    },
    { deep: true },
  )

  return {
    initCanvas,
    destroy,
    setCallbacks,
    addElement,
    deleteSelectedElements,
    updateElementProperty,
    alignElements,
    canMoveUp,
    canMoveDown,
    canMoveToFront,
    canMoveToBack,
    clearCanvas,
    loadData,
    updateData,
    canvas,
    canvasData,
    selectedElements,
    canvasScale,
    currentElement,
    currentElementData,
    currentElementConfig,
    hasMultipleSelection,
    clearSelection,
    updateCanvasSize,
    setupAutoResize,
    getSelectedElementProperty,
    selectedElementsData,
    syncAllFabricObjectsToData,
    updateCanvasSettings,
    updateCanvasBackground,
    saveData,
    exportJson,
  }
}
