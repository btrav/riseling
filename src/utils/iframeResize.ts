export function startIframeHeightReporter() {
  if (typeof window === 'undefined' || window.self === window.top) return;

  function report() {
    const h = Math.max(
      document.documentElement.scrollHeight,
      document.body.scrollHeight,
    );
    window.parent.postMessage({ type: 'riseling:height', h }, '*');
  }

  const observer = new ResizeObserver(report);
  observer.observe(document.body);
  window.addEventListener('load', report);
  report();
}
