const themetoggle = document.getElementById('themetoggle');
const addbtn = document.getElementById('add');
const applybtn = document.getElementById('apply');
const closebtn = document.getElementById('cancel');
const newnotes = document.getElementById('newnotes');
const box = document.getElementById('box');
const body = document.body;
const filterOption = document.querySelector('.filter-todo')
const tasklist = document.getElementById('Tasklist');
const inputnotes = document.getElementById('addnotes');
const savedTheme = localStorage.getItem('theme');
document.addEventListener('DOMContentLoaded', () => {
    loadtasks();
    loadTheme();
});
themetoggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
});
addbtn.addEventListener('click', () => {
    openpopup();

});
closebtn.addEventListener('click', () => {
    closepopup();
});
applybtn.addEventListener('click', addtask);
inputnotes.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addtask();
        closepopup();
    }
});
filterOption.addEventListener('change', function () {
    const notes = tasklist.getElementsByClassName('listitemclass');
    Array.from(notes).forEach(note => {
        const checkbox = note.querySelector('.checkbox');
        switch (filterOption.value) {
            case 'all':
                note.style.display = '';
                break;
            case 'Completed':
                note.style.display = checkbox.checked ? '' : 'none';
                break;
            case 'Incompleted':
                note.style.display = !checkbox.checked ? '' : 'none';
                break;
        }
    });
});

function loadTheme() {

    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
    }
}
function search() {
    const filter = document.getElementById('find').value.toUpperCase();
    const tasks = document.querySelectorAll('.listitemclass');
    let matchFound = false;
    const existingNotFound = tasklist.querySelector('.not-found-container');
    if (existingNotFound) {
        tasklist.removeChild(existingNotFound);
    }

    tasks.forEach(task => {
        const content = task.querySelector('.content');
        if (content) {
            const text = content.textContent || content.innerText;
            if (text.toUpperCase().includes(filter)) {
                task.style.display = '';
                matchFound = true;
            } else {
                task.style.display = 'none';
            }
        }
    });

    if (!matchFound && filter !== '') {
        const notFoundContainer = document.createElement('div');
        notFoundContainer.className = 'not-found-container';
        notFoundContainer.style.textAlign = 'center';
        notFoundContainer.style.marginTop = '20px';

        const notFoundImage = document.createElement('img');
        notFoundImage.src = 'assests/Detective-check-footprint 1.png';
        notFoundImage.alt = 'Not found';
        notFoundImage.style.maxWidth = '200px';

        const notFoundText = document.createElement('h3');
        notFoundText.textContent = 'NOT FOUND...';
        notFoundText.style.margin = '20px 0';
        if (localStorage.getItem('theme') === 'light') {
            notFoundText.style.color = 'black';
        } else {
            notFoundText.style.color = 'white';
        }

        notFoundContainer.appendChild(notFoundImage);
        notFoundContainer.appendChild(notFoundText);
        tasklist.appendChild(notFoundContainer);
    }
}
function openpopup() {
    box.classList.add('boxopen');
    newnotes.classList.add('open');
}
function closepopup() {
    newnotes.classList.remove('open');
    box.classList.remove('boxopen');
}
function addtask() {
    const task = inputnotes.value.trim();
    if (task) {
        createtaskelement(task);
        inputnotes.value = '';
        savetasks();
    } else {
        alert('Please Enter a Task:')
    }
}
function createtaskelement(task, ischecked = false) {
    const listitem = document.createElement('li');
    listitem.className = 'listitemclass';
    const hrline = document.createElement('hr');
    hrline.className = 'hrclass';
    const notediv = document.createElement('div');
    notediv.className = 'note';
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'checkbox';
    checkbox.checked = ischecked;
    const content = document.createElement('div');
    content.textContent = typeof task === 'object' ? task.text : task;
    content.className = 'content';
    if (ischecked) {
        content.style.textDecoration = 'line-through';
        content.style.color = 'rgba(184, 160, 160, 0.5)';
    }

    checkbox.addEventListener('change', function () {
        const content = this.nextElementSibling;
        if (this.checked) {
            content.style.textDecoration = 'line-through';
            content.style.color = 'rgba(184, 160, 160, 0.5)';
        } else {
            content.style.textDecoration = 'none';
            if (localStorage.getItem('theme') === 'dark') {
                content.style.color = 'rgba(255, 255, 255, 1)';
            } else {
                content.style.color = 'rgba(0, 0, 0, 1)';
            }
        }
        savetasks();
    });
    const removewriteiconsdiv = document.createElement('div');
    removewriteiconsdiv.className = 'removewriteicons';
    const writediv = document.createElement('div');
    writediv.className = 'write';
    writediv.innerHTML = '<img class="writeicon" src="/assests/Frame 6.png" alt="pen icon">';
    writediv.onclick = function () {
        const newText = prompt('Edit note:', content.textContent);
        if (newText !== null && newText.trim() !== '') {
            content.textContent = newText.trim();
            savetasks();
        }
    };
    const removediv = document.createElement('div');
    removediv.className = 'remove';
    removediv.innerHTML = '<img class="removeicon" src="assests/trash-svgrepo-com 1.png" alt="trash icon">';
    removediv.onclick = function () {
        listitem.remove();
        savetasks();
    };
    tasklist.appendChild(listitem);
    listitem.appendChild(notediv);
    notediv.appendChild(checkbox);
    notediv.appendChild(content);
    notediv.appendChild(removewriteiconsdiv);
    removewriteiconsdiv.appendChild(writediv);
    removewriteiconsdiv.appendChild(removediv);
    listitem.appendChild(hrline);
    closepopup();
}
function savetasks() {
    let tasks = [];
    tasklist.querySelectorAll('.listitemclass').forEach(function (item) {
        const content = item.querySelector('.content');
        const checkbox = item.querySelector('.checkbox');
        if (content && checkbox) {
            tasks.push({
                text: content.textContent.trim(),
                ischecked: checkbox.checked
            });
        }
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
function loadtasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasklist.innerHTML = '';

    tasks.forEach(task => {
        if (typeof task === 'string') {
            createtaskelement(task, false);
        } else if (task && task.text) {
            createtaskelement(task.text, task.ischecked);
        }
    });
}
