import { Identifier } from "typescript";

export default interface UpdatedReportResponse {
    id: Identifier;
    title: string;
    content: string;
    projectId: Identifier;
    taskId: Identifier;
}