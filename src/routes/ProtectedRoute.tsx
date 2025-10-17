import {Navigate} from 'react-router-dom'
import {getToken, hasAnyRole} from '../utils/auth'
import {AppRole} from "../interfaces/types";

export default function ProtectedRoute({children, roles,}: {
    children: JSX.Element,
    roles?: AppRole[]
}) {
    const token = getToken();
    if (!token) return <Navigate to="/login" replace/>;

    if (roles && !hasAnyRole(token, roles)) {
        return <Navigate to="/login" replace/>;
    }
    return children;
}
