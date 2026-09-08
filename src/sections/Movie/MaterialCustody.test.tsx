import {fireEvent, render, screen} from "@testing-library/react";
import {Movie} from "../../domain/Movie/Movie";
import {MovieMaterial} from "../../domain/Movie/MovieMaterial";
import {MovieRepository} from "../../domain/Movie/MovieRepository";
import {MaterialCustody} from "./MaterialCustody";

const movieInFile: Movie = {
    id: 7,
    title: 'Expediente de prueba',
    duration: 98,
    poster: 'cartel.jpg',
    trailer: 'abc123',
    summary: '',
    comments: '',
    link: '',
    alias: '',
    film_festival_id: '57',
    section: '',
    sessions: [],
    votes: []
};

class FakeMovieRepository implements MovieRepository {
    public discarded: MovieMaterial[] = [];

    constructor(private readonly failing: boolean) {
    }

    findById(): Promise<Movie> {
        throw new Error('No usado en este test');
    }

    findAll(): Promise<Movie[]> {
        throw new Error('No usado en este test');
    }

    async discardMaterial(id: number, material: MovieMaterial): Promise<Movie> {
        if (this.failing) {
            throw new Error('Algo ha ido mal');
        }
        this.discarded.push(material);
        return {...movieInFile, [material]: ''};
    }
}

function renderCustody(repository: MovieRepository, onDiscarded: (movie: Movie) => void) {
    render(<MaterialCustody movieId={movieInFile.id} poster={movieInFile.poster} trailer={movieInFile.trailer}
                            repository={repository} token="token" onDiscarded={onDiscarded}/>);
}

describe('MaterialCustody', () => {
    it('whenMaterialIsPresentThenItIsListedAsHeldInTheFile', () => {
        renderCustody(new FakeMovieRepository(false), () => {
        });

        expect(screen.getAllByText('En expediente')).toHaveLength(2);
    });

    it('whenDiscardIsClickedThenItAsksForConfirmationBeforeCallingTheRepository', () => {
        const repository = new FakeMovieRepository(false);
        renderCustody(repository, () => {
        });

        fireEvent.click(screen.getAllByRole('button', {name: 'Descartar'})[0]);

        expect(screen.getByText('¿Descartar del expediente?')).toBeInTheDocument();
        expect(repository.discarded).toEqual([]);
    });

    it('whenDiscardIsConfirmedThenTheUpdatedMovieIsReportedBack', async () => {
        const repository = new FakeMovieRepository(false);
        const refreshed: Movie[] = [];
        renderCustody(repository, (movie) => refreshed.push(movie));

        fireEvent.click(screen.getAllByRole('button', {name: 'Descartar'})[0]);
        fireEvent.click(screen.getAllByRole('button', {name: 'Descartar'})[0]);

        expect(await screen.findByText('Descartado · pendiente de recaptura')).toBeInTheDocument();
        expect(repository.discarded).toEqual(['poster']);
        expect(refreshed).toEqual([{...movieInFile, poster: ''}]);
    });

    it('whenTheRequestFailsThenTheMaterialStaysInTheFileAndCanBeRetried', async () => {
        renderCustody(new FakeMovieRepository(true), () => {
        });

        fireEvent.click(screen.getAllByRole('button', {name: 'Descartar'})[1]);
        fireEvent.click(screen.getAllByRole('button', {name: 'Descartar'})[1]);

        expect(await screen.findByText('La orden no llegó al archivo. Inténtalo de nuevo.')).toBeInTheDocument();
        expect(screen.getAllByRole('button', {name: 'Descartar'})).toHaveLength(2);
    });

    it('whenCancelIsClickedThenTheRowGoesBackToItsRestingState', () => {
        renderCustody(new FakeMovieRepository(false), () => {
        });

        fireEvent.click(screen.getAllByRole('button', {name: 'Descartar'})[0]);
        fireEvent.click(screen.getByRole('button', {name: 'Cancelar'}));

        expect(screen.queryByText('¿Descartar del expediente?')).not.toBeInTheDocument();
        expect(screen.getAllByText('En expediente')).toHaveLength(2);
    });
});
