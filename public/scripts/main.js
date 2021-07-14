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
        if(activeForm == loginForm) return;
        activeForm.classList.remove('active-form');
        loginForm.classList.add('active-form');
        loginRegisModalTitle.textContent = 'Вход';
        loginRegisModalSubmit.textContent = 'Войти';
    })
    regis.addEventListener('click', function() {
        const activeForm = loginRegisModal.querySelector('.'+activeFormClass);
        if(activeForm == regisForm) return;
        activeForm.classList.remove('active-form');
        regisForm.classList.add('active-form');
        loginRegisModalTitle.textContent = 'Регистрация';
        loginRegisModalSubmit.textContent = 'Зарегистрироваться';
    })
});