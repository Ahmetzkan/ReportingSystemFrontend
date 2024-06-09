import { Identifier } from "typescript";

export default interface AddReportRequest {
    title: string;
    content: string;
    projectId: Identifier;
    taskId: Identifier;
}