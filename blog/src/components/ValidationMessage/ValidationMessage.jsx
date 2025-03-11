import { string, object } from 'prop-types';
import styles from './styles.module.scss';
const ValidationMessage = ({ message, style }) => {
  return (
    <p style={style} className={styles.valMessage}>
      {message}
    </p>
  );
};

ValidationMessage.propTypes = {
  message: string.isRequired,
  style: object,
};

export default ValidationMessage;
