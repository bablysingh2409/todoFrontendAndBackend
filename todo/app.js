const textArea = document.querySelector('#tasks-details');
const date = document.querySelector('#date');
const category = document.querySelector('#category');
const addButton = document.querySelector('.add');
const ul = document.querySelector('.todos');
const deleteBtn = document.querySelector('.delete');
const error = document.querySelector('#error');

//event handler
(function eventHandler() {
  addButton.addEventListener('click', creatingUser);
  ul.addEventListener('click', handleCheckedEvent);
  deleteBtn.addEventListener('click', handleRemoveEvent);
})();

//on window load
window.addEventListener('load', async (e) => {
  let getData = await getDataFromDataBase();
  renderElement(getData);
});

//validation check
function checkValidation(todo) {
  let { task, date, category } = todo;
  let taskCon = document.querySelector('.text-area');
  let listDateCon = document.querySelector('.list-date-container');
  if (!task) {
    error.textContent = `must fill Description fleld`;
    taskCon.style.borderBottom = '1px solid red';
    return false;
  } else if (!category || category == 'none') {
    error.textContent = `must fill category fleld`;
    listDateCon.style.borderBottom = '1px solid red';
    return false;
  } else if (!date) {
    error.textContent = `must fill date fleld`;
    listDateCon.style.borderBottom = '1px solid red';
    return false;
  } else {
    error.textContent = '';
    taskCon.style.borderBottom = '1px solid #CCD5AE ';
    listDateCon.style.borderBottom = '1px solid #CCD5AE';
    return true;
  }
}

async function creatingUser() {
  let todo = {
    task: textArea.value,
    date: date.value,
    category: category.value,
    completed: false,
  };

  let validationCheck = checkValidation(todo);
  if (!validationCheck) return;
  else {
    await saveDataToDataBase(todo);
    let userData = await getDataFromDataBase();
    renderElement(userData);
  }
}

//saving data to database
async function saveDataToDataBase(data) {
  try {
    let postData = await fetch('http://localhost:3000/user', {
      method: 'POST',
      mode: 'cors',
      body: JSON.stringify(data),
      headers: {
        'content-type': 'application/json; charset=UTF-8',
        Authorization: 'Bearer my-api-key',
      },
    });
    let userData = await postData.json();
    console.log(userData);
  } catch (err) {
    console.log('err occured:', err);
  }
}

//getting data from database
async function getDataFromDataBase() {
  try {
    let res = await fetch('http://localhost:3000/user');
    let userData = await res.json();
    return userData;
  } catch (err) {
    console.log(err);
  }
}

//rendring element which is fetch from database
function renderElement(todos) {
  ul.innerHTML = '';
  todos.forEach((todo, i) => {
    addElementToDom(todo);
  });
}

//creating element
function addElementToDom(todo) {
  const li = document.createElement('li');
  li.innerHTML = `
  <div class="check-label">
    <div class="tasks">
      <input type="checkbox" id=${todo._id} class="check-todo" ${todo.completed ? 'checked' : ''} />
      
      <label for=${todo._id} class="task-details">${todo.task}</label>
    </div>

    <div class="task-date">
      <i class="fa-sharp fa-solid fa-calendar-days"></i><span>${todo.date.slice(0, 10)}</span>
    </div>
  </div>
  <div class="category">
    <button class="category-btn">${todo.category}</button>
  </div>
  `;
  ul.appendChild(li);
  resetApp();
}

//save data on the same id in database
async function updateTheData(data, id) {
  try {
    let postData = await fetch('http://localhost:3000/user/' + id, {
      method: 'PUT',
      mode: 'cors',
      headers: {
        'content-type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(data),
    });
    let res = await postData.json();
    console.log(res);
  } catch (err) {
    console.log('error:', err);
  }
}

//toggle data from database
async function toggleTask(id) {
  try {
    let res = await fetch('http://localhost:3000/user/' + id);
    let data = await res.json();
    data.completed = !data.completed;
    updateTheData(data, id);
  } catch (err) {
    console.log('err occured:', err);
  }
}

//handling the toggling
function handleCheckedEvent(e) {
  let target = e.target;
  if (target.classList.contains('check-todo')) {
    let id = target.getAttribute('id');
    toggleTask(id);
  }
}

//removing the user details
async function removeUser(userData) {
  userData.forEach(async (user) => {
    try {
      if (user.completed) {
        let res = await fetch('http://localhost:3000/user/' + user._id, {
          method: 'DELETE',
          headers: {
            'content-type': 'application/json',
          },
          body: JSON.stringify(user),
        });
        const data = await res.json();
        console.log(data);
      }
    } catch (err) {
      console.log('error occured:', err);
    }
  });
  let newUsers = await getDataFromDataBase();
  renderElement(newUsers);
}

//handling removing event
async function handleRemoveEvent() {
  let userData = await getDataFromDataBase();
  removeUser(userData);
}

//reset element
function resetApp() {
  date.value = '';
  textArea.value = '';
  category.value = '';
}
