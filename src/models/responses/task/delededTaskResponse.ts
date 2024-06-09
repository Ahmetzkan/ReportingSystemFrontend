import { Identifier } from "typescript";

export default interface DeletedTaskResponse {
    id: Identifier;
    title: string;
    description: string;
    status: string;
}