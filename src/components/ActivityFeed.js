// src/components/ActivityFeed.jsx
import Avatar from './Avatar';

const ActivityFeed = ({ activities }) => {
  return (
    <div className="space-y-3">
      {activities.map((act) => (
        <div
          key={act.id}
          className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          <Avatar name={act.userName} src={act.userAvatar} />
          <div>
            <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{act.userName}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">{act.action}</p>
          </div>
          <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">{act.time}</span>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
