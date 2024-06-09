import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import './Login.css';
import { Link, useNavigate } from 'react-router-dom';
import authService from '../../services/authService';
import { authActions } from '../../store/auth/authSlice';
import { userActions } from '../../store/user/userSlice';
import { useDispatch } from 'react-redux';
import Toaster from '../../components/Toaster/Toaster';
import { FAILED_LOGIN, SUCCESS_LOGIN } from '../../environment/messages';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="general login-general">
      <div className="container login-container">
        <Formik
          initialValues={{ email: '', password: '' }}
          validationSchema={Yup.object({
            email: Yup.string().email('Geçersiz email adresi').required('Doldurulması zorunludur.'),
            password: Yup.string().min(5, 'Parola en az 5 karakterli olmalıdır.').required('Doldurulması zorunludur.')
          })}
          onSubmit={(values) => {
            authService.login(values).then(response => {
              if (response.data !== undefined) {
                dispatch(authActions.addToken({ token: response.data.token }));
                dispatch(userActions.getUserInfo());
                authService.getUserInfo();
                Toaster({ name: SUCCESS_LOGIN });
                navigate("/reporting-system");
              }

              if (response.data === undefined) {
                Toaster({ name: FAILED_LOGIN });
              }
            })
          }}>
          <Form className="p-4 form login-form">
            <h2 className="mb-4">Giriş Yap</h2>
            <div className="mb-4">
              <label htmlFor="email"></label>
              <Field name="email" type="email" className="form-control" placeholder="Email" />
              <ErrorMessage name="email" component="div" className="text-danger" />
            </div>
            <div className="mb-3">
              <label htmlFor="password"></label>
              <Field name="password" type="password" className="form-control" placeholder="Parola" />
              <ErrorMessage name="password" component="div" className="text-danger" />
            </div>
            <button type="submit" className="btn login-btn mt-4">Giriş Yap</button>
          </Form>
        </Formik>
        <div className="mt-2 link login-link">
          <Link to="/register">Henüz bir hesabın yok mu? Kayıt ol</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;