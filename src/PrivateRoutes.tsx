import {Outlet} from "react-router-dom";
import useToken from "./sections/Login/UseToken";
import {LoginFactory} from "./sections/Login/LoginFactory";

export function PrivateRoutes() {
    const {token} = useToken();

    if (token === undefined) {
        return null; // or loading indicator/spinner/etc
    }
    return token
        ? <Outlet/>
        //: <Navigate to="/login" replace state={{ from: location }} />;
        /*:  <Login setToken={setToken} />;*/
        : LoginFactory()
}