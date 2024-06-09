import { Identifier } from "typescript";

export default interface GetListTaskResponse {
    id: Identifier;
    title: string;
    description: string;
    status: string;
    createdDate: Date;
}