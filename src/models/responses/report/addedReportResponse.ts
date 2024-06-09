import { Identifier } from "typescript";

export default interface AddedReportResponse {
    id: Identifier;
    title: string;
    content: string;
    projectId: Identifier;
    taskId: Identifier;
}