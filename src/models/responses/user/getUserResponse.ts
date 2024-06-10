import { Identifier } from "typescript";

export default interface GetUserResponse {
    id: Identifier;
    firstName: string;
    lastName: string;
    email: string;
    tcNo: string;
    birthDate: Date;
}