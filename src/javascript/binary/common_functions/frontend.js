var sidebar_scroll = function(elm_selector) {
    elm_selector.on('click', '#sidebar-nav li', function() {
        var clicked_li = $(this);
        $.scrollTo($('.section:eq(' + clicked_li.index() + ')'), 500);
        return false;
    }).addClass('unbind_later');

    if (elm_selector.length) {
        // grab the initial top offset of the navigation
        var selector = elm_selector.find('.sidebar');
        var width = selector.width();
        var sticky_navigation_offset_top = selector.offset().top;
        // With thanks:
        // http://www.backslash.gr/content/blog/webdevelopment/6-navigation-menu-that-stays-on-top-with-jquery

        // our function that decides weather the navigation bar should have "fixed" css position or not.
        var sticky_navigation = function() {
            var scroll_top = $(window).scrollTop(); // our current vertical position from the top

            // if we've scrolled more than the navigation, change its position to fixed to stick to top,
            // otherwise change it back to relative
            if (scroll_top > sticky_navigation_offset_top && scroll_top + selector[0].offsetHeight < document.getElementById('footer').offsetTop) {
                selector.css({'position': 'fixed', 'top': 0, 'width': width});
            } else if (scroll_top + selector[0].offsetHeight > document.getElementById('footer').offsetTop) {
                selector.css({'position': 'absolute', 'bottom': document.getElementById('footer').offsetHeight + 'px', 'top': '', 'width': width});
            } else {
                selector.css({'position': 'relative'});
            }
        };

        //run our function on load
        sticky_navigation();

        var sidebar_nav = selector.find('#sidebar-nav');
        var length = elm_selector.find('.section').length;
        $(window).on('scroll', function() {
            // and run it again every time you scroll
            sticky_navigation();

            for (var i = 0; i < length; i++) {
                var sectionOffset = $('.section:eq(' + i + ')').offset();
                if ($(window).scrollTop() === 0 || (sectionOffset && $(this).scrollTop() >= sectionOffset.top - 5)) {
                    sidebar_nav.find('li').removeClass('selected');

                    if ($(window).scrollTop() === 0) {
                        // We're at the top of the screen, so highlight first nav item
                        sidebar_nav.find('li:first-child').addClass('selected');
                    } else if ($(window).scrollTop() + $(window).height() >= $(document).height()) {
                        // We're at bottom of screen so highlight last nav item.
                        sidebar_nav.find('li:last-child').addClass('selected');
                    } else {
                        sidebar_nav.find('li:eq(' + i + ')').addClass('selected');
                    }
                }
            }
        });
    }
};

var get_started_behaviour = function() {
    // Get Started behaviour:

    var update_active_subsection = function(to_show) {
        var fragment;
        var subsection = $('.subsection');
        subsection.addClass('hidden');
        to_show.removeClass('hidden');
        var nav_back = $('.subsection-navigation .back');
        var nav_next = $('.subsection-navigation .next');

        if (to_show.hasClass('first')) {
            nav_back.addClass('button-disabled');
            nav_next.removeClass('button-disabled');
        } else if (to_show.hasClass('last')) {
            nav_back.removeClass('button-disabled');
            nav_next.addClass('button-disabled');
        } else {
            nav_back.removeClass('button-disabled');
            nav_next.removeClass('button-disabled');
        }

        fragment = to_show.find('a[name]').attr('name').slice(0, -8);
        document.location.hash = fragment;

        return false;
    };

    var to_show;
    var nav = $('.get-started').find('.subsection-navigation');
    var fragment;
    var len = nav.length;

    if (len) {
        nav.on('click', 'a', function() {
            var button = $(this);
            if (button.hasClass('button-disabled')) {
                return false;
            }
            var now_showing = $('.subsection:not(.hidden)');
            var show = button.hasClass('next') ? now_showing.next('.subsection') : now_showing.prev('.subsection');
            return update_active_subsection(show);
        });

        fragment = (location.href.split('#'))[1];
        to_show = fragment ? $('a[name=' + fragment + '-section]').parent().parent('.subsection') : $('.subsection.first');
        update_active_subsection(to_show);
    }
    select_nav_element();
};

