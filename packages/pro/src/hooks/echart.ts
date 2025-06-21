import type { EChartsOption } from 'echarts'
import { add } from 'lodash-es'
import { computed, ref, watch } from 'vue'

export interface EchartCommonProps {
  min?: boolean
  /** 显示 X 轴标签 */
  showXAxisLabel?: boolean
  /** 显示 Y 轴标签 */
  showYAxisLabel?: boolean
  /** 显示 X 轴线 */
  showXAxisLine?: boolean
  /** 显示 Y 轴线 */
  showYAxisLine?: boolean
  /** 显示网格线 */
  showGridLine?: boolean
  /** 显示分割区域 */
  showSplitArea?: boolean
  /** 显示图例 */
  showLegend?: boolean
}

/**
 * 通用图表配置
 */
export function useEchartCommon(props?: EchartCommonProps): EChartsOption {
  const isMin = props?.min ?? false

  // 根据是否为迷你图设置默认值，用户可通过 props 覆盖
  const showLegend = props?.showLegend ?? !isMin

  // 迷你图如果要显示标签，需要调整空间预留
  const needAxisLabels = isMin && (props?.showXAxisLabel || props?.showYAxisLabel)

  return {
    grid: {
      left: isMin ? '0%' : '10',
      right: isMin ? '0%' : '10',
      top: isMin ? '2%' : '15%',
      bottom: isMin ? '0%' : '10%',
      containLabel: !isMin || needAxisLabels, // 如果迷你图需要显示标签，则包含标签
    },
    tooltip: {
      show: true,
    },
    legend: {
      show: showLegend,
      top: '0',
      bottom: '0',
    },
  } as EChartsOption
}

// 基础数据项接口
export interface EchartDataItem {
  name: string
  value: number
}

// 多系列数据项
export interface EchartSeriesItem {
  name: string
  data: number[]
  stack?: string
}

// 坐标轴图表基类
export interface EchartAxisProps extends EchartCommonProps {
  /** X轴标签 */
  labels?: string[]
  /** 自动判断单/多系列数据 */
  data?: EchartDataItem[] | EchartSeriesItem[] | number[]
  /** 单系列图表的名称 */
  name?: string
}

/**
 * 坐标轴图表基础配置
 */
function useEchartAxis(props?: EchartAxisProps) {
  const commonOption = useEchartCommon(props)
  const isMin = props?.min ?? false

  // X轴标签数据
  const xAxisData = computed(() => {
    if (props?.labels?.length)
      return props.labels

    if (Array.isArray(props?.data) && props.data.length > 0
      && typeof props.data[0] === 'object' && props.data[0] !== null && 'name' in props.data[0]) {
      return (props.data as EchartDataItem[]).map(item => item.name)
    }
    return []
  })

  // 自动判断并处理数据
  const seriesData = computed(() => {
    if (!props?.data?.length) {
      return [{ name: props?.name || 'Series', data: [], stack: undefined }]
    }

    const firstItem = props.data[0]

    // 判断是否为多系列数据 (EchartSeriesItem[])
    if (typeof firstItem === 'object' && firstItem !== null && 'data' in firstItem && Array.isArray(firstItem.data)) {
      return props.data as EchartSeriesItem[]
    }

    // 判断是否为单系列对象数据 (EchartDataItem[])
    if (typeof firstItem === 'object' && firstItem !== null && 'name' in firstItem && 'value' in firstItem) {
      return [{
        name: props?.name || 'Series',
        data: (props.data as EchartDataItem[]).map(item => item.value),
        stack: undefined,
      }]
    }

    // 判断是否为纯数值数组 (number[])
    if (typeof firstItem === 'number') {
      return [{
        name: props?.name || 'Series',
        data: props.data as number[],
        stack: undefined,
      }]
    }

    // 默认返回空数据
    return [{ name: props?.name || 'Series', data: [], stack: undefined }]
  })

  // 根据是否为迷你图设置默认值，用户可通过 props 覆盖
  const showXAxisLabel = props?.showXAxisLabel ?? !isMin
  const showYAxisLabel = props?.showYAxisLabel ?? !isMin
  const showXAxisLine = props?.showXAxisLine ?? !isMin
  const showYAxisLine = props?.showYAxisLine ?? !isMin
  const showGridLine = props?.showGridLine ?? false
  const showXSplitArea = props?.showSplitArea ?? false // X轴背景色默认关闭
  const showYSplitArea = props?.showSplitArea ?? !isMin // Y轴背景色非mini模式下显示

  const xAxisConfig = {
    axisLabel: {
      show: showXAxisLabel,
      showMinLabel: !isMin,
      showMaxLabel: !isMin,
    },
    axisLine: { show: showXAxisLine },
    axisTick: { show: showXAxisLine },
    splitLine: { show: showGridLine },
    splitArea: { show: showXSplitArea },
  }

  const yAxisConfig = {
    axisLabel: {
      show: showYAxisLabel,
      showMinLabel: !isMin,
      showMaxLabel: !isMin,
    },
    axisLine: { show: showYAxisLine },
    axisTick: { show: showYAxisLine },
    splitLine: { show: showGridLine },
    splitArea: { show: showYSplitArea },
  }

  return {
    commonOption,
    xAxisData,
    seriesData,
    xAxisConfig,
    yAxisConfig,
    isMin,
  }
}

