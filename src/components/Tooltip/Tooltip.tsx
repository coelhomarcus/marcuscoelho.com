import { useCallback, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";

interface TooltipProps {
  content: ReactNode;
  children: ReactNode;
  className?: string;
}

export function Tooltip({ content, children, className }: TooltipProps) {
  const [visible, setVisible] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0 });

  const move = useCallback((e: React.MouseEvent) => {
    setCoords({ x: e.clientX, y: e.clientY });
    setVisible(true);
  }, []);

  const hide = useCallback(() => setVisible(false), []);

  return (
    <span
      onMouseEnter={move}
      onMouseMove={move}
      onMouseLeave={hide}
      className={`inline-flex ${className ?? ""}`}
    >
      {children}

      {createPortal(
        <AnimatePresence>
          {visible && (
            <motion.div
              initial={{ opacity: 0, y: 4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 4, scale: 0.95 }}
              transition={{ duration: 0.12, ease: "easeOut" }}
              style={{
                position: "fixed",
                left: coords.x + 5,
                top: coords.y + 10,
                transform: "translate(-50%, calc(-100% - 15px))",
              }}
              className="pointer-events-none z-50 whitespace-nowrap rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-xs text-zinc-200 shadow-lg"
            >
              {content}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </span>
  );
}

export default Tooltip;
