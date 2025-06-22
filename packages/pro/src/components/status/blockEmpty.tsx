import { useI18n } from '@duxweb/dvha-core'
import clsx from 'clsx'
import { defineComponent } from 'vue'

export const DuxBlockEmpty = defineComponent({
  name: 'Message',
  props: {
    text: {
      type: String,
    },
    desc: {
      type: String,
    },
    simple: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const { t } = useI18n()
    return () => (
      <div class="flex justify-center p-2">
        <div class={clsx([
          'flex flex-row items-center',
          props.simple ? 'flex-col' : 'gap-2',
        ])}
        >
          <div>
            <svg class="size-60px" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:rgb(var(--ui-color-primary));stop-opacity:0.1" />
                  <stop offset="100%" style="stop-color:rgb(var(--ui-color-primary));stop-opacity:0.05" />
                </linearGradient>
                <linearGradient id="boxGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" style="stop-color:rgb(var(--ui-bg-elevated));stop-opacity:1" />
                  <stop offset="100%" style="stop-color:rgb(var(--ui-bg-muted));stop-opacity:1" />
                </linearGradient>
              </defs>

              <circle cx="100" cy="100" r="85" fill="url(#bgGradient)" />

              <g transform="translate(100, 100)">
                <ellipse cx="0" cy="35" rx="45" ry="8" fill="rgb(var(--ui-color-gray-300))" opacity="0.3" />

                <path
                  d="M -35 -10 L -35 25 Q -35 30 -30 30 L 30 30 Q 35 30 35 25 L 35 -5 Q 35 -10 30 -10 L 5 -10 L -5 -20 L -30 -20 Q -35 -20 -35 -15 Z"
                  fill="url(#boxGradient)"
                  stroke="rgb(var(--ui-color-gray-300))"
                  stroke-width="1"
                />

                <path
                  d="M -5 -20 L 5 -10 L 15 -10 Q 20 -10 20 -15 Q 20 -20 15 -20 Z"
                  fill="rgb(var(--ui-color-primary))"
                  opacity="0.8"
                />

                <g transform="translate(0, -5)" opacity="0.6">
                  <rect x="-8" y="-5" width="16" height="20" rx="2" fill="rgb(var(--ui-bg-elevated))" stroke="rgb(var(--ui-color-gray-400))" stroke-width="0.5" />
                  <line x1="-5" y1="0" x2="5" y2="0" stroke="rgb(var(--ui-color-gray-400))" stroke-width="1" opacity="0.5" />
                  <line x1="-5" y1="4" x2="3" y2="4" stroke="rgb(var(--ui-color-gray-400))" stroke-width="1" opacity="0.5" />
                  <line x1="-5" y1="8" x2="5" y2="8" stroke="rgb(var(--ui-color-gray-400))" stroke-width="1" opacity="0.5" />
                </g>

                <circle cx="-25" cy="-25" r="2" fill="rgb(var(--ui-color-primary))" opacity="0.4">
                  <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle cx="25" cy="-15" r="1.5" fill="rgb(var(--ui-color-primary))" opacity="0.3">
                  <animate attributeName="opacity" values="0.3;0.6;0.3" dur="3s" repeatCount="indefinite" />
                </circle>
                <circle cx="20" cy="25" r="1" fill="rgb(var(--ui-color-primary))" opacity="0.2">
                  <animate attributeName="opacity" values="0.2;0.5;0.2" dur="4s" repeatCount="indefinite" />
                </circle>
              </g>
            </svg>
          </div>

          <div class="flex flex-col gap-0">
            <div class={clsx([
              'text-default',
              props.simple ? 'text-center' : '',
            ])}
            >
              {props.text || t('pages.empty.title')}
            </div>
            {!props.simple && (<div class="text-muted">{props.desc || t('pages.empty.desc')}</div>
            )}
          </div>
        </div>
      </div>
    )
  },
})
