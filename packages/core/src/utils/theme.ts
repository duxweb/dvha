function withRgb(variableName: string) {
  return `rgb(var(${variableName}))`
}

function withOpacity(variableName: string, opacityVar: string) {
  return `color-mix(in oklab, rgb(var(${variableName})) var(${opacityVar}, 100%), transparent)`
}

export function themePreset(themeColor: Record<string, any>) {
  // 常量定义
  const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
  const COLOR_TYPES = ['primary', 'info', 'success', 'warning', 'error', 'gray']
  const SCENES = ['hover', 'pressed', 'focus', 'disabled']

  // 构建颜色变量映射
  const colorsVar: Record<string, Record<string, any>> = {
    white: { DEFAULT: withRgb('--ui-color-white') },
    black: { DEFAULT: withRgb('--ui-color-black') },
  }

  // 生成基础色彩变量
  Object.keys(themeColor).forEach((colorName) => {
    colorsVar[colorName] = {}
    SHADES.forEach((shade) => {
      colorsVar[colorName][shade] = withRgb(`--base-color-${colorName}-${shade}`)
    })
  })

  // 生成 UI 色彩变量
  COLOR_TYPES.forEach((type) => {
    colorsVar[type] = {
      DEFAULT: withOpacity(`--ui-color-${type}`, '--un-text-opacity'),
    }

    SHADES.forEach((shade) => {
      colorsVar[type][shade] = withOpacity(`--ui-color-${type}-${shade}`, '--un-text-opacity')
    })

    SCENES.forEach((scene) => {
      colorsVar[type][scene] = withOpacity(`--ui-color-${type}-${scene}`, '--un-text-opacity')
    })
  })

  // 语义化颜色定义
  const semanticColors = {
    text: ['default', 'dimmed', 'muted', 'toned', 'highlighted', 'inverted'],
    bg: ['default', 'muted', 'elevated', 'accented', 'inverted'],
    border: ['default', 'muted', 'accented', 'inverted'],
  }

  function createSemanticColorRules(prefix: string, property: string, variants: string[], opacityVar: string, sourcePrefix?: string) {
    const rules: any[] = []

    variants.forEach((variant) => {
      const cssVarPrefix = sourcePrefix || prefix
      const cssVar = `--ui-${cssVarPrefix}${variant === 'default' ? '' : `-${variant}`}`

      rules.push([
        `${prefix}-${variant}`,
        {
          [property]: `color-mix(in oklab, rgb(var(${cssVar})) var(${opacityVar}, 100%), transparent)`,
          [opacityVar]: '100%',
        },
      ])

      rules.push([
        new RegExp(`^${prefix}-${variant}\\/(\\d*\\.?\\d+)(%?)$`),
        ([, opacity, isPercent]: string[]) => {
          const opacityValue = Number(opacity)
          let opacityStr: string
          if (isPercent || opacityValue > 1) {
            opacityStr = `${opacityValue}%`
          }
          else {
            // 小数转百分比
            opacityStr = `${opacityValue * 100}%`
          }
          return {
            [property]: `color-mix(in oklab, rgb(var(${cssVar})) var(${opacityVar}, 100%), transparent)`,
            [opacityVar]: opacityStr,
          }
        },
      ])

      rules.push([
        new RegExp(`^${prefix}-${variant}\\[(.+)\\]$`),
        ([, value]: string[]) => ({
          [property]: value.replace(/_/g, ' '),
        }),
      ])
    })

    return rules
  }

  // 生成所有语义化颜色规则
  const textRules = createSemanticColorRules('text', 'color', semanticColors.text, '--un-text-opacity')
  const bgRules = createSemanticColorRules('bg', 'background-color', semanticColors.bg, '--un-bg-opacity')
  const borderRules = createSemanticColorRules('border', 'border-color', semanticColors.border, '--un-border-opacity')
  const ringRules = createSemanticColorRules('ring', '--un-ring-color', semanticColors.border, '--un-ring-opacity', 'border')

  const divideRules: any[] = []
  semanticColors.border.forEach((variant) => {
    const cssVar = `--ui-border${variant === 'default' ? '' : `-${variant}`}`

    divideRules.push([
      new RegExp(`^divide-${variant}$`),
      (_: any, { rawSelector }: any) => {
        const selector = rawSelector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        return `
          .${selector} > :not(:last-child) {
            border-color: color-mix(in oklab, rgb(var(${cssVar})) var(--un-border-opacity, 100%), transparent);
            --un-border-opacity: 100%;
          }`
      },
    ])

    divideRules.push([
      new RegExp(`^divide-${variant}\\/(\\d*\\.?\\d+)(%?)$`),
      ([, opacity, isPercent]: string[], { rawSelector }: any) => {
        const opacityValue = Number(opacity)
        let opacityStr: string
        if (isPercent || opacityValue > 1) {
          opacityStr = `${opacityValue}%`
        }
        else {
          opacityStr = `${opacityValue * 100}%`
        }
        const selector = rawSelector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
        return `
          .${selector} > :not(:last-child) {
            border-color: color-mix(in oklab, rgb(var(${cssVar})) var(--un-border-opacity, 100%), transparent);
            --un-border-opacity: ${opacityStr};
          }`
      },
    ])
  })

  const rules = [
    ...textRules,
    ...bgRules,
    ...borderRules,
    ...ringRules,
    ...divideRules,
  ]

  return {
    name: 'preset-theme',
    theme: {
      colors: colorsVar,
    },
    rules,
  }
}
