var APITokenWS = (function() {
    "use strict";

    var errorClass = 'errorfield';
    var hideClass  = 'invisible';
    var tableContainer = '#tokens_list';
    var maxTokens = 30;

    function hide(s) { return function() { $(s).addClass(hideClass); }; }
    function show(s) { return function() { $(s).removeClass(hideClass); }; }

    var hideForm  = hide('#token_form');
    var showForm  = show('#token_form');
    var hideTable = hide(tableContainer);
    var showTable = show(tableContainer);

    function init() {
        if (japanese_client()) {
            window.location.href = page.url.url_for('user/settingsws');
            return;
        }

        Content.populate();
        BinarySocket.init({
            onmessage: function(msg) {
                var response = JSON.parse(msg.data);
                if (response.msg_type === "api_token") {
                    responseHandler(response);
                }
            }
        });

        showLoadingImage($(tableContainer));
        BinarySocket.send({api_token: 1});

        $('#btnCreate').click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            var params = getFormParams();
            if (!params) {
                return;
            }
            createToken(params);
        });
    }

    function responseHandler(response) {
        if ('error' in response) {
            showErrorMessage(response.error.message);
            return;
        }

        clearMessages();

        var api_token = response.api_token;
        var tokens    = api_token.tokens;
        var newToken;

        if (tokens.length >= maxTokens) {
            hideForm();
            showErrorMessage(text.localize('The maximum number of tokens ([_1]) has been reached.', [maxTokens]));
        } else {
            showForm();
        }

        if ('new_token' in api_token) {
            showSubmitSuccess('New token created.');
            $('#txtName').val('');
            newToken = response.echo_req.new_token;
        } else if ('delete_token' in api_token) {
            var deleted = response.echo_req.delete_token;
            $('#' + deleted)
                .removeClass('new')
                .addClass('deleting')
                .fadeOut(700, function() {
                    $(this).remove();
                    populateTokensList(tokens);
                });
            return;
        }

        populateTokensList(tokens, newToken);
    }

    // -----------------------
    // ----- Tokens List -----
    // -----------------------
    function populateTokensList(tokens, newToken) {
        var $tableContainer = $(tableContainer);
        if (tokens.length === 0) {
            hideTable();
            return;
        }
        showTable();
        $tableContainer.empty();

        var headers = ['Name', 'Token', 'Scopes', 'Last Used', 'Action'];
        var columns = ['name', 'token', 'scopes', 'last-used', 'action'];
        new FlexTableUI({
            id:        'tokens_table',
            container: tableContainer,
            header:    headers.map(function(s) { return text.localize(s); }),
            cols:      columns,
            data:      tokens,
            formatter: formatToken,
            style: function($row, token) {
                if (token.display_name === newToken) {
                    $row.addClass('new');
                }
                $row.attr('id', token.token);
                createDeleteButton($row, token);
            }
        });
        showLocalTimeOnHover('td.last-used');
    }

    function createDeleteButton($row, token) {
        var message = text.localize('Are you sure that you want to permanently delete token');
        var $button = $('<button/>', {class: 'button btnDelete', text: text.localize('Delete')});
        $button.click(function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (!window.confirm(message + ': "' + token.display_name + '"?')) {
                return;
            }
            deleteToken(token.token);
        });
        $row.children('.action').html(
            $('<span/>', {class: 'button'})
                .append($button)
        );
    }

    function capitalise(v) {
        return v.charAt(0).toUpperCase() + v.slice(1);
    }

    function formatToken(token) {
        var lastUsed = (token.last_used ? token.last_used + ' GMT': text.localize('Never Used'));
        var scopes = token.scopes.map(capitalise);
        return [
            token.display_name,
            token.token,
            scopes.join(', '),
            lastUsed,
            ''  // btnDelete
        ];
    }

    // ---------------------------
    // ----- Form Validation -----
    // ---------------------------
    function getFormParams() {
        clearMessages();
        var nameID  = '#txtName';
        var name = $(nameID).val().trim();

        function err(a, b) {
            return Content.errorMessage(a, b);
        }

        var letters = Content.localize().textLetters,
            numbers = Content.localize().textNumbers,
            space   = Content.localize().textSpace;

        var error = (
            (!name.length       && err('req')) ||
            (!checkBounds(name) && err('range', template('([_1]-[_2])', [2, 32]))) ||
            (!noSymbols(name)   && err('reg', [letters, numbers, '_'])) ||
            null
        );

        if (error) {
            showError(nameID, error);
            return null;
        }

        var scopes = $('input:checkbox[name="scopes[]"]:checked')
            .map(function() { return this.value; })
            .get();
        if (scopes.length === 0) {
            showError('#scopes', 'Please select at least one scope.');
            return null;
        }

        return {name: name, scopes: scopes};
    }

    function noSymbols(string) {
        return /^\w+$/.test(string);
    }

    function checkBounds(string) {
        return (string.length >= 2) && (string.length <= 32);
    }

    // ---------------------------
    // ----- Actions Process -----
    // ---------------------------
    function createToken(params) {
        BinarySocket.send({
            api_token: 1,
            new_token: params.name,
            new_token_scopes: params.scopes,
        });
    }

    function deleteToken(token) {
        BinarySocket.send({
            api_token:    1,
            delete_token: token,
        });
    }

    // -----------------------------
    // ----- Message Functions -----
    // -----------------------------
    function showErrorMessage(msg) {
        $('#token_message').removeClass(hideClass)
            .find('p')
            .attr('class', errorClass)
            .html(text.localize(msg));
    }

    function showSubmitSuccess(msg) {
        $('#formMessage')
            .attr('class', 'success-msg')
            .html('<ul class="checked"><li>' + text.localize(msg) + '</li></ul>')
            .css('display', 'block')
            .delay(3000)
            .fadeOut(1000);
    }

    function showError(fieldID, err) {
        $(fieldID).parent()
            .append($('<p/>', {class: errorClass, text: text.localize(err)}));
    }

    function clearMessages() {
        $('#frmNewToken .' + errorClass).remove();
        $('#token_message').addClass(hideClass);
        $('#formMessage').html('');
    }

    return {
        init: init,
    };
}());
