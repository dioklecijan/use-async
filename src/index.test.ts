import { renderHook, act } from "@testing-library/react-hooks";
import { useAsync } from "./";

// mock timer using jest
jest.useFakeTimers();

const demoFn = (a: number, b: number, fail = false) => {
  if (fail)
    return new Promise((_resolve: any, reject: any) => {
      setTimeout(reject("expected to reject"), 10);
    });
  else
    return new Promise((resolve: any) => {
      setTimeout(resolve(a + b), 10);
    });
};

describe("useAsync", () => {
  it("should have state with error, pending and value", () => {
    const { result } = renderHook(() => useAsync(demoFn, false));
    expect(result.current.state.pending).toBe(false);
    expect(result.current.state.error).toBe(null);
    expect(result.current.state.value).toBe(null);
  });

  it("should execute async function on init ", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsync(demoFn, true, 1, 2)
    );
    expect(result.current.state.pending).toBe(true);
    expect(result.current.state.value).toBe(null);
    expect(result.current.state.error).toBe(null);
    await waitForNextUpdate();
    expect(result.current.state.pending).toBe(false);
    expect(result.current.state.value).toBe(3);
    expect(result.current.state.error).toBe(null);
  });

  it("should execute async function explicitly ", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsync(demoFn, false)
    );
    act(() => {
      result.current.execute(1, 2);
    });
    expect(result.current.state.pending).toBe(true);
    expect(result.current.state.value).toBe(null);
    expect(result.current.state.error).toBe(null);
    await waitForNextUpdate();
    expect(result.current.state.pending).toBe(false);
    expect(result.current.state.value).toBe(3);
    expect(result.current.state.error).toBe(null);
  });

  it("should handle async function rejection ", async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsync(demoFn, true, 1, 2, true)
    );
    expect(result.current.state.pending).toBe(true);
    expect(result.current.state.value).toBe(null);
    expect(result.current.state.error).toBe(null);
    await waitForNextUpdate();
    expect(result.current.state.pending).toBe(false);
    expect(result.current.state.value).toBe(null);
    expect(typeof result.current.state.error).toBe('string');
  });
});
