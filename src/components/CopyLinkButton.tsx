import { useEffect } from 'react';

type Props = { onCopied: (message: string) => void };

export function CopyLinkButton({ onCopied }: Props) {
  async function copy() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      onCopied('Link copied');
    } catch {
      onCopied('Copy failed');
    }
  }

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const isCmdS = (e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 's';
      if (isCmdS) {
        e.preventDefault();
        copy();
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <button
      type="button"
      onClick={copy}
      title="Copy share URL (⌘S)"
      className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
    >
      Copy link
    </button>
  );
}
