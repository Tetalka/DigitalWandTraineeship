window.addEventListener('load', function() {
    const newsAddModal = document.querySelector('.news-add-modal');
    const newsAddForm = newsAddModal?.querySelector('form');
    newsAddModal?.querySelector('.btn-submit').addEventListener('click', async function () {
        const response = await fileAjax('/news/create', 'POST', newsAddForm);
        if (response['status']) {
            clearInputData(newsAddForm);
        }
        showErrors(response['message']['errors'], newsAddForm);
        showMessage(response['message']['data'], newsAddForm, 'success', 'success');
    });

    const categoriesPicker = $('.news-add-modal [name="categories[]"]');
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
            if (controls.querySelector('.btn-discard')) {
                return;
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
        const name = categoriesAddForm.querySelector('[name = "name"]').value;
        if (!name.trim()) {
            return;
        }

        function destroy() {
            category.remove();
        }

        const category = fromHTML(`
        <div class="badge category border p-0 pl-3 to-add" data-name="${name}"> 
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
    }

    function getMarkedData(form, mark) {
        const data = {};
        
        for (const input of form.querySelectorAll(`[class*="${mark}"]`)) {
            const id = input.getAttribute('data-id');
            if (id) {
                data[id] = input.value;
            }
            else {
                //data[] !!!
            }
        }
        return data;
    }
    categoriesAddModal?.querySelector('.btn-submit').addEventListener('click', async function() {
        /*const added = getMarkedData(categories, 'to-add');
        if (added.length) {
            const addedResponse = ajax('/categories/create', 'POST', added);
        }
        const updated = getMarkedData(categories, 'to-update');
        if (updated.length) {
            const updatedResponse = ajax('/categories/update', 'PUT', updated);
        }
        const deleted = getMarkedData(categories, 'to-delete');
        if (deleted.length) {
            const deletedResponse = ajax('/categories/delete', 'DELETE', deleted);
        }
        const data = {added: added, updated: updated, deleted: deleted};
        console.log(data);*/
    });
});