var select_nav_element = function() {
  var $navLink = $('.nav li a');
  var $navList = $('.nav li');
  $navList.removeClass('selected');
  for (var i = 0; i < $navLink.length; i++) {
    if ($navLink[i].href.match(window.location.pathname)) {
      document.getElementsByClassName('nav')[0].getElementsByTagName('li')[i].setAttribute('class', 'selected');
      break;
    }
  }
  return;
};

var email_rot13 = function(str) {
    return str.replace(/[a-zA-Z]/g, function(c){return String.fromCharCode((c<="Z"?90:122)>=(c=c.charCodeAt(0)+13)?c:c-26);});
};

var display_cs_contacts = function () {
    $('.contact-content').on("change", '#cs_telephone_number', function () {
        var val = $(this).val();
        $('#display_cs_telephone').text(val);
    });
    $('#cs_contact_eaddress').html(email_rot13("<n uers=\"znvygb:fhccbeg@ovanel.pbz\" ery=\"absbyybj\">fhccbeg@ovanel.pbz</n>"));
};

var change_chat_icon = function () {
  // desk.com change icon - crude way
  var len = $('#live-chat-icon').length;
  if( len > 0 ) {
      var timer = null;
      var updateIcon =  function () {
          var image_url = page.url.url_for_static('images/pages/contact/chat-icon.svg');
          var desk_widget = $('.a-desk-widget');
          var image_str = desk_widget.css('background-image');
          if(image_str) {
              desk_widget.css({
                  'background-image': 'url("' + image_url + '")',
                  'background-size': 'contain',
                  'min-width': 50,
                  'min-height': 50,
                  'width': 'auto'
              });

              if(image_str.match(/live-chat-icon/g)){
                  clearInterval(timer);
              }
          }
          desk_widget.removeAttr('onmouseover onmouseout');
      };
      timer = setInterval(updateIcon, 500);
  }
};

var render_desk_widget = function() {
       new DESK.Widget({
                version: 1,
                site: 'binary.desk.com',
                port: '80',
                type: 'chat',
                id: 'live-chat-icon',
                displayMode: 0,  //0 for popup, 1 for lightbox
                features: {
                        offerAlways: true,
                        offerAgentsOnline: false,
                        offerRoutingAgentsAvailable: false,
                        offerEmailIfChatUnavailable: false
                },
                fields: {
                        ticket: {
                                // desc: &#x27;&#x27;,
                // labels_new: &#x27;&#x27;,
                // priority: &#x27;&#x27;,
                // subject: &#x27;&#x27;,
                // custom_loginid: &#x27;&#x27;
                        },
                        interaction: {
                                // email: &#x27;&#x27;,
                // name: &#x27;&#x27;
                        },
                        chat: {
                                //subject: ''
                        },
                        customer: {
                                // company: &#x27;&#x27;,
                // desc: &#x27;&#x27;,
                // first_name: &#x27;&#x27;,
                // last_name: &#x27;&#x27;,
                // locale_code: &#x27;&#x27;,
                // title: &#x27;&#x27;,
                // custom_loginid: &#x27;&#x27;
                        }
                }
        }).render();
};

var show_live_chat_icon = function() {
    if(typeof DESK === 'undefined') {
        loadCSS("https://d3jyn100am7dxp.cloudfront.net/assets/widget_embed_191.cssgz?1367387331");
        loadJS("https://d3jyn100am7dxp.cloudfront.net/assets/widget_embed_libraries_191.jsgz?1367387332");
    }

    var desk_load = setInterval(function() {
        if(typeof DESK !== "undefined") {
            render_desk_widget();
            change_chat_icon();
            clearInterval(desk_load);
        }
    }, 80);
};

