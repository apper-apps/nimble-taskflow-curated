import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const ConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  variant = "danger"
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  const getIcon = () => {
    switch (variant) {
      case "danger":
        return "AlertTriangle";
      case "warning":
        return "AlertCircle";
      case "info":
        return "Info";
      default:
        return "AlertTriangle";
    }
  };

  const getIconColor = () => {
    switch (variant) {
      case "danger":
        return "text-error";
      case "warning":
        return "text-warning";
      case "info":
        return "text-info";
      default:
        return "text-error";
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="relative bg-surface rounded-12 shadow-2xl w-full max-w-md p-6"
          >
            <div className="flex items-start gap-4">
              {/* Icon */}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-${variant === "danger" ? "error" : variant}/10`}>
                <ApperIcon name={getIcon()} className={`w-5 h-5 ${getIconColor()}`} />
              </div>
              
              {/* Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
                
                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    variant={variant}
                    onClick={handleConfirm}
                    className="flex-1"
                  >
                    {confirmLabel}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    {cancelLabel}
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmDialog;