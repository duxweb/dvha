// typings.d.ts
declare module '*.css' {
  const content: string
  export default content
}

declare module '*?raw' {
  const content: string
  export default content
}

declare module '*.vue' {
  import { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
