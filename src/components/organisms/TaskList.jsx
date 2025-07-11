import { motion, AnimatePresence } from "framer-motion";
import TaskCard from "@/components/molecules/TaskCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const TaskList = ({ 
  tasks, 
  categories, 
  loading, 
  error, 
  onRetry,
  onToggleComplete,
  onEdit,
  onDelete,
  onArchive,
  emptyType = "tasks",
  emptyAction,
  emptyActionLabel
}) => {
  if (loading) {
    return <Loading type="tasks" />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} type="tasks" />;
  }

  if (tasks.length === 0) {
    return (
      <Empty 
        type={emptyType} 
        onAction={emptyAction} 
        actionLabel={emptyActionLabel}
      />
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <AnimatePresence>
        {tasks.map((task, index) => (
          <motion.div
            key={task.Id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: index * 0.05 }}
          >
            <TaskCard
              task={task}
              categories={categories}
              onToggleComplete={onToggleComplete}
              onEdit={onEdit}
              onDelete={onDelete}
              onArchive={onArchive}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
};

export default TaskList;