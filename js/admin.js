function cadastrar() {
    let form = document.getElementById('admin-form');
    
    let email = form.email.value;
    let username = form.username.value;
    let date = new Date().toLocaleDateString('pt-BR');

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (users.some(user => user.email === email)) {
        alert('Usuário com este email já cadastrado.');
        return false;
    }
    
    users.push({
        "email": email,
        "username": username,
        "date": date
    });

    let usersJSON = JSON.stringify(users);

    localStorage.setItem('users', usersJSON);

    updateTable();

    return false;
}

function deleteUser(email) {
    let users = JSON.parse(localStorage.getItem('users')) || [];

    users = users.filter(user => user.email !== email);

    localStorage.setItem('users', JSON.stringify(users));

    updateTable();
}

function updateTable(filter = null) {
    let tableBody = document.querySelector('#user-table tbody');

    let users = JSON.parse(localStorage.getItem('users')) || [];

    if (filter !== null) {
        users = users.filter(user => user.username.toLowerCase().includes(filter) || user.email.toLowerCase().includes(filter)|| user.date == filter);   
    }

    let usersHTML = users.map(user => {
        let date = document.createElement('td');
        let email = document.createElement('td');
        let username = document.createElement('td');
        let deleteButton = document.createElement('td');
        let deleteIcon = document.createElement('i');
        let row = document.createElement('tr');

        date.textContent = user.date;
        email.textContent = user.email;
        username.textContent = user.username;

        deleteIcon.className = 'material-symbols-outlined';
        deleteIcon.textContent = 'delete';
        deleteIcon.style.cursor = 'pointer';

        deleteButton.onclick = () => deleteUser(user.email);
        deleteButton.appendChild(deleteIcon);

        row.appendChild(date);
        row.appendChild(email);
        row.appendChild(username);
        row.appendChild(deleteButton);

        return row;
    });

    tableBody.replaceChildren(...usersHTML);
}

window.onload = () => {
    document.getElementById('admin-form').addEventListener('submit', (event) => {
        event.preventDefault();
        cadastrar();
        event.target.reset();
    });
    document.getElementById('clear-form').addEventListener('click', () => {
        document.getElementById('admin-form').reset();
    });
    document.getElementById('delete-all').addEventListener('click', () => {
        if (confirm('Tem certeza que deseja remover todos os usuários?')) {
            localStorage.removeItem('users');
            updateTable();
        }
    });
    document.getElementById('search-button').addEventListener('click', () => {
        let searchValue = document.getElementById('search').value.toLowerCase();
        
        updateTable(searchValue);
    });

    updateTable();
};
