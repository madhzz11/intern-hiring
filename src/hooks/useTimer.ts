import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { setTimeRemaining } from '../store/assessmentSlice';

export const useTimer = () => {
  const dispatch = useDispatch();
  const { timeRemaining, isActive } = useSelector((state: RootState) => state.assessment);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        dispatch(setTimeRemaining(timeRemaining - 1));
      }, 1000);
    } else if (timeRemaining === 0) {
      // Time's up - could trigger auto-submission here
      console.log('Assessment time expired');
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeRemaining, isActive, dispatch]);

  return { timeRemaining, isActive };
};