// 柱状图
export interface EchartBarProps extends EchartAxisProps {
  /** 是否为水平柱状图 */
  horizontal?: boolean
  /** 堆叠分组 */
  stack?: string
}

/**
 * 柱状图
 */
export function useEchartBar(props?: EchartBarProps) {
  const { commonOption, xAxisData, seriesData, xAxisConfig, yAxisConfig, isMin } = useEchartAxis(props)

  const option = computed(() => {
    // 当只有一个系列时隐藏 legend
    const shouldShowLegend = seriesData.value.length > 1 && (props?.showLegend ?? !isMin)

    return {
      ...commonOption,
      legend: {
        ...commonOption.legend,
        show: shouldShowLegend,
      },
      tooltip: {
        ...commonOption.tooltip,
        trigger: 'axis',
      },
      xAxis: {
        type: props?.horizontal ? 'value' : 'category',
        data: props?.horizontal ? undefined : xAxisData.value,
        ...xAxisConfig,
        axisLabel: {
          ...xAxisConfig.axisLabel,
        },
        splitArea: { ...xAxisConfig.splitArea, show: xAxisConfig.splitArea?.show ?? !props?.horizontal },
      },
      yAxis: {
        type: props?.horizontal ? 'category' : 'value',
        data: props?.horizontal ? xAxisData.value : undefined,
        ...yAxisConfig,
        axisLabel: {
          ...yAxisConfig.axisLabel,
        },
        splitNumber: isMin ? 3 : undefined,
        splitArea: { ...yAxisConfig.splitArea },
      },
      series: seriesData.value.map((item, index) => {
        const isStacked = !!(props?.stack || item.stack)
        const isFirstSeries = index === 0
        const isLastSeries = index === seriesData.value.length - 1

        // 堆叠图的圆角逻辑：只有顶部和底部有圆角
        let borderRadius: any = isMin ? 2 : 4
        if (isStacked) {
          if (isFirstSeries && isLastSeries) {
            // 只有一个系列时，四个角都有圆角
            borderRadius = isMin ? 2 : 4
          }
          else if (isFirstSeries) {
            // 第一个系列（底部），只有底部圆角
            borderRadius = [0, 0, borderRadius, borderRadius]
          }
          else if (isLastSeries) {
            // 最后一个系列（顶部），只有顶部圆角
            borderRadius = [borderRadius, borderRadius, 0, 0]
          }
          else {
            // 中间系列，没有圆角
            borderRadius = 0
          }
        }

        return {
          type: 'bar',
          name: item.name,
          stack: props?.stack || item.stack,
          data: item.data,
          barMaxWidth: 40,
          itemStyle: {
            borderRadius,
          },
        }
      }),
    } as EChartsOption
  })

  return { option }
}

// 折线图
export interface EchartLineProps extends EchartAxisProps {
  /** 是否平滑曲线 */
  smooth?: boolean
  /** 堆叠分组 */
  stack?: string
}

/**
 * 折线图
 */
