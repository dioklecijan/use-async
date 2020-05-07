import React from "react";

import { useAsync } from "@dioklecijan/use-async";

// async function
const getCurrentRate = async (base:string, symbols?: string) => {
  // force exception if base=ERROR
  const url =
    base === "ERROR"
      ? `https://xapi.ratesapi.io/api/latest?base=${base}&symbols=${symbols}`
      : symbols
      ? `https://api.ratesapi.io/api/latest?base=${base}&symbols=${symbols}`
      : `https://api.ratesapi.io/api/latest?base=${base}`;
  const res = await fetch(url);
  return res.json();
};

// helper to convert an Error object to JSON
const replaceError = (key, value) => {
  if (value instanceof Error) {
    let error = {};
    Object.getOwnPropertyNames(value).forEach(
      (prop) => (error[prop] = value[prop])
    );
    return error;
  }
  return value;
};

const App = () => {
  const fx = useAsync(getCurrentRate, true, "EUR", "GBP,USD");
  return (
    <div>
      <h1>European Central Bank exchange rates</h1>
      <button onClick={() => fx.execute("EUR")}>EUR</button>
      <button onClick={() => fx.execute("EUR", "GBP")}>EUR/GBP</button>
      <button onClick={() => fx.execute("GBP", "EUR")}>GBP/EUR</button>
      <button onClick={() => fx.execute("EUR", "USD")}>EUR/USD</button>
      <button onClick={() => fx.execute("EUR", "GBP,USD")}>EUR/GPB,USD</button>
      <button onClick={() => fx.execute("EUR", "HRK")}>EUR/HRK</button>
      <button onClick={() => fx.execute("EUR", "UNKNOWN")}>EUR/UNKNOWN</button>
      <button onClick={() => fx.execute("ERROR")}>ERROR REQUEST</button>
      <pre>{JSON.stringify(fx.state, replaceError, 2)}</pre>
    </div>
  );
};
export default App;
