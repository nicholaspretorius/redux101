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

const thunk = store => next => action => {
  if (typeof action === "function") {
    return action(store.dispatch);
  }

  return next(action);
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

function handleInitialData() {
  return dispatch => {
    return Promise.all([API.fetchTodos(), API.fetchGoals()])
      .then(([todos, goals]) => {
        dispatch(receiveDataAction(todos, goals));
      })
      .catch(() => alert("An error occurred fetching initial data."));
  };
}

function handleAddTodo(todo, cb) {
  return dispatch => {
    return API.saveTodo(todo)
      .then(item => {
        dispatch(addTodoAction(item));
        cb();
      })
      .catch(() => {
        alert("There was an error adding the item.");
      });
  };
}

// async action creator. returns func
function handleDeleteTodo(todo) {
  return dispatch => {
    dispatch(removeTodoAction(todo.id));

    return API.deleteTodo(todo.id).catch(e => {
      dispatch(addTodoAction(todo));
      alert("There was an error deleting the item.", e);
    });
  };
}

function handleToggleTodo(todo) {
  return dispatch => {
    dispatch(toggleTodoAction(todo.id));
    return API.saveTodoToggle(todo.id).catch(() => {
      dispatch(toggleTodoAction(todo.id));
      alert("There was an error toggling the item.");
    });
  };
}

function handleAddGoal(goal, cb) {
  return dispatch => {
    return API.saveGoal(goal)
      .then(g => {
        dispatch(addGoalAction(g));
        cb();
      })
      .catch(() => {
        alert("There was an error adding the goal.");
      });
  };
}

function handleDeleteGoal(goal) {
  return dispatch => {
    dispatch(removeGoalAction(goal.id));
    return API.deleteGoal(goal.id).catch(() => {
      dispatch(addGoalAction(goal));
      alert("There was an error deleting the goal.");
    });
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

const store = Redux.createStore(
  Redux.combineReducers({
    todos,
    goals,
    loading
  }),
  Redux.applyMiddleware(ReduxThunk.default, logger, checker)
);
