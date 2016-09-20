var Statement = (function(){
    'use strict';
    var moment = require('../../../../lib/moment/moment');
    var StringUtil = require('../../../common_functions/string_util').StringUtil,
        addComma = require('../../../websocket_pages/trade/common').addComma;
    var getStatementData = function(statement) {
        var dateObj = new Date(statement["transaction_time"] * 1000),
            momentObj = moment.utc(dateObj),
            dateStr = momentObj.format("YYYY-MM-DD"),
            timeStr = momentObj.format("HH:mm:ss") + ' GMT';

        var statement_data = {
            'date'    : dateStr + "\n" + timeStr,
            'ref'     : statement["transaction_id"],
            'payout'  : parseFloat(statement["payout"]).toFixed(2),
            'action'  : StringUtil.toTitleCase(statement["action_type"]),
            'amount'  : addComma(parseFloat(statement["amount"])),
            'balance' : addComma(parseFloat(statement["balance_after"])),
            'desc'    : statement["longcode"].replace(/\n/g, '<br />'),
            'id'      : statement["contract_id"],
            'app_id'  : statement["app_id"]
        };

        return statement_data;
    };

    var generateCSV = function(allData){
        var columns = ['date', 'ref', 'payout', 'action', 'desc', 'amount', 'balance'],
            header  = ['Date', 'Reference ID', 'Potential Payout', 'Action', 'Description', 'Credit/Debit'].map(function(str){return page.text.localize(str);});
        header.push(page.text.localize('Balance') + (TUser.get().currency ? ' (' + TUser.get().currency + ')' : ''));
        var sep = ',',
            csv = [header.join(sep)];
        if (allData && allData.length > 0) {
            csv = csv.concat(
                allData.map(function(data){
                    return columns.map(function(key){
                       return (data[key] ? data[key].replace(new RegExp(sep, 'g'), '').replace(new RegExp('\n|<br />', 'g'), ' ') : '');
                    }).join(sep);
                })
            );
        }
        return csv.join('\r\n');
    };

    var external = {
        getStatementData: getStatementData,
        generateCSV: generateCSV
    };

    return external;
}());

module.exports = {
    Statement: Statement,
};
