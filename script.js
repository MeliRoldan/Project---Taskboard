const modal = document.getElementById('modal');
const modalForm = document.getElementById('modalForm');
const closeModal = document.getElementById('closeModal');
const editTitle = document.getElementById('editTitle');
const editDescription = document.getElementById('editDescription');

class User {
    #password
    constructor(username, email, password) {
        this.username = username;
        this.email = email;
        this.#password = password;
        this.tasks = [];
    }

    validatePassword(password) {
        return this.#password === password;
    }

    save() {
        localStorage.setItem(this.username, JSON.stringify(this.tasks));
    }

    fetch() {
        const savedTasks = localStorage.getItem(this.username);
        if(savedTasks) {
            this.tasks = JSON.parse(savedTasks);
        }
    }
}

class Task {
    constructor(title, description) {
        this.title = title;
        this.description = description;
        this.status = 'todo';
    }
}

class TaskManager {
    constructor() {
        this.currentUser = null;
        this.currentTask = null;
        this.usersArr = [];
    }

    register(username, email, password) {
        const exsistingUser = this.usersArr.find(user => user.email === email);
        if(exsistingUser) {
            alert("User already exists! Please log in.");
            return;
        }

        const newUser = new User(username, email, password);
        this.usersArr.push(newUser);
        alert('You are succesfully registered! Please log in.');
    }

    login(email, password) {
        const validatedUser = this.usersArr.find(user => user.email === email);
        if(validatedUser && validatedUser.validatePassword(password)) {
            this.currentUser = validatedUser;
            document.getElementById('authPage').style.display = 'none';
            document.getElementById('taskboard').style.display = 'block';
            document.getElementById('greeting').innerHTML = 'Hello, ' + validatedUser.username + '!';
            this.currentUser.fetch();
            this.loadTasks();
        } else {
            alert("Incorrect email or password. Try again.");
        }
    }

    addTask(title, description) {
        const newTask = new Task(title, description);
        this.currentUser.tasks.push(newTask);
        this.currentUser.save();
        this.loadTasks();
    }

    editTask(index) {
        this.currentTask = index;
        const task = this.currentUser.tasks[index];
        modal.style.display = 'flex';
        editTitle.value = task.title;
        editDescription.value = task.description;
    }

    moveTask(index, status) {
        this.currentUser.tasks[index].status = status;
        this.currentUser.save();
        this.loadTasks();
    }

    loadTasks() {
        const taskListing = {
            todo: document.getElementById('todoUl'),
            inprogress: document.getElementById('progressUL'),
            done: document.getElementById('doneUl')
        }

        for (let tasks in taskListing) {
            taskListing[tasks].innerHTML = "";
        }

        this.currentUser.tasks.forEach((task, index) => {
            const task_li = document.createElement('li');
            task_li.className = `task ` + (task.status === 'done' ? 'done' : '');
            task_li.innerHTML = `<span>
                <h2>${task.title}</h2>
                <span id="icons">
                </span>
            </span>
            <p>${task.description}</p>`;

            if(task.status !== 'done') {
                const btnIcons = task_li.querySelector('#icons');
                btnIcons.innerHTML = `<img id="edit" class="edit" width="20" height="20" src="https://img.icons8.com/windows/20/edit--v1.png" alt="edit--v1"/>
                    ${task.status !== 'inprogress' ? `<img id="toProgress" class="toProgress" width="20" height="20" src="https://img.icons8.com/ios-filled/20/loading.png" alt="loading"/>` : ''}
                    <img id="toDone" class="toDone" width="20" height="20" src="https://img.icons8.com/material-two-tone/20/checkmark--v2.png" alt="checkmark--v2"/>
                `;

                btnIcons.querySelector('#edit').addEventListener('click', () => this.editTask(index));

                const toProgressBtn =  btnIcons.querySelector('#toProgress');
                if(toProgressBtn) {
                    toProgressBtn.addEventListener('click', () => this.moveTask(index, 'inprogress'));
                }

                btnIcons.querySelector('#toDone').addEventListener('click', () => this.moveTask(index, 'done'));
            }

            taskListing[task.status].appendChild(task_li);
        });

        updateIcons();
    }

    logout() {
        this.currentUser = null;
        this.currentTask = null;
        document.getElementById('authPage').style.display = 'flex';
        document.getElementById('taskboard').style.display = 'none';
    }
}

const taskManager = new TaskManager();

document.getElementById('regForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('userName').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    taskManager.register(username, email, password);
    document.getElementById('userName').value = '';
    document.getElementById('regEmail').value = '';
    document.getElementById('regPassword').value = '';
})

document.getElementById('logForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    taskManager.login(email, password);
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
})

document.getElementById('taskForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const itemTitle = document.getElementById('itemTitle').value;
    const itemDescription = document.getElementById('itemDescription').value;
    taskManager.addTask(itemTitle, itemDescription);
})

modalForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const taskIndex = taskManager.currentTask;
    const task = taskManager.currentUser.tasks[taskIndex];
    task.title = editTitle.value;
    task.description = editDescription.value;
    taskManager.currentUser.save();
    taskManager.loadTasks();
    modal.style.display = 'none';
})

closeModal.addEventListener('click', (event) => {
    event.preventDefault();
    modal.style.display = 'none';
})

document.getElementById('logoutBtn').addEventListener('click', function(event) {
    event.preventDefault();
    taskManager.logout();
})

document.addEventListener('DOMContentLoaded', function() {
    const toggleSwitch = document.getElementById('toggle');
    const formContainer = document.getElementById('formContainer');

    function toggleTheme() {
      document.body.classList.toggle('dark-mode');
      formContainer.classList.toggle('dark-mode');
      
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(link => {
        link.classList.toggle('dark-text');
      });

      updateIcons();
    }

    toggleSwitch.addEventListener('change', toggleTheme);
});

function  updateIcons () {
    const iconImages = document.querySelectorAll('#icons img');
    const isDarkMode = document.body.classList.contains('dark-mode');

    iconImages.forEach(img => {
        switch (img.className) {
            case 'edit':
                img.src = isDarkMode
                    ? 'https://img.icons8.com/ios-glyphs/30/FFFFFF/edit--v1.png'
                    : 'https://img.icons8.com/windows/20/edit--v1.png';
                break;
            case 'toProgress':
                img.src = isDarkMode
                    ? 'https://img.icons8.com/ios-filled/20/FFFFFF/loading.png'
                    : 'https://img.icons8.com/ios-filled/20/loading.png';
                break;
            case 'toDone':
                img.src = isDarkMode
                    ? 'https://img.icons8.com/ios-glyphs/30/FFFFFF/checkmark--v1.png'
                    : 'https://img.icons8.com/material-two-tone/20/checkmark--v1.png';
                break;
        }
    });

    const accBtns = document.querySelectorAll('#accBtns img');
    accBtns.forEach(icon => {
        console.log(icon)
        switch (icon.className) {
            case 'logoutBtn':
                icon.src = isDarkMode
                    ? 'https://img.icons8.com/external-regular-kawalan-studio/24/FFFFFF/external-logout-shopping-e-commerce-regular-kawalan-studio.png'
                    : 'https://img.icons8.com/external-thin-kawalan-studio/24/external-logout-social-media-thin-kawalan-studio-2.png';
                break;
            case 'accIcon':
                icon.src = isDarkMode
                    ? 'https://img.icons8.com/windows/25/FFFFFF/user.png'
                    : 'https://img.icons8.com/windows/25/user.png';
                break;
        }
    });
};