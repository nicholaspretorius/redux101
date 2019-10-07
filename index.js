// library code

// function createStore(reducer) {
//   let state;
//   let listeners = [];

//   const getState = () => state;

//   const subscribe = listener => {
//     listeners.push(listener);
//     return () => {
//       listeners = listeners.filter(l => l !== listener);
//     };
//   };

//   const dispatch = action => {
//     state = reducer(state, action);
//     listeners.forEach(listener => listener()); // invoke all the listeners
//   };

//   return {
//     getState,
//     subscribe,
//     dispatch
//   };
// }

// app code: dev writes reducer function

function generateId() {
  return (
    Math.random()
      .toString(36)
      .substring(2) + new Date().getTime().toString(36)
  );
}

function createRemoveButton(onClick) {
  const removeBtn = document.createElement("button");
  removeBtn.innerHTML = "X";
  removeBtn.addEventListener("click", onClick);
  return removeBtn;
}

const logger = store => next => action => {
  console.group(action.type);
  console.log("The action: ", action);
  const result = next(action);
  console.log("The result: ", store.getState());
  console.groupEnd();
  return result;
};

// return return pattern is 'currying', next is calls next middleware or dispatch
// using ES6
const checker = store => next => action => {
  if (action.type === ADD_TODO && action.todo.name.toLowerCase().includes("bitcoin")) {
    return alert("Nope, that's a bad idea");
  }

  if (action.type === ADD_GOAL && action.goal.name.toLowerCase().includes("bitcoin")) {
    return alert("Nope, that's a worse idea");
  }

  return next(action);
};

// function checker(store) {
//   return function(next) {
//     return function(action) {
//       if (action.type === ADD_TODO && action.todo.name.toLowerCase().includes("bitcoin")) {
//         return alert("Nope, that's a bad idea");
//       }

//       if (action.type === ADD_GOAL && action.goal.name.toLowerCase().includes("bitcoin")) {
//         return alert("Nope, that's a worse idea");
//       }

//       return next(action);
//     };
//   };
// }

// function addTodoToDom(todo) {
//   const node = document.createElement("li");
//   const text = document.createTextNode(todo.name);
//   node.appendChild(text);
//   node.classList.add(todo.id);
//   node.style.textDecoration = todo.complete ? "line-through" : "none";
//   node.addEventListener("click", toggleTodo);

//   const removeBtn = createRemoveButton(() => {
//     store.dispatch(removeTodoAction(todo.id));
//   });

//   node.appendChild(removeBtn);

//   document.getElementById("todos").appendChild(node);
// }

// function addGoalToDom(goal) {
//   const node = document.createElement("li");
//   const text = document.createTextNode(goal.name);
//   node.appendChild(text);
//   node.classList.add(goal.id);

//   const removeBtn = createRemoveButton(() => {
//     store.dispatch(removeGoalAction(goal.id));
//   });

//   node.appendChild(removeBtn);

//   document.getElementById("goals").appendChild(node);
// }

const ADD_TODO = "ADD_TODO";
const REMOVE_TODO = "REMOVE_TODO";
const TOGGLE_TODO = "TOGGLE_TODO";
const ADD_GOAL = "ADD_GOAL";
const REMOVE_GOAL = "REMOVE_GOAL";
const RECEIVE_DATA = "RECEIVE_DATA";

// action creators
function addTodoAction(todo) {
  return {
    type: ADD_TODO,
    todo
  };
}

function removeTodoAction(id) {
  return {
    type: REMOVE_TODO,
    id
  };
}

function toggleTodoAction(id) {
  return {
    type: TOGGLE_TODO,
    id
  };
}

function addGoalAction(goal) {
  return {
    type: ADD_GOAL,
    goal
  };
}

function removeGoalAction(id) {
  return {
    type: REMOVE_GOAL,
    id
  };
}

function receiveDataAction(todos, goals) {
  return {
    type: RECEIVE_DATA,
    todos,
    goals
  };
}

// reducers
function todos(state = [], action) {
  switch (action.type) {
    case ADD_TODO:
      return state.concat([action.todo]); // is pure since concat returns a new array not a mutated array.
    case REMOVE_TODO:
      return state.filter(todo => todo.id !== action.id);
    case TOGGLE_TODO:
      return state.map(todo =>
        todo.id !== action.id ? todo : Object.assign({}, todo, { complete: !todo.complete })
      );
    case RECEIVE_DATA:
      return action.todos;
    default:
      return state;
  }
}

function goals(state = [], action) {
  switch (action.type) {
    case ADD_GOAL:
      return state.concat([action.goal]);
    case REMOVE_GOAL:
      return state.filter(goal => goal.id !== action.id);
    case RECEIVE_DATA:
      return action.goals;
    default:
      return state;
  }
}

function loading(state = true, action) {
  switch (action.type) {
    case RECEIVE_DATA:
      return false;
    default:
      return state;
  }
}

// function app(state = {}, action) {
//   return {
//     todos: todos(state.todos, action),
//     goals: goals(state.goals, action)
//   };
// }

const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
    loading
  }),
  Redux.applyMiddleware(logger, checker)
);

// store.subscribe(() => {
//   // console.log("Update state: ", store.getState());
//   const { todos, goals } = store.getState();

//   //   document.getElementById("todos").innerHTML = "";
//   //   document.getElementById("goals").innerHTML = "";

//   //   todos.forEach(addTodoToDom);
//   //   goals.forEach(addGoalToDom);
// });

// function addTodo() {
//   const input = document.getElementById("todo");
//   const name = input.value;

//   if (name === "") return;
//   input.value = "";
//   store.dispatch(
//     addTodoAction({
//       id: generateId(),
//       name: name,
//       complete: false
//     })
//   );
// }

// function addGoal() {
//   const input = document.getElementById("goal");
//   const name = input.value;
//   if (name === "") return;
//   input.value = "";
//   store.dispatch(
//     addGoalAction({
//       id: generateId(),
//       name: name,
//       complete: false
//     })
//   );
// }

// function toggleTodo(event) {
//   store.dispatch(toggleTodoAction(event.target.className));
// }

// document.getElementById("todoBtn").addEventListener("click", addTodo);
// document.getElementById("goalBtn").addEventListener("click", addGoal);

// store.dispatch(
//   addTodoAction({
//     id: 2,
//     name: "Learn TDD",
//     complete: false
//   })
// );

// store.dispatch(
//   addTodoAction({
//     id: 3,
//     name: "Learn Java",
//     complete: false
//   })
// );

// store.dispatch(toggleTodoAction(1));
// store.dispatch(removeTodoAction(3));

// store.dispatch(
//   addGoalAction({
//     id: 1,
//     name: "Apply for Automattic post",
//     complete: false
//   })
// );

// store.dispatch(
//   addGoalAction({
//     id: 2,
//     name: "Complete Udacity React Nanodegree",
//     complete: false
//   })
// );

// const unsubscibe = store.subscribe(() => {
//   console.log("Update state again: ", store.getState());
// });

// unsubscribe();
