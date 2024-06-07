import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Register.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import authService from '../../services/authService';
import { authActions } from '../../store/auth/authSlice';
import { userActions } from '../../store/user/userSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  return (
    <div className='register-general'>
      <div className="register-container">
        <Formik
          initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }}
          validationSchema={Yup.object({
            firstName: Yup.string().required('Doldurulması zorunludur.'),
            lastName: Yup.string().required('Doldurulması zorunludur.'),
            email: Yup.string().email('Geçersiz email adresi.').required('Doldurulması zorunludur.'),
            password: Yup.string().min(5, 'Parola en az 5 karakterli olmalıdır.').required('Doldurulması zorunludur.'),
            confirmPassword: Yup.string().oneOf([Yup.ref('password'), 'a'], 'Parolalar eşleşmiyor.').required('Doldurulması zorunludur.')
          })}
          onSubmit={(values) => {
            authService.register(values).then(response => {
              if (response.data !== undefined) {
                dispatch(authActions.addToken({ token: response.data.token }));
                dispatch(userActions.getUserInfo());
                navigate('/login');
              }
            })
          }}>

          <Form className="p-4 register-form">
            <h2 className="mb-4">Kayıt ol</h2>
            <div className="mb-3">
              <label htmlFor="firstName"></label>
              <Field name="firstName" type="text" className="form-control" placeholder="Ad" />
              <ErrorMessage name="firstName" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="lastName"></label>
              <Field name="lastName" type="text" className="form-control" placeholder="Soyad" />
              <ErrorMessage name="lastName" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="email"></label>
              <Field name="email" type="email" className="form-control" placeholder="Email" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="password"></label>
              <Field name="password" type="password" className="form-control" placeholder="Parola" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="confirmPassword"></label>
              <Field name="confirmPassword" type="password" className="form-control" placeholder="Parola tekrarı" />
              <ErrorMessage name="confirmPassword" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn btn-primary register-btn">Kayıt ol</button>
          </Form>
        </Formik>
        <div className="register-link mb-4">
          <Link to="/login">Zaten bir hesabın var mı? Giriş yap</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;