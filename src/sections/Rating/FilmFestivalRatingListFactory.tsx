import React from "react";
import {FilmFestivalRatingList} from "./FilmFestivalRatingList";
import {AsyncFetchRatingRepository} from "../../infrastructure/Rating/AsyncFetchRatingRepository";

const ratingRepository = new AsyncFetchRatingRepository(process.env.REACT_APP_API_BASE_URL ?? '');

export class FilmFestivalRatingListFactory {
    static create(): React.ReactElement {
        return <FilmFestivalRatingList ratingRepository={ratingRepository}/>;
    }
}
