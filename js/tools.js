$(document).ready(function() {

    $.validator.addMethod('imei',
        function(curValue, element) {
            return this.optional(element) || curValue.match(/^\d{18}$/);
        },
        'Серийный номер должен состоять из 18 цифр'
    );

    $('body').on('focus', '.form-input input', function() {
        $(this).parent().addClass('focus');
    });

    $('body').on('blur', '.form-input input', function() {
        $(this).parent().removeClass('focus');
        if ($(this).val() != '') {
            $(this).parent().addClass('full');
        } else {
            $(this).parent().removeClass('full');
        }
    });

	$('body').on('keyup', '.form-input input', function() {
		if ($(this).val() != '') {
			$(this).parent().addClass('full');
		} else {
			$(this).parent().removeClass('full');
		}
	});

	$('body').on('click', '.form-input-clear', function(e) {
		$(this).parent().find('input').val('').trigger('change').trigger('blur');
		e.preventDefault();
	});

    $('body').on('change', '.form-file input', function() {
        var curInput = $(this);
        var curField = curInput.parents().filter('.form-file');
        var curName = curInput.val().replace(/.*(\/|\\)/, '');
        if (curName != '') {
            var curNameArray = curName.split('.');
            var curExt = curNameArray[curNameArray.length - 1];
            curNameArray.pop();
            var curNameText = curNameArray.join('.');
            if (curNameText.length > 5) {
                curNameText = curNameText.substring(0, 5) + '...' + curNameText.slice(-1);
            }

            curField.find('.form-file-input span').html('<svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#input-file"></use></svg>' + '<em>' + curNameText + '.' + curExt + '<a href="#"><svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#input-file-remove"></use></svg></a></em>');
            curField.addClass('full');
        } else {
            curField.find('.form-file-input span').html('<svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#input-file"></use></svg>' + curField.find('.form-file-input span').attr('data-placeholder'));
            curField.removeClass('full');
        }
    });

    $('body').on('click', '.form-file-input span em a', function(e) {
        var curField = $(this).parents().filter('.form-file');
        curField.find('input').val('');
        curField.find('.form-file-input span').html('<svg><use xlink:href="' + pathTemplate + 'images/sprite.svg#input-file"></use></svg>' + curField.find('.form-file-input span').attr('data-placeholder'));
        curField.removeClass('full');
        e.preventDefault();
    });

    $('form').each(function() {
        initForm($(this));
    });

    $('body').on('click', '.form-input-hint', function() {
        if ($(this).hasClass('open')) {
            $(this).removeClass('open');
        } else {
            $('.form-input-hint.open').removeClass('open');
            $(this).addClass('open');
        }
    });

    $(document).click(function(e) {
        if ($(e.target).parents().filter('.form-input-hint').length == 0 && !$(e.target).hasClass('form-input-hint')) {
            $('.form-input-hint').removeClass('open');
        }
    });

    $('body').on('click', '.result-btn a', function(e) {
        var curLink = $(this);
        $('.result').addClass('loading');
        $.ajax({
            type: 'POST',
            url: curLink.attr('href'),
            dataType: 'html',
            cache: false
        }).fail(function(jqXHR, textStatus, errorThrown) {
            alert('Сервис временно недоступен, попробуйте позже.');
            curForm.removeClass('loading');
        }).done(function(html) {
            $('.promo-form-inner').html(html);
            $('.promo-form-content form').each(function() {
                initForm($(this));
            });
        });
        e.preventDefault();
    });

});

function initForm(curForm) {
	curForm.find('input.imei').attr('autocomplete', 'off');
    curForm.find('input.imei').mask('000000000000000000');

	curForm.find('.form-input input').each(function() {
		if ($(this).val() != '') {
			$(this).parent().addClass('full');
		} else {
			$(this).parent().removeClass('full');
		}
	});

    curForm.find('.form-input input:focus').each(function() {
        $(this).trigger('focus');
    });

    curForm.find('.form-input input').blur(function(e) {
        $(this).val($(this).val()).change();
    });

    curForm.validate({
        ignore: '',
        submitHandler: function(form) {
            curForm.addClass('loading');
            var formData = new FormData(form);

            if (curForm.find('[type=file]').length != 0) {
                var file = curForm.find('[type=file]')[0].files[0];
                formData.append('file', file);
            }

            $.ajax({
                type: 'POST',
                url: curForm.attr('action'),
                processData: false,
                contentType: false,
                dataType: 'html',
                data: formData,
                cache: false
            }).fail(function(jqXHR, textStatus, errorThrown) {
                alert('Сервис временно недоступен, попробуйте позже.');
                curForm.removeClass('loading');
            }).done(function(html) {
                $('.promo-form-inner').html(html);
            });
        }
    });
}