import React from "react";
import {AgentWidget} from "./AgentWidget";
import {AsyncFetchAgentRepository} from "../../infrastructure/Agent/AsyncFetchAgentRepository";

const agentRepository = new AsyncFetchAgentRepository(process.env.REACT_APP_API_BASE_URL ?? '');

export class AgentWidgetFactory {
    static create(): React.ReactElement {
        return <AgentWidget agentRepository={agentRepository}/>;
    }
}
