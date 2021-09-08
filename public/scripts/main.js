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
        loginForm.querySelector('.form-message')?.remove();
        showMessage(response['message']['data'], loginForm, 'success', 'success');
    }
    async function doRegis() {
        const response = await ajax('/user/create', 'POST', getInputData(regisForm));
        showErrors(response['message']['errors'], regisForm);
        regisForm.querySelector('.form-message')?.remove();
        showMessage(response['message']['data'], regisForm, 'success', 'success');
    }

    document.querySelector('.navbar .exitButton')?.addEventListener('click', async function() {
        if(await fetch('/user/exit')) {
            window.location.assign('/');
        }
    })

    const news = document.querySelector('.news');
    const commentForm = document.querySelector('.comment-form');
    commentForm?.remove();
    const comments = getElement('div', 'comments');
    function newsInit() {
            for (const item of document.querySelectorAll('.news-item')) {
            item.querySelector('.news-item__title').addEventListener('click', open);
            item.querySelector('.news-item__subtitle').addEventListener('click', open);
            item.querySelector('.news-item__image-wrap').addEventListener('click', open);
            item.querySelector('.news-item__comments').addEventListener('click', open);

            const itemPage = item.cloneNode(true);
            const pageId = itemPage.getAttribute('data-id');
            const actions = itemPage.querySelector('.news-item__actions');
            actions?.remove();
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
                    let username = document.querySelector('.user').getAttribute('data-name');
                    comment = createComment(username, data['text'], data['date'], response['message']['approved']);
                    clearCommentMessage();
                    comments.prepend(comment);
                }
            }
            function open() {

                function back() {
                    clearInputData(commentForm);
                    comments.innerHTML = '';
                    commentForm.querySelector('.btn-submit')?.removeEventListener('click', sendComment);
                    btnAdd && document.querySelector('.page-title').appendChild(btnAdd);
                }
                const btnAdd = document.querySelector('.btn-news-add');
                const title = itemPage.querySelector('.news-item__title');

                itemPage.querySelector('.news-item__footer').appendChild(commentForm);
                commentForm.querySelector('.btn-submit')?.addEventListener('click', sendComment);

                itemPage.appendChild(comments);
                
                switchWindow(news, itemPage, back);
                btnAdd?.remove();
                title.classList.add('d-flex', 'align-items-center');
                actions && title.appendChild(actions);
                
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
                        const comment = createComment(data['author'], data['text'], data['date']);
                        comments.appendChild(comment);
                    }
                }
            }
            function clearCommentMessage() {
                comments.querySelector('.comment-message')?.remove();
            }
            function wordDate(rowDate) {
                const date = new Date(rowDate);
                const now = new Date();
                const monthDays = new Date(now.getFullYear(), now.getMonth(), 0).getDate();
                const words = [//Вплоть до секунд, но нужно тогда обновлять
                    {
                        'count': 60,
                        'word': ['', 'секунды', 'секунд'],
                    },
                    {
                        'count': 60,
                        'word': ['Минута', 'минуты', 'минут'],
                    },
                    {
                        'count': 24,
                        'word': ['Час', 'часа', 'часов'],
                    },
                    {
                        'count': monthDays,
                        'word': ['День', 'дня', 'дней'],
                    },
                    {
                        'count': 12,
                        'word': ['Месяц', 'месяца', 'месяцев'],
                    },
                    {
                        'count': 0,
                        'word': ['Год', 'года', 'лет'],
                    },
                ];
                let diff = Math.round(now.getTime()/1000 - date.getTime()/1000);
                if (diff <= 5) return 'Только что';
                for (const hit of words) {
                    if (hit.count > diff) {
                        if (diff == 1) return `${hit.word[0]} назад`;
                        const number = diff%10;
                        let word = '';
                        if (number < 5 && (diff < 10 || diff > 21)) word = hit.word[1];
                        else word = hit.word[2];
                        return `${diff} ${word} назад`
                    }
                    diff = Math.trunc(diff/hit.count);
                }
            }
            function createComment(author, text, rowDate, approved = true) {
                const comment = getElement('div', 'col-12 px-0 comment');
                const date = new Date(rowDate).format('dd.mm.yyyy HH:MM:ss');
                const dateTitle = wordDate(rowDate);
                comment.innerHTML = `
                <div class="">
                    <h5>${author}${approved? '' : ' <span class="text-muted">На модерации</span>'}</h5>
                    <h6 title=${date}>${dateTitle}</h6>
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
    }
    newsInit();

    //ПЕРЕХОД ПО КАТЕГОРИЯМ
    function newsCatInit(selector) {
        for (let category of document.querySelectorAll(selector)) {
            async function loadCat() {
                function clearNews() {
                    for (const item of parent.querySelectorAll('.news-item-wrap')) {
                        item.remove();
                    }
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
                const response = await GET(`news/category/${id}`);
                const parent = document.querySelector('.news');
                const data = JSON.parse(response['message']['news']);
                const master = response['message']['master'];

                clearNews();
                for (const item of data) {
                    const html = makeItem(item, master);
                    parent.appendChild(html);
                }
                newsInit();
                newsCatInit('.news-item__category');
            }
            const id = category.getAttribute('data-id');
            category.addEventListener('click', loadCat);
        }
    }
    newsCatInit('.navbar-vertical .category, .news-item__category');
});