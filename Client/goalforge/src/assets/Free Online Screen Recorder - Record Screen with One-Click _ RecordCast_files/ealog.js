(function (e, t) {
    var n = e.amplitude || {_q: [], _iq: {}};
    var r = t.createElement("script")
    ;r.type = "text/javascript";
    r.async = true
    ;r.src = "https://cdn.amplitude.com/libs/amplitude-4.5.2-min.gz.js"
    ;r.onload = function () {
        if (e.amplitude.runQueuedFunctions) {
            e.amplitude.runQueuedFunctions()
        } else {
            console.log("[Amplitude] Error: could not load SDK")
        }
    }
    ;var i = t.getElementsByTagName("script")[0];
    i.parentNode.insertBefore(r, i)
    ;

    function s(e, t) {
        e.prototype[t] = function () {
            this._q.push([t].concat(Array.prototype.slice.call(arguments, 0)));
            return this
        }
    }

    var o = function () {
            this._q = [];
            return this
        }
    ;var a = ["add", "append", "clearAll", "prepend", "set", "setOnce", "unset"]
    ;
    for (var u = 0; u < a.length; u++) {
        s(o, a[u])
    }
    n.Identify = o;
    var c = function () {
            this._q = []
            ;
            return this
        }
    ;var l = ["setProductId", "setQuantity", "setPrice", "setRevenueType", "setEventProperties"]
    ;
    for (var p = 0; p < l.length; p++) {
        s(c, l[p])
    }
    n.Revenue = c
    ;var d = ["init", "logEvent", "logRevenue", "setUserId", "setUserProperties", "setOptOut",
        "setVersionName", "setDomain", "setDeviceId", "setGlobalUserProperties", "identify",
        "clearUserProperties", "setGroup", "logRevenueV2", "regenerateDeviceId", "logEventWithTimestamp",
        "logEventWithGroups", "setSessionId", "resetSessionId"]
    ;

    function v(e) {
        function t(t) {
            e[t] = function () {
                e._q.push([t].concat(Array.prototype.slice.call(arguments, 0)))
            }
        }

        for (var n = 0; n < d.length; n++) {
            t(d[n])
        }
    }

    v(n);
    n.getInstance = function (e) {
        e = (!e || e.length === 0 ? "$default_instance" : e).toLowerCase()
        ;
        if (!n._iq.hasOwnProperty(e)) {
            n._iq[e] = {_q: []};
            v(n._iq[e])
        }
        return n._iq[e]
    }
    ;e.amplitude = n
})(window, document);

amplitude.getInstance().init(document.getElementById('ealog_info').getAttribute('api-key'));
amplitude.getInstance().setUserId(null);
window.ealog = window.ealog || {
    addEvent: function (eventType, eventProperties = null) {
        let displayMode = window.fj.displayMode ? window.fj.displayMode : "browser";
        if (window.fj.displayMode) {
            if (!eventProperties)
                eventProperties = {};
            eventProperties.displayMode = displayMode;
        }
        switch (eventType) {
            case "revenue":
                eventProperties = Object.assign({}, eventProperties);
                let revenue = new amplitude.Revenue()
                    .setPrice(eventProperties.price)
                    .setQuantity(eventProperties.quantity || 1)
                    .setRevenueType(eventProperties.revenueType || "income");
                delete eventProperties.price;
                delete eventProperties.quantity;
                delete eventProperties.revenueType;
                revenue.setEventProperties(eventProperties);
                amplitude.getInstance().logRevenueV2(revenue);
                break;
            default:
                amplitude.getInstance().logEvent(eventType, eventProperties);
                break;
        }

        //debug ealog data;
        if (document.getElementById('ealog_info').getAttribute('env') == 'dev') {
            console.log({
                eventType: eventType,
                eventProperties: eventProperties
            });
        }

        return this;
    },

    resetAccountId: function (userEmail = '') {
        this.setUserProperties({'account id': userEmail});
        return this;
    },

    setUserProperties: function (userProperties) {
        amplitude.getInstance().setUserProperties(userProperties);
        return this;
    }
};

function getQueryString(name) {
    let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

$(document).ready(() => {
    try {
        let source = getQueryString("source");
        let location = getQueryString("location");
        let version = getQueryString("version");
        let ab = getQueryString("ab");
        if (source) {
            let other_data = {};
            if (location)
                other_data.location = location;
            if (location)
                other_data.version = version;
            if (location)
                other_data.ab = ab;

            let source_data = {
                source: source,
                other: other_data
            };
            window.ealog.addEvent("external link", {source: source, location: location, version: version, ab: ab});
            window.localStorage.setItem("source_data", JSON.stringify(source_data));
        }
    } catch (e) {
        console.error(e);
    }
});

window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-ealog]').forEach((ele) => {
        ele.addEventListener('click', () => {
            let data = ele.dataset.ealog.split(',');
            ealog.addEvent(data[0], new Function('return ' + data[1])());
        });
    });
});
!function () {
    //页面访问事件
    let pathName = document.location.pathname;
    if (window.name === pathName)
        return;
    window.name = pathName;
    let res;
    if (pathName === '/') {
        ealog.addEvent('home page visit');
    } else if (pathName === '/apps/screen-recorder/') {
        ealog.addEvent('Select the audio page visit');
    };

    //页面点击事件
    $(document).on("click",".ea_data_home_btn_top_click",function () {
        ealog.addEvent('recordcast click',{
            "button":"top start"
        });
    });

    $(document).on("click",".ea_data_home_btn_bottom_click",function () {
        ealog.addEvent('recordcast click',{
            "button":"bottom start"
        });
    });

    $(document).on("click",".ea_data_record_re",function () {
        ealog.addEvent('re-record click');
    });

    $(document).on("click",".ea_data_record_download",function () {
        ealog.addEvent('download click');
    });

    $(document).on("click",".ea_data_record_edit",function () {
        ealog.addEvent('edit click');
    });

    $(document).on("click",".ea_data_record_share_fb",function () {
        ealog.addEvent('share click',{
            "share platforms":"facebook"
        });
    });

    $(document).on("click",".ea_data_record_share_tw",function () {
        ealog.addEvent('share click',{
            "share platforms":"twitter"
        });
    });






}();
