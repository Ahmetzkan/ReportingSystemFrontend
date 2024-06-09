import { Route, Routes } from 'react-router-dom';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import NotFound from '../../pages/NotFound/NotFound';
import ProtectedRoute from './ProtectedRoute';
import ReportingSystem from '../../pages/ReportingSystem/ReportingSystem';
import Navbar from '../../layouts/Navbar';
import TaskingSystem from '../../pages/TaskingSystem/TaskingSystem';
import ProjectingSystem from '../../pages/ProjectingSystem/ProjectingSystem';

const RouteDefinitions = () => {
    return (
        <Routes>
            <Route path="*" Component={NotFound} />
            <Route path="/" Component={Login} />
            <Route path="/login" Component={Login} />
            <Route path="/register" Component={Register} />
            <Route path="/reporting-system" element={<ProtectedRoute> <ReportingSystem /> </ProtectedRoute>} />
            <Route path="/tasking-system" element={<ProtectedRoute> <TaskingSystem /> </ProtectedRoute>} />
            <Route path="/projecting-system" element={<ProtectedRoute> <ProjectingSystem /> </ProtectedRoute>} />
            <Route element={<ProtectedRoute>{Navbar}</ProtectedRoute>} />

        </Routes >
    )
}

export default RouteDefinitions;
