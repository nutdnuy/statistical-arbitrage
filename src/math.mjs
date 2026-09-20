// Deterministic normal generator retained unchanged from the original lesson runtime.
export function normalGenerator(seed) {
  let state = seed >>> 0;
  function uniform() {
    state = (Math.imul(1664525, state) + 1013904223) >>> 0;
    return (state + 0.5) / 4294967296;
  }
  return () => Math.sqrt(-2 * Math.log(uniform())) * Math.cos(2 * Math.PI * uniform());
}
