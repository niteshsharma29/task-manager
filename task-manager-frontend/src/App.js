import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';  

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    status: 'To Do'
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');  
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/tasks', newTask);  
      setTasks([...tasks, response.data]);
      setNewTask({ title: '', description: '', status: 'To Do' });
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  const handleStatusChange = async (taskId, status) => {
    try {
      const response = await axios.patch(`/api/tasks/${taskId}`, { status });  
      const updatedTasks = tasks.map(task => task._id === taskId ? response.data : task);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  const handleDelete = async (taskId) => {
    try {
      await axios.delete(`/api/tasks/${taskId}`); 
      const updatedTasks = tasks.filter(task => task._id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="App">
      <header>
        <h1>Task Manager</h1>
      </header>

      <div className="task-form">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="title"
            placeholder="Enter task title"
            value={newTask.title}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="description"
            placeholder="Enter task description"
            value={newTask.description}
            onChange={handleInputChange}
          />
          <select name="status" value={newTask.status} onChange={handleInputChange}>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </select>
          <button type="submit">Add Task</button>
        </form>
      </div>

      <div className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks found. Add a new task above.</p>
        ) : (
          tasks.map(task => (
            <div key={task._id} className="task-card">
              <h3>{task.title}</h3>
              <p>{task.description}</p>
              <p>Status: {task.status}</p>
              <div className="button-group">
                <button className="status-btn todo" onClick={() => handleStatusChange(task._id, 'To Do')}>To Do</button>
                <button className="status-btn in-progress" onClick={() => handleStatusChange(task._id, 'In Progress')}>In Progress</button>
                <button className="status-btn done" onClick={() => handleStatusChange(task._id, 'Done')}>Done</button>
                <button className="delete-btn" onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default App;
