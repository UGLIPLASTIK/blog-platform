import { bool } from 'prop-types';
import styles from './styles.module.scss';
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { isAuth, user, logout } from '../../store/auth-slice';
import { startCreate } from '../../store/editor-slice';
import avatar from '../../assets/avatar_default.png';

const Header = () => {
  const logined = useSelector(isAuth);
  const userState = useSelector(user);
  const dispatch = useDispatch();

  const UnloginedBtns = ({ logined }) => {
    if (logined) {
      return null;
    }
    return (
      <div className={styles.btnGroup}>
        <Link className={styles.link} to="/sign-in">
          Sign In
        </Link>
        <Link className={[`${styles.link} ${styles.prime}`].join(' ')} to="/sign-up">
          Sign Up
        </Link>
      </div>
    );
  };
  UnloginedBtns.propTypes = {
    logined: bool,
  };

  const LoginedBtns = ({ logined }) => {
    if (!logined) {
      return null;
    }
    return (
      <div className={styles.btnGroup}>
        <Link
          onClick={() => dispatch(startCreate())}
          to="/new-article"
          className={[`${styles.link} ${styles.prime} ${styles.create}`].join(' ')}
        >
          Create article
        </Link>
        <Link to="/profile-editor">
          <div className={styles.userInfo}>
            <span className={styles.userInfo__name}>{userState.username}</span>
            <img src={userState.image ? userState.image : avatar} alt="avatar" />
          </div>
        </Link>

        <Link onClick={() => dispatch(logout())} id="logOut" className={styles.link}>
          Log Out
        </Link>
      </div>
    );
  };
  LoginedBtns.propTypes = {
    logined: bool,
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link className={styles.link} to="/articles">
          Realworld Blog
        </Link>
        <UnloginedBtns logined={logined} />
        <LoginedBtns logined={logined} />
      </div>
    </header>
  );
};

export default Header;
