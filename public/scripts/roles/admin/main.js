window.addEventListener('load', function() {
    const Anim_conclude_dur = 3000;

    const newsAddWindow = document.querySelector('.news-add-window');
    newsAddWindow?.remove();
    newsAddWindow.querySelector('[name]').value = '';

    function openAddForm() {
        function back() {
            document.querySelector('.page-title').appendChild(btn);
        }

        const btn = this;
        const news = document.querySelector('.news');
        btn.remove();
        switchWindow(news, newsAddWindow, back);
    }
    const newsAddBtn = document.querySelector('.btn-news-add');
    newsAddBtn.addEventListener('click', openAddForm)

    const newsAddForm = newsAddWindow?.querySelector('form');
    newsAddWindow?.querySelector('.btn-submit').addEventListener('click', async function () {
        const response = await fileAjax('/news/create', 'POST', newsAddForm);
        if (response['status']) {
            clearInputData(newsAddForm);
        }
        showErrors(response['message']['errors'], newsAddForm);
        showMessage(response['message']['data'], newsAddForm, 'success', 'success');
    });

    const categoriesPicker = $(newsAddWindow).find('[name="categories[]"]');
    categoriesPicker?.selectpicker({
        liveSearch: true,
        size: 6,
        noneSelectedText: 'Ничего не выбрано',
        noneResultsText: 'Не найдено {0}',
        selectedTextFormat: 'count > 1',
        countSelectedText: function(count) {
            digit = count % 10;
            if (digit == 1 && count != 11) {
                return `Выбрана ${count} категория`;
            }
            if (digit > 1 && digit < 5 && (count < 10 || count > 20)) {
                return `Выбраны ${count} категории`;
            }
            return `Выбрано ${count} категорий`;
        },
        style: 'btn-default border'
    });

    const categoriesAddModal = document.querySelector('.categories-add-modal');
    const categoriesAddForm = categoriesAddModal?.querySelector('.categories-add-form');
    const categories = categoriesAddModal?.querySelector('.categories');
    reg(categoriesAddForm.querySelector('[name = "name"]'), addCategory);
    for (const category of categories.querySelectorAll('.category')) {
        category.querySelector('.btn-edit').addEventListener('click', edit);
        category.querySelector('.btn-delete').addEventListener('click', destroy);
        
        const controls = category.querySelector('.category__controls');
        const realName = category.getAttribute('data-name');
        
        
        function addBtnDiscard(block = null) {
            if (existed = controls.querySelector('.btn-discard')) {
                return existed;
            }
            const btn = getElement('button', 'btn btn-outline-secondary btn-discard');
            btn.innerHTML = getIcon('discard');
            if (!block) {
                controls.prepend(btn);
            }
            else block.prepend(btn);
            return btn;
        }
        function removeBtnDiscard() {
            if (btn = controls.querySelector('.btn-discard')) {
                btn.remove();
            }
        }

        function edit() {
            const name = category.querySelector('.category__name');
            const input = getElement('input', 'category__name form-control h-100');
            input.value = name.textContent;

            category.style='padding: 0 !important;';
            controls.remove();
            name.replaceWith(input);
            input.focus();
            reg(input, function() {
                input.blur();
            });
            input.addEventListener('blur', editEnd);

            function editEnd() {
                name.textContent = input.value;
                input.replaceWith(name);
                name.parentNode.appendChild(controls);
                category.style='';
                check();
            }
            function check() {
                if (!name.textContent.trim()) {
                    name.textContent = realName;
                    return;
                }
                if (name.textContent != realName) {
                    mark();
                    const btn = addBtnDiscard();
                    btn.addEventListener('click', discard);
                    return;
                }
                removeBtnDiscard();
                unmark();
            }
            function discard() {
                this.remove();
                name.textContent = realName;
            }
            function mark() {
                category.classList.add('to-update');
            }
            function unmark() {
                category.classList.remove('to-update');
            }
        }

        function destroy() {
            const genControls = controls.querySelector('.general');
            const extraControls = getElement('div', 'extra');
            const btn = addBtnDiscard(extraControls);
            //const icon = getIcon('delete', false);
            btn.addEventListener('click', discard);
            
            genControls.replaceWith(extraControls);
            category.classList.add('alert-danger');
            mark();
            //category.prepend(icon);

            function discard() {
                this.remove();
                extraControls.replaceWith(genControls);
                category.classList.remove('alert-danger');
                unmark();
                //icon.remove();
            }
            function mark() {
                category.classList.add('to-delete');
            }
            function unmark() {
                category.classList.remove('to-delete');
            }
        }
    }
    categoriesAddForm.querySelector('.btn-insert').addEventListener('click', addCategory);
    function addCategory() {
        input = categoriesAddForm.querySelector('[name = "name"]');
        const name = input.value;
        if (!name.trim()) {
            return;
        }

        function destroy() {
            category.remove();
        }

        const category = fromHTML(`
        <div class="badge category p-0 pl-3 to-add" data-name="${name}"> 
            <span class="category__name">${name}</span>
            <div class="btn-group category__controls h-100 pl-3">
                <div class="btn-group general">
                    <button class="btn btn-outline-danger btn-delete"><span aria-hidden="true">X</span></button>
                </div>
            </div>
        </div>
        `);
        category.querySelector('.btn-delete').addEventListener('click', destroy);
        categories.appendChild(category);
        input.value = '';
    }

    function getMarked(form, mark) {
        const data = [];
        data.__proto__.find = function(id) {
            for (let obj of this) {
                if (obj['id'] === id) 
                return {
                    field: obj['field'], 
                    index: this.indexOf(obj)
                };
            }
            return false;
        };
        data.__proto__.remove = function(to, from = 0) {
            let rest = this.slice((to || from) + 1 || this.length);
            this.length = from < 0 ? this.length + from : from;
            return this.push.apply(this, rest);
        };
        
        for (const field of form.querySelectorAll(`[class*="${mark}"]`)) {
            let id = field.getAttribute('data-id');
            const name = field.querySelector('.category__name').textContent;
            id = id? id : name;
            data.push({
                    id: id,
                    field: field,
                    mark: mark
                });
        }
        return data;
    }

    function getMarkedData(marked) {
        const data = [];
        
        for (const one of marked) {
            const id = one['id'];
            const field = one['field'];
            const name = field.querySelector('.category__name').textContent;
            const realName = field.getAttribute('data-name');
            if (realName && name != realName) {
                obj = {
                    id: id,
                    become: name
                }
                data.push(obj);
                continue;
            }
            data.push(id);
        }
        return data
    }

    /*function getMarkedData(form, mark) {
        const data = [];
        
        for (const field of form.querySelectorAll(`[class*="${mark}"]`)) {
            const id = field.getAttribute('data-id');
            const name = field.querySelector('.category__name').textContent;
            const realName = field.getAttribute('data-name');
            let one = {};
            if (id) {
                one['id'] = id;
                if (realName && name != realName) {
                    one['become'] = name;
                }
            }
            else {
                one = name;
            }
            data.push(one);
        }
        return data;
    }*/
    
    function reject(marked, rejected) {
        if(!rejected || !rejected.length) return;
        for (const id of rejected) {
            const obj = marked.find(id);
            marked.remove(obj['index']);
            highlight(categories, obj['field'], 'rejected', Anim_conclude_dur); 
        }
    }

    function apply(applied) {
        if(!applied || !applied.length) return;
        for (const obj of applied) {
            const field = obj['field'];
            highlight(categories, field, 'applied', Anim_conclude_dur);
            field.classList.remove(obj['mark']);
        }
    }

    function updateId(marked, response) {
        for (let update of response) {
            const name = update['name'];
            const id = update['id'];
            marked[name]['field'].setAttribute('data-id', id);
        }
    }

    categoriesAddModal?.querySelector('.btn-submit').addEventListener('click', async function() {
        async function sendAndConclude(marked, url, method, data) {
            const response = await ajax(url, method, data);
            const rejected = response['message']['rejected']
            reject(marked, rejected);
            marked = marked.filter(value => !rejected.includes(value));
            if (applied = response['applied']) updateId(marked, applied);
            apply(marked);
        }

        const added = getMarked(categories, 'to-add');
        if (added.length) {
            const toSend = {toAdd: getMarkedData(added)};
            sendAndConclude(added, '/categories', 'POST', toSend);
        }
        const updated = getMarked(categories, 'to-update');
        if (updated.length) {
            const toSend = {toUpdate: getMarkedData(updated)};
            sendAndConclude(updated, '/categories', 'PUT', toSend);
        }
        const deleted = getMarked(categories, 'to-delete');
        if (deleted.length) {
            const toDelete = {toDelete: getMarkedData(deleted)};
            sendAndConclude(deleted, '/categories', 'DELETE', toDelete);
        }
    });
});