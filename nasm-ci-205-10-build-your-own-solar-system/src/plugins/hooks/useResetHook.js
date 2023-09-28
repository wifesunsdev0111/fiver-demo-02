import { useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { sendButtonInfoToGA, setButtonType } from '../../redux/gaEvents';
import { setSessionDuration } from '../../redux/app';
import CalculateSessionDuration from './CalculateSessionDuration';
import { reset } from '../../redux/game';

export default function useResetHook() {
  const history = useHistory();
  const dispatch = useDispatch();
  const sessionStartTime = useSelector((state) => state.app.sessionStartTime);
  return () => {
    let sessionDurationRounded = parseInt(
      CalculateSessionDuration(sessionStartTime, new Date())
    );
    let sessionDurationValidated =
      typeof sessionDurationRounded === 'number' ? sessionDurationRounded : 0;
    dispatch(setSessionDuration(sessionDurationValidated));
    dispatch(setButtonType('startover'));
    dispatch(sendButtonInfoToGA());
    dispatch(reset());
    history.push('/');
  };
}
