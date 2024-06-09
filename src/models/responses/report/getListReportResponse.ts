import { Identifier } from "typescript";

export default interface GetListReportResponse {
    id: Identifier;
    title: string;
    content: string;
    projectId: Identifier;
    taskId: Identifier;
    createdDate: Date;
}