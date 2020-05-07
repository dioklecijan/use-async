/**
 * 2020-04-28 18:08:34
 * --------------------
 * Hook for executing async functions with pending and error state.
 * Taken from https://usehooks.com/ and modified to accept function params.
 *
 * Pass immediate=true to execute function immediatelly with initialArgs.
 *
 * @example
 * ```js
 * // somewhere define async function:
 * const myFunction = async(a, b) => {
 *    const x = await asyncCall(a, b);
 *    return x;
 * }
 *
 * // in your component
 * const {state, execute} = useAsync(myFunction, true, 1, 2);
 *
 * // rendering
 * {state.value && renderThis()}
 * {state.error && renderThat()}
 * {state.pending && renderWait()}
 *
 * // you can explicitly call  async function via execute
 * // and pass different arguments:
 * React.useCallback(() => execute(3, 4), [])
 *
 * ```
 */

// @flow
import * as React from "react";

type IFunction = (...params: any) => Promise<any>;

type IState = {
  value: any;
  error: any;
  pending: boolean;
};

type IAction =
  | { type: "set_value"; payload: any }
  | { type: "set_error"; payload: any }
  | { type: "set_pending"; payload: boolean }
  | { type: "start_request" };

const reducer = (state: IState, action: IAction): IState => {
  switch (action.type) {
    case "set_value":
      return { ...state, value: action.payload };

    case "set_error":
      return { ...state, error: action.payload };

    case "set_pending":
      return { ...state, pending: action.payload };

    case "start_request":
      return {
        pending: true,
        value: null,
        error: null,
      };

    default:
      return state;
  }
};

export const useAsync = (
  asyncFunction: IFunction,
  immediate: boolean = true,
  ...initialArgs: any
) => {
  const [state, dispatch] = React.useReducer(reducer, {
    value: null,
    error: null,
    pending: false,
  });

  const execute = React.useCallback(
    (...args: any) => {
      dispatch({ type: "start_request" });
      return asyncFunction(...args)
        .then((response) => dispatch({ type: "set_value", payload: response }))
        .catch((error) => dispatch({ type: "set_error", payload: error }))
        .finally(() => dispatch({ type: "set_pending", payload: false }));
    },
    [asyncFunction]
  );

  React.useEffect(() => {
    if (immediate) {
      execute(...initialArgs);
    }
  }, []);

  return { state, execute };
};