export function useEchartLine(props?: EchartLineProps) {
  const { commonOption, xAxisData, seriesData, xAxisConfig, yAxisConfig, isMin } = useEchartAxis(props)

  const option = computed(() => {
    // 当只有一个系列时隐藏 legend
    const shouldShowLegend = seriesData.value.length > 1 && (props?.showLegend ?? !isMin)

    return {
      ...commonOption,
      legend: {
        ...commonOption.legend,
        show: shouldShowLegend,
      },
      tooltip: {
        ...commonOption.tooltip,
        trigger: 'axis',
      },
      xAxis: {
        type: 'category',
        data: xAxisData.value,
        boundaryGap: !isMin, // 迷你图不留边界间隙
        ...xAxisConfig,
        axisLabel: {
          ...xAxisConfig.axisLabel,
        },
        splitArea: { ...xAxisConfig.splitArea, show: xAxisConfig.splitArea?.show ?? false }, // 优先使用用户配置
      },
      yAxis: {
        type: 'value',
        ...yAxisConfig,
        axisLabel: {
          ...yAxisConfig.axisLabel,
        },
        // 迷你图减少Y轴刻度数量，避免过于密集
        splitNumber: isMin ? 3 : undefined,
        splitArea: { ...yAxisConfig.splitArea },
      },
      series: seriesData.value.map(item => ({
        type: 'line',
        name: item.name,
        stack: props?.stack || item.stack,
        data: item.data,
        smooth: props?.smooth ?? false,
        symbol: isMin ? 'none' : 'circle',
        symbolSize: isMin ? 0 : 6,
        lineStyle: {
          width: isMin ? 2 : 2, // 迷你图也加粗到2px
        },
      })),
    } as EChartsOption
  })

  return { option }
}

// 饼图系列基类
export interface EchartPieProps extends EchartCommonProps {
  data?: EchartDataItem[]
}

/**
 * 饼图系列基础配置
 */
function useEchartPieBase(props?: EchartPieProps) {
  const commonOption = useEchartCommon(props)
  const isMin = props?.min ?? false

  const data = computed(() => {
    return props?.data?.map?.(item => ({
      name: item.name,
      value: item.value,
    })) || []
  })

  const legendData = ref<Array<EchartDataItem & { status: boolean }>>([])

  watch(() => props?.data, () => {
    legendData.value = props?.data?.map?.(item => ({
      ...item,
      status: true,
    })) || []
  }, { immediate: true })

  const selected = computed(() => {
    return legendData.value?.reduce((acc, current) => {
      acc[current.name] = current.status
      return acc
    }, {} as Record<string, boolean>)
  })

  // 当只有一条数据时隐藏 legend
  const shouldShowLegend = computed(() => {
    const dataLength = props?.data?.length || 0
    return dataLength > 1 && (props?.showLegend ?? !isMin)
  })

  return {
    commonOption,
    data,
    legendData,
    selected,
    shouldShowLegend,
    isMin,
  }
}

// 饼图
export function useEchartPie(props?: EchartPieProps) {
  const { commonOption, data, legendData, selected, shouldShowLegend, isMin } = useEchartPieBase(props)

  const option = computed(() => {
    const baseOption = { ...commonOption }
    delete baseOption.grid

    return {
      ...baseOption,
      tooltip: {
        ...commonOption.tooltip,
        trigger: 'item',
      },
      legend: {
        ...commonOption.legend,
        show: shouldShowLegend.value,
        selected: selected.value,
      },
      series: {
        type: 'pie',
        top: isMin ? '0%' : '10%',
        radius: isMin ? '100%' : '65%',
        center: ['50%', '50%'],
        label: { show: !isMin },
        labelLine: { show: !isMin },
        emphasis: {
          scale: !isMin, // 迷你图不放大
          scaleSize: isMin ? 0 : 10,
        },
        data: data.value,
      },
    } as EChartsOption
  })

  return { option, legendData }
}

// 环形图
export interface EchartRingProps extends EchartPieProps {
  /** 环形图中心标签 */
  ringLabel?: string
}

/**
 * 环形图
 */
