import { Identifier } from "typescript";

export default interface DeletedProjectResponse {
    id: Identifier;
    name: string;
    startDate: Date;
    endDate: Date;
    status: string;
}