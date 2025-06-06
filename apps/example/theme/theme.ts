function withRgb(variableName: string) {
  return `rgb(var(${variableName}))`
}

export function themePreset(themeColor: Record<string, any>) {
  const colorsVar: Record<string, Record<string, any>> = {}
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
  const colorTypes = ['primary', 'info', 'success', 'warning', 'error', 'gray']
  const scenes = ['hover', 'pressed', 'focus', 'disabled']

  colorsVar.white = { DEFAULT: withRgb('--color-white') }
  colorsVar.black = { DEFAULT: withRgb('--color-black') }

  Object.keys(themeColor).forEach((colorName) => {
    colorsVar[colorName] = {}
    shades.forEach((shade) => {
      colorsVar[colorName][shade] = withRgb(`--base-color-${colorName}-${shade}`)
    })
  })

  colorTypes.forEach((type) => {
    colorsVar[type] = {}

    colorsVar[type].DEFAULT = withRgb(`--ui-color-${type}`)

    shades.forEach((shade) => {
      colorsVar[type][shade] = withRgb(`--ui-color-${type}-${shade}`)
    })

    scenes.forEach((scene) => {
      colorsVar[type][scene] = withRgb(`--ui-color-${type}-${scene}`)
    })
  })

  const classVars = {
    // 文字颜色
    'text': {
      color: withRgb('--ui-text'),
    },
    'text-dimmed': {
      color: withRgb('--ui-text-dimmed'),
    },
    'text-muted': {
      color: withRgb('--ui-text-muted'),
    },
    'text-toned': {
      color: withRgb('--ui-text-toned'),
    },
    'text-highlighted': {
      color: withRgb('--ui-text-highlighted'),
    },
    'text-inverted': {
      color: withRgb('--ui-text-inverted'),
    },

    // 背景颜色
    'bg': {
      'background-color': withRgb('--ui-bg'),
    },
    'bg-muted': {
      'background-color': withRgb('--ui-bg-muted'),
    },
    'bg-elevated': {
      'background-color': withRgb('--ui-bg-elevated'),
    },
    'bg-accented': {
      'background-color': withRgb('--ui-bg-accented'),
    },
    'bg-inverted': {
      'background-color': withRgb('--ui-bg-inverted'),
    },

    // 边框颜色
    'border': {
      'border-color': withRgb('--ui-border'),
    },
    'border-muted': {
      'border-color': withRgb('--ui-border-muted'),
    },
    'border-accented': {
      'border-color': withRgb('--ui-border-accented'),
    },
    'border-inverted': {
      'border-color': withRgb('--ui-border-inverted'),
    },
  }

  const utilities: Record<string, Record<string, string>> = {}
  Object.entries(classVars).forEach(([className, styles]) => {
    utilities[`.${className}`] = styles
  })

  const rules: object[] = []
  Object.entries(classVars).forEach(([className, styles]) => {
    rules.push([
      className,
      styles,
    ])
  })

  return {
    colors: colorsVar,
    classes: classVars,
    rules,
    utilities,
  }
}
