type Props = { editorUrl: string };

export function EditLink({ editorUrl }: Props) {
  return (
    <a
      href={editorUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-4 right-4 z-10 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/90 px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm backdrop-blur-sm transition-colors hover:border-gray-400 hover:text-gray-900"
    >
      <span className="font-display text-sm font-semibold">Riseling</span>
      <span className="opacity-70">·</span>
      <span>Edit</span>
      <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true">
        <path
          d="M3 2 L7 5 L3 8"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </a>
  );
}
