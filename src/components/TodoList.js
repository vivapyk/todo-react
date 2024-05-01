/* 
  할 일 목록을 관리하고 렌더링하는 주요 컴포넌트입니다.
  상태 관리를 위해 `useState` 훅을 사용하여 할 일 목록과 입력값을 관리합니다.
  할 일 목록의 추가, 삭제, 완료 상태 변경 등의 기능을 구현하였습니다.
*/
"use client";

import React, { useState, useEffect } from "react";
import TodoItem from "@/components/TodoItem";
import styles from "@/styles/TodoList.module.css";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useTodo } from "./hooks/useTodo";


// TodoList 컴포넌트를 정의합니다.
const TodoList = () => {
  const { todos, getTodos, addTodo, toggleTodo, deleteTodo, hideCompletedTodo } = useTodo()
  const [input, setInput] = useState("");

  useEffect(() => {
    getTodos();
  }, []);

  // addNewTodo 함수는 입력값을 이용하여 새로운 할 일을 목록에 추가하는 함수입니다.
  const addNewTodo = async () => {
    addTodo(input)
    setInput("");
  };

  // 컴포넌트를 렌더링합니다.
  return (
    <div className={styles.container}>
      <h1>Todo List</h1>
      {/* 할 일을 입력받는 텍스트 필드입니다. */}
      <Input
        type="text"
        className={styles.itemInput}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      {/* 할 일을 추가하는 버튼입니다. */}
      <div className={styles.buttonContainer}>
        <Button onClick={addNewTodo}>
          Add Todo
        </Button>

        <Button onClick={hideCompletedTodo}>
          {todos.find((a) => a.completed) ? 'Hide Finished Todos' : 'View all todos'}
        </Button>
      </div>

      {/* 할 일 목록을 렌더링합니다. */}
      <ul>
        {todos.map((todo) => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={() => toggleTodo(todo.id)}
            onDelete={() => deleteTodo(todo.id)}
          />
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
