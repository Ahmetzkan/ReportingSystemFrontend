import { Identifier } from "typescript";

export default interface UpdateReportRequest {
    id: Identifier;
    title: string;
    content: string;
    projectId: Identifier;
    taskId: Identifier;
}