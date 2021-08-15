window.addEventListener('load', function() {
    const commentsBlock = document.querySelector('.comments');
    //const comments = document.getElementsByClassName('comment');

    //for (const comment of comments) {
    for (const comment of document.querySelectorAll('.comment')) {
        comment.querySelector('.btn-reject').addEventListener('click', reject);
        comment.querySelector('.btn-approve').addEventListener('click', approve);

        const id = comment.getAttribute('data-id');

        //Думаю добавить возможность отменять действия, сворачивая при действии весь коммент, оставляя кнопку "вернуть"
        async function reject() {
            const response = await ajax('', 'DELETE', {'id': id});
            if (response['status']) {
                makeAlert('Комментарий успешно удалён', 'danger', 'success');
            }
            //comment.remove(); //1-2
        }
        async function approve() {
            const response = await ajax('', 'PUT', {'id': id});
            if (response['status']) {
                makeAlert('Комментарий успешно принят', 'success', 'success');
            }
            //comment.remove(); //1-2
        }

        function makeAlert(text, styleType, icon) {
            /*const index = Array.prototype.indexOf.call(comments, comment); //1
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
            }*/

            /*const previous = comment.previousElementSibling; //2
            const next = comment.nextElementSibling;
            const alert = showMessage(text, null, styleType, icon);
            
            if (previous) {
                previous.after(alert);
                return;
            }
            if (next) {
                next.before(alert);
                return;
            }
            comment.parentNode.appendChild(alert);*/

            const alert = showMessage(text, null, styleType, icon); //3
            comment.replaceWith(alert);

        }
    }
});