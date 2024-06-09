import './Navbar.css';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { userActions } from '../store/user/userSlice';
import { authActions } from '../store/auth/authSlice';

const Navbar = () => {
    const [activeLink, setActiveLink] = useState(null);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLinkClick = (index: any) => {
        setActiveLink(index);
    };

    const handleLogOut = () => {
        dispatch(authActions.removeToken());
        dispatch(userActions.removeUserInfo());
        navigate("/login");
    };

    return (
        <nav className="navbar">
            <ul className="navbar-nav">
                <li className="nav-item">
                    <Link
                        to="/tasking-system"
                        className={`nav-link ${activeLink === 0 ? 'active' : ''}`}
                        onClick={() => handleLinkClick(0)}
                    >
                        Görev
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        to="/projecting-system"
                        className={`nav-link ${activeLink === 1 ? 'active' : ''}`}
                        onClick={() => handleLinkClick(1)}
                    >
                        Proje
                    </Link>
                </li>
                <li className="nav-item">
                    <Link
                        to="/reporting-system"
                        className={`nav-link ${activeLink === 2 ? 'active' : ''}`}
                        onClick={() => handleLinkClick(2)}
                    >
                        Rapor

                    </Link>
                </li>
                <li className="nav-item nav-item-right">
                    <Link
                        to="/login"
                        className={`nav-link ${activeLink === 3 ? 'active' : ''}`}
                        onClick={() => { handleLinkClick(3); handleLogOut(); }}
                    >
                        Oturumu Kapat
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
