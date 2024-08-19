import React from 'react';
import useToken from "./sections/Login/UseToken";
import {BrowserRouter, Outlet, Route, Routes} from "react-router-dom";
import {DashboardFactory} from "./sections/Dashboard/DashboardFactory";
import {MovieDetailFactory} from "./sections/Movie/MovieDetailFactory";
import {LoginFactory} from "./sections/Login/LoginFactory";
import {FilmFestivalVoteListFactory} from "./sections/List/FilmFestivalVoteListFactory";
import {Layout} from "./sections/Layout/Layout";

function App() {
    const {token, setToken} = useToken();

    if (!token) {
        return LoginFactory(setToken);
    }

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={DashboardFactory.create()}/>
                    {/*<Route path="/" element={DashboardFactory.create()} />*/}
                    {/*<Route path="/login" element={LoginFactory(setToken)} />*/}
                    <Route path="/movie/:id" element={MovieDetailFactory.create()}/>
                    <Route path="/film-festival/:id/list" element={FilmFestivalVoteListFactory.create()}/>
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
