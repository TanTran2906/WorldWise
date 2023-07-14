import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../App";

function ProtectedRoute({ children }) {
    const { isAuthenticated } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(
        function () {
            if (!isAuthenticated) navigate("/");
        },
        [isAuthenticated, navigate]
    );
    return isAuthenticated ? children : null;
}

export default ProtectedRoute;
