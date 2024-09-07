import {Group} from "./Group";

export interface UserRepository {
    usersFromGroup(groupId: number, token: string): Promise<Group>
}