import { Group } from "../../domain/User/Group";
import {UserRepository} from "../../domain/User/UserRepository";

export class AsyncFetchUserRepository implements UserRepository {
    private host: string;

    constructor(host: string) {
        this.host = host;
    }

    usersFromGroup(groupId: number, token: string): Promise<Group> {
        return fetch(this.host+`/group/${groupId}`, {
            mode: 'cors',
            method: 'GET',
            headers : {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(data => data.json())
            .catch(error => console.error(error));
    }

}