// hooks/useAutoLogout.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAutoLogout = (user, onLogout) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];
    let timeout;

    const resetTimer = () => {
      clearTimeout(timeout);
      // 30 minutes inactivity (you can adjust this)
      timeout = setTimeout(() => {
        onLogout();
        navigate('/login');
      }, 30 * 60 * 1000); // 30 minutes
    };

    // Add event listeners
    events.forEach(event => {
      document.addEventListener(event, resetTimer);
    });

    // Initialize timer
    resetTimer();

    // Cleanup
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, resetTimer);
      });
      clearTimeout(timeout);
    };
  }, [user, onLogout, navigate]);
};

export default useAutoLogout;