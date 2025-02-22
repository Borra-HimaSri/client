import React, { useState } from "react";
import useGetData from "../api/usegetData";
import "./About.css"; // Import the CSS file

const About = () => {
    const { data, loading, error, postData, updateData, deleteData } = useGetData(
        process.env.REACT_APP_BACKEND_SERVER_URL
    );

    const [task, setTask] = useState({
        title: "",
        description: "",
        status: "pending",
    });

    const [editingTask, setEditingTask] = useState(null); // Track the task being edited
    const [searchTerm, setSearchTerm] = useState(""); // State for search term
    const [deleting, setDeleting] = useState(false); // State to track deletion progress

    const handleChange = (e) => {
        setTask({ ...task, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (editingTask) {
            // If editing, call updateData
            await updateData(editingTask._id, task);
            setEditingTask(null); // Reset editing state
        } else {
            // If not editing, call postData
            await postData(task);
        }
        setTask({ title: "", description: "", status: "pending" }); // Reset form
    };

    const handleEdit = (task) => {
        setEditingTask(task); // Set the task to be edited
        setTask({ title: task.title, description: task.description, status: task.status }); // Populate form with task data
    };

    const handleDelete = async (id) => {
        setDeleting(true); // Set deleting state to true
        await deleteData(id); // Delete the task
        setDeleting(false); // Reset deleting state
    };

    // Filter tasks based on search term
    const filteredTasks = data.filter((task) => {
        return (
            task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            task.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <div className="container">
            <h1>About</h1>
            <p>This is the about page</p>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Add/Edit Task Form */}
            <h2>{editingTask ? "Edit Task" : "Add a Task"}</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    value={task.title}
                    onChange={handleChange}
                    placeholder="Task Title"
                    required
                />
                <input
                    type="text"
                    name="description"
                    value={task.description}
                    onChange={handleChange}
                    placeholder="Task Description"
                    required
                />

                {/* Status Dropdown */}
                <select name="status" value={task.status} onChange={handleChange} required>
                    <option value="pending">Pending</option>
                    <option value="in progress">In Progress</option>
                    <option value="completed">Completed</option>
                </select>

                <button type="submit">{editingTask ? "Update Task" : "Add Task"}</button>
                {editingTask && (
                    <button type="button" onClick={() => setEditingTask(null)}>
                        Cancel Edit
                    </button>
                )}
            </form>

            {/* Task List */}
            <h2>Tasks:</h2>
            <ul className="task-list">
                {filteredTasks.map((task, index) => (
                    <li key={index}>
                        <strong>Title:</strong> {task.title} <br />
                        <strong>Description:</strong> {task.description} <br />
                        <strong>Status:</strong> {task.status} <br />
                        <button className="edit-button" onClick={() => handleEdit(task)}>
                            Edit
                        </button>
                        <button
                            className="delete-button"
                            onClick={() => handleDelete(task._id)}
                            disabled={deleting}
                        >
                            {deleting ? "Deleting..." : "Delete"}
                        </button>
                        <hr />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default About;