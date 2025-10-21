import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser } from 'react-icons/fa';
import {useSelector, useDispatch} from 'react-redux'
import {register, reset} from '../features/auth/authSlice'

function Register() {
  // console.log('Register component mounted'); // <- confirm component renders

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
    role:'user'
  });

  const { name, email, password, password2,role } = formData;
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const {user, isLoading, isError, isSuccess, message} = useSelector((state) => state.auth)

  useEffect(()=>{
    if (isError) {
      toast.error(message)
    }
    if (isSuccess) {
      navigate('/')
    }
    dispatch(reset())
  },[isError, isSuccess, user,message, navigate, dispatch])

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    // console.log('Register onSubmit', { name, email, role }); // <- should appear

    if (password !== password2) {
      toast.error('Passwords do not match');
      return;
    }
    const userData = { name, email, password, role };
    dispatch(register(userData))
  };

  return (
    <>
      <section className='heading'>
        <h1><FaUser /> Register</h1>
        <p>Please create an account</p>
      </section>

      <section className='form'>
        <form onSubmit={onSubmit}>
          <div className='form-group'>
            <input type='text' id='name' name='name' value={name} onChange={onChange} placeholder='Enter Your Name' required />
          </div>
          <div className='form-group'>
            <input type='email' id='email' name='email' value={email} onChange={onChange} placeholder='Enter Your email' required />
          </div>
          <div className='form-group'>
            <input type='password' id='password' name='password' value={password} onChange={onChange} placeholder='Enter your password' required />
          </div>
          <div className='form-group'>
            <input type='password' id='password2' name='password2' value={password2} onChange={onChange} placeholder='Confirm your password' required />
          </div>
          <div className="form-group">
            <input type="text" id='role' name='role' value={role} onChange={onChange} placeholder='Enter Your Role' required/>
          </div>
          <div className='form-group'>
            <button type='submit' className='btn btn-block' onClick={() => console.log('button clicked')} disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Submit'}
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Register;