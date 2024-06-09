import { Paginate } from "../models/paginate";
import { BaseService } from "../core/services/baseService";
import GetListProjectResponse from "../models/responses/project/getListProjectResponse";
import AddProjectRequest from "../models/requests/project/addProjectRequest";
import AddedProjectResponse from "../models/responses/project/addedProjectResponse";
import UpdateProjectRequest from "../models/requests/project/updateProject.Request";
import UpdatedProjectResponse from "../models/responses/project/updatedProjectResponse";
import DeleteProjectRequest from "../models/requests/project/deleteProjectRequest";
import DeletedProjectResponse from "../models/responses/project/deletedProjectResponse";

class ProjectService extends BaseService<
    Paginate<GetListProjectResponse>,
    GetListProjectResponse,
    AddProjectRequest,
    AddedProjectResponse,
    UpdateProjectRequest,
    UpdatedProjectResponse,
    DeleteProjectRequest,
    DeletedProjectResponse
> {
    constructor() {
        super();
        this.apiUrl = "Projects";
    }
}


export default new ProjectService();