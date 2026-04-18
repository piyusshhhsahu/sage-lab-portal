import { createContext, useCallback, useContext, useState } from 'react';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const addToast = useCallback((message, type = 'success') => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4500);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast }}>
      {children}
      <div className="fixed top-4 right-4 z-[1000] flex flex-col gap-3 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`w-full rounded-2xl border p-4 shadow-xl backdrop-blur-sm transition-all duration-300 ${toast.type === 'success'
              ? 'bg-green-500/10 border-green-300 text-green-900 dark:bg-green-500/15 dark:text-green-200'
              : 'bg-red-500/10 border-red-300 text-red-900 dark:bg-red-500/15 dark:text-red-200'}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">
                {toast.type === 'success' ? <FaCheckCircle size={18} /> : <FaExclamationCircle size={18} />}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-sm">
                  {toast.type === 'success' ? 'Success' : 'Error'}
                </p>
                <p className="text-sm leading-relaxed text-current opacity-90">
                  {toast.message}
                </p>
              </div>
              <button type="button" onClick={() => removeToast(toast.id)} className="text-current opacity-80 hover:opacity-100">
                <FaTimes />
              </button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
