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
    const categoriesAddForm = categoriesAddModal?.querySelector('form');
    categoriesAddModal?.querySelector('.btn-submit').addEventListener('click', async function() {
        /*const added = getInputMarkedData(categoriesAddForm, 'to-add');
        if (added) {
            const addedResponse = ajax('/categories/create', 'POST', added);
        }
        const updated = getInputMarkedData(categoriesAddForm, 'to-update');
        if (updated) {
            const updatedResponse = ajax('/categories/create', 'POST', updated);
        }
        const deleted = getInputMarkedData(categoriesAddForm, 'to-delete');
        if (deleted) {
            const deletedResponse = ajax('/categories/create', 'POST', deleted);
        }
        const data = {added: added, updated: updated, deleted: deleted};
        const response = await ajax('/categories/create', 'POST', );*/
    });
});