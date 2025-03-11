import styles from './styles.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import ValidationMessage from '../ValidationMessage';
import { loginUser } from '../../store/auth-slice';
import { isRejected, isFulfilled } from '@reduxjs/toolkit';

const LoginForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ mode: 'onSubmit' });

  const emailError = errors.email?.message;
  const onsubmit = async (formData) => {
    // eslint-disable-next-line no-unused-vars
    const { repeatPass, ...user } = formData;
    const data = { user };
    const response = await dispatch(loginUser(data));
    if (isFulfilled(response)) {
      console.log('User logged in successfully:', response.payload.user.username);
      navigate('/articles');
    } else if (isRejected(response)) {
      alert('The email or password you entered is incorrect!');
    }
  };

  return (
    <div className={styles.authForm}>
      <form onSubmit={handleSubmit(onsubmit)} action="submit">
        <h3>Sign In</h3>
        <label htmlFor="email">
          Email address
          {emailError && <ValidationMessage message={emailError} />}
        </label>
        <input
          autoComplete="email"
          placeholder="Email address"
          id="email"
          type="email"
          style={emailError && { border: '1px solid rgba(245, 34, 45, 1)' }}
          {...register('email', {
            required: 'This field is required',
            pattern: {
              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
              message: 'Invalid email format',
            },
          })}
        />
        <label htmlFor="password">Password</label>
        <input
          placeholder="Password"
          id="password"
          type="text"
          {...register('password', {
            required: 'This field is required',
          })}
        />
        <button>Login</button>
        <div className={styles.LoginLink}>
          Don’t have an account? <Link to="/sign-up">Sign Up.</Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
