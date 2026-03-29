export function BlinkingCursor({ className }: { className?: string }) {
  return (
    <span
      className={`inline-block w-[2px] h-[0.85em] bg-current align-middle animate-blink ${className ?? ""}`}
    />
  );
}