export function useEchartRing(props?: EchartRingProps) {
  const { commonOption, data, legendData, selected, shouldShowLegend, isMin } = useEchartPieBase(props)

  const total = computed(() => {
    return legendData.value?.reduce((acc, current) => {
      return add(acc, Number(current.value))
    }, 0) || 0
  })

  const option = computed(() => {
    const baseOption = { ...commonOption }
    delete baseOption.grid // 环形图不需要grid配置

    return {
      ...baseOption,
      tooltip: {
        ...commonOption.tooltip,
        trigger: 'item',
      },
      legend: {
        ...commonOption.legend,
        show: shouldShowLegend.value,
        selected: selected.value,
      },
      graphic: isMin
        ? []
        : [
            {
              type: 'text',
              left: 'center',
              top: '45%',
              style: {
                text: props?.ringLabel || 'Total',
                textAlign: 'center',
                fontSize: 14,
              },
            },
            {
              type: 'text',
              left: 'center',
              top: '55%',
              style: {
                text: String(total.value),
                textAlign: 'center',
                fontSize: 16,
              },
            },
          ],
      series: {
        top: isMin ? '0%' : '10%',
        type: 'pie',
        radius: isMin ? ['30%', '100%'] : ['40%', '70%'],
        center: ['50%', '50%'],
        label: { show: !isMin },
        labelLine: { show: !isMin },
        emphasis: {
          scale: !isMin, // 迷你图不放大
          scaleSize: isMin ? 0 : 10,
        },
        data: data.value,
      },
    } as EChartsOption
  })

  return { option, legendData }
}

// 玫瑰图
export function useEchartRose(props?: EchartPieProps) {
  const { commonOption, data, legendData, selected, shouldShowLegend, isMin } = useEchartPieBase(props)

  const option = computed(() => {
    const baseOption = { ...commonOption }
    delete baseOption.grid // 玫瑰图不需要grid配置

    return {
      ...baseOption,
      tooltip: {
        ...commonOption.tooltip,
        trigger: 'item',
      },
      legend: {
        ...commonOption.legend,
        show: shouldShowLegend.value,
        selected: selected.value,
      },
      series: {
        type: 'pie',
        top: isMin ? '0%' : '10%',
        radius: isMin ? '100%' : '70%',
        center: ['50%', '50%'],
        roseType: 'area',
        label: { show: !isMin },
        labelLine: { show: !isMin },
        emphasis: {
          scale: !isMin, // 迷你图不放大
          scaleSize: isMin ? 0 : 10,
        },
        data: data.value,
      },
    } as EChartsOption
  })

  return { option, legendData }
}

// 漏斗图
export function useEchartFunnel(props?: EchartPieProps) {
  const { commonOption, data, legendData, selected, shouldShowLegend, isMin } = useEchartPieBase(props)

  const option = computed(() => {
    const baseOption = { ...commonOption }
    delete baseOption.grid

    return {
      ...baseOption,
      tooltip: {
        ...commonOption.tooltip,
        trigger: 'item',
      },
      legend: {
        ...commonOption.legend,
        show: shouldShowLegend.value,
        selected: selected.value,
      },
      series: {
        type: 'funnel',
        top: isMin ? '0%' : '15%',
        left: isMin ? '0%' : '10%',
        right: isMin ? '0%' : '10%',
        bottom: isMin ? '0%' : '5%',
        label: { show: !isMin },
        data: data.value,
      },
    } as EChartsOption
  })

  return { option, legendData }
}

// 雷达图
export interface EchartRadarDataItem {
  name: string
  value: number[]
}

export interface EchartRadarProps extends EchartCommonProps {
  /** 雷达图指标配置 */
  indicator?: Array<{ name: string, max: number }>
  data?: EchartRadarDataItem[]
}

/**
 * 雷达图
 */
export function useEchartRadar(props?: EchartRadarProps) {
  const commonOption = useEchartCommon(props)
  const isMin = props?.min ?? false

  const option = computed(() => {
    const baseOption = { ...commonOption }
    delete baseOption.grid

    // 当只有一条数据时隐藏 legend
    const dataLength = props?.data?.length || 0
    const shouldShowLegend = dataLength > 1 && (props?.showLegend ?? !isMin)

    return {
      ...baseOption,
      tooltip: {
        ...commonOption.tooltip,
        trigger: 'item',
      },
      legend: {
        ...commonOption.legend,
        show: shouldShowLegend,
        left: 'center',
      },
      radar: {
        indicator: props?.indicator || [],
        splitArea: { show: !isMin },
        center: ['50%', '50%'],
        radius: isMin ? '100%' : '50%',
        axisName: {
          color: isMin ? 'transparent' : undefined,
        },
      },
      series: [{
        type: 'radar',
        data: props?.data || [],
        lineStyle: { width: isMin ? 1 : 2 },
        areaStyle: { opacity: isMin ? 0.3 : 0.5 },
      }],
    } as unknown as EChartsOption
  })

  return { option }
}

