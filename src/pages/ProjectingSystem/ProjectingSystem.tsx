import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./ProjectingSystem.css";
import projectService from "../../services/projectService";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import GetListProjectResponse from "../../models/responses/project/getListProjectResponse";
import DeleteProjectRequest from "../../models/requests/project/deleteProjectRequest";

const ProjectingSystem = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [projectsPerPage] = useState(5);
    const [editProject, setEditProject] = useState<GetListProjectResponse | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState({
        search: "",
        startDate: "",
        endDate: "",
        sortField: "createdDate",
        sortOrder: "asc"
    });

    const [projects, setProjects] = useState<GetListProjectResponse[]>([]);
    const [filteredProjects, setFilteredProjects] = useState<GetListProjectResponse[]>([]);

    useEffect(() => {
        projectService.getAll(0, 100).then((result) => {
            setProjects(result.data.items);
            setFilteredProjects(result.data.items);
        });
    }, []);

    useEffect(() => {
        filterProjects(projects, filter);
    }, [projects, filter]);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Proje adı gereklidir."),
        status: Yup.string().required("Proje durumu gereklidir."),
        startDate: Yup.date().required("Başlangıç tarihi gereklidir."),
        endDate: Yup.date().required("Bitiş tarihi gereklidir.")
    });

    const onSubmit = async (values: any) => {
        const currentDate = new Date();
        const newProject: GetListProjectResponse = {
            id: editProject ? editProject.id : values.id || "",
            name: values.name,
            status: values.status,
            startDate: values.startDate,
            endDate: values.endDate,
            createdDate: values.createdDate || currentDate.toISOString(),
        };

        try {
            if (editProject) {
                await projectService.update(newProject);
                setProjects(projects.map(p => p.id === newProject.id ? newProject : p));
                setFilteredProjects(filteredProjects.map(p => p.id === newProject.id ? newProject : p));
            } else {
                await projectService.add(newProject);
                setProjects([...projects, newProject]);
                setFilteredProjects([...filteredProjects, newProject]);
            }
        } catch (error) {
            console.error("Error updating/adding project:", error);
        }
        setShowModal(false);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleEdit = (project: GetListProjectResponse) => {
        setEditProject(project);
        setShowModal(true);
    };

    const handleDelete = async (project: GetListProjectResponse) => {
        const deleteRequest: DeleteProjectRequest = {
            id: project.id
        };
        await projectService.delete(deleteRequest);
        setProjects(projects.filter(p => p.id !== project.id));
        setFilteredProjects(filteredProjects.filter(p => p.id !== project.id));
    };

    const handleAddNew = () => {
        setEditProject(null);
        setShowModal(true);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "sortField") {
            if (value === "createdDate" || value === "name") {
                setFilter({ ...filter, sortField: value, sortOrder: "asc" });
            } else {
                const [field, order] = value.split("_");
                setFilter({ ...filter, sortField: field, sortOrder: order });
            }
        } else {
            setFilter({ ...filter, [name]: value });
        }
    };

    const filterProjects = (projects: GetListProjectResponse[], filter: any) => {
        let filtered = projects;

        if (filter.search) {
            filtered = filtered.filter(project =>
                project.name.toLowerCase().includes(filter.search.toLowerCase()) ||
                project.status.toLowerCase().includes(filter.search.toLowerCase())
            );
        }

        if (filter.startDate) {
            filtered = filtered.filter(project =>
                new Date(project.startDate) >= new Date(filter.startDate)
            );
        }

        if (filter.endDate) {
            filtered = filtered.filter(project =>
                new Date(project.endDate) <= new Date(filter.endDate)
            );
        }

        filtered.sort((a, b) => {
            if (filter.sortField === 'createdDate') {
                return filter.sortOrder === 'asc'
                    ? new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
                    : new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            } else if (filter.sortField === 'name') {
                const fieldA = (a.name || '').toLowerCase();
                const fieldB = (b.name || '').toLowerCase();
                return filter.sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
            }
            return 0;
        });

        setFilteredProjects(filtered);
    };

    return (
        <div className="container projectingSystem">
            <div className="project-form">
                <Button onClick={handleAddNew} className="btn btn-primary mb-3">
                    Yeni Proje Ekle
                </Button>
                <div className="filter-container">
                    <input type="text" name="search" placeholder="Ad veya Durum ile Ara..."
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
                        name="sortField" value={`${filter.sortField}_${filter.sortOrder}`}
                        onChange={handleFilterChange} className="form-control mb-2"
                    >
                        <option value="createdDate_asc">Oluşturulma Tarihine Göre (Yeni'den Eski'ye)</option>
                        <option value="createdDate_desc">Oluşturulma Tarihine Göre (Eski'den Yeni'ye)</option>
                        <option value="name_asc">Ada Göre (Z'den A'ya)</option>
                        <option value="name_desc">Ada Göre (A'den Z'ye)</option>
                    </select>
                </div>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editProject ? "Projeyi Düzenle" : "Proje Oluştur"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={{
                                name: editProject?.name || "",
                                status: editProject?.status || "",
                                startDate: editProject?.startDate ? new Date(editProject.startDate).toISOString().split('T')[0] : "",
                                endDate: editProject?.endDate ? new Date(editProject.endDate).toISOString().split('T')[0] : "",
                                createdDate: editProject?.createdDate || "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                            enableReinitialize
                        >
                            {({ touched, errors }) => (
                                <Form>
                                    <div className="form-group">
                                        <label htmlFor="name">Proje Adı:</label>
                                        <Field
                                            type="text"
                                            name="name"
                                            id="name"
                                            className={
                                                "form-control" +
                                                (errors.name && touched.name ? " is-invalid" : "")
                                            }
                                        />
                                        <ErrorMessage
                                            name="name"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="status">Proje Durumu:</label>
                                        <Field
                                            type="text"
                                            name="status"
                                            id="status"
                                            className={
                                                "form-control" +
                                                (errors.status && touched.status ? " is-invalid" : "")
                                            }
                                        />
                                        <ErrorMessage
                                            name="status"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="startDate">Başlangıç Tarihi:</label>
                                        <Field
                                            type="date"
                                            name="startDate"
                                            id="startDate"
                                            className={
                                                "form-control" +
                                                (errors.startDate && touched.startDate ? " is-invalid" : "")
                                            }
                                        />
                                        <ErrorMessage
                                            name="startDate"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="endDate">Bitiş Tarihi:</label>
                                        <Field
                                            type="date"
                                            name="endDate"
                                            id="endDate"
                                            className={
                                                "form-control" +
                                                (errors.endDate && touched.endDate ? " is-invalid" : "")
                                            }
                                        />
                                        <ErrorMessage
                                            name="endDate"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </div>

                                    <Button type="submit" className="btn btn-primary">
                                        {editProject ? "Güncelle" : "Kaydet"}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
            </div>

            <div className="project-list">
                <h2>Projeler</h2>
                <ul>
                    {filteredProjects
                        .slice(
                            (currentPage - 1) * projectsPerPage,
                            currentPage * projectsPerPage
                        )
                        .map((project, index) => (
                            <li key={index} className="project-item">
                                <h3>{project.name}</h3>
                                <p>Durum: {project.status}</p>
                                <p>Başlangıç Tarihi: {new Date(project.startDate).toLocaleDateString()}</p>
                                <p>Bitiş Tarihi: {new Date(project.endDate).toLocaleDateString()}</p>
                                <p>Oluşturulma Tarihi: {new Date(project.createdDate).toLocaleString()}</p>
                                <div className="project-actions">
                                    <FaEdit onClick={() => handleEdit(project)} className="action-icon" />
                                    <FaTrash onClick={() => handleDelete(project)} className="action-icon" />
                                </div>
                            </li>
                        ))}
                </ul>

                <div className="pagination">
                    {filteredProjects.length > projectsPerPage && (
                        <ul className="pagination-list">
                            {Array.from(
                                { length: Math.ceil(filteredProjects.length / projectsPerPage) },
                                (_, i) => (
                                    <li key={i + 1} className="page-item">
                                        <button
                                            onClick={() => paginate(i + 1)}
                                            className="page-link"
                                        >
                                            {i + 1}
                                        </button>
                                    </li>
                                )
                            )}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectingSystem;