var display_career_email = function() {
    $("#hr_contact_eaddress").html(email_rot13("<n uers=\"znvygb:ue@ovanel.pbz\" ery=\"absbyybj\">ue@ovanel.pbz</n>"));
};

function check_login_hide_signup() {
    if (page.client.is_logged_in) {
        $('#verify-email-form').remove();
        $('.break').attr('style', 'margin-bottom:1em');
    }
}

function hide_if_logged_in() {
    if (page.client.is_logged_in) {
        $('.client_logged_out').remove();
    }
}

// use function to generate elements and append them
// e.g. element is select and element to append is option
function appendTextValueChild(element, text, value, disabled){
    var option = document.createElement("option");
    option.text = text;
    option.value = value;
    if (disabled === 'disabled') {
      option.setAttribute('disabled', 'disabled');
    }
    element.appendChild(option);
    return;
}

// append numbers to a drop down menu, eg 1-30
function dropDownNumbers(select, startNum, endNum) {
    select.appendChild(document.createElement("option"));

    for (var i = startNum; i <= endNum; i++){
        var option = document.createElement("option");
        option.text = i;
        option.value = i;
        select.appendChild(option);
    }
    return;

}

function dropDownMonths(select, startNum, endNum) {
    var months = [
        page.text.localize("Jan"),
        page.text.localize("Feb"),
        page.text.localize("Mar"),
        page.text.localize("Apr"),
        page.text.localize("May"),
        page.text.localize("Jun"),
        page.text.localize("Jul"),
        page.text.localize("Aug"),
        page.text.localize("Sep"),
        page.text.localize("Oct"),
        page.text.localize("Nov"),
        page.text.localize("Dec")
    ];
    select.appendChild(document.createElement("option"));
    for (var i = startNum; i <= endNum; i++){
        var option = document.createElement("option");
        if (i <= '9') {
            option.value = '0' + i;
        } else {
            option.value = i;
        }
        for (var j = i; j <= i; j++) {
            option.text = months[j-1];
        }
        select.appendChild(option);
    }
    return;
}

function generateBirthDate(country){
    var days    = document.getElementById('dobdd'),
        months  = document.getElementById('dobmm'),
        year    = document.getElementById('dobyy');

    if (document.getElementById('dobdd').length > 1) return;

    //days
    dropDownNumbers(days, 1, 31);
    //months
    dropDownMonths(months, 1, 12);
    var currentYear = new Date().getFullYear();
    var startYear = currentYear - 100;
    var endYear = currentYear - 17;
    //years
    dropDownNumbers(year, startYear, endYear);
    if (japanese_client()) {
      days.options[0].innerHTML = page.text.localize('Day');
      months.options[0].innerHTML = page.text.localize('Month');
      year.options[0].innerHTML = page.text.localize('Year');
    }
    return;
}

function isValidDate(day, month, year){
    // Assume not leap year by default (note zero index for Jan)
    var daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

    // If evenly divisible by 4 and not evenly divisible by 100,
    // or is evenly divisible by 400, then a leap year
    if ( ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0) ) {
        daysInMonth[1] = 29;
    }
    return day <= daysInMonth[--month];
}

