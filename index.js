const form = document.getElementById("form");
form.addEventListener("submit", handleSubmit);

const openModal = document.getElementById("open-modal");
const modal = document.getElementById("modal");
const closeModal = document.getElementById("close-modal");
closeModal.addEventListener("click", () => {
  modal.close();
});

openModal.addEventListener("click", () => {
  modal.showModal();
});

let editUserId = null;
const listado = document.querySelector('#Tabla');
const mockapi = "https://647a6c4ad2e5b6101db057d8.mockapi.io/API";

// Obtener todos los usuarios
async function getAll(url) {
  try {
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);

    listado.innerHTML = '';

    data.forEach(user => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${user.id}</td>
        <td>${user.name}</td>
        <td>${user.email}</td>
        <td>${user.phone}</td>
        <td>
          <button class="eliminar-button" data-id="${user.id}">ELIMINAR</button>
          <button class="editar-button" data-id="${user.id}">EDITAR</button>
        </td>
      `;
      const eliminarButton = row.querySelector(".eliminar-button");
      eliminarButton.addEventListener("click", () => {
        const userId = eliminarButton.getAttribute("data-id");
        deleteOne(userId);
      });

      const editarButton = row.querySelector(".editar-button");
      editarButton.addEventListener("click", () => {
        editUserId = editarButton.getAttribute("data-id");
        abrirModal(user);
      });

      listado.appendChild(row);
    });
  } catch (err) {
    console.error(err);
  }
}

// Eliminar por id
async function deleteOne(id) {
  try {
    const response = await fetch(mockapi + `/${id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    console.log(data);
    getAll(mockapi);
  } catch (err) {
    console.error(err);
  }
}

// Agregar usuario
async function addOne(user) {
  try {
    const response = await fetch(mockapi, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    console.log(data);
    return data;
  } catch (err) {
    console.error(err);
    throw err;
  }
}

async function verificarExisteUsuario(user) {
  try {
    const response = await fetch(mockapi + `?name=${user.name}`);
    const data = await response.json();

    if (data.length > 0) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.error(err);
    return false;
  }
}

// Actualizar por id
async function updateOne(id, user) {
  try {
    const response = await fetch(mockapi + `/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    });
    const data = await response.json();
    console.log(data);
    getAll(mockapi);
  } catch (err) {
    console.error(err);
  }
}

// Manejo envío del formulario
async function handleSubmit(event) {
  event.preventDefault();

  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  const user = {
    name: fullNameInput.value,
    email: emailInput.value,
    phone: phoneInput.value
  };

  try {
    if (editUserId) {
      await updateOne(editUserId, user);
      alert("Usuario actualizado correctamente");
    } else {
      const existingUser = await verificarExisteUsuario(user);
      if (existingUser) {
        alert("El usuario ya existe");
      } else {
        const newUser = await addOne(user);
        if (newUser) {
          alert("Usuario agregado correctamente");
        }
      }
    }

    modal.close();
    editUserId = null;

    await getAll(mockapi);
  } catch (err) {
    console.error(err);
  }
}

// Abrir modal para agregar o editar
function abrirModal(user) {
  const fullNameInput = document.getElementById("fullName");
  const emailInput = document.getElementById("email");
  const phoneInput = document.getElementById("phone");

  const userToEdit = user;

  if (userToEdit) {
    fullNameInput.value = userToEdit.name;
    emailInput.value = userToEdit.email;
    phoneInput.value = userToEdit.phone;
  } else {
    fullNameInput.value = "";
    emailInput.value = "";
    phoneInput.value = "";
  }

  modal.showModal();
}

getAll(mockapi);
