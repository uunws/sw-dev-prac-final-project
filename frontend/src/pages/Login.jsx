import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { FaSignInAlt } from 'react-icons/fa';
import { useSelector, useDispatch } from 'react-redux';
import { login, reset } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    console.log('auth state change', { user, isLoading, isError, isSuccess, message }) // debug
    if (isError) toast.error(message);
    if (isSuccess || user) navigate('/');
    if (user && !isSuccess) console.log('user present but isSuccess false', user);
    dispatch(reset());
  }, [isError, isSuccess, user, message, navigate, dispatch]);

  const onChange = (e) =>
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const onSubmit = (e) => {
    e.preventDefault();
    console.log('Login submit', { email, password }); // debug
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    const userData = { email, password };
    dispatch(login(userData));
  };

  return (
    <>
      <section className='heading'>
        <h1>
          <FaSignInAlt /> Login
        </h1>
        <p>Please log in to get support</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input
              type='email'
              className='form-control'
              id='email'
              name='email'
              value={email}
              onChange={onChange}
              placeholder='Enter your email'
              required
            />
          </div>
          <div className='form-group'>
            <input
              type='password'
              className='form-control'
              id='password'
              name='password'
              value={password}
              onChange={onChange}
              placeholder='Enter your password'
              required
            />
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block' disabled={isLoading}>
              {isLoading ? 'Logging in...' : 'Submit'}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Login;