import { Paginate } from "../models/paginate";
import { BaseService } from "../core/services/baseService";
import GetListReportResponse from "../models/responses/report/getListReportResponse";
import AddReportRequest from "../models/requests/report/addReportRequest";
import AddedReportResponse from "../models/responses/report/addedReportResponse";
import UpdateReportRequest from "../models/requests/report/updateReportRequest";
import UpdatedReportResponse from "../models/responses/report/updatedReportResponse";
import DeleteReportRequest from "../models/requests/report/deleteReportRequest";
import DeletedReportResponse from "../models/responses/report/deletedReportResponse";

class ReportService extends BaseService<
    Paginate<GetListReportResponse>,
    GetListReportResponse,
    AddReportRequest,
    AddedReportResponse,
    UpdateReportRequest,
    UpdatedReportResponse,
    DeleteReportRequest,
    DeletedReportResponse
> {
    constructor() {
        super();
        this.apiUrl = "Reports";
    }
}


export default new ReportService();