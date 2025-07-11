import React from "react";
import { cn } from "@/utils/cn";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Checkbox = React.forwardRef(({ 
  className, 
  checked = false,
  onChange,
  ...props 
}, ref) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <input
        type="checkbox"
        ref={ref}
        checked={checked}
        onChange={onChange}
        className="sr-only"
        {...props}
      />
      <div
        onClick={onChange}
        className={cn(
          "w-5 h-5 rounded border-2 cursor-pointer transition-all duration-200 flex items-center justify-center",
          checked
            ? "bg-gradient-to-r from-primary to-secondary border-primary"
            : "border-gray-300 hover:border-primary bg-surface",
          className
        )}
      >
        {checked && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-white"
          >
            <ApperIcon name="Check" className="w-3 h-3" />
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

Checkbox.displayName = "Checkbox";

export default Checkbox;