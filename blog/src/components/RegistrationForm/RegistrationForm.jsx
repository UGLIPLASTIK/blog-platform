import styles from './styles.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useForm } from 'react-hook-form';
import ValidationMessage from '../ValidationMessage';
import { registerNewUser } from '../../store/auth-slice';

const RegistrationForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({ mode: 'onSubmit' });

  const emailError = errors.email?.message;
  const passError = errors.password?.message;
  const confirmPassError = errors.repeatPass?.message;
  const confirmError = errors.confirm?.message;
  const usernameError = errors.username?.message;

  const onsubmit = async (formData) => {
    try {
      // eslint-disable-next-line no-unused-vars
      const { confirm, repeatPass, ...user } = formData;
      const data = { user };
      const result = await dispatch(registerNewUser(data)).unwrap();
      console.log('User registered successfully:', result);
      navigate('/sign-in');
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <div className={styles.regForm}>
      <form onSubmit={handleSubmit(onsubmit)} method="post" action="submit">
        <h3>Create new account</h3>
        <label htmlFor="username">
          Username
          {usernameError && <ValidationMessage message={usernameError} />}
        </label>
        <input
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
          Password
          {passError && <ValidationMessage message={passError} />}
        </label>
        <input
          placeholder="Password"
          id="password"
          type="text"
          style={passError && { borderColor: 'rgba(245, 34, 45, 1)' }}
          {...register('password', {
            required: 'This field is required',
            pattern: {
              value: /^.{6,40}$/,
              message: 'Password must be between 6 and 40 characters',
            },
          })}
        />
        <label htmlFor="repeatPass">
          Repeat Password
          {confirmPassError && <ValidationMessage message={confirmPassError} />}
        </label>
        <input
          placeholder="Repeat Password"
          id="repeatPass"
          type="text"
          style={confirmPassError && { borderColor: 'rgba(245, 34, 45, 1)' }}
          {...register('repeatPass', {
            required: 'This field is required',
            validate: (value) => {
              const { password } = getValues();
              return value === password || 'Passwords do not match';
            },
          })}
        />

        <hr />
        <div className={styles.confirm}>
          <label htmlFor="confirm">I agree to the processing of my personal information</label>
          {confirmError && <ValidationMessage message={confirmError} />}
          <input
            type="checkbox"
            id="confirm"
            {...register('confirm', {
              required: 'You must accept the conditions',
            })}
          />
        </div>
        <button type="submit">Create</button>
        <div className={styles.LoginLink}>
          Already have an account? <Link to="/sign-in">Sign In</Link>.
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
