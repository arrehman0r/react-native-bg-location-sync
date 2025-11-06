
import { Snackbar } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { hideToast } from '../redux/reducer/utilsSlice';
import { theme } from '../theme';

const AppToast = () => {
  const dispatch = useDispatch();
  const { visible, message } = useSelector((state) => state.utils);
  return (
    <Snackbar
      visible={visible}
      rippleColor={theme.colors.secondary}
      onDismiss={() => dispatch(hideToast())}
      duration={3000}
      action={{
        label: 'Dismiss',
        onPress: () => dispatch(hideToast()),
      }}
    >
      {message}
    </Snackbar>
  );
};

export default AppToast;
