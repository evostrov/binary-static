var Login = require('../base/login').Login;
var objectNotEmpty = require('../base/utility').objectNotEmpty;
var Validate = require('../common_functions/validation').Validate;
var japanese_client = require('../common_functions/country_base').japanese_client;
var CommonFunctions = require('../common_functions/common_functions').CommonFunctions;
var generateBirthDate = require('./attach_dom/birth_date_dropdown').generateBirthDate;

var AccountOpening = (function() {
    function handle_account_opening_settings(response) {
        var country = response.get_settings.country_code;
        if (country && country !== null) {
          $('#real-form').show();
          page.client.residence = country;
          generateBirthDate(country);
          generateState();
          if (/maltainvestws/.test(window.location.pathname)) {
            var settings = response.get_settings;
            var title = document.getElementById('title'),
                fname = document.getElementById('fname'),
                lname = document.getElementById('lname'),
                dobdd = document.getElementById('dobdd'),
                dobmm = document.getElementById('dobmm'),
                dobyy = document.getElementById('dobyy');
            var inputs = document.getElementsByClassName('input-disabled');
            if (settings.salutation) {
              title.value = settings.salutation;
              fname.value = settings.first_name;
              lname.value = settings.last_name;
              var date = moment.utc(settings.date_of_birth * 1000);
              dobdd.value = date.format('DD').replace(/^0/, '');
              dobmm.value = date.format('MM');
              dobyy.value = date.format('YYYY');
              for (i = 0; i < inputs.length; i++) {
                  inputs[i].disabled = true;
              }
              document.getElementById('address1').value = settings.address_line_1;
              document.getElementById('address2').value = settings.address_line_2;
              document.getElementById('address-town').value = settings.address_city;
              window.state = settings.address_state;
              document.getElementById('address-postcode').value = settings.address_postcode;
              document.getElementById('tel').value = settings.phone;
            } else {
              for (i = 0; i < inputs.length; i++) {
                  inputs[i].disabled = false;
              }
            }
          }
          return;
        } else if (document.getElementById('move-residence-here') && $('#residence-form').is(':hidden')) {
          show_residence_form();
          return;
        }
    }

    function show_residence_form() {
        var residenceForm = $('#residence-form');
        var residenceDisabled = $('#residence-disabled');
        residenceDisabled.insertAfter('#move-residence-here');
        $('#error-residence').insertAfter('#residence-disabled');
        residenceDisabled.removeAttr('disabled');
        residenceForm.show();
        residenceForm.submit(function(evt) {
          evt.preventDefault();
          if (Validate.fieldNotEmpty(residenceDisabled.val(), document.getElementById('error-residence'))) {
            page.client.set_cookie('residence', residenceDisabled.val());
            page.client.residence = residenceDisabled.val();
            BinarySocket.send({set_settings:1, residence:page.client.residence});
          }
          return;
        });
    }

    function generateState() {
        var state = document.getElementById('address-state');
        if (state.length !== 0) return;
        CommonFunctions.appendTextValueChild(state, Content.localize().textSelect, '');
        if (page.client.residence !== "") {
          BinarySocket.send({ states_list: page.client.residence });
        }
        return;
    }

    function handle_residence_state_ws() {
      BinarySocket.init({
        onmessage: function(msg){
          var select;
          var response = JSON.parse(msg.data);
          var type = response.msg_type;
          var residenceDisabled = $('#residence-disabled');
          if (type === 'set_settings') {
            var errorElement = document.getElementById('error-residence');
            if (response.hasOwnProperty('error')) {
              if (response.error.message) {
                errorElement.innerHTML = response.error.message;
                errorElement.setAttribute('style', 'display:block');
              }
              return;
            } else {
              errorElement.setAttribute('style', 'display:none');
              BinarySocket.send({landing_company: page.client.residence});
              return;
            }
          } else if (type === 'landing_company') {
            Cookies.set('residence', page.client.residence, {domain: '.' + document.domain.split('.').slice(-2).join('.'), path: '/'});
            if ( ((page.client.can_upgrade_gaming_to_financial(response.landing_company) && !page.client.is_virtual()) || page.client.can_upgrade_virtual_to_financial(response.landing_company) ) && !/maltainvestws/.test(window.location.href)) {
              window.location.href = page.url.url_for('new_account/maltainvestws');
              return;
            } else if (page.client.can_upgrade_virtual_to_japan(response.landing_company) && page.client.is_virtual() && !/japanws/.test(window.location.href)) {
              window.location.href = page.url.url_for('new_account/japanws');
              return;
            } else if (!$('#real-form').is(':visible')) {
              BinarySocket.send({residence_list:1});
              $('#residence-form').hide();
              residenceDisabled.insertAfter('#move-residence-back');
              $('#error-residence').insertAfter('#residence-disabled');
              residenceDisabled.attr('disabled', 'disabled');
              generateBirthDate(page.client.residence);
              generateState();
              $('#real-form').show();
              return;
            }
          } else if (type === 'states_list') {
            select = document.getElementById('address-state');
            var states_list = response.states_list;
            for (i = 0; i < states_list.length; i++) {
                CommonFunctions.appendTextValueChild(select, states_list[i].text, states_list[i].value);
            }
            select.parentNode.parentNode.show();
            if (window.state) {
              select.value = window.state;
            }
            return;
          } else if (type === 'residence_list'){
            select = document.getElementById('residence-disabled') || document.getElementById('residence');
            var phoneElement   = document.getElementById('tel'),
                residenceValue = page.client.residence,
                residence_list = response.residence_list;
            if (residence_list.length > 0){
              for (i = 0; i < residence_list.length; i++) {
                var residence = residence_list[i];
                if (select) {
                  CommonFunctions.appendTextValueChild(select, residence.text, residence.value, residence.disabled ? 'disabled' : undefined);
                }
                if (residenceValue !== 'jp' && phoneElement && phoneElement.value === '' && residence.phone_idd && residenceValue === residence.value) {
                  phoneElement.value = '+' + residence.phone_idd;
                }
              }
              if (residenceValue && select){
                  select.value = residenceValue;
              }
              if (document.getElementById('virtual-form')) {
                  BinarySocket.send({website_status:1});
              }
            }
            return;
          } else if (type === 'website_status') {
            var status  = response.website_status;
            if (status && status.clients_country) {
              var clientCountry = $('#residence option[value="' + status.clients_country + '"]');
              if (!clientCountry.attr('disabled')) {
                  clientCountry.prop('selected', true);
              }
              var email_consent_parent = $('#email_consent').parent().parent();
              if (status.clients_country === 'jp' || japanese_client()) {
                  if (!document.getElementById('japan-label')) $('#residence').parent().append('<label id="japan-label">' + page.text.localize('Japan') + '</label>');
                  email_consent_parent.removeClass('invisible');
              } else {
                  $('#residence').removeClass('invisible')
                                 .on('change', function() {
                                     if ($(this).val() === 'jp') {
                                         email_consent_parent.removeClass('invisible');
                                     } else {
                                         email_consent_parent.addClass('invisible');
                                     }
                                 });
              }
            }
            return;
          } else if (type === 'get_financial_assessment' && objectNotEmpty(response.get_financial_assessment)) {
              for (var key in response.get_financial_assessment) {
                  if (key) {
                      var val = response.get_financial_assessment[key];
                      $("#" + key).val(val);
                  }
              }
              return;
          }
        }
      });
    }

    return {
        handle_account_opening_settings: handle_account_opening_settings,
        handle_residence_state_ws      : handle_residence_state_ws,
    };
})();

module.exports = {
    AccountOpening: AccountOpening,
};
