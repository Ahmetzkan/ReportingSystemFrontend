import React, { useEffect, useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import "./TaskingSystem.css";
import taskService from "../../services/taskService";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Modal, Button } from "react-bootstrap";
import DeleteTaskRequest from "../../models/requests/task/deleteTaskRequest";
import GetListTaskResponse from "../../models/responses/task/getListTaskResposnse";

const TaskingSystem = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [tasksPerPage] = useState(5);
    const [editTask, setEditTask] = useState<GetListTaskResponse | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [filter, setFilter] = useState({
        search: "",
        startDate: "",
        endDate: "",
        sortField: "createdDate",
        sortOrder: "asc"
    });

    const [tasks, setTasks] = useState<GetListTaskResponse[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<GetListTaskResponse[]>([]);

    useEffect(() => {
        taskService.getAll(0, 100).then((result) => {
            setTasks(result.data.items);
            setFilteredTasks(result.data.items);
        });
    }, []);

    useEffect(() => {
        filterTasks(tasks, filter);
    }, [tasks, filter]);

    const validationSchema = Yup.object().shape({
        title: Yup.string().required("Görev başlığı gereklidir."),
        description: Yup.string().required("Görev açıklaması gereklidir."),
        status: Yup.string().required("Görev durumu gereklidir.")
    });

    const onSubmit = async (values: any) => {
        const currentDate = new Date();
        const newTask: GetListTaskResponse = {
            id: editTask ? editTask.id : values.id || "",
            title: values.title,
            description: values.description,
            status: values.status,
            createdDate: values.createdDate || currentDate.toISOString()
        };

        try {
            if (editTask) {
                await taskService.update(newTask);
                setTasks(tasks.map(t => t.id === newTask.id ? newTask : t));
                setFilteredTasks(filteredTasks.map(t => t.id === newTask.id ? newTask : t));
            } else {
                await taskService.add(newTask);
                setTasks([...tasks, newTask]);
                setFilteredTasks([...filteredTasks, newTask]);
            }
        } catch (error) {
            console.error("Error updating/adding task:", error);
        }
        setShowModal(false);
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    const handleEdit = (task: GetListTaskResponse) => {
        setEditTask(task);
        setShowModal(true);
    };

    const handleDelete = async (task: GetListTaskResponse) => {
        const deleteRequest: DeleteTaskRequest = {
            id: task.id
        };
        await taskService.delete(deleteRequest);
        setTasks(tasks.filter(t => t.id !== task.id));
        setFilteredTasks(filteredTasks.filter(t => t.id !== task.id));
    };

    const handleAddNew = () => {
        setEditTask(null);
        setShowModal(true);
    };

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        if (name === "sortField") {
            if (value === "createdDate" || value === "title") {
                setFilter({ ...filter, sortField: value, sortOrder: "asc" });
            } else {
                const [field, order] = value.split("_");
                setFilter({ ...filter, sortField: field, sortOrder: order });
            }
        } else {
            setFilter({ ...filter, [name]: value });
        }
    };

    const filterTasks = (tasks: GetListTaskResponse[], filter: any) => {
        let filtered = tasks;

        if (filter.search) {
            filtered = filtered.filter(task =>
                task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
                task.description.toLowerCase().includes(filter.search.toLowerCase()) ||
                task.status.toLowerCase().includes(filter.search.toLowerCase())
            );
        }

        if (filter.startDate) {
            filtered = filtered.filter(task =>
                new Date(task.createdDate) >= new Date(filter.startDate)
            );
        }

        if (filter.endDate) {
            filtered = filtered.filter(task =>
                new Date(task.createdDate) <= new Date(filter.endDate)
            );
        }

        filtered.sort((a, b) => {
            if (filter.sortField === 'createdDate') {
                return filter.sortOrder === 'asc'
                    ? new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
                    : new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime();
            } else if (filter.sortField === 'title') {
                const fieldA = (a.title || '').toLowerCase();
                const fieldB = (b.title || '').toLowerCase();
                return filter.sortOrder === 'asc' ? fieldA.localeCompare(fieldB) : fieldB.localeCompare(fieldA);
            }
            return 0;
        });

        setFilteredTasks(filtered);
    };

    return (
        <div className="container taskingSystem">
            <div className="task-form">
                <Button onClick={handleAddNew} className="btn btn-primary mb-3">
                    Yeni Görev Ekle
                </Button>
                <div className="filter-container">
                    <input type="text" name="search" placeholder="Başlık veya Açıklama ile Ara..."
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
                        <option value="title_asc">Başlığa Göre (Z'den A'ya)</option>
                        <option value="title_desc">Başlığa Göre (A'dan Z'ye)</option>
                    </select>
                </div>
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>{editTask ? "Görevi Düzenle" : "Görev Oluştur"}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Formik
                            initialValues={{
                                title: editTask?.title || "",
                                description: editTask?.description || "",
                                status: editTask?.status || "",
                                createdDate: editTask?.createdDate || "",
                            }}
                            validationSchema={validationSchema}
                            onSubmit={onSubmit}
                            enableReinitialize
                        >
                            {({ touched, errors }) => (
                                <Form>
                                    <div className="form-group">
                                        <label htmlFor="title">Görev Başlığı:</label>
                                        <Field
                                            type="text"
                                            name="title"
                                            id="title"
                                            className={
                                                "form-control" +
                                                (errors.title && touched.title ? " is-invalid" : "")
                                            }
                                        />
                                        <ErrorMessage
                                            name="title"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="description">Görev Açıklaması:</label>
                                        <Field
                                            as="textarea"
                                            name="description"
                                            id="description"
                                            rows="2"
                                            className={
                                                "form-control" +
                                                (errors.description && touched.description
                                                    ? " is-invalid"
                                                    : "")
                                            }
                                        />
                                        <ErrorMessage
                                            name="description"
                                            component="div"
                                            className="invalid-feedback"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="status">Görev Durumu:</label>
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

                                    <Button type="submit" className="btn btn-primary">
                                        {editTask ? "Güncelle" : "Kaydet"}
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </Modal.Body>
                </Modal>
            </div>

            <div className="task-list">
                <h2>Görevler</h2>
                <ul>
                    {filteredTasks
                        .slice(
                            (currentPage - 1) * tasksPerPage,
                            currentPage * tasksPerPage
                        )
                        .map((task, index) => (
                            <li key={index} className="task-item">
                                <h3>{task.title}</h3>
                                <p>Açıklama: {task.description}</p>
                                <p>Durum: {task.status}</p>
                                <p>Oluşturulma Tarihi: {new Date(task.createdDate).toLocaleString()}</p>
                                <div className="task-actions">
                                    <FaEdit onClick={() => handleEdit(task)} className="action-icon" />
                                    <FaTrash onClick={() => handleDelete(task)} className="action-icon" />
                                </div>
                            </li>
                        ))}
                </ul>

                <div className="pagination">
                    {filteredTasks.length > tasksPerPage && (
                        <ul className="pagination-list">
                            {Array.from(
                                { length: Math.ceil(filteredTasks.length / tasksPerPage) },
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

export default TaskingSystem;
