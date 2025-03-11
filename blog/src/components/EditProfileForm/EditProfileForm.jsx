import styles from './styles.module.scss';
import { useForm } from 'react-hook-form';
import ValidationMessage from '../ValidationMessage';
import { useNavigate } from 'react-router-dom';
import { user, isAuth, updateUser } from '../../store/auth-slice';
import { useSelector, useDispatch } from 'react-redux';

const EditProfileForm = () => {
  const logined = useSelector(isAuth);
  const navigate = useNavigate();
  const userState = useSelector(user);
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onSubmit' });
  if (!logined) {
    navigate('/sign-in');
    return null;
  }

  const emailError = errors.email?.message;
  const passError = errors.password?.message;
  const usernameError = errors.username?.message;

  const onSubmit = (e) => {
    const newUserData = {
      username: e.username,
      email: e.email,
      password: e.password,
      image: e.avatar ? e.avatar : null,
    };
    dispatch(updateUser(newUserData));
  };
  // console.log(userState.token);

  return (
    <div className={styles.editProfileForm}>
      <form method="put" onSubmit={handleSubmit(onSubmit)}>
        <h3>Edit Profile</h3>
        <label htmlFor="username">
          Username
          {usernameError && <ValidationMessage message={usernameError} />}
        </label>
        <input
          defaultValue={userState.username}
          style={usernameError && { borderColor: 'rgba(245, 34, 45, 1)' }}
          autoComplete="name"
          placeholder="Username"
          id="username"
          type="text"
          {...register('username', {
            required: 'This field is required',
            pattern: {
              value: /^[a-zA-Z0-9]{3,20}$/,
              message: 'must be between 3 and 20 characters',
            },
          })}
        />
        <label htmlFor="email">
          Email address
          {emailError && <ValidationMessage message={emailError} />}
        </label>
        <input
          defaultValue={userState.email}
          autoComplete="email"
          placeholder="Email address"
          id="email"
          type="email"
          style={emailError && { borderColor: 'rgba(245, 34, 45, 1)' }}
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
            },
          })}
        />
        <label htmlFor="password">
          New password
          {passError && <ValidationMessage message={passError} />}
        </label>
        <input
          placeholder="New password"
          id="password"
          type="password"
          style={passError && { borderColor: 'rgba(245, 34, 45, 1)' }}
          {...register('password', {
            required: 'This field is required',
            pattern: {
              value: /^.{6,40}$/,
              message: 'Password must be between 6 and 40 characters',
            },
          })}
        />
        <label htmlFor="password">Avatar image (url)</label>
        <input
          placeholder="Avatar image"
          id="avatar"
          type="url"
          {...register('avatar', {
            required: false,
          })}
        />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default EditProfileForm;
