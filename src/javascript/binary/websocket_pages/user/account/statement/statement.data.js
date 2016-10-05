var StatementData = (function(){
    var hasOlder = true;

    function initSocket(){
        BinarySocket.init({
            onmessage: function(msg){
                var response = JSON.parse(msg.data);
                if (response) {
                    var type = response.msg_type;
                    if (type === 'statement'){
                        StatementWS.statementHandler(response);
                    } else if (type === 'oauth_apps') {
                        addTooltip(StatementUI.setOauthApps(buildOauthApps(response.oauth_apps)));
                    }
                }
            }
        });
        BinarySocket.send({'oauth_apps': 1});
    }

    function getStatement(opts){
        var req = {statement: 1, description: 1};
        if(opts){
            $.extend(true, req, opts);
        }
        if ($('#jump-to').val() !== '') {
            req.date_to = Math.floor((moment.utc($('#jump-to').val()).valueOf() / 1000)) + (24*60*60);
            req.date_from = 0;
        }

        BinarySocket.send(req);
    }

    return {
        initSocket: initSocket,
        getStatement: getStatement,
        hasOlder: hasOlder
    };
}());

module.exports = {
    StatementData: StatementData,
};
