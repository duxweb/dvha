import { createDux } from '@duxweb/dvha-core'
import * as DuxPro from '@duxweb/dvha-pro'
import * as NaiveUI from 'naive-ui'
import { createApp } from 'vue'
import config from './config'

import '@duxweb/dvha-pro/style.css'

// import '@duxweb/dvha-pro/theme/style.scss'

const { createDuxPro, DuxApp } = DuxPro

const app = createApp(DuxApp)

app.use(createDux(config))
app.use(NaiveUI)
app.use(createDuxPro())

app.mount('#app')
