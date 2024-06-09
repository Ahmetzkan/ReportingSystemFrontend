import { Identifier } from "typescript";

export default interface UpdatedTaskResponse {
    id: Identifier;
    title: string;
    description: string;
    status: string;
}