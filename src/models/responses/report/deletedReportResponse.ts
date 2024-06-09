import { Identifier } from "typescript";

export default interface DeletedReportResponse {
    id: Identifier;
    title: string;
    content: string;
    projectId: Identifier;
    taskId: Identifier;
}