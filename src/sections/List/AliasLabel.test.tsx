import {useState} from "react";
import {fireEvent, render, screen} from "@testing-library/react";
import {Movie} from "../../domain/Movie/Movie";
import {MovieRepository} from "../../domain/Movie/MovieRepository";
import {AliasLabel} from "./AliasLabel";

const movieInFile: Movie = {
    id: 7,
    title: 'Expediente de prueba',
    duration: 98,
    poster: '',
    trailer: '',
    summary: '',
    comments: '',
    link: '',
    alias: 'La de los pingüinos',
    film_festival_id: '57',
    section: '',
    sessions: [],
    votes: []
};

class FakeMovieRepository implements MovieRepository {
    public renamedTo: (string | null)[] = [];

    constructor(private readonly failing: boolean) {
    }

    findById(): Promise<Movie> {
        throw new Error('No usado en este test');
    }

    findAll(): Promise<Movie[]> {
        throw new Error('No usado en este test');
    }

    discardMaterial(): Promise<Movie> {
        throw new Error('No usado en este test');
    }

    async updateAlias(id: number, alias: string | null): Promise<Movie> {
        if (this.failing) {
            throw new Error('Algo ha ido mal');
        }
        this.renamedTo.push(alias);
        return {...movieInFile, alias: alias ?? ''};
    }
}

function AliasLabelHost({repository, initialAlias}: { repository: MovieRepository, initialAlias: string }) {
    const [alias, setAlias] = useState(initialAlias);
    return <AliasLabel movieId={movieInFile.id} title={movieInFile.title} alias={alias}
                       repository={repository} token="token" onRenamed={setAlias}/>;
}

function renderLabel(repository: MovieRepository, initialAlias: string) {
    render(<AliasLabelHost repository={repository} initialAlias={initialAlias}/>);
}

const editButton = () => screen.getByRole('button', {name: `Cambiar el alias de ${movieInFile.title}`});
const aliasInput = () => screen.getByRole('textbox', {name: `Alias de ${movieInFile.title}`});
const saveButton = () => screen.getByRole('button', {name: `Guardar el alias de ${movieInFile.title}`});

describe('AliasLabel', () => {
    it('whenTheMovieHasNoAliasThenOnlyTheTagInvitesToPutOne', () => {
        renderLabel(new FakeMovieRepository(false), '');

        expect(screen.getByRole('button', {name: `Poner alias a ${movieInFile.title}`})).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('whenTheTagIsClickedThenTheAliasBecomesEditableWithItsCurrentValue', () => {
        renderLabel(new FakeMovieRepository(false), movieInFile.alias);

        fireEvent.click(editButton());

        expect(aliasInput()).toHaveValue(movieInFile.alias);
    });

    it('whenANewAliasIsSavedThenTheRepositoryReceivesItAndTheLabelShowsIt', async () => {
        const repository = new FakeMovieRepository(false);
        renderLabel(repository, movieInFile.alias);

        fireEvent.click(editButton());
        fireEvent.change(aliasInput(), {target: {value: '  La del oso  '}});
        fireEvent.click(saveButton());

        expect(await screen.findByText('La del oso')).toBeInTheDocument();
        expect(repository.renamedTo).toEqual(['La del oso']);
    });

    it('whenTheAliasIsLeftEmptyThenItIsClearedAsNull', async () => {
        const repository = new FakeMovieRepository(false);
        renderLabel(repository, movieInFile.alias);

        fireEvent.click(editButton());
        fireEvent.change(aliasInput(), {target: {value: '   '}});
        fireEvent.click(saveButton());

        expect(await screen.findByRole('button', {name: `Poner alias a ${movieInFile.title}`})).toBeInTheDocument();
        expect(repository.renamedTo).toEqual([null]);
    });

    it('whenTheAliasIsUnchangedThenItClosesWithoutCallingTheRepository', () => {
        const repository = new FakeMovieRepository(false);
        renderLabel(repository, movieInFile.alias);

        fireEvent.click(editButton());
        fireEvent.click(saveButton());

        expect(repository.renamedTo).toEqual([]);
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('whenTheEditIsCancelledThenTheAliasStaysAsItWas', () => {
        renderLabel(new FakeMovieRepository(false), movieInFile.alias);

        fireEvent.click(editButton());
        fireEvent.change(aliasInput(), {target: {value: 'Otro nombre'}});
        fireEvent.click(screen.getByRole('button', {name: `Descartar el cambio de alias de ${movieInFile.title}`}));

        expect(screen.getByText(movieInFile.alias)).toBeInTheDocument();
        expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
    });

    it('whenSavingFailsThenTheTypedAliasStaysOnScreenToRetry', async () => {
        renderLabel(new FakeMovieRepository(true), movieInFile.alias);

        fireEvent.click(editButton());
        fireEvent.change(aliasInput(), {target: {value: 'La del oso'}});
        fireEvent.click(saveButton());

        expect(await screen.findByRole('alert')).toHaveTextContent('No se ha guardado · reintenta');
        expect(aliasInput()).toHaveValue('La del oso');
    });
});
