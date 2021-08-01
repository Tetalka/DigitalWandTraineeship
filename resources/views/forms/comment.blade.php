<div class='col-12 px-0 comment-form'>
    <div class=''>
        @if ($user)
            <h5>{{ $user->name }}</h5>
            <div class=''>
                <div>
                    <div class='form-group'>
                        <label class='w-100'>
                            <div class='form-control' name='text' contenteditable></div>
                        </label>
                    </div>
                    <button class='btn btn-outline-success btn-submit'>Отправить</button>
                </div>
            </div>
        @else
            <h5 class='text-muted text-center'>Войдите, чтобы оставлять комментарии</h5>
        @endif  
    </div>
</div>