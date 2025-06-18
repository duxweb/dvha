import { defineComponent } from 'vue'

export const DuxError = defineComponent({
  name: 'DuxError',
  setup() {
    return () => (
      <div>
        <h1>500</h1>
        <p>Internal Server Error</p>
      </div>
    )
  },
})
