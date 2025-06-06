export const themePreset = (themeColor: Record<string, any>) => {
  const colorsVar: Record<string, Record<string, string>> = {}
  const shades = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900', '950']
  const colorTypes = ['primary', 'info', 'success', 'warning', 'error', 'gray']
  const scenes = ['hover', 'pressed', 'focus', 'disabled']

  colorsVar.white = { DEFAULT: 'var(--color-white)' }
  colorsVar.black = { DEFAULT: 'var(--color-black)' }

  Object.keys(themeColor).forEach((colorName) => {
    colorsVar[colorName] = {}
    shades.forEach((shade) => {
      colorsVar[colorName][shade] = `var(--base-color-${colorName}-${shade})`
    })
  })

  colorTypes.forEach((type) => {
    colorsVar[type] = {}

    colorsVar[type].DEFAULT = `var(--ui-color-${type})`

    shades.forEach((shade) => {
      colorsVar[type][shade] = `var(--ui-color-${type}-${shade})`
    })

    scenes.forEach((scene) => {
      colorsVar[type][scene] = `var(--ui-color-${type}-${scene})`
    })
  })

  const classVars = {
    // 文字颜色
    'text': {
      'color': 'var(--ui-text)',
    },
    'text-dimmed': {
      'color': 'var(--ui-text-dimmed)',
    },
    'text-muted': {
      'color': 'var(--ui-text-muted)',
    },
    'text-toned': {
      'color': 'var(--ui-text-toned)',
    },
    'text-highlighted': {
      'color': 'var(--ui-text-highlighted)',
    },
    'text-inverted': {
      'color': 'var(--ui-text-inverted)',
    },

    // 背景颜色
    'bg': {
      'background-color': 'var(--ui-bg)',
    },
    'bg-muted': {
      'background-color': 'var(--ui-bg-muted)',
    },
    'bg-elevated': {
      'background-color': 'var(--ui-bg-elevated)',
    },
    'bg-accented': {
      'background-color': 'var(--ui-bg-accented)',
    },
    'bg-inverted': {
      'background-color': 'var(--ui-bg-inverted)',
    },

    // 边框颜色
    'border': {
      'border-color': 'var(--ui-border)',
    },
    'border-muted': {
      'border-color': 'var(--ui-border-muted)',
    },
    'border-accented': {
      'border-color': 'var(--ui-border-accented)',
    },
    'border-inverted': {
      'border-color': 'var(--ui-border-inverted)',
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
    rules: rules,
    utilities,
  }
}