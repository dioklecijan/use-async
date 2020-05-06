import React from 'react'

import { useMyHook } from '@dioklecijan/use-async'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App
