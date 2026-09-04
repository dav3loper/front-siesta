import {createContext, ReactNode, useContext, useState} from "react";
import {MovieContext} from "../../domain/Agent/AgentRepository";

interface AgentContextValue {
    movieContext?: MovieContext;
    setMovieContext: (context?: MovieContext) => void;
}

const AgentContextInstance = createContext<AgentContextValue>({
    movieContext: undefined,
    setMovieContext: () => {
    }
});

export function AgentContextProvider({children}: { children: ReactNode }) {
    const [movieContext, setMovieContext] = useState<MovieContext>();

    return (
        <AgentContextInstance.Provider value={{movieContext, setMovieContext}}>
            {children}
        </AgentContextInstance.Provider>
    );
}

export function useAgentContext() {
    return useContext(AgentContextInstance);
}
