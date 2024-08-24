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
};

const addItem = document.getElementById('addItem');
const textarea = document.getElementById('textarea');
const addbtn = document.getElementById('headerDiv');
const todoUl = document.getElementById('todoUl');
const progressUL = document.getElementById('progressUL');
const doneUl = document.getElementById('doneUl');
const main = document.querySelector('main');

const modal = document.getElementById('modal');
const modalForm = document.getElementById('modalForm');
const closeModal = document.getElementById('closeModal');
const editTitle = document.getElementById('editTitle');
const editDescription = document.getElementById('editDescription');

class Task {
    constructor(title, description, id) {
        this.title = title;
        this.description = description;
        this.id = id;
    }
}

let todoArr = [];
let progressArr = [];
let doneArr = [];

addbtn.addEventListener('submit', function (event) {
    event.preventDefault();
    const title = addItem.value;
    const description = textarea.value;
    const id = Math.floor(Math.random() * 1000);

    todoUl.innerHTML += `
        <li>
            <span>
                <h2>${title}</h2>
                <span id="icons">
                    <img id="${id}" class="edit" width="20" height="20" src="https://img.icons8.com/windows/20/edit--v1.png" alt="edit--v1"/>
                    <img id="${id}" class="toProgress" width="20" height="20" src="https://img.icons8.com/ios-filled/20/loading.png" alt="loading"/>
                    <img class="toDone" width="20" height="20" src="https://img.icons8.com/material-two-tone/20/checkmark--v2.png" alt="checkmark--v2"/>
                </span>
            </span>
            <p>${description}</p>
        </li>
    `
    updateIcons();
    
    const item = new Task(title, description, id);
    todoArr.push(item);
    addItem.value = '';
    textarea.value = '';
})

let currentItem;

todoUl.addEventListener('click', function (event) {
    const target = event.target.id;

    if(event.target.classList.contains('edit')){
        const targetItem = todoArr.find(item => item.id == target);
        currentItem = targetItem;
        editTitle.value = targetItem.title;
        editDescription.value = targetItem.description;
        modal.style.display = 'flex';
    }

    if(event.target.classList.contains('toProgress')){
        const itemIndex = todoArr.findIndex(item => item.id == target);
        const [movedItem] = todoArr.splice(itemIndex, 1);
        progressArr.push(movedItem);
        const li = event.target.closest('li');
        todoUl.removeChild(li);
        progressUL.appendChild(li);
        event.target.style.display = 'none';
    }

    if(event.target.classList.contains('toDone')){
        const itemIndex = todoArr.findIndex(item => item.id == target);
        const [movedItem] = todoArr.splice(itemIndex, 1);
        doneArr.push(movedItem);
        const li = event.target.closest('li');
        todoUl.removeChild(li);
        doneUl.appendChild(li);
        const allIcons = li.querySelectorAll('img');
        const liH2 = li.querySelectorAll('h2');
        const liP = li.querySelectorAll('p');
        allIcons.forEach(icon => icon.style.display = 'none');
        liH2.forEach(h => h.style.textDecoration = 'line-through');
        liP.forEach(p => p.style.textDecoration = 'line-through');
    }
})

progressUL.addEventListener('click', function (event) {
    const target = event.target.id;

    if(event.target.classList.contains('edit')){
        const targetItem = progressArr.find(item => item.id == target);
        
        currentItem = targetItem;
        editTitle.value = targetItem.title;
        editDescription.value = targetItem.description;
        modal.style.display = 'flex';
    }

    if(event.target.classList.contains('toDone')){
        const itemIndex = progressArr.findIndex(item => item.id == target);
        const [movedItem] = progressArr.splice(itemIndex, 1);
        doneArr.push(movedItem);
        const li = event.target.closest('li');
        progressUL.removeChild(li);
        doneUl.appendChild(li);
        const allIcons = li.querySelectorAll('img');
        const liH2 = li.querySelectorAll('h2');
        const liP = li.querySelectorAll('p');
        allIcons.forEach(icon => icon.style.display = 'none');
        liH2.forEach(h => h.style.textDecoration = 'line-through');
        liP.forEach(p => p.style.textDecoration = 'line-through');
    }
})

modalForm.addEventListener('submit', function (event) {
    event.preventDefault();
    currentItem.title = editTitle.value;
    currentItem.description = editDescription.value;
    const li = main.querySelector(`li img[id="${currentItem.id}"]`).closest('li');
    li.querySelector('h2').textContent = currentItem.title;
    li.querySelector('p').textContent = currentItem.description;
    modal.style.display = 'none';
});

closeModal.addEventListener('click', function () {
    modal.style.display = 'none';
});