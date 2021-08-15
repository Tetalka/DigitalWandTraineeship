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
        input.textContent = '';
        if(input.selectpicker) {
            input.selectpicker('refresh');
        }
    }
}

async function ajax(url, method, data) {
    const response = await fetch(url, {
        method: method,
        headers: {
        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
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
