var Login = require('../base/login').Login;
var Endpoint = require('./endpoint').Endpoint;
var GetStartedJP = require('./get_started_jp').GetStartedJP;
var JobDetails = require('./job_details').JobDetails;
var Platforms = require('./platforms').Platforms;
var Regulation = require('./regulation').Regulation;
var MBTradePage = require('../websocket_pages/mb_trade/mb_tradepage').MBTradePage;
var Scroll = require('../common_functions/scroll').Scroll;
var GetStarted = require('./get_started').GetStarted;
var Contact = require('./contact').Contact;
var Careers = require('./careers').Careers;
var Home = require('./home').Home;
var WhyUs = require('./why_us').WhyUs;
var CharityPage = require('./charity').CharityPage;
var TermsAndConditions = require('./tnc').TermsAndConditions;

pjax_config_page('/home', function() {
    return {
        onLoad: function() {
            Home.init();
        }
    };
});

pjax_config_page('/why-us', function() {
    return {
        onLoad: function() {
            WhyUs.init();
        },
        onUnload: function() {
            Scroll.offScroll();
        }
    };
});

pjax_config_page('/volidx-markets', function() {
    return {
        onLoad: function() {
            Scroll.goToHashSection();
        },
        onUnload: function() {
            Scroll.offScroll();
        }
    };
});

pjax_config_page('/open-source-projects', function() {
    return {
        onLoad: function() {
            Scroll.sidebar_scroll($('.open-source-projects'));
        },
        onUnload: function() {
            Scroll.offScroll();
        }
    };
});

pjax_config_page('/payment-agent', function() {
    return {
        onLoad: function() {
            Scroll.sidebar_scroll($('.payment-agent'));
        },
        onUnload: function() {
            Scroll.offScroll();
        }
    };
});

pjax_config_page('/get-started', function() {
    return {
        onLoad: function() {
            GetStarted.get_started_behaviour();
        },
        onUnload: function() {
            Scroll.offScroll();
        },
    };
});

pjax_config_page('/contact', function() {
    return {
        onLoad: function() {
            Contact.init();
        },
    };
});

pjax_config_page('/careers', function() {
    return {
        onLoad: function() {
            Careers.display_career_email();
        },
    };
});


pjax_config_page('/charity', function() {
    return {
        onLoad: CharityPage.onLoad,
        onUnload: CharityPage.onUnload
    };
});

pjax_config_page('/terms-and-conditions', function() {
    return {
        onLoad: function() {
            TermsAndConditions.init();
        },
    };
});

pjax_config_page('/trading', function () {
    return {
        onLoad: function(){if(/\/trading\.html/.test(window.location.pathname)) TradePage.onLoad();},
        onUnload: function(){if(/\/trading\.html/.test(window.location.pathname)) TradePage.onUnload();}
    };
});

pjax_config_page('/trading_beta', function () {
    return {
        onLoad: function(){TradePage_Beta.onLoad();},
        onUnload: function(){TradePage_Beta.onUnload();}
    };
});

pjax_config_page('/multi_barriers_trading', function () {
    return {
        onLoad: function(){MBTradePage.onLoad();},
        onUnload: function(){MBTradePage.onUnload();}
    };
});

pjax_config_page('/jp_trading', function () {
    return {
        onLoad: function(){JPTradePage.onLoad();},
        onUnload: function(){JPTradePage.onUnload();}
    };
});

pjax_config_page('/platforms', function() {
    return {
        onLoad: function() {
            Platforms.init();
        }
    };
});

pjax_config_page_require_auth("/cashier/deposit-jp", function(){
    return {
        onLoad: function() {
            CashierJP.init('deposit');
        }
    };
});

pjax_config_page_require_auth("/cashier/withdraw-jp", function(){
    return {
        onLoad: function() {
            CashierJP.init('withdraw');
        }
    };
});

pjax_config_page("/endpoint", function(){
    return {
        onLoad: function() {
            Endpoint.init();
        }
    };
});

pjax_config_page('/get-started-jp', function() {
    return {
        onLoad: function() {
            GetStartedJP.init();
        }
    };
});

pjax_config_page('/open-positions', function() {
  return {
      onLoad: function() {if (/\/open-positions\.html/.test(window.location.pathname)) Scroll.scrollToHashSection();}
  };
});

pjax_config_page('/open-positions/job-details', function() {
    return {
        onLoad: function() {
            JobDetails.init();
            JobDetails.addEventListeners();
        }
    };
});

pjax_config_page('/regulation', function() {
    return {
        onLoad: function() {
            Regulation.init();
        }
    };
});
