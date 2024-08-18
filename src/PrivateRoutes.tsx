import {Navigate, Outlet, useLocation} from "react-router-dom";
import useToken from "./sections/Login/UseToken";

export function PrivateRoutes() {
    const location = useLocation();
    const {token} = useToken();

    if (token === undefined) {
        return null; // or loading indicator/spinner/etc
    }
    return token
        ? <Outlet/>
        : <Navigate to="/login" replace state={{ from: location }} />;

}