const userUrl = "https://appleseed-wa.herokuapp.com/api/users/";
const container = document.querySelector(".container");
let editRow;
let row = document.createElement("tr");
let databaseAllUsers = {};

const getUsers = async () => {
  let callApi = await fetch(userUrl);
  let data = await callApi.json();

  allUsers = await Promise.all(
    data.map(async (u) => {
      let userId = await getId(userUrl + u.id);
      data[u.id].age = userId.age;
      data[u.id].city = userId.city;
      data[u.id].gender = userId.gender;
      data[u.id].hobby = userId.hobby;
      data[u.id].editButton = "Edit";
      data[u.id].deleteButton = "Delete";

      databaseAllUsers[u.id] = data[u.id];
      console.log(databaseAllUsers[u.id]);
    })
  );
};

const getId = async (url) => {
  let id = await fetch(url);
  return await id.json();
};

function createTable(databaseAllUsers) {
  container.innerHTML = "";
  row.innerHTML = `
    <thead>
      <tr>
        <th>Id</th>          
        <th>First Name</th>
        <th>Last Name</th>
        <th>Capsule</th>
        <th>Age</th>
        <th>City</th>
        <th>Gender</th>
        <th>Hobby</th>
      </tr>
    </thead>
    
  `;
  container.appendChild(row);

  for (let user in databaseAllUsers) {
    let row = document.createElement("tr");
    row.innerHTML = `<td data-row="${user}" data-type="id">${databaseAllUsers[user].id}</td>
        <td data-row="${user}" data-type="firstName">${databaseAllUsers[user].firstName}</td>
        <td data-row="${user}" data-type="lastName">${databaseAllUsers[user].lastName}</td>
        <td data-row="${user}" data-type="capsule">${databaseAllUsers[user].capsule}</td>
        <td data-row="${user}" data-type="gender">${databaseAllUsers[user].gender}</td>
        <td data-row="${user}" data-type="age">${databaseAllUsers[user].age}</td>
        <td data-row="${user}" data-type="city">${databaseAllUsers[user].city}</td>
        <td data-row="${user}" data-type="hobby">${databaseAllUsers[user].hobby}</td>
        <button data-row="${user}" class='edit-button'>${databaseAllUsers[user].editButton}</button>
        <button data-row="${user}" class='delete-button'>${databaseAllUsers[user].deleteButton}</button>
        <hr>`;
    container.appendChild(row);
  }
}

container.addEventListener("click", (e) => {
  let userRow = e.target.getAttribute("data-row");
  if (e.target.innerText == "Confirm") {
    confirmRow(userRow, editRow, true);
    createTable(databaseAllUsers);
  }
  if (e.target.innerText == "Edit") {
    editRow = editUserRow(userRow);
    createTable(databaseAllUsers);
  }
  if (e.target.innerText == "Delete") {
    deleteRow(userRow);
    createTable(databaseAllUsers);
  }
  if (e.target.innerText == "Cancel") {
    confirmRow(userRow, editUserRow, false);
    createTable(databaseAllUsers);
  }
});

function deleteRow(row) {
  console.log(databaseAllUsers[row]);
  delete databaseAllUsers[row];
}

function editUserRow(row) {
  let dataOfUser = databaseAllUsers[row];
  databaseAllUsers[row] = {
    id: dataOfUser.id,
    firstName: `<input type="text" data-type="firstName" value="${dataOfUser.firstName}">`,
    lastName: `<input type="text" data-type="lastName" value="${dataOfUser.lastName}">`,
    capsule: `<input type="text" data-type="capsule" value="${dataOfUser.capsule}">`,
    age: `<input type="text" data-type="age" value="${dataOfUser.age}">`,
    city: `<input type="text" data-type="city" value="${dataOfUser.city}">`,
    gender: `<input type="text" data-type="gender" value="${dataOfUser.gender}">`,
    hobby: `<input type="text" data-type="hobby" value="${dataOfUser.hobby}">`,
    editButton: "Confirm",
    deleteButton: "Cancel",
  };
  createTable(databaseAllUsers);
  return dataOfUser;
}

function confirmRow(row, editUserForConfirm, confirm) {
  if (confirm) {
    let inputs = document.querySelectorAll("input");
    let firstInput = true;
    for (let input of inputs) {
      if (!firstInput) {
        if (input.value != input.getAttribute("value")) {
          let type = input.getAttribute("data-type");
          editUserForConfirm[type] = input.value;
        }
      } else firstInput = false;
    }
  }
  databaseAllUsers[row] = editUserForConfirm;
  createTable(databaseAllUsers);
}

const searchFun = () => {
  let filter = document.querySelector("#myInput").value.toUpperCase();
  let tr = container.getElementsByTagName("tr");

  for (let i = 0; i < tr.length; i++) {
    let td = tr[i].getElementsByTagName("td")[1];
    if (td) {
      let textValue = td.textContent || td.innerHTML;
      if (textValue.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
};

document.querySelector("#myInput").addEventListener("input", searchFun);
getUsers().then(() => {
  createTable(databaseAllUsers);
});
