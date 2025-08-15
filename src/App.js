import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3000/tasks';

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get(API_URL);
        setTasks(response.data);
      } catch (err) {
        setError('Error al cargar las tareas.');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      const newTask = { title: newTaskTitle, description: newTaskDescription };
      const response = await axios.post(API_URL, newTask);
      setTasks([...tasks, response.data]);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (err) {
      setError('Error al crear la tarea.');
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`${API_URL}/${taskId}`);
      setTasks(tasks.filter(task => task.id !== taskId));
    } catch (err) {
      setError('Error al eliminar la tarea.');
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setNewTaskTitle(task.title);
    setNewTaskDescription(task.description);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const updatedTask = {
        title: newTaskTitle,
        description: newTaskDescription,
        status: editingTask.status,
        priority: editingTask.priority
      };
      const response = await axios.put(`${API_URL}/${editingTask.id}`, updatedTask);
      setTasks(tasks.map(task => (task.id === editingTask.id ? response.data : task)));
      setEditingTask(null);
      setNewTaskTitle('');
      setNewTaskDescription('');
    } catch (err) {
      setError('Error al actualizar la tarea.');
    }
  };

  if (loading) {
    return <div className="loading">Cargando tareas...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="App">
      <h1>Lista de Tareas</h1>
      <form onSubmit={editingTask ? handleUpdateTask : handleCreateTask} className="task-form">
        <input
          type="text"
          placeholder="Título de la tarea"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={newTaskDescription}
          onChange={(e) => setNewTaskDescription(e.target.value)}
        ></textarea>
        <button type="submit">{editingTask ? 'Actualizar Tarea' : 'Añadir Tarea'}</button>
      </form>

      <div className="task-list">
        {tasks.map(task => (
          <div key={task.id} className="task-item">
            <h3>{task.title}</h3>
            <p>{task.description}</p>
            <span className={`status ${task.status}`}>{task.status}</span>
            <div className="task-actions">
              <button onClick={() => handleEditTask(task)}>Editar</button>
              <button onClick={() => handleDeleteTask(task.id)}>Eliminar</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;