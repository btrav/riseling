type Props = { message: string | null };

export function Toast({ message }: Props) {
  if (!message) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg"
    >
      {message}
    </div>
  );
}
