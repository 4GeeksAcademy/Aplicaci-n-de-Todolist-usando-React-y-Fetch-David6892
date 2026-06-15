import { useEffect, useState } from "react";

export default function Home() {
  const USERNAME = "David_G";
  const API_URL = `https://playground.4geeks.com/todo/users/${USERNAME}`;

  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState("");

  // Obtener tareas del servidor
  const getTodos = async () => {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Error al obtener las tareas");
      }

      const data = await response.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error(error);
    }
  };

  // Crear usuario si no existe
  const createUser = async () => {
    try {
      await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Cargar tareas al iniciar
  useEffect(() => {
    const initialize = async () => {
      await createUser();
      await getTodos();
    };

    initialize();
  }, []);

  // Agregar tarea
  const addTask = async (e) => {
    if (e.key !== "Enter" || task.trim() === "") return;

    try {
      const response = await fetch(`${API_URL}/todos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          label: task,
          is_done: false,
        }),
      });

      if (!response.ok) {
        throw new Error("Error al agregar la tarea");
      }

      setTask("");
      await getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  // Eliminar una tarea
  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/todos/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Error al eliminar la tarea");
      }

      await getTodos();
    } catch (error) {
      console.error(error);
    }
  };

  // Eliminar todas las tareas
  const clearAllTasks = async () => {
    try {
      await Promise.all(
        todos.map((todo) =>
          fetch(`${API_URL}/todos/${todo.id}`, {
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

      <ul
        style={{
          listStyle: "none",
          padding: 0,
          marginTop: "20px",
        }}
      >
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
                cursor: "pointer",
                padding: "5px 10px",
              }}
            >
              X
            </button>
          </li>
        ))}
      </ul>

      <p>
        {todos.length} tarea{todos.length !== 1 ? "s" : ""} pendiente
        {todos.length !== 1 ? "s" : ""}
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