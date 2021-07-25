window.addEventListener('load', function() {
    const login = document.querySelector('.login');
    const regis = document.querySelector('.regis');
    const loginRegisModal = document.querySelector('.login-regis-modal');
    const loginRegisModalTitle = loginRegisModal?.querySelector('.modal-title');
    const loginRegisModalSubmit = loginRegisModal?.querySelector('.btn-submit');
    const loginForm = loginRegisModal?.querySelector('.login-form');
    const regisForm = loginRegisModal?.querySelector('.regis-form');
    const activeFormClass = 'active-form'; 
    login?.addEventListener('click', function() {
        const activeForm = loginRegisModal.querySelector('.'+activeFormClass);
        loginRegisModalSubmit.addEventListener('click', doLogin);
        if(activeForm == loginForm) {
            return;
        }
        activeForm.classList.remove('active-form');
        loginForm.classList.add('active-form');
        loginRegisModalTitle.textContent = 'Вход';
        loginRegisModalSubmit.textContent = 'Войти';
        loginRegisModalSubmit.removeEventListener('click', doRegis);
    })
    regis?.addEventListener('click', function() {
        const activeForm = loginRegisModal.querySelector('.'+activeFormClass);
        loginRegisModalSubmit.addEventListener('click', doRegis);
        if(activeForm == regisForm) {
            return;
        }
        activeForm.classList.remove('active-form');
        regisForm.classList.add('active-form');
        loginRegisModalTitle.textContent = 'Регистрация';
        loginRegisModalSubmit.textContent = 'Зарегистрироваться';
        loginRegisModalSubmit.removeEventListener('click', doLogin);
    })
    async function doLogin() {
        const response = await ajax('/user/auth', 'POST', getInputData(loginForm));
        if (response['status']) {
            window.location.reload();
        }
        showErrors(response['message']['errors'], loginForm);
        showData(response['message']['data'], loginForm);
    }
    async function doRegis() {
        const response = await ajax('/user/create', 'POST', getInputData(regisForm));
        showErrors(response['message']['errors'], regisForm);
        showData(response['message']['data'], regisForm);
    }

    document.querySelector('.navbar .exitButton')?.addEventListener('click', async function() {
        if(await fetch('/user/exit')) {
            window.location.reload();
        }
    })
});