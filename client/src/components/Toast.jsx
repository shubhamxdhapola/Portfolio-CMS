import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCheckCircle, FiAlertCircle, FiX } from 'react-icons/fi';

export default function Toast({ toast, onClose }) {
  const isSuccess = toast?.type === 'success';

  return (
    <AnimatePresence mode="wait">
      {toast && (
        <motion.div
          key={toast.id || toast.message}
          initial={{ opacity: 0, y: 36, scale: 0.88, filter: 'blur(4px)' }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)',
            transition: {
              type: 'spring',
              stiffness: 420,
              damping: 26,
              mass: 0.8,
            },
          }}
          exit={{
            opacity: 0,
            y: 28,
            scale: 0.92,
            filter: 'blur(3px)',
            transition: {
              duration: 0.24,
              ease: [0.36, 0, 0.66, -0.04], // Smooth springy pop-down
            },
          }}
          className="fixed bottom-6 right-6 z-50 flex items-center gap-3.5 rounded-2xl border border-slate-200/90 bg-white/95 backdrop-blur-md px-4 py-3.5 shadow-[0_12px_36px_rgba(0,0,0,0.12)] max-w-md pointer-events-auto"
        >
          <div
            className={`flex size-8 shrink-0 items-center justify-center rounded-xl shadow-xs ${
              isSuccess
                ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/70'
                : 'bg-rose-50 text-rose-600 border border-rose-200/70'
            }`}
          >
            {isSuccess ? <FiCheckCircle className="size-5" /> : <FiAlertCircle className="size-5" />}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs sm:text-sm font-semibold text-slate-800 leading-snug">
              {toast.message}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition p-1.5 rounded-lg hover:bg-slate-100 cursor-pointer"
            aria-label="Dismiss notification"
          >
            <FiX className="size-4" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
