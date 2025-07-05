import type { HSL } from 'colorizr'
import type { ThemeRiverSeriesOption } from 'echarts'
import { generate } from '@ant-design/colors'

export function generateRainbowFromColor(hsl: HSL, numColors: number) {
  const baseHue = (Number(hsl.h) % 360 + 360) % 360
  const colors: string[] = []

  const harmonicIntervals = [0, 144, 72, 216, 36, 180, 108, 252, 18, 162]
  const targetSaturation = 60
  const targetLightness = 55

  if (numColors <= harmonicIntervals.length) {
    for (let i = 0; i < numColors; i++) {
      const hue = (baseHue + harmonicIntervals[i]) % 360
      colors.push(`hsla(${hue}, ${Math.round(targetSaturation)}%, ${Math.round(targetLightness)}%, 0.8)`)
    }
  }
  else {
    const goldenRatio = 137.508
    for (let i = 0; i < numColors; i++) {
      const hue = (baseHue + i * goldenRatio) % 360
      colors.push(`hsla(${hue}, ${Math.round(targetSaturation)}%, ${Math.round(targetLightness)}%, 0.8)`)
    }
  }

  return colors
}

export function getTheme(colors: string[], dark: boolean) {
  const colorLine = dark
    ? generate(colors[0], {
        theme: 'dark',
        backgroundColor: 'rgb(var(--ui-bg))',
      })
    : generate(colors[0], {
        backgroundColor: 'rgb(var(--ui-bg))',
      })

  const theme = {
    color: colors,
    backgroundColor: 'rgba(255,255,255,0)',
    textStyle: {},
    grid: {
      left: '10',
      right: '10',
      top: '10%',
      bottom: '5%',
      containLabel: true,
    },
    title: {
      textStyle: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'left',
        color: 'rgb(var(--ui-text))',
      },
      subtextStyle: {
        color: 'rgb(var(--ui-text-muted))',
      },
    },

    line: {
      itemStyle: {
        borderWidth: '2',
      },
      lineStyle: {
        width: '2',
      },
      areaStyle: {
        opacity: 0.3,
      },
      symbolSize: '8',
      symbol: 'emptyCircle',
      smooth: false,
    },
    radar: {
      itemStyle: {
        borderWidth: '2',
      },
      lineStyle: {
        width: '2',
      },
      symbolSize: '6',
      symbol: 'emptyCircle',
      smooth: false,
      axisLine: {
        lineStyle: {
          color: 'rgb(var(--ui-text-muted))',
        },
      },
      splitLine: {
        lineStyle: {
          color: 'rgb(var(--ui-border-accented))',
        },
      },
      splitArea: {
        areaStyle: {
          color: [
            'rgba(250,250,250,0)',
            'rgb(var(--ui-bg-muted))',
          ],
        },
      },
    },
    bar: {
      itemStyle: {
        barBorderWidth: 0,
        barBorderColor: 'rgb(var(--ui-border-muted))',
        borderRadius: 0,
      },
    },
    pie: {
      itemStyle: {
        borderWidth: 1.5,
        borderColor: 'var(--ui-border)',
        borderRadius: 0,
      },
      label: {
        color: 'rgb(var(--ui-text))',
      },
    },
    scatter: {
      itemStyle: {
        borderWidth: 0,
        borderColor: 'rgb(var(--ui-border-muted))',
      },
    },
    boxplot: {
      itemStyle: {
        borderWidth: 0,
        borderColor: 'rgb(var(--ui-border-muted))',
      },
    },
    parallel: {
      itemStyle: {
        borderWidth: 0,
        borderColor: 'rgb(var(--ui-border-muted))',
      },
    },
    sankey: {
      itemStyle: {
        borderWidth: 0,
        borderColor: 'rgb(var(--ui-border-muted))',
      },
    },
    funnel: {
      itemStyle: {
        borderWidth: 2,
        borderColor: 'var(--ui-border)',
      },
      label: {
        color: 'rgb(var(--ui-text))',
      },
    },
    treemap: {
      itemStyle: {
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0)',
      },
      label: {
        color: 'rgb(var(--ui-color-white) / 0.8)',
      },
    },
    gauge: {
      itemStyle: {
        borderWidth: 0,
        borderColor: 'rgb(var(--ui-border-muted))',
      },
    },
    candlestick: {
      itemStyle: {
        color: '#e6a0d2',
        color0: 'transparent',
        borderColor: '#e6a0d2',
        borderColor0: '#3fb1e3',
        borderWidth: '2',
      },
    },
    graph: {
      itemStyle: {
        borderWidth: 0,
        borderColor: 'rgb(var(--ui-border-muted))',
      },
      lineStyle: {
        width: '1',
        color: 'rgb(var(--ui-border-muted))',
      },
      symbolSize: '8',
      symbol: 'emptyCircle',
      smooth: false,
      color: colors,
      label: {
        color: 'var(--ui-border)',
      },
    },
    map: {
      itemStyle: {
        areaColor: 'var(--ui-border)',
        borderColor: 'rgb(var(--n-gray-color-7))',
        borderWidth: 0.5,
      },
      label: {
        show: false,
        color: 'rgb(var(--ui-text))',
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(var(--ui-primary), 0.25)',
          borderColor: 'rgb(var(--ui-primary))',
          borderWidth: 1,
        },
        label: {
          color: 'rgb(var(--ui-primary))',
        },
      },
    },
    geo: {
      itemStyle: {
        areaColor: 'var(--ui-border)',
        borderColor: 'rgb(var(--ui-border-muted))',
        borderWidth: 0.5,
      },
      label: {
        color: 'var(--ui-border)',
      },
      emphasis: {
        itemStyle: {
          areaColor: 'rgba(var(--ui-primary), 0.25)',
          borderColor: 'rgb(var(--ui-primary))',
          borderWidth: 1,
        },
        label: {
          color: 'rgb(var(--ui-primary))',
        },
      },
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgb(var(--ui-border-accented))',
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: 'rgb(var(--ui-border-accented))',
        },
      },
      axisLabel: {
        show: true,
        color: 'rgb(var(--ui-text-muted))',
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: [
            'rgb(var(--ui-border-accented))',
          ],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: [
            'rgba(250,250,250,0)',
            'rgb(var(--ui-bg-muted))',
          ],
        },
      },
    },
    valueAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgb(var(--ui-border-accented))',
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: 'rgb(var(--ui-border-accented))',
        },
      },
      axisLabel: {
        show: true,
        color: 'rgb(var(--ui-text-muted))',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: [
            'rgb(var(--ui-border-accented))',
          ],
        },
      },
      splitArea: {
        show: true,
        areaStyle: {
          color: [
            'rgba(250,250,250,0)',
            'rgb(var(--ui-bg-muted))',
          ],
        },
      },
    },
    logAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgb(var(--ui-border-accented))',
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: 'rgb(var(--ui-border-accented))',
        },
      },
      axisLabel: {
        show: true,
        color: 'rgb(var(--ui-text-muted))',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: [
            'rgb(var(--ui-border-accented))',
          ],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: [
            'rgba(250,250,250,0)',
            'rgb(var(--ui-bg-muted))',
          ],
        },
      },
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: 'rgb(var(--ui-border-accented))',
        },
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: 'rgb(var(--ui-border-accented))',
        },
      },
      axisLabel: {
        show: true,
        color: 'rgb(var(--ui-text-muted))',
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: [
            'rgb(var(--ui-border-accented))',
          ],
        },
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: [
            'rgba(250,250,250,0)',
            'rgb(var(--ui-bg-muted))',
          ],
        },
      },
    },
    toolbox: {
      iconStyle: {
        borderColor: 'rgb(var(--ui-border-muted))',
      },
      emphasis: {
        iconStyle: {
          borderColor: 'rgb(var(--ui-border-muted))',
        },
      },
    },
    legend: {
      textStyle: {
        color: 'rgb(var(--ui-text-muted))',
      },
    },
    tooltip: {
      backgroundColor: 'rgb(var(--ui-bg) / 0.8)',
      shadowBlur: 10,
      borderWidth: 0,
      textStyle: {
        color: 'rgb(var(--ui-text))',
      },
      axisPointer: {
        lineStyle: {
          color: 'rgb(var(--ui-border-muted))',
          width: 1,
        },
        crossStyle: {
          color: 'rgb(var(--ui-border-muted))',
          width: 1,
        },
      },
    },
    timeline: {
      lineStyle: {
        color: 'rgb(var(--ui-primary))',
        width: 1,
      },
      itemStyle: {
        color: 'rgb(var(--ui-primary))',
        borderWidth: 1,
      },
      controlStyle: {
        color: 'rgb(var(--ui-primary))',
        borderColor: 'rgb(var(--ui-primary))',
        borderWidth: 0.5,
      },
      checkpointStyle: {
        color: 'rgb(var(--ui-primary))',
        borderColor: 'rgb(var(--ui-primary))',
      },
      label: {
        color: 'rgb(var(--ui-primary))',
      },
      emphasis: {
        itemStyle: {
          color: 'rgb(var(--ui-primary))',
        },
        controlStyle: {
          color: 'rgb(var(--ui-primary))',
          borderColor: 'rgb(var(--ui-primary))',
          borderWidth: 0.5,
        },
        label: {
          color: 'rgb(var(--ui-primary))',
        },
      },
    },
    visualMap: {
      color: colorLine,
    },
    dataZoom: {
      backgroundColor: 'rgba(255,255,255,0)',
      dataBackgroundColor: 'rgba(222,222,222,1)',
      fillerColor: 'rgba(114,230,212,0.25)',
      handleColor: 'rgb(var(--ui-border-muted))',
      handleSize: '100%',
      textStyle: {
        color: 'rgb(var(--ui-text-muted))',
      },
    },
    markPoint: {
      label: {
        color: 'rgb(var(--ui-text))',
      },
      emphasis: {
        label: {
          color: 'rgb(var(--ui-text))',
        },
      },
    },
  } as ThemeRiverSeriesOption

  return theme
}
