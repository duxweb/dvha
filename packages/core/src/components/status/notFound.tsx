import { defineComponent } from 'vue'

export const DuxNotFound = defineComponent({
  name: 'DuxNotFound',
  setup() {
    return () => (
      <div>
        <h1>404</h1>
        <p>Page not found</p>
      </div>
    )
  },
})
