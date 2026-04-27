import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  timeout?: number;
  onDismiss?: () => void;
}

export function ErrorMessage({ message, timeout, onDismiss }: ErrorMessageProps) {
  const [shown, setShown] = useState(true);

  useEffect(() => {
    if (timeout) {
      const timer = window.setTimeout(() => setShown(false), timeout);
      return () => clearTimeout(timer);
    }
  }, [timeout]);

  if (!shown) return null;

  return (
    <div
      className="sticky top-0 z-40 flex items-center justify-between px-4 py-3 bg-[#fdbf57] border border-[#7a003c] rounded"
      role="alert"
    >
      <span className="font-medium text-[#56002a]">{message}</span>
      <button
        onClick={() => { setShown(false); onDismiss?.(); }}
        className="text-[#56002a] hover:text-[#7a003c] cursor-pointer"
        aria-label="Dismiss"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
}