function handle_residence_state_ws(){
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
            appendTextValueChild(select, states_list[i].text, states_list[i].value);
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
              appendTextValueChild(select, residence.text, residence.value, residence.disabled ? 'disabled' : undefined);
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
          if (status.clients_country === 'jp' || japanese_client()) {
              if (!document.getElementById('japan-label')) $('#residence').parent().append('<label id="japan-label">' + page.text.localize('Japan') + '</label>');
          } else {
              $('#residence').removeClass('invisible');
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

function generateState() {
    var state = document.getElementById('address-state');
    if (state.length !== 0) return;
    appendTextValueChild(state, Content.localize().textSelect, '');
    if (page.client.residence !== "") {
      BinarySocket.send({ states_list: page.client.residence });
    }
    return;
}

// returns true if internet explorer browser
function isIE() {
  return /(msie|trident|edge)/i.test(window.navigator.userAgent) && !window.opera;
}

// trim leading and trailing white space
function Trim(str){
  while(str.charAt(0) == (" ") ){str = str.substring(1);}
  while(str.charAt(str.length-1) ==" " ){str = str.substring(0,str.length-1);}
  return str;
}

function limitLanguage(lang) {
  if (page.language() !== lang && !Login.is_login_pages()) {
    window.location.href = page.url_for_language(lang);
  }
  if (document.getElementById('language_select')) {
    $('#language_select').remove();
    $('#gmt-clock').removeClass();
    $('#gmt-clock').addClass('gr-6 gr-12-m');
    $('#contact-us').removeClass();
    $('#contact-us').addClass('gr-6 gr-hide-m');
  }
}

function checkClientsCountry() {
  var clients_country = localStorage.getItem('clients_country');
  if (clients_country) {
    var str;
    if (clients_country === 'jp') {
      limitLanguage('JA');
    } else if (clients_country === 'id') {
      limitLanguage('ID');
    } else {
      $('#language_select').show();
    }
  } else {
    BinarySocket.init();
    BinarySocket.send({"website_status" : "1"});
  }
}

function japanese_client() {
    return (page.language().toLowerCase() === 'ja' || (Cookies.get('residence') === 'jp') || localStorage.getItem('clients_country') === 'jp');
}

function change_blog_link(lang) {
  var regex = new RegExp(lang);
  if (!regex.test($('.blog a').attr('href'))) {
    $('.blog a').attr('href', $('.blog a').attr('href') + '/' + lang + '/');
  }
}

//hide and show hedging value if trading purpose is set to hedging
function detect_hedging($purpose, $hedging) {
    $purpose.change(function(evt) {
      if ($purpose.val() === 'Hedging') {
        $hedging.removeClass('invisible');
      }
      else if ($hedging.is(":visible")) {
        $hedging.addClass('invisible');
      }
      return;
    });
}

function jqueryuiTabsToDropdown($container) {
    var $ddl = $('<select/>');
    $container.find('li a').each(function() {
        $ddl.append($('<option/>', {text: $(this).text(), value: $(this).attr('href')}));
    });
    $ddl.change(function() {
        $container.find('li a[href="' + $(this).val() + '"]').click();
    });
    return $ddl;
}

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

$(function() {
    $( "#accordion" ).accordion({
      heightStyle: "content",
      collapsible: true,
      active: false
    });
});

var $buoop = {
  vs: {i:10, f:39, o:30, s:5, c:39},
  l: page.language().toLowerCase(),
  url: 'https://whatbrowser.org/'
};
function $buo_f(){
 var e = document.createElement("script");
 e.src = "//browser-update.org/update.min.js";
 document.body.appendChild(e);
}
try {
  document.addEventListener("DOMContentLoaded", $buo_f,false);
} catch(e) {
  window.attachEvent("onload", $buo_f);
}

module.exports = {
    sidebar_scroll: sidebar_scroll,
    get_started_behaviour: get_started_behaviour,
    display_cs_contacts: display_cs_contacts,
    show_live_chat_icon: show_live_chat_icon,
    display_career_email: display_career_email,
    check_login_hide_signup: check_login_hide_signup,
    hide_if_logged_in: hide_if_logged_in,
    generateBirthDate: generateBirthDate,
    isValidDate: isValidDate,
    handle_residence_state_ws: handle_residence_state_ws,
    isIE: isIE,
    Trim: Trim,
    checkClientsCountry: checkClientsCountry,
    japanese_client: japanese_client,
    change_blog_link: change_blog_link,
    detect_hedging: detect_hedging,
    jqueryuiTabsToDropdown: jqueryuiTabsToDropdown,
    handle_account_opening_settings: handle_account_opening_settings,
};
