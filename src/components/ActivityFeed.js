// src/components/ActivityFeed.jsx
import Avatar from './Avatar';

const ActivityFeed = ({ activities }) => {
  return (
    <div className="space-y-3">
      {activities.map((act) => (
        <div
          key={act.id}
          className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Avatar name={act.userName} src={act.userAvatar} />
          <div>
            <p className="text-sm font-medium">{act.userName}</p>
            <p className="text-xs text-gray-500">{act.action}</p>
          </div>
          <span className="ml-auto text-xs text-gray-400">{act.time}</span>
        </div>
      ))}
    </div>
  );
};

export default ActivityFeed;
