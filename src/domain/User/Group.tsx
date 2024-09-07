export interface Group{
    id: number;
    name: string;
    user_list: UserFromGroup[]
}

interface UserFromGroup {
    id: number;
    name: string;
}