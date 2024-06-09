import { Identifier } from "typescript";

export default interface GetListProjectResponse {
    id: Identifier;
    name: string;
    startDate: Date;
    endDate: Date;
    status: string;
    createdDate: Date;
    updatedDate: Date;
}