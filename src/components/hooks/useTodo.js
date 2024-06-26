import { useState } from "react";
import { db } from "@/firebase";
import {
    collection,
    query,
    doc,
    getDocs,
    addDoc,
    updateDoc,
    deleteDoc,
    orderBy,
    where,
    getDoc,
    Timestamp
} from "firebase/firestore";

export const useTodo = (data) => {

    // DB의 todos 컬렉션 참조를 만듭니다. 컬렉션 사용시 잘못된 컬렉션 이름 사용을 방지합니다.
    const todoCollection = collection(db, "todos");
    const [todos, setTodos] = useState([]);

    const getTodos = async () => {
        if (!data) return;
        // Firestore 쿼리를 만듭니다.
        // const q = query(collection(db, "todos"), where("user", "==", user.uid));
        const q = query(todoCollection, where("name", "==", data.user.name), orderBy("createdAt", "asc"));

        // Firestore 에서 할 일 목록을 조회합니다.
        const results = await getDocs(q);
        const newTodos = [];

        // 가져온 할 일 목록을 newTodos 배열에 담습니다.
        results.docs.forEach((doc) => {
            // console.log(doc.data());
            // id 값을 Firestore 에 저장한 값으로 지정하고, 나머지 데이터를 newTodos 배열에 담습니다.
            newTodos.push({ id: doc.id, ...doc.data(), createdAt: doc.data().createdAt.toDate() });
        });

        setTodos(newTodos);
    };

    // addTodo 함수는 입력값을 이용하여 새로운 할 일을 목록에 추가하는 함수입니다.
    const addTodo = async (input) => {
        // 입력값이 비어있는 경우 함수를 종료합니다.
        if (input.trim() === "") return;

        // 유저 name이 없는 경우 함수를 종료합니다. 
        if (!data?.user?.name) return;
        // 기존 할 일 목록에 새로운 할 일을 추가하고, 입력값을 초기화합니다.
        // {
        //   id: 할일의 고유 id,
        //   text: 할일의 내용,
        //   completed: 완료 여부,
        // }
        // ...todos => {id: 1, text: "할일1", completed: false}, {id: 2, text: "할일2", completed: false}}, ..

        const createdAt = new Date()
        // Firestore 에 추가한 할 일을 저장합니다.
        const docRef = await addDoc(todoCollection, {
            name: data.user.name,
            text: input,
            createdAt,
            completed: false,
        });

        setTodos([...todos, { id: docRef.id, text: input, completed: false, createdAt }]);
    }

    const toggleTodo = (id) => {
        // 할 일 목록에서 해당 id를 가진 할 일의 완료 상태를 반전시킵니다.
        const updatedTodo = todos.map((todo) => {
            if (todo.id === id && todo.name === data.user.name) {
                // Firestore 에서 해당 id를 가진 할 일을 찾아 완료 상태를 업데이트합니다.
                const todoDoc = doc(todoCollection, id);
                updateDoc(todoDoc, { completed: !todo.completed });
                // ...todo => id: 1, text: "할일1", completed: false
                return { ...todo, completed: !todo.completed };
            } else {
                return todo;
            }
        })

        setTodos(updatedTodo);
    };

    // deleteTodo 함수는 할 일을 목록에서 삭제하는 함수입니다.
    const deleteTodo = (id) => {
        const todoDoc = doc(todoCollection, id);
        const todoToDelete = todos.find((todo) => todo.id === id)
        if (todoToDelete.name === data.user.name) {
            deleteDoc(todoDoc);
        }
        // 해당 id를 가진 할 일을 제외한 나머지 목록을 새로운 상태로 저장합니다.
        // setTodos(todos.filter((todo) => todo.id !== id));
        setTodos(
            todos.filter((todo) => {
                return todo.id !== id;
            })
        );
    };

    const hideCompletedTodo = () => {
        if (todos.find((a) => a.completed)) {
            const incompleteTodos = todos.filter((a) => !a.completed)
            setTodos(incompleteTodos)
        } else {
            getTodos()
        }
    }

    return {
        todos,
        getTodos,
        addTodo,
        toggleTodo,
        deleteTodo,
        hideCompletedTodo,
    }
}