// 地图
export interface EchartMapProps extends EchartCommonProps {
  /** 地图名称 */
  mapName?: string
  data?: EchartDataItem[]
}

/**
 * 地图
 */
export function useEchartMap(props?: EchartMapProps) {
  const commonOption = useEchartCommon(props)
  const isMin = props?.min ?? false

  const option = computed(() => {
    return {
      ...commonOption,
      tooltip: {
        ...commonOption.tooltip,
        trigger: 'item',
      },
      visualMap: {
        show: !isMin,
        min: 0,
        max: Math.max(...(props?.data?.map(item => item.value) || [100])),
        left: 'left',
        top: 'bottom',
        calculable: true,
      },
      series: [{
        type: 'map',
        map: props?.mapName || 'china',
        data: props?.data || [],
        label: { show: !isMin },
      }],
    } as EChartsOption
  })

  return { option }
}

export interface EchartTreeMapDataItem {
  name: string
  value: number
  children?: EchartTreeMapDataItem[]
}

export interface EchartTreeMapProps extends EchartCommonProps {
  data?: EchartTreeMapDataItem[] | EchartTreeMapDataItem[][]
  /** 树状图名称，支持多个 */
  name?: string | string[]
}

/**
 * 矩形树图
 */
export function useEchartTreeMap(props?: EchartTreeMapProps) {
  const commonOption = useEchartCommon(props)
  const isMin = props?.min ?? false

  const option = computed(() => {
    const isMultipleSeries = Array.isArray(props?.data) && props?.data.length > 0 && Array.isArray(props?.data[0])

    let series
    if (isMultipleSeries) {
      const dataArray = props?.data as EchartTreeMapDataItem[][]
      const nameArray = Array.isArray(props?.name) ? props?.name : [props?.name || 'TreeMap']

      series = dataArray.map((data, index) => ({
        name: nameArray[index] || `TreeMap ${index + 1}`,
        type: 'treemap',
        data,
        label: { show: !isMin },
        itemStyle: { borderWidth: isMin ? 1 : 2 },
        top: `${15 + index * (60 / dataArray.length)}%`,
        height: `${70 / dataArray.length - 5}%`,
        breadcrumb: { show: false },
        roam: isMin ? false : 'move',
        nodeClick: !isMin,
        levels: [{
          itemStyle: {
            borderWidth: 0,
            gapWidth: isMin ? 1 : 2,
          },
        }],
      }))
    }
    else {
      series = [{
        name: Array.isArray(props?.name) ? props?.name[0] : (props?.name || 'TreeMap'),
        type: 'treemap',
        data: props?.data || [],
        label: { show: !isMin },
        itemStyle: { borderWidth: isMin ? 1 : 2 },
        breadcrumb: { show: !isMin },
        roam: isMin ? false : 'move',
        nodeClick: !isMin,
        levels: [{
          itemStyle: {
            borderWidth: 0,
            gapWidth: isMin ? 1 : 2,
          },
        }],
      }]
    }

    return {
      ...commonOption,
      legend: {
        ...commonOption.legend,
      },
      tooltip: {
        ...commonOption.tooltip,
        trigger: 'item',
      },
      grid: {
        ...commonOption.grid,
        top: isMultipleSeries ? '15%' : '10%',
        bottom: isMultipleSeries ? '15%' : '5%',
      },
      series,
    } as EChartsOption
  })

  return { option }
}

/**
 * 通用图表类型选择器
 */
export function useEchartType(type: string, props: any) {
  switch (type) {
    case 'bar':
      return useEchartBar(props)
    case 'line':
      return useEchartLine(props)
    case 'pie':
      return useEchartPie(props)
    case 'ring':
      return useEchartRing(props)
    case 'rose':
      return useEchartRose(props)
    case 'radar':
      return useEchartRadar(props)
    case 'map':
      return useEchartMap(props)
    case 'funnel':
      return useEchartFunnel(props)
    case 'treemap':
      return useEchartTreeMap(props)
    default:
      return useEchartBar(props)
  }
}
