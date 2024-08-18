import {createBrowserRouter, RouterProvider} from "react-router-dom";

import {MovieDetailFactory} from "./sections/Movie/MovieDetailFactory";
import {Layout} from "./sections/Layout/Layout";
import {DashboardFactory} from "./sections/Dashboard/DashboardFactory";
import {FilmFestivalVoteListFactory} from "./sections/List/FilmFestivalVoteListFactory";
import {PrivateRoutes} from "./PrivateRoutes";
import {Login} from "./sections/Login/Login";
import {LoginFactory} from "./sections/Login/LoginFactory";

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
            element: LoginFactory(),
        }
    ])
;

export function Router() {
    return <RouterProvider router={router}/>;
}
