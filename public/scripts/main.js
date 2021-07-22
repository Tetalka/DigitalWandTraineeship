window.addEventListener('load', function() {
    function getElement(tag, classes, text = '') {
        let element = document.createElement(tag);
        if(Array.isArray(classes)) {
            element.classList.add(...classes);
        }
        else element.classList.add(classes);
        element.textContent = text;
        return element;
    }
    const login = document.querySelector('.login');
    const regis = document.querySelector('.regis');
    const loginRegisModal = document.querySelector('.login-regis-modal');
    const loginRegisModalTitle = loginRegisModal.querySelector('.modal-title');
    const loginRegisModalSubmit = loginRegisModal.querySelector('.btn-submit');
    const loginForm = loginRegisModal.querySelector('.login-form');
    const regisForm = loginRegisModal.querySelector('.regis-form');
    const activeFormClass = 'active-form'; 
    login?.addEventListener('click', function() {
        const activeForm = loginRegisModal.querySelector('.'+activeFormClass);
        loginRegisModalSubmit.addEventListener('click', doLogin);
        if(activeForm == loginForm) return;
        activeForm.classList.remove('active-form');
        loginForm.classList.add('active-form');
        loginRegisModalTitle.textContent = 'Вход';
        loginRegisModalSubmit.textContent = 'Войти';
        loginRegisModalSubmit.removeEventListener('click', doRegis);
    })
    regis?.addEventListener('click', function() {
        const activeForm = loginRegisModal.querySelector('.'+activeFormClass);
        loginRegisModalSubmit.addEventListener('click', doRegis);
        if(activeForm == regisForm) return;
        activeForm.classList.remove('active-form');
        regisForm.classList.add('active-form');
        loginRegisModalTitle.textContent = 'Регистрация';
        loginRegisModalSubmit.textContent = 'Зарегистрироваться';
        loginRegisModalSubmit.removeEventListener('click', doLogin);
    })
    async function doLogin() {
        const response = await ajax('/auth', 'POST', getInputData(loginForm));
        if (response['status']) window.location.reload();
        showErrors(response['message']['errors'], loginForm);
        showData(response['message']['data'], loginForm);
    }
    async function doRegis() {
        const response = await ajax('/create', 'POST', getInputData(regisForm));
 
        showErrors(response['message']['errors'], regisForm);
        showData(response['message']['data'], regisForm);
    }
    function getInputData(form) {
        const data = {};
        for (const input of form.querySelectorAll('input')) {
            data[input.getAttribute('name')] = input.value;
        }
        return data;
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
            'message': await response?.json()};
    }
    function showErrors(errors, form) {
        if (!errors) return;
        if (typeof errors == 'string') {
            form.querySelector('.form-message')?.remove();
            const error = getElement('div', ['text-danger', 'form-message'], errors);
            form.appendChild(error);
            return;
        }
        for (const name of Object.keys(errors)) {
            const input = form.querySelector(`[name='${name}']`);
            const label = input.parentNode;
            label.querySelector('.text-danger')?.remove();
            const error = getElement('div', 'text-danger', errors[name].join("\n"));
            label.appendChild(error);
            input.addEventListener('input', removeError);
            function removeError() {
                error.remove();
                this.removeEventListener('input', removeError);
            }
        }
    }
    function showData(data, form) {
        if (!data) return;
        form.querySelector('.form-message')?.remove();
        const message = getElement('div', ['text-success', 'form-message'], data);
        form.appendChild(message);
    }

    document.querySelector('.navbar .exitButton')?.addEventListener('click', async function() {
        if(await fetch('/exit')) {
            window.location.reload();
        }
    })
});