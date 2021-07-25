function getElement(tag, classes, text = '') {
    let element = document.createElement(tag);
    if(Array.isArray(classes)) {
      element.classList.add(...classes);
    }
    else element.classList.add(classes);
    element.textContent = text;
    return element;
  }

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
        const error = getElement('div', ['text-danger', 'form-message'], errors);
        form.appendChild(error);
        return;
    }
    for (const name of Object.keys(errors)) {
        const input = form.querySelector(`[name='${name}'], [name='${name}[]']`);
        const label = input.parentNode;
        label.querySelector('.text-danger')?.remove();
        const errorsBlock = getElement('div', ['text-danger']);
        for(const message of errors[name]) {
            const error = getElement('div', null, message);
            errorsBlock.appendChild(error);
            input.addEventListener('input', removeError);
            function removeError() {
                errorsBlock.remove();
                this.removeEventListener('input', removeError);
            }
        }
        label.appendChild(errorsBlock);
    }
}

function showData(dataArray, form) {
    if (!dataArray) return;
    form.querySelector('.form-message')?.remove();
    const messageBlock = document.createElement('div');
    messageBlock.innerHTML = `
        <div class="alert alert-success alert-dismissible d-flex align-items-center" role="alert">
            <button type="button" class="btn-close" data-dismiss="alert" aria-label="Close"></button>
            <div>
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" viewBox="0 0 16 16" fill="currentColor" role="img" aria-label="Success:">
                    <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
                </svg>
                ${dataArray[0]}
            </div>
        </div>
    `;
    form.appendChild(messageBlock);
}