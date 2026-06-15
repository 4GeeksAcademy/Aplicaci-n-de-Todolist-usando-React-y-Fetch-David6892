import { useEffect, useState } from "react";

export default function Home() {
  const USERNAME = "David6892";

  const API_URL = `https://playground.4geeks.com/todo/users/${USERNAME}`;
  const TODOS_URL = `https://playground.4geeks.com/todo/todos`;

  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  
  const getTodos = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        setTodos([]);
        return;
      }

      const data = await response.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error(error);
    }
  };

  
  useEffect(() => {
    getTodos();
  }, []);

  
  const addTask = async (e) => {
    if (e.key !== "Enter" || task.trim() === "") return;

    try {
      await fetch(`${TODOS_URL}/${USERNAME}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: task,
          is_done: false,
        }),
      });

      setTask("");
      await getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  
  const deleteTask = async (id) => {
    try {
      await fetch(`${TODOS_URL}/${id}`, {
        method: "DELETE",
      });

      await getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  
  const clearAllTasks = async () => {
    try {
      await Promise.all(
        todos.map((todo) =>
          fetch(`${TODOS_URL}/${todo.id}`, {
            method: "DELETE",
          })
        )
      );

      await getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "40px auto",
        textAlign: "center",
      }}
    >
      <h1>Todo List</h1>

      <input
        type="text"
        placeholder="Escribe una tarea y pulsa Enter"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        onKeyDown={addTask}
        style={{
          width: "100%",
          padding: "10px",
          fontSize: "16px",
        }}
      />

      <ul style={{ listStyle: "none", padding: 0, marginTop: "20px" }}>
        {todos.map((todo) => (
          <li
            key={todo.id}
            style={{
              display: "flex",
              justifyContent: "space-between",
              padding: "10px",
              borderBottom: "1px solid #ddd",
            }}
          >
            <span>{todo.label}</span>

            <button
              onClick={() => deleteTask(todo.id)}
              style={{
                background: "red",
                color: "white",
                border: "none",
                padding: "5px 10px",
                cursor: "pointer",
              }}
            >
              X
            </button>
          </li>
        ))}
      </ul>

      <p>
        {todos.length} tarea{todos.length !== 1 ? "s" : ""} pendiente
      </p>

      <button
        onClick={clearAllTasks}
        style={{
          marginTop: "10px",
          padding: "10px 20px",
          background: "#333",
          color: "white",
          border: "none",
          cursor: "pointer",
        }}
      >
        Limpiar todas las tareas
      </button>
    </div>
  );
}