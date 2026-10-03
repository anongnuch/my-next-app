"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { CartIcon } from "@/app/components/icons";

const ToastContext = createContext(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be called inside <ToastProvider>");
  }
  return context;
}

function ToastItem({ toast, duration, onDismiss }) {
  useEffect(() => {
    const timer = setTimeout(() => onDismiss(toast.id), duration);
    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  return (
    <li className="animate-toast-in flex items-center gap-2 rounded-md bg-foreground px-4 py-3 text-[13px] font-semibold text-background">
      <CartIcon size={16} />
      {toast.message}
    </li>
  );
}

// The toast is the acknowledgement an Add To Cart press gets while the cart
// itself sits off screen in the header. Ink fill, no shadow — see DESIGN.md.
export function ToastProvider({ children, duration = 2600 }) {
  const [toasts, setToasts] = useState([]);
  const nextId = useRef(0);

  const showToast = useCallback((message) => {
    nextId.current += 1;
    const id = nextId.current;
    setToasts((current) => [...current, { id, message }]);
  }, []);

  const dismiss = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <ul
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2"
      >
        {toasts.map((toast) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            duration={duration}
            onDismiss={dismiss}
          />
        ))}
      </ul>
    </ToastContext.Provider>
  );
}
