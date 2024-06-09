import { Paginate } from "../models/paginate";
import { BaseService } from "../core/services/baseService";
import GetListTaskResponse from "../models/responses/task/getListTaskResposnse";
import AddTaskRequest from "../models/requests/task/addTaskRequest";
import AddedTaskResponse from "../models/responses/task/addedTaskResponse";
import UpdateTaskRequest from "../models/requests/task/updateTaskRequest";
import UpdatedTaskResponse from "../models/responses/task/updatedTaskResponse";
import DeleteTaskRequest from "../models/requests/task/deleteTaskRequest";
import DeletedTaskResponse from "../models/responses/task/delededTaskResponse";

class TaskService extends BaseService<
    Paginate<GetListTaskResponse>,
    GetListTaskResponse,
    AddTaskRequest,
    AddedTaskResponse,
    UpdateTaskRequest,
    UpdatedTaskResponse,
    DeleteTaskRequest,
    DeletedTaskResponse
> {
    constructor() {
        super();
        this.apiUrl = "Tasks";
    }
}


export default new TaskService();