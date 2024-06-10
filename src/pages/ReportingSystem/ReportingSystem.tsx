import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./ReportingSystem.css";
import GetListProjectResponse from "../../models/responses/project/getListProjectResponse";
import GetListTaskResponse from "../../models/responses/task/getListTaskResposnse";
import GetListReportResponse from "../../models/responses/report/getListReportResponse";
import DeleteReportRequest from "../../models/requests/report/deleteReportRequest";
import reportService from "../../services/reportService";
import taskService from "../../services/taskService";
import projectService from "../../services/projectService";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";

const ReportingSystem = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [reportsPerPage] = useState(5);
  const [selectedType, setSelectedType] = useState("");
  const [editReport, setEditReport] = useState<GetListReportResponse | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState({
    search: "",
    startDate: "",
    endDate: "",
    sortField: "createdDate",
    sortOrder: "asc"
  });

  const [tasks, setTasks] = useState<GetListTaskResponse[]>([]);
  const [projects, setProjects] = useState<GetListProjectResponse[]>([]);
  const [reports, setReports] = useState<GetListReportResponse[]>([]);
  const [filteredReports, setFilteredReports] = useState<GetListReportResponse[]>([]);

  useEffect(() => {
    reportService.getAll(0, 100).then((result) => {
      setReports(result.data.items);
      setFilteredReports(result.data.items);
    });
    taskService.getAll(0, 100).then((result) => {
      setTasks(result.data.items);
    });
    projectService.getAll(0, 100).then((result) => {
      setProjects(result.data.items);
    });
  }, []);

  useEffect(() => {
    filterReports(reports, filter);
  }, [reports, filter, tasks, projects]);


  const validationSchema = Yup.object().shape({
    title: Yup.string().required("Rapor başlığı gereklidir."),
    content: Yup.string().required("Rapor içeriği gereklidir."),
    itemId: Yup.string().required("Lütfen bir seçenek belirleyin.")
  });

  const onSubmit = async (values: any) => {
    const currentDate = new Date();
    const newReport: GetListReportResponse = {
      id: editReport ? editReport.id : values.id || "",
      title: values.title,
      content: values.content,
      projectId: selectedType === "project" ? values.itemId : null,
      taskId: selectedType === "task" ? values.itemId : null,
      createdDate: values.createdDate || currentDate.toISOString()
    };

    try {
      if (editReport) {
        await reportService.update(newReport);
        const updatedReports = reports.map(report => (report.id === editReport.id ? newReport : report));
        setReports(updatedReports);
        setFilteredReports(updatedReports);
      } else {
        const addedReportResponse = await reportService.add(newReport);
        const addedReport: GetListReportResponse = {
          id: addedReportResponse.data.id,
          title: addedReportResponse.data.title,
          content: addedReportResponse.data.content,
          projectId: addedReportResponse.data.projectId,
          taskId: addedReportResponse.data.taskId,
          createdDate: values.createdDate || currentDate.toISOString()
        };
        const updatedReports = [...reports, addedReport];
        setReports(updatedReports);
        setFilteredReports(updatedReports);
      }
    } catch (error) {
      console.error("Error updating/adding report:", error);
    }
    setShowModal(false);
  };

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>, setFieldValue: (field: string, value: any) => void) => {
    setFieldValue("itemId", "");
    setSelectedType(e.target.value);
    const options = getOptions();
    setFieldValue("options", options);
  };

  const getOptions = () => {
    if (selectedType === "task") {
      return tasks;
    } else if (selectedType === "project") {
      return projects;
    }
    return [];
  };

  const handleEdit = (report: GetListReportResponse) => {
    setSelectedType(report.projectId ? "project" : "task");
    setEditReport(report);
    setShowModal(true);
  };

  const handleDelete = async (report: GetListReportResponse) => {
    const deleteRequest: DeleteReportRequest = {
      id: report.id
    };

    await reportService.delete(deleteRequest)
      .then(() => {
        const updatedReports = reports.filter((r) => r.id !== report.id);
        setReports(updatedReports);
        setFilteredReports(updatedReports);
      })
  };

  const handleAddNew = () => {
    setEditReport(null);
    setSelectedType("");
    setShowModal(true);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === "sortField" && value === "createdDate") {
      setFilter({ ...filter, sortField: "createdDate", sortOrder: "asc" });
    } else if (name === "sortField" && value === "createdDate_desc") {
      setFilter({ ...filter, sortField: "createdDate", sortOrder: "desc" });
    } else if (name === "sortField" && value === "title") {
      setFilter({ ...filter, sortField: "title", sortOrder: "asc" });
    } else if (name === "sortField" && value === "title_desc") {
      setFilter({ ...filter, sortField: "title", sortOrder: "desc" });
    } else {
      setFilter({ ...filter, [name]: value });
    }
  };

  const filterReports = (reports: GetListReportResponse[], filter: any) => {
    let filtered = reports;

    if (filter.search) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(filter.search.toLowerCase()) ||
        (report.projectId && projects.find(p => p.id === report.projectId)?.name.toLowerCase().includes(filter.search.toLowerCase())) ||
        (report.taskId && tasks.find(t => t.id === report.taskId)?.title.toLowerCase().includes(filter.search.toLowerCase()))
      );
    }

    if (filter.startDate) {
      filtered = filtered.filter(report =>
        new Date(report.createdDate) >= new Date(filter.startDate)
      );
    }

    if (filter.endDate) {
      filtered = filtered.filter(report =>
        new Date(report.createdDate) <= new Date(filter.endDate)
      );
    }

    filtered.sort((a, b) => {
      if (filter.sortField === "createdDate") {
        return filter.sortOrder === "asc"
          ? new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
          : new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
      } else if (filter.sortField === "title") {
        const fieldA = (a.title || "").toLowerCase();
        const fieldB = (b.title || "").toLowerCase();
        return filter.sortOrder === "asc" ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
      }
      return 0;
    });

    setFilteredReports(filtered);
  };

  return (
    <div className="container managementSystem">
      <div className="report-form">
        <Button onClick={handleAddNew} className="btn btn-primary mb-3">
          Yeni Rapor Ekle
        </Button>
        <div className="filter-container">
          <input type="text" name="search" placeholder="Başlık veya İsim ile Ara..."
            value={filter.search} onChange={handleFilterChange}
            className="form-control mb-2"
          />
          <input
            type="date" name="startDate" placeholder="Başlangıç Tarihi"
            value={filter.startDate} onChange={handleFilterChange}
            className="form-control mb-2"
          />
          <input
            type="date" name="endDate" placeholder="Bitiş Tarihi"
            value={filter.endDate} onChange={handleFilterChange}
            className="form-control mb-2"
          />
          <select
            name="sortField" value={filter.sortField}
            onChange={handleFilterChange} className="form-control mb-2"
          >
            <option value="createdDate">Oluşturulma Tarihine Göre (Yeni'den Eski'ye)</option>
            <option value="createdDate_desc">Oluşturulma Tarihine Göre (Eski'den Yeni'ye)</option>
            <option value="title">Başlığa Göre (Z'den A'ya)</option>
            <option value="title_desc">Başlığa Göre (A'dan Z'ye)</option>
          </select>

        </div>
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>{editReport ? "Raporu Düzenle" : "Rapor Oluştur"}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Formik
              initialValues={{
                title: editReport?.title || "",
                content: editReport?.content || "",
                itemId: editReport?.projectId || editReport?.taskId || "",
                options: []
              }}
              validationSchema={validationSchema} onSubmit={onSubmit} enableReinitialize
            >
              {({ touched, errors, setFieldValue }) => (
                <Form>
                  <div className="form-group">
                    <label htmlFor="title">Rapor Başlığı:</label>
                    <Field
                      type="text" name="title" id="title"
                      className={
                        "form-control" + (errors.title && touched.title ? " is-invalid" : "")
                      }
                    />
                    <ErrorMessage name="title" component="div" className="invalid-feedback" />
                  </div>

                  <div className="form-group">
                    <label htmlFor="content">Rapor İçeriği:</label>
                    <Field
                      as="textarea" name="content" id="content" rows="2"
                      className={"form-control" + (errors.content && touched.content ? " is-invalid" : "")}
                    />
                    <ErrorMessage
                      name="content" component="div" className="invalid-feedback"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="type">Görev veya Proje Seçiniz:</label>
                    <select
                      name="type" id="type" className="form-control"
                      value={selectedType} onChange={(e) => handleTypeChange(e, setFieldValue)}
                    >
                      <option value="">Seçiniz</option>
                      <option value="task">Görev</option>
                      <option value="project">Proje</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="itemId">Seçenek:</label>
                    <Field
                      as="select" name="itemId" id="itemId"
                      className={"form-control" + (errors.itemId && touched.itemId ? " is-invalid" : "")}
                      disabled={!selectedType}
                    >
                      <option value="">Seçiniz</option>
                      {getOptions().map((option: any, index: number) => (
                        <option key={index} value={option.id.toString()}>
                          {selectedType === "task" ? option.title : option.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="itemId" component="div" className="invalid-feedback" />
                  </div>

                  <Button type="submit" className="btn btn-primary">
                    {editReport ? "Güncelle" : "Kaydet"}
                  </Button>
                </Form>
              )}
            </Formik>
          </Modal.Body>
        </Modal>
      </div>

      <div className="report-list">
        <h2>Raporlar</h2>
        <ul>
          {filteredReports.slice((currentPage - 1) * reportsPerPage, currentPage * reportsPerPage).map((report, index) => (
            <li key={index} className="report-item">
              <h3>{report.title}</h3>
              <p>İçerik: {report.content}</p>
              {report.taskId && <p>Görev: {tasks.find(task => task.id === report.taskId)?.title}</p>}
              {report.projectId && <p>Proje: {projects.find(project => project.id === report.projectId)?.name}</p>}
              <p>Oluşturulma Tarihi: {new Date(report.createdDate).toLocaleString()}</p>
              <div className="report-actions">
                <FaEdit onClick={() => handleEdit(report)} className="action-icon" />
                <FaTrash onClick={() => handleDelete(report)} className="action-icon" />
              </div>
            </li>
          ))}
        </ul>

        <div className="pagination">
          {filteredReports.length > reportsPerPage && (
            <ul className="pagination-list">
              {Array.from({ length: Math.ceil(filteredReports.length / reportsPerPage) }, (_, i) => (
                <li key={i + 1} className="page-item">
                  <button onClick={() => paginate(i + 1)} className="page-link">
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportingSystem;