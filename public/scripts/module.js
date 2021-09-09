function getElement(tag, classes = '', text = '') {
    let element = document.createElement(tag);
    element.className = classes;
    element.textContent = text;
    return element;
}

/*function parent(child, selector) {
    let body = document.body;
    let parent = child.parentNode;
    while (parent != body) {
        if (parent.parentNode.querySelector(selector)) {
            return parent;
        }
        parent = parent.parentNode;
    }
    return null;
}*/

function getInputData(form) {
    const data = {};
    for (const input of form.querySelectorAll('[name]')) {
        data[input.getAttribute('name')] = input.value;
    }
    return data;
}
function clearInputData(form) {
    for (const input of form.querySelectorAll('[name]')) {
        input.value = '';
        if($(input).selectpicker) {
            $(input).selectpicker('refresh');
            continue;
        }
        input.textContent = '';
    }
}

async function ajax(url, method, data = null) {
    const headers = {
        method: method,
        headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        'Content-Type': 'application/json'
        },
    };
    if (data) headers['body'] = JSON.stringify(data);
    const response = await fetch(url, headers);
    return {
        'status': response.ok,
        'message': await response?.json()
    };
}
async function GET(url) {
    const response = await fetch(url, {
        headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        },
    });
    return {
        'status': response.ok,
        'message': await response?.json()
    };
}
async function fileAjax(url, method, form) {
    const response = await fetch(url, {
        method: method,
        headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content')
        },
        body: new FormData(form)
    });
    return {
        'status': response.ok,
        'message': await response?.json()
    };
}

function showErrors(errors, form) {
    if (!errors) {
        return;
    }
    if (typeof errors == 'string') {
        form.querySelector('.form-message')?.remove();
        const error = getElement('div', 'text-danger form-message', errors);
        form.appendChild(error);
        return;
    }
    for (const name of Object.keys(errors)) {
        const input = form.querySelector(`[name='${name}'], [name='${name}[]']`);
        input.classList.add('is-invalid');
        const label = input.parentNode;
        label.querySelector('.text-danger')?.remove();
        const errorsBlock = getElement('div', 'text-danger');
        for(const message of errors[name]) {
            const error = getElement('div', null, message);
            errorsBlock.appendChild(error);
            input.addEventListener('input', removeError);
            function removeError() {
                errorsBlock.remove();
                this.classList.remove('is-invalid');
                this.removeEventListener('input', removeError);
            }
        }
        label.appendChild(errorsBlock);
    }
}

function showMessage(data, parent = null, styleType = 'success', icon = null) {
    if (!data) {
        return;
    }

    message = '';
    if (icon) {
        icon = getIcon(icon);
    }
    else {
        icon = '';
    }
    
    const styleTypes = {
        'success': 
            `<div class='alert alert-success alert-dismissible d-flex align-items-center' role='alert'>
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>X</button>
                <div>
                    ${icon}
                    ${data}
                </div>
            </div>`,
        'danger': 
            `<div class='alert alert-danger alert-dismissible d-flex align-items-center' role='alert'>
                <button type='button' class='close' data-dismiss='alert' aria-label='Close'>X</button>
                <div>
                    ${icon}
                    ${data}
                </div>
            </div>`,
    };
    html = styleTypes[styleType];
    const messageBlock = getElement('div', 'w-100');
    messageBlock.innerHTML = html;
    parent?.appendChild(messageBlock);
    return messageBlock;
}

function startLoading(parent) {
    const block = getElement('div', 'loading-wrap');
    for (let i = 0; i < 3; i++) {
        let dot = getElement('div', 'spinner-grow text-success');
        dot.style = `--i: ${i*200}ms`;
        dot.innerHTML = `<span class='sr-only'></span>`;
        block.appendChild(dot);
    }
    parent.appendChild(block);
}
function stopLoading(parent) {
    parent.querySelector('.loading-wrap').remove();
}

function getIcon(name, html = true) {
    const icons = {
    'success': 
        `<svg class='bi flex-shrink-0' width='24' height='24' viewBox='0 0 16 16' fill='currentColor'>
            <path d='M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z'/>
        </svg>`,
    
    'discard': `
        <svg class='bi flex-shrink-0' width='24' height='24' viewBox='0 0 512 512' fill='currentColor'>
            <path d='m352 153.037h-275.873l85.103-85.927-28.42-28.147-132.789 134.074 132.79 134.073 28.42-28.147-85.102-85.926h275.871c66.168 0 
            120 53.832 120 120s-53.832 120-120 120h-352v40h352c88.224 0 160-71.776 160-160s-71.776-160-160-160z'/>
        </svg>`,
    'back': `
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
        </svg>`,
    'delete': 
        `<svg class='bi flex-shrink-0' width='24' height='24' viewBox='0 0 16 16' fill='currentColor'>
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z'/>
            <path d='M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z'/>
        </svg>`,
    };
    if (html) {
        return icons[name];
    }
    return fromHTML(icons[name]);
}

function highlight(space = document, selector, style, ms = 0) {
    let elem = selector;
    if (typeof selector == 'string') {
        elem = space.querySelector(selector);
    }

    if (!elem) return false;
    elem.classList.add(style);

    if (ms) setTimeout(function() {
        elem.classList.remove(style);
    }, ms);
}

function fromHTML(html) {
    const placeholder = document.createElement('div');
    placeholder.innerHTML = html;
    return placeholder.children[0];
}

function reg(input, onEnter = null) {
    input.addEventListener('input', function () {
        input.value = input.value.replace(/\s/g, '');
    });

    if(onEnter) {
        input.addEventListener('keydown', function(e) {
            if (e.key == 'Enter') {
                onEnter();
            }
        });
    }
}

function switchWindow(curWindow, newWindow, backCallback) {
    function back() {
        newWindow.remove();
        curWindow.classList.remove('d-none');
        if (backCallback) backCallback();
        this.remove();
    }

    const parent = curWindow.parentNode;
    const btnReturn = getElement('button', 'btn btn-return');
    btnReturn.title = 'Вернуться';
    btnReturn.innerHTML = getIcon('back', true);
    btnReturn.addEventListener('click', back);
    curWindow.classList.add('d-none');
    parent.querySelector('.page-title').appendChild(btnReturn);
    parent.appendChild(newWindow);
}
function makeItem(info, master) {
    const item = getElement('div', 'col-12 col-md-6 px-3 news-item-wrap');
    let actions = '';
    if (master) 
        actions = `
        <div class='btn-group ml-2 news-item__actions'>
            <div class="dropdown">
                <button class="btn btn-outline-success" data-toggle="dropdown">
                    <i class='bi bi-three-dots'></i>
                </button>
                <div class="dropdown-menu font-italic">
                    <button class="dropdown-item btn btn-outline-warning news-item__action btn-edit"><i class='bi bi-pencil'></i> Изменить</button>
                    <button class="dropdown-item btn btn-outline-warning news-item__action btn-delete"><i class="bi bi-x-circle"></i> Удалить</button>
                </div>
            </div>
        </div>`;
    let categories = '';
    for (let cat of info.categories) {
        categories += `
        <div class='badge category news-item__category'
            data-id='${cat.id}'
            style='
            --background-color: ${cat.background_color};
            --font-color: ${cat.font_color };'
            >
        ${cat.name}
        </div>`;
    }
    item.innerHTML = `
    <div class='card news-item shadow-sm' data-id='${info.id}'>
        <div class='news-item__head no-wrap'>
            <div class='news-item__title-wrap'>
                <h3 class='news-item__title text-truncate interactable'>${info.title}</h3>
                ${actions}
            </div>
            <div class='news-item__subtitle-wrap text-muted interactable'><strong class='news-item__subtitle text-truncate'>${info.subtitle}</strong></div>
            <div class='news-item__categories text-muted text-truncate'>
            ${categories}
            </div>
        </div>
        <div class='news-item__content'>
            <div class='news-item__image-wrap interactable'>
                <img src='images/${info.image}' class='img-fluid news-item__image'>
            </div>
            <div class='w-100 news-item__text text-truncate'>
                ${info.description}
            </div>
        </div>
        <div class='news-item__footer'>
            <div class='d-flex justify-content-center'>
                <div class='news-item__comments text-muted interactable'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" class="bi bi-chat-square-text" viewBox="0 0 16 16">
                        <path d="M14 1a1 1 0 0 1 1 1v8a1 1 0 0 1-1 1h-2.5a2 2 0 0 0-1.6.8L8 14.333 6.1 11.8a2 2 0 0 0-1.6-.8H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2.5a1 1 0 0 1 .8.4l1.9 2.533a1 1 0 0 0 1.6 0l1.9-2.533a1 1 0 0 1 .8-.4H14a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"/>
                        <path d="M3 3.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zM3 6a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9A.5.5 0 0 1 3 6zm0 2.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"/>
                    </svg>
                    <div class='text-center'>
                        ${info.comments}
                    </div>
                </div>
            </div>
        </div>
    </div>`;
    return item;
}