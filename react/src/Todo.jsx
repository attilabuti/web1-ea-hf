import React, { useState } from 'react';

import './Todo.css';

function Todo() {
    const [todos, setTodos] = useState([]);
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = e => {
        setInputValue(e.target.value);
    };

    const addTodo = e => {
        e.preventDefault();

        if (!inputValue.trim()) {
            return;
        }

        const newTodo = {
            id: Date.now(),
            text: inputValue,
            completed: false,
        };

        setTodos([...todos, newTodo]);
        setInputValue('');
    };

    const toggleComplete = id => {
        setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
    };

    const deleteTodo = id => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    return (
        <div className="todo">
            <h2 className="text-center">TODO</h2>

            <div className="todo-form">
                <form onSubmit={addTodo}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        placeholder="Új teendő..."
                    />

                    <button className="save" type="submit">Hozzáadás</button>
                </form>
            </div>

            <h3>Teendők</h3>

            <ul>
                {todos.map(todo => (
                    <li key={todo.id}>
                        <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>{todo.text}</span>

                        <div className="buttons">
                            <button className="todo-done" onClick={() => toggleComplete(todo.id)}>
                                {todo.completed ? 'Visszavonás' : 'Kész'}
                            </button>

                            <button className="todo-delete" onClick={() => deleteTodo(todo.id)}>Törlés</button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Todo;
