import { toast } from 'react-toastify'
import Toaster from '../../components/Toaster/Toaster';
import { AUTH_ERROR, BUSINESS_ERROR, VALIDATION_ERROR } from './errorTypes';
import { SERVER_CANNOT_REACHED, UNKNOWN_ERROR } from '../../environment/messages';

export const handleError = (error: any) => {
    if (error.code && error.code == "ERR_NETWORK") {
        Toaster({ name: SERVER_CANNOT_REACHED });

    }

    if (error.response && error.response.data && error.response.data.type) {
        let type = error.response.data.type;
        switch (type) {
            case BUSINESS_ERROR:
                handleBusinessError(error.response.data);
                break;
            case VALIDATION_ERROR:
                handleValidationError(error.response.data);
                break;
            case AUTH_ERROR:
                handleAuthError(error.response.data);
                break;
            default:
                //handleDefault(error);
                break;
        }
    }
};

export const handleBusinessError = (error: any) => {
    Toaster({ name: error.detail });
};
export const handleValidationError = (error: any) => {
    Object.keys(error.errors).forEach(key => {
        Toaster(`${key}: ${error.errors[key]}`);
    });
};
export const handleAuthError = (error: any) => {
    Toaster({ name: error.detail });
}

const handleDefault = (error: any) => {
    Toaster({ name: UNKNOWN_ERROR });
};

export { handleDefault };