import { useActivityTracker } from "../hooks/useActivityTracker";

const ActivityTracker = ({ children }) => {
  useActivityTracker();
  return children;
};

export default ActivityTracker;
