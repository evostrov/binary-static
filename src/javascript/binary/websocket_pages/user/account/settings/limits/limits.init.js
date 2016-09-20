var LimitsWS = (function(){
    "use strict";

    function limitsHandler(response){
        var limits = response.get_limits;
        LimitsUI.fillLimitsTable(limits);

        var elem_withdrawal_limit = document.getElementById("withdrawal-limit");
        var elem_already_withdraw = document.getElementById("already-withdraw");
        var elem_withdrawal_limit_aggregate = document.getElementById("withdrawal-limit-aggregate");

        if(limits['lifetime_limit'] === 99999999 && limits['num_of_days_limit'] === 99999999) {
            elem_withdrawal_limit.textContent = Content.localize().textAuthenticatedWithdrawal;
        } else {
            var text_WithdrawalLimits     = Content.localize().textWithdrawalLimitsEquivalant;
            var text_WithrawalAmount      = Content.localize().textWithrawalAmountEquivalant;
            var text_CurrentMaxWithdrawal = Content.localize().textCurrentMaxWithdrawalEquivalant;
            var client_currency           = 'EUR';
            var num_of_days_limit         = addComma(limits['num_of_days_limit']).split('.')[1] === '00' ? addComma(limits['num_of_days_limit']).split('.')[0] : addComma(limits['num_of_days_limit']);
            var already_withdraw          = limits["withdrawal_since_inception_monetary"]; // no need for addComma since it is already string like "1,000"
            var remainder                 = addComma(limits['remainder']).split('.')[1] === '00' ? addComma(limits['remainder']).split('.')[0] : addComma(limits['remainder']);

            if((/^(iom)$/i).test(TUser.get().landing_company_name)) { // MX
                text_WithdrawalLimits = Content.localize().textWithdrawalLimitsEquivalantDay;
                text_WithrawalAmount  = Content.localize().textWithrawalAmountEquivalantDay;
                elem_withdrawal_limit.textContent = template(text_WithdrawalLimits, [limits['num_of_days'], client_currency, num_of_days_limit]);
                elem_already_withdraw.textContent = template(text_WithrawalAmount,  [client_currency, already_withdraw, limits['num_of_days']]);
            }
            else {
                if((/^(costarica|japan)$/i).test(TUser.get().landing_company_name)) { // CR , JP
                    text_WithdrawalLimits     = Content.localize().textWithdrawalLimits;
                    text_WithrawalAmount      = Content.localize().textWithrawalAmount;
                    text_CurrentMaxWithdrawal = Content.localize().textCurrentMaxWithdrawal;
                    client_currency           = TUser.get().currency || page.client.get_storage_value('currencies');
                }
                elem_withdrawal_limit.textContent = template(text_WithdrawalLimits, [client_currency, num_of_days_limit]);
                elem_already_withdraw.textContent = template(text_WithrawalAmount,  [client_currency, already_withdraw]);
            }
            elem_withdrawal_limit_aggregate.textContent = template(text_CurrentMaxWithdrawal, [client_currency, remainder]);
        }
    }

    function limitsError(error){
        document.getElementById('withdrawal-title').setAttribute('style', 'display:none');
        document.getElementById('limits-title').setAttribute('style', 'display:none');
        var errorElement = document.getElementsByClassName('notice-msg')[0];
        if ((error && error.code === 'FeatureNotAvailable' && page.client.is_virtual()) || page.client.is_virtual()) {
          errorElement.innerHTML = page.text.localize('This feature is not relevant to virtual-money accounts.');
        } else if (error && error.message) {
          errorElement.innerHTML = error.message;
        } else {
          errorElement.innerHTML = page.text.localize('An error occured') + '.';
        }
        document.getElementById('client_message').setAttribute('style', 'display:block');
    }

    function initTable(){
        document.getElementById('client_message').setAttribute('style', 'display:none');
        LimitsUI.clearTableContent();
    }

    return {
        limitsHandler: limitsHandler,
        limitsError: limitsError,
        clean: initTable
    };
}());

module.exports = {
    LimitsWS: LimitsWS,
};
