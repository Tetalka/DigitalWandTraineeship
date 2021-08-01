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

    const news = document.querySelector('.news');
    const commentForm = document.querySelector('.comment-form');
    commentForm.remove();
    const comments = getElement('div', 'comments');
    for (const item of document.querySelectorAll('.news-item')) {
        item.querySelector('.news-item__title').addEventListener('click', open);
        item.querySelector('.news-item__subtitle').addEventListener('click', open);
        item.querySelector('.news-item__image-wrap').addEventListener('click', open);
        item.querySelector('.news-item__comments').addEventListener('click', open);

        const itemPage = item.cloneNode(true);
        const pageId = itemPage.getAttribute('data-id');
        itemPage.classList.add('news-item_opened');
        const categories = itemPage.querySelector('.news-item__categories');
        //categories.remove();
        categories.style.padding = '1rem var(--px-padding)';
        itemPage.querySelector('.news-item__content').appendChild(categories);
        itemPage.querySelector('.news-item__comments').remove();
        
        for (const text of itemPage.querySelectorAll('.text-truncate')) {
            text.classList.remove('text-truncate');
        }
        for (const block of itemPage.querySelectorAll('.interactable')) {
            block.classList.remove('interactable')
        }
        
        async function sendComment() {
            const text = this.textContent;
            this.textContent = '';
            startLoading(this);
            //data = getInputData(commentForm);
            data = {
                'text': commentForm.querySelector('[name="text"]').textContent,
                'news_itemId': pageId
            };
            const response = await ajax('/news/comments/create', 'POST', data);
            clearInputData(commentForm);
            stopLoading(this);
            this.textContent = text;
            if (response['status']) {
                let username = document.querySelector('user').getAttribute('data-name');
                createComment(username, data['text'], response['message']['created_at']);
                clearCommentMessage();
                comments.prepend(comment);
            }
        }
        function open() {
            itemPage.querySelector('.news-item__footer').appendChild(commentForm);
            commentForm.querySelector('.btn-submit').addEventListener('click', sendComment);

            itemPage.appendChild(comments);
            
            news.classList.add('d-none');
            const btnReturn = getElement('button', 'btn btn-return');
            btnReturn.title = 'Вернуться';
            btnReturn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" class="bi bi-arrow-left" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>`
            btnReturn.addEventListener('click', back);
            const main = news.parentNode;
            main.querySelector('.page-title').appendChild(btnReturn);
            main.appendChild(itemPage);
            
            window.addEventListener('scroll', isFooter);
            function isFooter() {
                if(comments.offsetTop <= pageYOffset + window.innerHeight) {
                    loadComments();
                }
            }
            async function loadComments() {
                startLoading(comments);
                window.removeEventListener('scroll', isFooter);
                const response = await GET(`/news/comments/${pageId}`);
                clearCommentMessage();
                stopLoading(comments);
                if (!response['status']) {
                    return;
                }
                if (!Object.keys(response['message']).length) {
                    const message = getElement('h4', 'text-muted text-center comment-message', 'Нет комментариев');
                    comments.appendChild(message);
                }
                for (const data of response['message']) {
                    const comment = createComment(data['author'], data['text'], data['created_at']);
                    comments.appendChild(comment);
                }
            }
        }
        function back() {
            clearInputData(commentForm);
            comments.innerHTML = '';
            this.remove();
            itemPage.remove();
            commentForm.querySelector('.btn-submit').removeEventListener('click', sendComment);
            news.classList.remove('d-none');
        }
        function clearCommentMessage() {
            comments.querySelector('.comment-message')?.remove();
        }
        function createComment(author, text, date) {
            const comment = getElement('div', 'col-12 px-0 comment');
            comment.innerHTML = `
            <div class="">
                <h5>${author}</h5>
                <h6>${date}</h6>
                <div class="mt-3">
                    <div class=''>
                        <div class="comment__text" name="text">${text}</div>
                    </div>
                </div>
            </div>
            `;
            return comment;
        }
    }
});