window.addEventListener('load', function() {
    const commentsBlock = document.querySelector('.comments');
    const comments = document.getElementsByClassName('comment');

    for (const comment of comments) {
        comment.querySelector('.btn-reject').addEventListener('click', reject);
        comment.querySelector('.btn-approve').addEventListener('click', approve);

        const id = comment.getAttribute('data-id');

        //Думаю добавить возможность отменять действия, сворачивая при действии весь коммент, оставляя кнопку "вернуть"
        async function reject() {
            const response = await ajax('', 'DELETE', {'id': id});
            if (response['status']) {
                makeAlert('Комментарий успешно удалён', 'danger', 'success');
            }
            comment.remove();
        }
        async function approve() {
            const response = await ajax('', 'PUT', {'id': id});
            if (response['status']) {
                makeAlert('Комментарий успешно принят', 'success', 'success');
            }
            comment.remove();
        }

        function makeAlert(text, styleType, icon) {
            const index = Array.prototype.indexOf.call(comments, comment);
            if (index == 0) {
                const alert = showMessage(text, null, styleType, icon);
                comment.parentNode.prepend(alert);
                return;
            }
            if (index != comments.length-1) {
                const nextSibling = comments[index+1];
                const alert = showMessage(text, null, styleType, icon);
                nextSibling.before(alert);
            }
            else {
                showMessage(text, comment.parentNode, styleType, icon);
            }
        }
    }
});