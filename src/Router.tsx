import {createBrowserRouter, RouterProvider} from "react-router-dom";

import {MovieDetailFactory} from "./sections/Movie/MovieDetailFactory";
import {Layout} from "./sections/Layout/Layout";
import {DashboardFactory} from "./sections/Dashboard/DashboardFactory";
import {FilmFestivalVoteListFactory} from "./sections/List/FilmFestivalVoteListFactory";
import {PrivateRoutes} from "./PrivateRoutes";
import {LoginFactory} from "./sections/Login/LoginFactory";
import useToken from "./sections/Login/UseToken";

export function Router() {
    const {setToken} = useToken();
    const router = createBrowserRouter([
        {
            element: <PrivateRoutes/>,
            children: [
                {
                    path: "/",
                    element: DashboardFactory.create(),
                }, {
                    path: "/movie/:id",
                    element: MovieDetailFactory.create()
                }, {
                    path: "/film-festival/:id/list",
                    element: FilmFestivalVoteListFactory.create()
                },
            ],
        },
        {
            path: "/login",
            element: LoginFactory(setToken),
        }
    ])
    ;
    return <RouterProvider router={router}/>;
}
