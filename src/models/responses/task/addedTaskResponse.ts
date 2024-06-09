import { Identifier } from "typescript";

export default interface AddedTaskResponse {
    id: Identifier;
    title: string;
    description: string;
    status: string;
}