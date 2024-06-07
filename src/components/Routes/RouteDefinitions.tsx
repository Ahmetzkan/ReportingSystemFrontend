import { Route, Routes } from 'react-router-dom';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import NotFound from '../../pages/NotFound/NotFound';

const RouteDefinitions = () => {
    return (
        <Routes>
            <Route path="*" Component={NotFound} />
            <Route path="/" Component={Login} />
            <Route path="/login" Component={Login} />
            <Route path="/register" Component={Register} />

        </Routes >
    )
}

export default RouteDefinitions;
