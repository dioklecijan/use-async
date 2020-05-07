# @dioklecijan/use-async

> a React hook for executing async functions

[![NPM](https://img.shields.io/npm/v/@dioklecijan/use-async.svg)](https://www.npmjs.com/package/@dioklecijan/use-async) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @dioklecijan/use-async
```

## Usage

See `example/src/App.js` for more complete example:

```tsx
import * as React from 'react'
import { useAsync } from '@dioklecijan/use-async'

const getCurrentRate = async (base:string) => {
  const url = `https://api.ratesapi.io/api/latest?base=${base}`;
  const res = await fetch(url);
  return res.json();
}

const Example = () => {
  const fx = useAsync(getCurrentRate, true, "EUR", "GBP,USD");
  return (
    <div>
    <div>
      <h1>European Central Bank exchange rates</h1>
      <button onClick={() => fx.execute("EUR")}>Get all rates</button>
      {fx.state.error && <div>Error: {fx.state.error.message}</div>}
      {fx.state.pending && <div>Fetching rates...</div>}
      {fx.state.value && <pre>{JSON.stringify(fx.state.value, null, 2)}</pre>}
    </div>
  )
}
```

## License

MIT © [dioklecijan](https://github.com/dioklecijan)

---

This hook is created using [create-react-hook](https://github.com/hermanya/create-react-hook).
