import { motion } from "framer-motion";
import StatsCard from "@/components/molecules/StatsCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";

const StatsOverview = ({ stats, loading, error, onRetry }) => {
  if (loading) {
    return <Loading type="stats" />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} type="stats" />;
  }

  const completionRate = stats.totalTasks > 0 
    ? Math.round((stats.completedToday / stats.totalTasks) * 100)
    : 0;

  const statsCards = [
    {
      title: "Total Tasks",
      value: stats.totalTasks,
      icon: "List",
      color: "primary",
      description: "Active tasks"
    },
    {
      title: "Completed Today",
      value: stats.completedToday,
      icon: "CheckCircle",
      color: "success",
      description: `${completionRate}% of total`
    },
    {
      title: "This Week",
      value: stats.completedThisWeek,
      icon: "Calendar",
      color: "info",
      description: "Tasks completed"
    },
    {
      title: "Current Streak",
      value: stats.currentStreak,
      icon: "Zap",
      color: "warning",
      description: "Days in a row"
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statsCards.map((card, index) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <StatsCard {...card} />
        </motion.div>
      ))}
    </div>
  );
};

export default StatsOverview;