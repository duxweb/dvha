import { computed, defineComponent } from 'vue'

export interface CanvasRulerProps {
  canvasWidth: number
  canvasHeight: number
  canvasScale: number
  rulerSize?: number
}

export const CanvasRuler = defineComponent({
  name: 'CanvasRuler',
  props: {
    canvasWidth: {
      type: Number,
      required: true,
    },
    canvasHeight: {
      type: Number,
      required: true,
    },
    canvasScale: {
      type: Number,
      required: true,
    },
    rulerSize: {
      type: Number,
      default: 20,
    },
  },
  setup(props) {
    // 计算标尺刻度
    const getTickMarks = (length: number, scale: number) => {
      const marks: Array<{ position: number, value: number, isMajor: boolean }> = []

      // 根据缩放比例调整刻度间距
      let tickInterval = 10
      if (scale < 0.5) {
        tickInterval = 50
      }
      else if (scale < 1) {
        tickInterval = 25
      }

      for (let i = 0; i <= length; i += tickInterval) {
        const position = i * scale
        const isMajor = i % (tickInterval * 5) === 0
        marks.push({ position, value: i, isMajor })
      }

      return marks
    }

    const horizontalTicks = computed(() =>
      getTickMarks(props.canvasWidth, props.canvasScale),
    )

    const verticalTicks = computed(() =>
      getTickMarks(props.canvasHeight, props.canvasScale),
    )

    // 计算画布实际显示尺寸
    const canvasDisplayWidth = computed(() => props.canvasWidth * props.canvasScale)
    const canvasDisplayHeight = computed(() => props.canvasHeight * props.canvasScale)

    return () => (
      <div class="absolute inset-0 pointer-events-none">
        <div
          class="absolute flex justify-center left-6 top-0 right-0 bg-default"
          style={{
            height: `${props.rulerSize}px`,
          }}
        >
          <div
            class="absolute top-0 bg-default"
            style={{
              left: '50%',
              transform: 'translateX(-50%)',
              width: `${canvasDisplayWidth.value}px`,
              height: `${props.rulerSize}px`,
            }}
          >
            <svg
              width={canvasDisplayWidth.value}
              height={props.rulerSize}
              class="absolute top-0 left-0"
            >
              {horizontalTicks.value.map((tick, index) => (
                <g key={index}>
                  <line
                    x1={tick.position}
                    y1={tick.isMajor ? 0 : props.rulerSize / 2}
                    x2={tick.position}
                    y2={props.rulerSize}
                    stroke="rgba(0,0,0, 0.1)"
                    stroke-width="1"
                  />
                  {tick.isMajor && (
                    <text
                      x={tick.position + 2}
                      y={props.rulerSize - 6}
                      font-size="10"
                      stroke="rgba(0,0,0, 0.1)"
                      font-family="monospace"
                      fill="rgb(var(--ui-text-muted))"
                    >
                      {tick.value}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* 左侧标尺 - 红色背景，黄色刻度区域 */}
        <div
          class="absolute flex justify-center items-center flex-col top-6 left-0 bottom-0 bg-default border-r border-muted"
          style={{
            width: `${props.rulerSize}px`,
          }}
        >
          {/* 黄色刻度区域 */}
          <div
            class="absolute left-0 bg-default"
            style={{
              top: '50%',
              transform: 'translateY(-50%)',
              width: `${props.rulerSize}px`,
              height: `${canvasDisplayHeight.value}px`,
            }}
          >
            <svg
              width={props.rulerSize}
              height={canvasDisplayHeight.value}
              class="absolute top-0 left-0"
            >
              {verticalTicks.value.map((tick, index) => (
                <g key={index}>
                  <line
                    x1={tick.isMajor ? 0 : props.rulerSize / 2}
                    y1={tick.position}
                    x2={props.rulerSize}
                    y2={tick.position}
                    stroke="rgba(0,0,0, 0.1)"
                    stroke-width="1"
                  />
                  {tick.isMajor && (
                    <text
                      x={props.rulerSize - 6}
                      y={tick.position - 6}
                      font-size="10"
                      fill="rgb(var(--ui-text-muted))"
                      font-family="monospace"
                      text-anchor="end"
                      transform={`rotate(-90, ${props.rulerSize - 2}, ${tick.position - 2})`}
                    >
                      {tick.value}
                    </text>
                  )}
                </g>
              ))}
            </svg>
          </div>
        </div>

        {/* 左上角区域 - 红色背景 */}
        <div
          class="absolute size-6 bg-default top-0 left-0"
        />
      </div>
    )
  },
})
