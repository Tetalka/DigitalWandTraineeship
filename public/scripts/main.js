window.addEventListener('load', function() {
    const login = document.querySelector('.login');
    const regis = document.querySelector('.regis');
    const loginRegisModal = document.querySelector('.login-regis-modal');
    const loginRegisModalTitle = loginRegisModal.querySelector('.modal-title');
    const loginRegisModalSubmit = loginRegisModal.querySelector('.btn-submit');
    const loginForm = loginRegisModal.querySelector('.login-form');
    const regisForm = loginRegisModal.querySelector('.regis-form');
    const activeFormClass = 'active-form'; 
    login.addEventListener('click', function() {
        const activeForm = loginRegisModal.querySelector('.'+activeFormClass);
        loginRegisModalSubmit.addEventListener('click', doLogin);
        if(activeForm == loginForm) return;
        activeForm.classList.remove('active-form');
        loginForm.classList.add('active-form');
        loginRegisModalTitle.textContent = 'Вход';
        loginRegisModalSubmit.textContent = 'Войти';
        loginRegisModalSubmit.removeEventListener('click', doRegis);
    })
    regis.addEventListener('click', function() {
        const activeForm = loginRegisModal.querySelector('.'+activeFormClass);
        loginRegisModalSubmit.addEventListener('click', doRegis);
        if(activeForm == regisForm) return;
        activeForm.classList.remove('active-form');
        regisForm.classList.add('active-form');
        loginRegisModalTitle.textContent = 'Регистрация';
        loginRegisModalSubmit.textContent = 'Зарегистрироваться';
        loginRegisModalSubmit.removeEventListener('click', doLogin);
    })
    function doLogin() {
        console.log('a');
        ajax('/auth', 'POST', getInputData(loginForm));
    }
    function doRegis() {
        ajax('/create', 'POST', getInputData(regisForm));
    }
    function getInputData(form) {
        let data = {};
        for (let input of form.querySelectorAll('input')) {
            data[input.getAttribute('name')] = input.value;
        }
        return data;
    }
    function ajax(url, method, data) {
        fetch(url, {
            method: method,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
    }
});