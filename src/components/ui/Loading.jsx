import { motion } from "framer-motion";

const Loading = ({ type = "tasks" }) => {
  const renderTaskSkeleton = () => (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface rounded-12 p-4 border border-gray-100"
        >
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-gray-200 rounded animate-pulse mt-1"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded animate-pulse w-1/2"></div>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-2 h-2 bg-gray-200 rounded-full animate-pulse"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-16"></div>
                <div className="h-3 bg-gray-200 rounded animate-pulse w-20 ml-auto"></div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderCategorySkeleton = () => (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center gap-3 p-3 rounded-lg"
        >
          <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          </div>
          <div className="w-6 h-6 bg-gray-200 rounded-full animate-pulse"></div>
        </motion.div>
      ))}
    </div>
  );

  const renderStatsSkeleton = () => (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.1 }}
          className="bg-surface rounded-12 p-4 border border-gray-100"
        >
          <div className="space-y-2">
            <div className="h-8 bg-gray-200 rounded animate-pulse w-12"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16"></div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  if (type === "categories") return renderCategorySkeleton();
  if (type === "stats") return renderStatsSkeleton();
  return renderTaskSkeleton();
};

export default Loading;