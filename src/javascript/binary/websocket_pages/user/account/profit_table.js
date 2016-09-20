var ProfitTable = (function(){
    'use strict';
    var getProfitTabletData = function(transaction) {
        var moment = require('../../../../lib/moment/moment');
        var buyMoment = moment.utc(transaction["purchase_time"] * 1000),
            sellMoment = moment.utc(transaction["sell_time"] * 1000),
            buyPrice = parseFloat(transaction["buy_price"]).toFixed(2),
            sellPrice = parseFloat(transaction["sell_price"]).toFixed(2);

        var profit_table_data = {
            'buyDate'   : buyMoment.format("YYYY-MM-DD") + "\n" + buyMoment.format("HH:mm:ss") + ' GMT',
            'ref'       : transaction["transaction_id"],
            'payout'    : parseFloat(transaction["payout"]).toFixed(2),
            'buyPrice'  : buyPrice,
            'sellDate'  : sellMoment.format("YYYY-MM-DD") + "\n" + sellMoment.format("HH:mm:ss") + ' GMT',
            'sellPrice' : sellPrice,
            'pl'        : Number(sellPrice - buyPrice).toFixed(2),
            'desc'      : transaction["longcode"],
            'id'        : transaction["contract_id"],
            'app_id'    : transaction["app_id"]
        };

        return profit_table_data;
    };

    var external = {
        getProfitTabletData: getProfitTabletData
    };

    return external;
}());

module.exports = {
    ProfitTable: ProfitTable,
};
