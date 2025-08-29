if (!window.text_) {
    //本地化函数
    window.text_ = (localKey) => {
        if(!localKey)
            return 'Unknown';

        let [category, key] = localKey.split('.');
        if (window.localLanguage !== undefined &&
            window.localLanguage[category] !== undefined &&
            window.localLanguage[category][key] !== undefined
        ) {
            return window.localLanguage[category][key];
        } else {
            if (key) {
                return key;
            } else {
                return localKey;
            }
        }
    }
}

if (!window.text_printf) {
    window.text_printf = function() {
        if (arguments.length < 1)
            return null;

        var key = arguments[0];
        var val = text_(key);

        var idx = 1;
        while (val.indexOf("%s") != -1 && typeof arguments[idx] != 'undefined') {
            val = val.replace("%s", arguments[idx]);
            idx++;
        }
        return val;
    };
}
if (!timestampToDate) {
    function timestampToDate(timestamp) {
        let map = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ];
        let date = new Date(timestamp * 1000);
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
        return map[month] + ' ' + day + ', ' + year;
    }
}
(function () {
    var t, e, n, r, a, o, i, l, u, s, c, h, p, g, v, f, d, m, y, C, T, w, $, D, S = [].slice,
        k = [].indexOf || function (t) {
            for (var e = 0, n = this.length; n > e; e++) if (e in this && this[e] === t) return e;
            return -1
        };
    t = window.jQuery || window.Zepto || window.$, t.payment = {}, t.payment.fn = {}, t.fn.payment = function () {
        var e, n;
        return n = arguments[0], e = 2 <= arguments.length ? S.call(arguments, 1) : [], t.payment.fn[n].apply(this, e)
    }, a = /(\d{1,4})/g, t.payment.cards = r = [{
        type: "maestro",
        patterns: [5018, 502, 503, 506, 56, 58, 639, 6220, 67],
        format: a,
        length: [12, 13, 14, 15, 16, 17, 18, 19],
        cvcLength: [3],
        luhn: !0
    }, {
        type: "forbrugsforeningen",
        patterns: [600],
        format: a,
        length: [16],
        cvcLength: [3],
        luhn: !0
    }, {type: "dankort", patterns: [5019], format: a, length: [16], cvcLength: [3], luhn: !0}, {
        type: "visa",
        patterns: [4],
        format: a,
        length: [13, 16],
        cvcLength: [3],
        luhn: !0
    }, {
        type: "mastercard",
        patterns: [51, 52, 53, 54, 55, 22, 23, 24, 25, 26, 27],
        format: a,
        length: [16],
        cvcLength: [3],
        luhn: !0
    }, {
        type: "amex",
        patterns: [34, 37],
        format: /(\d{1,4})(\d{1,6})?(\d{1,5})?/,
        length: [15],
        cvcLength: [3, 4],
        luhn: !0
    }, {
        type: "dinersclub",
        patterns: [30, 36, 38, 39],
        format: /(\d{1,4})(\d{1,6})?(\d{1,4})?/,
        length: [14],
        cvcLength: [3],
        luhn: !0
    }, {
        type: "discover",
        patterns: [60, 64, 65, 622],
        format: a,
        length: [16],
        cvcLength: [3],
        luhn: !0
    }, {
        type: "unionpay",
        patterns: [62, 88],
        format: a,
        length: [16, 17, 18, 19],
        cvcLength: [3],
        luhn: !1
    }, {type: "jcb", patterns: [35], format: a, length: [16], cvcLength: [3], luhn: !0}], e = function (t) {
        var e, n, a, o, i, l, u, s;
        for (t = (t + "").replace(/\D/g, ""), o = 0, l = r.length; l > o; o++) for (e = r[o], s = e.patterns, i = 0, u = s.length; u > i; i++) if (a = s[i], n = a + "", t.substr(0, n.length) === n) return e
    }, n = function (t) {
        var e, n, a;
        for (n = 0, a = r.length; a > n; n++) if (e = r[n], e.type === t) return e
    }, p = function (t) {
        var e, n, r, a, o, i;
        for (r = !0, a = 0, n = (t + "").split("").reverse(), o = 0, i = n.length; i > o; o++) e = n[o], e = parseInt(e, 10), (r = !r) && (e *= 2), e > 9 && (e -= 9), a += e;
        return a % 10 === 0
    }, h = function (t) {
        var e;
        return null != t.prop("selectionStart") && t.prop("selectionStart") !== t.prop("selectionEnd") ? !0 : null != ("undefined" != typeof document && null !== document && null != (e = document.selection) ? e.createRange : void 0) && document.selection.createRange().text ? !0 : !1
    }, $ = function (t, e) {
        var n, r, a, o, i, l;
        try {
            r = e.prop("selectionStart")
        } catch (u) {
            o = u, r = null
        }
        return i = e.val(), e.val(t), null !== r && e.is(":focus") ? (r === i.length && (r = t.length), i !== t && (l = i.slice(r - 1, +r + 1 || 9e9), n = t.slice(r - 1, +r + 1 || 9e9), a = t[r], /\d/.test(a) && l === "" + a + " " && n === " " + a && (r += 1)), e.prop("selectionStart", r), e.prop("selectionEnd", r)) : void 0
    }, m = function (t) {
        var e, n, r, a, o, i, l, u;
        for (null == t && (t = ""), r = "０１２３４５６７８９", a = "0123456789", i = "", e = t.split(""), l = 0, u = e.length; u > l; l++) n = e[l], o = r.indexOf(n), o > -1 && (n = a[o]), i += n;
        return i
    }, d = function (e) {
        var n;
        return n = t(e.currentTarget), setTimeout(function () {
            var t;
            return t = n.val(), t = m(t), t = t.replace(/\D/g, ""), $(t, n)
        })
    }, v = function (e) {
        var n;
        return n = t(e.currentTarget), setTimeout(function () {
            var e;
            return e = n.val(), e = m(e), e = t.payment.formatCardNumber(e), $(e, n)
        })
    }, l = function (n) {
        var r, a, o, i, l, u, s;
        return o = String.fromCharCode(n.which), !/^\d+$/.test(o) || (r = t(n.currentTarget), s = r.val(), a = e(s + o), i = (s.replace(/\D/g, "") + o).length, u = 16, a && (u = a.length[a.length.length - 1]), i >= u || null != r.prop("selectionStart") && r.prop("selectionStart") !== s.length) ? void 0 : (l = a && "amex" === a.type ? /^(\d{4}|\d{4}\s\d{6})$/ : /(?:^|\s)(\d{4})$/, l.test(s) ? (n.preventDefault(), setTimeout(function () {
            return r.val(s + " " + o)
        })) : l.test(s + o) ? (n.preventDefault(), setTimeout(function () {
            return r.val(s + o + " ")
        })) : void 0)
    }, o = function (e) {
        var n, r;
        return n = t(e.currentTarget), r = n.val(), 8 !== e.which || null != n.prop("selectionStart") && n.prop("selectionStart") !== r.length ? void 0 : /\d\s$/.test(r) ? (e.preventDefault(), setTimeout(function () {
            return n.val(r.replace(/\d\s$/, ""))
        })) : /\s\d?$/.test(r) ? (e.preventDefault(), setTimeout(function () {
            return n.val(r.replace(/\d$/, ""))
        })) : void 0
    }, f = function (e) {
        var n;
        return n = t(e.currentTarget), setTimeout(function () {
            var e;
            return e = n.val(), e = m(e), e = t.payment.formatExpiry(e), $(e, n)
        })
    }, u = function (e) {
        var n, r, a;
        return r = String.fromCharCode(e.which), /^\d+$/.test(r) ? (n = t(e.currentTarget), a = n.val() + r, /^\d$/.test(a) && "0" !== a && "1" !== a ? (e.preventDefault(), setTimeout(function () {
            return n.val("0" + a + " / ")
        })) : /^\d\d$/.test(a) ? (e.preventDefault(), setTimeout(function () {
            var t, e;
            return t = parseInt(a[0], 10), e = parseInt(a[1], 10), e > 2 && 0 !== t ? n.val("0" + t + " / " + e) : n.val("" + a + " / ")
        })) : void 0) : void 0
    }, s = function (e) {
        var n, r, a;
        return r = String.fromCharCode(e.which), /^\d+$/.test(r) ? (n = t(e.currentTarget), a = n.val(), /^\d\d$/.test(a) ? n.val("" + a + " / ") : void 0) : void 0
    }, c = function (e) {
        var n, r, a;
        return a = String.fromCharCode(e.which), "/" === a || " " === a ? (n = t(e.currentTarget), r = n.val(), /^\d$/.test(r) && "0" !== r ? n.val("0" + r + " / ") : void 0) : void 0
    }, i = function (e) {
        var n, r;
        return n = t(e.currentTarget), r = n.val(), 8 !== e.which || null != n.prop("selectionStart") && n.prop("selectionStart") !== r.length ? void 0 : /\d\s\/\s$/.test(r) ? (e.preventDefault(), setTimeout(function () {
            return n.val(r.replace(/\d\s\/\s$/, ""))
        })) : void 0
    }, g = function (e) {
        var n;
        return n = t(e.currentTarget), setTimeout(function () {
            var t;
            return t = n.val(), t = m(t), t = t.replace(/\D/g, "").slice(0, 4), $(t, n)
        })
    }, w = function (t) {
        var e;
        return t.metaKey || t.ctrlKey ? !0 : 32 === t.which ? !1 : 0 === t.which ? !0 : t.which < 33 ? !0 : (e = String.fromCharCode(t.which), !!/[\d\s]/.test(e))
    }, C = function (n) {
        var r, a, o, i;
        return r = t(n.currentTarget), o = String.fromCharCode(n.which), /^\d+$/.test(o) && !h(r) ? (i = (r.val() + o).replace(/\D/g, ""), a = e(i), a ? i.length <= a.length[a.length.length - 1] : i.length <= 16) : void 0
    }, T = function (e) {
        var n, r, a;
        return n = t(e.currentTarget), r = String.fromCharCode(e.which), /^\d+$/.test(r) && !h(n) ? (a = n.val() + r, a = a.replace(/\D/g, ""), a.length > 6 ? !1 : void 0) : void 0
    }, y = function (e) {
        var n, r, a;
        return n = t(e.currentTarget), r = String.fromCharCode(e.which), /^\d+$/.test(r) && !h(n) ? (a = n.val() + r, a.length <= 4) : void 0
    }, D = function (e) {
        var n, a, o, i, l;
        return n = t(e.currentTarget), l = n.val(), i = t.payment.cardType(l) || "unknown", n.hasClass(i) ? void 0 : (a = function () {
            var t, e, n;
            for (n = [], t = 0, e = r.length; e > t; t++) o = r[t], n.push(o.type);
            return n
        }(), n.removeClass("unknown"), n.removeClass(a.join(" ")), n.addClass(i), n.toggleClass("identified", "unknown" !== i), n.trigger("payment.cardType", i))
    }, t.payment.fn.formatCardCVC = function () {
        return this.on("keypress", w), this.on("keypress", y), this.on("paste", g), this.on("change", g), this.on("input", g), this
    }, t.payment.fn.formatCardExpiry = function () {
        return this.on("keypress", w), this.on("keypress", T), this.on("keypress", u), this.on("keypress", c), this.on("keypress", s), this.on("keydown", i), this.on("change", f), this.on("input", f), this
    }, t.payment.fn.formatCardNumber = function () {
        return this.on("keypress", w), this.on("keypress", C), this.on("keypress", l), this.on("keydown", o), this.on("keyup", D), this.on("paste", v), this.on("change", v), this.on("input", v), this.on("input", D), this
    }, t.payment.fn.restrictNumeric = function () {
        return this.on("keypress", w), this.on("paste", d), this.on("change", d), this.on("input", d), this
    }, t.payment.fn.cardExpiryVal = function () {
        return t.payment.cardExpiryVal(t(this).val())
    }, t.payment.cardExpiryVal = function (t) {
        var e, n, r, a;
        return a = t.split(/[\s\/]+/, 2), e = a[0], r = a[1], 2 === (null != r ? r.length : void 0) && /^\d+$/.test(r) && (n = (new Date).getFullYear(), n = n.toString().slice(0, 2), r = n + r), e = parseInt(e, 10), r = parseInt(r, 10), {
            month: e,
            year: r
        }
    }, t.payment.validateCardNumber = function (t) {
        var n, r;
        return t = (t + "").replace(/\s+|-/g, ""), /^\d+$/.test(t) ? (n = e(t), n ? (r = t.length, k.call(n.length, r) >= 0 && (n.luhn === !1 || p(t))) : !1) : !1
    }, t.payment.validateCardExpiry = function (e, n) {
        var r, a, o;
        return "object" == typeof e && "month" in e && (o = e, e = o.month, n = o.year), e && n ? (e = t.trim(e), n = t.trim(n), /^\d+$/.test(e) && /^\d+$/.test(n) && e >= 1 && 12 >= e ? (2 === n.length && (n = 70 > n ? "20" + n : "19" + n), 4 !== n.length ? !1 : (a = new Date(n, e), r = new Date, a.setMonth(a.getMonth() - 1), a.setMonth(a.getMonth() + 1, 1), a > r)) : !1) : !1
    }, t.payment.validateCardCVC = function (e, r) {
        var a, o;
        return e = t.trim(e), /^\d+$/.test(e) ? (a = n(r), null != a ? (o = e.length, k.call(a.cvcLength, o) >= 0) : e.length >= 3 && e.length <= 4) : !1
    }, t.payment.cardType = function (t) {
        var n;
        return t ? (null != (n = e(t)) ? n.type : void 0) || null : null
    }, t.payment.formatCardNumber = function (n) {
        var r, a, o, i;
        return n = n.replace(/\D/g, ""), (r = e(n)) ? (o = r.length[r.length.length - 1], n = n.slice(0, o), r.format.global ? null != (i = n.match(r.format)) ? i.join(" ") : void 0 : (a = r.format.exec(n), null != a ? (a.shift(), a = t.grep(a, function (t) {
            return t
        }), a.join(" ")) : void 0)) : n
    }, t.payment.formatExpiry = function (t) {
        var e, n, r, a;
        return (n = t.match(/^\D*(\d{1,2})(\D+)?(\d{1,4})?/)) ? (e = n[1] || "", r = n[2] || "", a = n[3] || "", a.length > 0 ? r = " / " : " /" === r ? (e = e.substring(0, 1), r = "") : 2 === e.length || r.length > 0 ? r = " / " : 1 === e.length && "0" !== e && "1" !== e && (e = "0" + e, r = " / "), e + r + a) : ""
    }
}).call(this);
if (!window.FJGlobalariable){
    window.FJGlobalariable = {productName: 'recordcast'};
}

if(window.FJTools){
    $.post = FJTools.post;
}


/**
 * 判断当前计划能否升级到目标计划
 *
 * @param curPlan
 * @param tarPlan
 * @returns {boolean}
 */
window.checkPlanCanUpgrade = function(curPlan, tarPlan) {
    if(curPlan.package == tarPlan.package && curPlan.period == tarPlan.period)
    {
        return false;
    }

    var packageValue = {
        "free": 0,
        "basic": 1,
        "plus": 2,
        "business": 3
    }
    if(packageValue[curPlan.package] > packageValue[tarPlan.package])
    {
        return false;
    }

    var periodValue = {
        'null': 0,
        "monthly": 1,
        "annual": 2
    }
    if(periodValue[curPlan.period] > periodValue[tarPlan.period])
    {
        return false;
    }

    return true;
}

window.FJGlobalariable.modSubscription = {
    config: {
        stripeApiKey: 'pk_live_51JATtdKYgOU6fS37epMRlbQgIJ3UGmqqO2FEs5jCT7m8dAD4psPziTXlJnw2BRIBvOb41cvnGMekcsyYTMK5ZkH400efbhZPE1',
        googleKey: '6Lfh6rEZAAAAAE8innRwHZvAfWlTqHg-lHyu8zjU',
    },
    paypalPlan: function(plan) {
        return null;
    },
    //网络请求
    network: {
        createPlan: (plan, coupon = null, create_plan_lock = null) => {
            return new Promise((resolve, reject) => {
                let post_data = {
                    plan: plan,
                    coupon: coupon,
                    create_plan_lock: create_plan_lock,
                };
                if (window.csrf_token) {
                    post_data[window.csrf_token] = 1;
                }

                jQuery.ajax({
                    type: "POST",
                    url: "/subscription/create_plan",
                    data: post_data,
                    success: function (response) {
                        resolve(response);
                    },
                    error: function (error) {
                        reject({type: 'ajax', error: error});
                    }
                });
            });
        },
        createByPaypal: (plan, data, countryCode, coupon = '') => {
            let user_info = {
                browser: window.fjuser.getBrowser(),
                geo: countryCode,
                device: window.fjuser.getDeviceInfo(),
            };
            return new Promise((resolve, reject) => {
                let post_data = {
                    plan: plan,
                    data: JSON.stringify(data),
                    user_info: JSON.stringify(user_info),
                    coupon: coupon
                };
                if (window.csrf_token) {
                    post_data[window.csrf_token] = 1;
                }

                jQuery.ajax({
                    type: "POST",
                    url: "/subscription/pp/create",
                    data: post_data,
                    success: function (response) {
                        resolve(response);
                    },
                    error: function (error) {
                        reject({type: 'ajax', error: error});
                    }
                });
            });
        },
        checkoutPaypalSubscriptionStatus: (sub_id) => {
            return new Promise((resolve, reject) => {
                let post_data = {
                    sub_id: sub_id,
                };
                if (window.csrf_token) {
                    post_data[window.csrf_token] = 1;
                }

                jQuery.ajax({
                    type: "POST",
                    url: "/subscription/pp/checkout_subscription_status",
                    data: post_data,
                    success: function (response) {
                        resolve(response);
                    },
                    error: function (error) {
                        reject({type: 'ajax', error: error});
                    }
                });
            });
        },
        subscription: (plan, name, countryCode, sendToken = true, coupon = null) => {
            return new Promise((resolve, reject) => {
                let create = (token = null) => {
                    let user_info = {
                        browser: window.fjuser.getBrowser(),
                        geo: countryCode,
                        device: window.fjuser.getDeviceInfo()
                    };

                    let post_data = {
                        name: name,
                        plan: plan,
                        //recaptcha: null
                        coupon: coupon,
                        user_info: JSON.stringify(user_info)
                    };
                    if (window.csrf_token) {
                        post_data[window.csrf_token] = 1;
                    }
                    if (token) {
                        post_data['token'] = token;
                    }

                    jQuery.ajax({
                        type: "POST",
                        url: "/subscription/create",
                        data: post_data,
                        success: function (response) {
                            resolve(response);
                        },
                        error: function (error) {
                            reject({type: 'ajax', error: error});
                        }
                    });

                }

                if (sendToken) {
                    Stripe.setPublishableKey(window.FJGlobalariable.modSubscription.config.stripeApiKey);
                    let $form = jQuery('#card-element');
                    Stripe.card.createToken($form, (status, response) => {
                        if (response.error) {
                            reject({type:'stripe', error: response.error});
                        } else {
                            create(response.id);
                        }
                    });
                } else {
                    create();
                }
            });
        },
        upgrade: (plan, coupon, countryCode) => {
            return new Promise((resolve, reject) => {
                let user_info = {
                    browser: window.fjuser.getBrowser(),
                    geo: countryCode,
                    device: window.fjuser.getDeviceInfo()
                };
                let post_data = {
                    plan: plan,
                    coupon: coupon,
                    user_info: JSON.stringify(user_info)
                };
                if (window.csrf_token) {
                    post_data[window.csrf_token] = 1;
                };
                jQuery.ajax({
                    type: "POST",
                    url: "/subscription/upgrade",
                    data: post_data,
                    success: function (response) {
                        resolve(response);
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            });
        },
        //修改信用卡信息
        changeCard: (id = '#card-change-element') => {
            return new Promise((resolve, reject) => {
                Stripe.setPublishableKey(window.FJGlobalariable.modSubscription.config.stripeApiKey);
                let $form = jQuery(id);
                Stripe.card.createToken($form, (status, response) => {
                    if (response.error) {
                        reject({type:'stripe', error: response.error});
                    } else {
                        let token = response.id;
                        let post_data = {
                            token: token,
                        };
                        if (window.csrf_token) {
                            post_data[window.csrf_token] = 1;
                        }
                        jQuery.ajax({
                            type: "POST",
                            url: "/subscription/update_card",
                            data: post_data,
                            success: function (response) {
                                resolve(response);
                            },
                            error: function (error) {
                                reject({type: 'ajax', error: error});
                            }
                        });
                    }
                });
            });
        },
        updateInvoices: () => {
            return new Promise((resolve, reject) => {
                let post_data = {
                };
                if (window.csrf_token) {
                    post_data[window.csrf_token] = 1;
                };
                jQuery.ajax({
                    type: "POST",
                    url: "/subscription/get_invoices",
                    data: post_data,
                    success: function (response) {
                        resolve(response);
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            });
        },
        getSubscription: () => {
            return new Promise((resolve, reject) => {
                let post_data = {
                };
                if (window.csrf_token) {
                    post_data[window.csrf_token] = 1;
                }
                jQuery.ajax({
                    type: "POST",
                    url: "/subscription/get_subscription_info",
                    data: post_data,
                    success: function (response) {
                        resolve(response);
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            });
        },
        /**
         * 应用优惠码
         * @returns {Promise<void>}
         */
        redeemCoupon: (coupon, plan) => {
            return new Promise((resolve, reject) => {
                let post_data = {coupon, plan};
                if (window.csrf_token) {
                    post_data[window.csrf_token] = 1;
                }
                jQuery.ajax({
                    type: "POST",
                    url: "/subscription/redeem_coupon",
                    data: post_data,
                    success: function (response) {
                        resolve(response);
                    },
                    error: function (error) {
                        reject(error);
                    }
                });
            });
        },
    },
    //订阅计划静态数据
    planData: [
        {
            name: 'SUB.FREE_NAME', //套餐名字，
            package: 'free', //订阅套餐可能值 free, basic, full
            isPopular: false,
            price: {
                monthly: 0,
                annual: 0,
            },
            features: [
                {
                    icon: 'tick',
                    text: 'SUB.FREE_FEATURE_1',
                },
                {
                    icon: 'tick',
                    text: 'SUB.FREE_FEATURE_2',
                },
                {
                    icon: 'tick',
                    text: 'SUB.FREE_FEATURE_3',
                }
            ],
        },
        {
            name: 'SUB.PLUS_NAME', //套餐名字，
            package: 'plus', //订阅套餐可能值 free, base, plus
            isPopular: true,
            price: {
                monthly: 5.99,
                annual: 3.99,
            },
            features: [
                {
                    icon: 'tick',
                    text: 'SUB.PLUS_FEATURE_1',
                },
                {
                    icon: 'tick',
                    text: 'SUB.PLUS_FEATURE_2',
                },
                {
                    icon: 'tick',
                    text: 'SUB.PLUS_FEATURE_3',
                },
                {
                    icon: 'tick',
                    text: 'SUB.PLUS_FEATURE_4',
                },
                {
                    icon: 'tick',
                    text: 'SUB.PLUS_FEATURE_5',
                }
            ],
            save: '50%',
        }
    ],
    //全局状态
    state: {
        page: 'plans',  // 当前展示的页面 '' plans pay successful
        isAnnual: true, // 订阅周期是否选择年
        selectPlan: '', // 选择的订阅套餐
    },
    entry: '',
    subscriptionChangedCallback: () => {},
    getStartCallback: function() {
        this.state.page= '';
    },
    updateSubscriptionInfo: function(subscription) {
        if(!subscription)
            return;

        window.fj.currentPlan.package = subscription.package;
        window.fj.currentPlan.period = subscription.period;
        window.fj.currentPlan.last4 = subscription.last4;
        window.fj.currentPlan.price = subscription.price;
        window.fj.currentPlan.period_end = subscription.period_end;
        window.fj.currentPlan.status = subscription.status;
        window.fj.currentPlan.sub_type = subscription.sub_type;

        if (this.subscriptionChangedCallback) {
            try { // 捕获外部回调执行异常
                this.subscriptionChangedCallback(subscription);
            } catch (e){}
        }
    },
    showLoading: false,
    addSubscriptionChangedListener: function (callback) {
        let tmp = this.subscriptionChangedCallback;
        this.subscriptionChangedCallback = (subscription) => {
            tmp(subscription);
            callback(subscription);
        }
    },
    //某些请求返回未登录的回调
    noLoginResponseCallback: function () {
        PanelFunc.showSignInPane();
        window.loginToCreateProjectCallback = () => {
            this.showLoading = true;

            window.FJGlobalariable.modSubscription.network.updateInvoices().then((res) => {
                window.fj.billing.chargeHistory = res.data;
            }).catch((error) => {
            }).finally(() => {
            });

            window.FJGlobalariable.modSubscription.network.getSubscription().then((response) => {
                window.FJGlobalariable.modSubscription.updateSubscriptionInfo(response.data.subscription);
            }).catch((error) => {
            }).finally(() => {
                this.showLoading = false;
            });
        }
    }

};

window.FJGlobalariable.NoJumpFAQPages = true

//测试环境
if (-1 === location.href.indexOf('www.recordcast.com')) {
    window.FJGlobalariable.modSubscription.config = {
        stripeApiKey: 'pk_test_51JATtdKYgOU6fS37pWan4UbX7S7fDBQtZwOZDhY1Cl42AqRhHP07TcDEzwYgub9pgNbRUXkjoJ2gBlp0E8CeP8g400ZHIkdp0X',
        googleKey: '6Lfh6rEZAAAAAE8innRwHZvAfWlTqHg-lHyu8zjU',
    }
}
Vue.component('fj-sub-modal-loading', {
    template: `
    <div class="fj-sub-modal-loading" :style="this.show">
        <div class="mask"></div>
        <div class="smile">
            <img src="data:image/gif;base64,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">
            <div class="message" :style="this.showMessage">
                <span>{{window.FJGlobalariable.modSubscription.loadingMessage}}</span>
            </div>         
        </div>
    </div>
    `,
    data: function () {
        return {
            modSubscription : window.FJGlobalariable.modSubscription,
            message: '',
            localLanguage: window.localLanguage,
        };
    },
    computed: {
        show: function () {
            if (!this.modSubscription.showLoading) {
                window.FJGlobalariable.modSubscription.loadingMessage = '';
            } else {
                this.message = window.FJGlobalariable.modSubscription.loadingMessage;
            }
            return this.modSubscription.showLoading ? 'display: flex' : '';
        },
        showMessage: function () {
            return this.message ? '' : 'display: none';
        }
    }
});
Vue.component('fj-sub-period-select', {
    template: `
    <div class="fj-sub-period-select">
        <div class="period-info">
            <div class="period-name" :class="periodNameClass" @click="openDropdown" ref="dropdownBtn">
                <span>{{periodName}}</span>
                <i v-if="canSelect"></i>
            </div>
            <span class="other-info">{{periodSave}}</span>
        </div>
        <div class="period-price">
            <span class="price">{{'$' + selectPeriodPrice}}</span>
            <span class="unit">{{text_('SUB.PAY_UNIT_PRICE')}}</span>
        </div>
        <div class="dropdown" v-if="showDropdown" ref="dropdown">
            <div @click="clickPeriod('annual')">
                <span class="item-main">{{text_('SUB.PAY_BILLED_ANNUALLY')}}</span>
                <span class="item-other">{{text_('SUB.PLANS_SAVE') + saveRatio}}</span>
            </div>
            <div @click="clickPeriod('monthly')">
                <span class="item-main">{{text_('SUB.PAY_BILLED_MONTHLY')}}</span>
            </div>
        </div>
    </div>
    `,
    props: {
        selectCallback: {
            type: Function,
            default: () => {}
        },
        selectPeriod: {
            type: String,
            required: true
        }
    },
    data: function () {
        return {
            showDropdown: false,
            localLanguage: window.localLanguage,
        }
    },
    computed: {
        periodNameClass: function () {
            if(!this.canSelect) {
                return 'disabled';
            }

            return this.showDropdown ? 'active' : '';
        },
        periodSave: function () {
            let amount = (window.FJGlobalariable.modSubscription.state.selectPlan.price.monthly - window.FJGlobalariable.modSubscription.state.selectPlan.price.annual) * 12;
            return  this.selectPeriod === 'monthly' ? '' : text_printf('SUB.PLANS_SAVE_A_YEAR', amount.toFixed(2));
        },
        periodName: function () {
            return this.selectPeriod === 'annual' ?
                text_('SUB.PAY_BILLED_ANNUALLY') :
                text_('SUB.PAY_BILLED_MONTHLY') ;
        },
        saveRatio: function () {
            return ' ' + window.FJGlobalariable.modSubscription.state.selectPlan.save;
        },
        selectPeriodPrice: function () {
            return this.selectPeriod === 'annual' ?
                window.FJGlobalariable.modSubscription.state.selectPlan.price.annual :
                window.FJGlobalariable.modSubscription.state.selectPlan.price.monthly ;
        },
        canSelect: function () {
            let package = window.fj.currentPlan.package;
            let period = window.fj.currentPlan.period;
            let selectPackage = window.FJGlobalariable.modSubscription.state.selectPlan.package;
            let power = {
                'free': 0,
                'basic': 1,
                'plus': 2,
                'business': 3,
            };

            if (package !== 'free' && period === 'annual') {
                return false;
            } else {
                if (power[selectPackage] > power[package]) {
                    return true;
                } else {
                    return false;
                }
            }
        }
    },
    methods: {
        openDropdown: function () {
            if (!this.canSelect) {
                return;
            }

            this.showDropdown = !this.showDropdown;
        },
        clickPeriod: function (period) {
            this.selectCallback(period);
            this.showDropdown = false;
        }
    },
    mounted: function () {
        let body = document.body;
        body.addEventListener('click', e => {
            if (!this.showDropdown) {
                return;
            }
            let dropdown = this.$refs.dropdown;
            let dropdownBtn = this.$refs.dropdownBtn;

            let el = e.target;
            while(el !== body && el !== dropdown && el !== dropdownBtn) {
                el = el.parentElement;
            }
            if(el === body) {
                this.showDropdown = false;
            }
        })
    }
});
Vue.component('fj-sub-modal-change-card', {
    template: `
            <div class="fj-sub-modal-change-card">
                <div v-if="showModal">
                    <div class="fj-sub-mask" @click="cancel"></div>
                    <div class="fj-sub-body">
                        <form class="fj-sub-form-body" id="card-change-element">
                            <div class="fj-sub-form-title">
                                {{title}}
                            </div>   
                            <div>
                                <fj-sub-text-input ref="cardNumber" :errorText="errorTexts.number" :placeholder="text_('SUB.PAY_CARD_NUMBER')" stripe="number">
                                    <template slot="head">
                                        <fj-sub-icon-card/>
                                    </template>
                                    <template slot="foot">
                                        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAAAUCAYAAACwN74uAAAACXBIWXMAAAsTAAALEwEAmpwYAAAKTWlDQ1BQaG90b3Nob3AgSUNDIHByb2ZpbGUAAHjanVN3WJP3Fj7f92UPVkLY8LGXbIEAIiOsCMgQWaIQkgBhhBASQMWFiApWFBURnEhVxILVCkidiOKgKLhnQYqIWotVXDjuH9yntX167+3t+9f7vOec5/zOec8PgBESJpHmomoAOVKFPDrYH49PSMTJvYACFUjgBCAQ5svCZwXFAADwA3l4fnSwP/wBr28AAgBw1S4kEsfh/4O6UCZXACCRAOAiEucLAZBSAMguVMgUAMgYALBTs2QKAJQAAGx5fEIiAKoNAOz0ST4FANipk9wXANiiHKkIAI0BAJkoRyQCQLsAYFWBUiwCwMIAoKxAIi4EwK4BgFm2MkcCgL0FAHaOWJAPQGAAgJlCLMwAIDgCAEMeE80DIEwDoDDSv+CpX3CFuEgBAMDLlc2XS9IzFLiV0Bp38vDg4iHiwmyxQmEXKRBmCeQinJebIxNI5wNMzgwAABr50cH+OD+Q5+bk4eZm52zv9MWi/mvwbyI+IfHf/ryMAgQAEE7P79pf5eXWA3DHAbB1v2upWwDaVgBo3/ldM9sJoFoK0Hr5i3k4/EAenqFQyDwdHAoLC+0lYqG9MOOLPv8z4W/gi372/EAe/tt68ABxmkCZrcCjg/1xYW52rlKO58sEQjFu9+cj/seFf/2OKdHiNLFcLBWK8ViJuFAiTcd5uVKRRCHJleIS6X8y8R+W/QmTdw0ArIZPwE62B7XLbMB+7gECiw5Y0nYAQH7zLYwaC5EAEGc0Mnn3AACTv/mPQCsBAM2XpOMAALzoGFyolBdMxggAAESggSqwQQcMwRSswA6cwR28wBcCYQZEQAwkwDwQQgbkgBwKoRiWQRlUwDrYBLWwAxqgEZrhELTBMTgN5+ASXIHrcBcGYBiewhi8hgkEQcgIE2EhOogRYo7YIs4IF5mOBCJhSDSSgKQg6YgUUSLFyHKkAqlCapFdSCPyLXIUOY1cQPqQ28ggMor8irxHMZSBslED1AJ1QLmoHxqKxqBz0XQ0D12AlqJr0Rq0Hj2AtqKn0UvodXQAfYqOY4DRMQ5mjNlhXIyHRWCJWBomxxZj5Vg1Vo81Yx1YN3YVG8CeYe8IJAKLgBPsCF6EEMJsgpCQR1hMWEOoJewjtBK6CFcJg4Qxwicik6hPtCV6EvnEeGI6sZBYRqwm7iEeIZ4lXicOE1+TSCQOyZLkTgohJZAySQtJa0jbSC2kU6Q+0hBpnEwm65Btyd7kCLKArCCXkbeQD5BPkvvJw+S3FDrFiOJMCaIkUqSUEko1ZT/lBKWfMkKZoKpRzame1AiqiDqfWkltoHZQL1OHqRM0dZolzZsWQ8ukLaPV0JppZ2n3aC/pdLoJ3YMeRZfQl9Jr6Afp5+mD9HcMDYYNg8dIYigZaxl7GacYtxkvmUymBdOXmchUMNcyG5lnmA+Yb1VYKvYqfBWRyhKVOpVWlX6V56pUVXNVP9V5qgtUq1UPq15WfaZGVbNQ46kJ1Bar1akdVbupNq7OUndSj1DPUV+jvl/9gvpjDbKGhUaghkijVGO3xhmNIRbGMmXxWELWclYD6yxrmE1iW7L57Ex2Bfsbdi97TFNDc6pmrGaRZp3mcc0BDsax4PA52ZxKziHODc57LQMtPy2x1mqtZq1+rTfaetq+2mLtcu0W7eva73VwnUCdLJ31Om0693UJuja6UbqFutt1z+o+02PreekJ9cr1Dund0Uf1bfSj9Rfq79bv0R83MDQINpAZbDE4Y/DMkGPoa5hpuNHwhOGoEctoupHEaKPRSaMnuCbuh2fjNXgXPmasbxxirDTeZdxrPGFiaTLbpMSkxeS+Kc2Ua5pmutG003TMzMgs3KzYrMnsjjnVnGueYb7ZvNv8jYWlRZzFSos2i8eW2pZ8ywWWTZb3rJhWPlZ5VvVW16xJ1lzrLOtt1ldsUBtXmwybOpvLtqitm63Edptt3xTiFI8p0in1U27aMez87ArsmuwG7Tn2YfYl9m32zx3MHBId1jt0O3xydHXMdmxwvOuk4TTDqcSpw+lXZxtnoXOd8zUXpkuQyxKXdpcXU22niqdun3rLleUa7rrStdP1o5u7m9yt2W3U3cw9xX2r+00umxvJXcM970H08PdY4nHM452nm6fC85DnL152Xlle+70eT7OcJp7WMG3I28Rb4L3Le2A6Pj1l+s7pAz7GPgKfep+Hvqa+It89viN+1n6Zfgf8nvs7+sv9j/i/4XnyFvFOBWABwQHlAb2BGoGzA2sDHwSZBKUHNQWNBbsGLww+FUIMCQ1ZH3KTb8AX8hv5YzPcZyya0RXKCJ0VWhv6MMwmTB7WEY6GzwjfEH5vpvlM6cy2CIjgR2yIuB9pGZkX+X0UKSoyqi7qUbRTdHF09yzWrORZ+2e9jvGPqYy5O9tqtnJ2Z6xqbFJsY+ybuIC4qriBeIf4RfGXEnQTJAntieTE2MQ9ieNzAudsmjOc5JpUlnRjruXcorkX5unOy553PFk1WZB8OIWYEpeyP+WDIEJQLxhP5aduTR0T8oSbhU9FvqKNolGxt7hKPJLmnVaV9jjdO31D+miGT0Z1xjMJT1IreZEZkrkj801WRNberM/ZcdktOZSclJyjUg1plrQr1zC3KLdPZisrkw3keeZtyhuTh8r35CP5c/PbFWyFTNGjtFKuUA4WTC+oK3hbGFt4uEi9SFrUM99m/ur5IwuCFny9kLBQuLCz2Lh4WfHgIr9FuxYji1MXdy4xXVK6ZHhp8NJ9y2jLspb9UOJYUlXyannc8o5Sg9KlpUMrglc0lamUycturvRauWMVYZVkVe9ql9VbVn8qF5VfrHCsqK74sEa45uJXTl/VfPV5bdra3kq3yu3rSOuk626s91m/r0q9akHV0IbwDa0b8Y3lG19tSt50oXpq9Y7NtM3KzQM1YTXtW8y2rNvyoTaj9nqdf13LVv2tq7e+2Sba1r/dd3vzDoMdFTve75TsvLUreFdrvUV99W7S7oLdjxpiG7q/5n7duEd3T8Wej3ulewf2Re/ranRvbNyvv7+yCW1SNo0eSDpw5ZuAb9qb7Zp3tXBaKg7CQeXBJ9+mfHvjUOihzsPcw83fmX+39QjrSHkr0jq/dawto22gPaG97+iMo50dXh1Hvrf/fu8x42N1xzWPV56gnSg98fnkgpPjp2Snnp1OPz3Umdx590z8mWtdUV29Z0PPnj8XdO5Mt1/3yfPe549d8Lxw9CL3Ytslt0utPa49R35w/eFIr1tv62X3y+1XPK509E3rO9Hv03/6asDVc9f41y5dn3m978bsG7duJt0cuCW69fh29u0XdwruTNxdeo94r/y+2v3qB/oP6n+0/rFlwG3g+GDAYM/DWQ/vDgmHnv6U/9OH4dJHzEfVI0YjjY+dHx8bDRq98mTOk+GnsqcTz8p+Vv9563Or59/94vtLz1j82PAL+YvPv655qfNy76uprzrHI8cfvM55PfGm/K3O233vuO+638e9H5ko/ED+UPPR+mPHp9BP9z7nfP78L/eE8/sl0p8zAAAAIGNIUk0AAHolAACAgwAA+f8AAIDpAAB1MAAA6mAAADqYAAAXb5JfxUYAACw0SURBVHgBACQs29MBkarO/4ShygD5+v0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABwYDAHxfNgBvVjIBAAAAAAAAAAAAAAAA+Pj4//z8/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQEBAAICAgBAAAAAAAAAAAAAAAAAAAAAJyy6/+QquwA+fv/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcFAQBwVhQAY00UAQAAAAAAAAAAAAAAAPX19f8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAApOs0QD5+v0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPn6/QCTrNEAAAAAAAAAAAAAAAAAAAAAAP39/QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/tvfAP/d4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA9OIAAPPeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD9/f0AAAAAAAAAAAAAAAAAAAAAAAAAAACdtO8A+fv/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD5+/8AnbTvAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT8/f4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/P3+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/i5QD7l6MA/JOfAAAAAAAAAAAAAAAAAAVzZgAEal4AARADAALboQAB15cAAAAAAAAAAAAAAAAA/yVfAP4lXgAACx0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/f7/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP3+/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/4OQA/IyYAP2/xgD/6ewAAAQEAAIkHwAMW0sA+2lkAAAAAACc3/4AodnxANvy/QD7/QAAFwcBAEAbCAB0LAkAIgsCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPyWogD6doUAAAAAAAAAAAAAAAAAAAAAAAAAAAD7jZoAAqyRAAZA/wAAQAkAAAAAAAAAAAAAAAAAAAAAAAHboQAD26EA/i94AP8mYgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD7mKIA/HSFAP8AAQABAP8AAAAAAAAA+QD70NoABtC7AOm4ygBhZ4wAvf0JAADw+wAAAgEAAAAAAOL3/wCi2/YAotr1AIYvCgBuLgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP3ByAD6doUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgr9AA5A7wAAAAAA9tsGAAIlAwAAAAAAAAAAAAAAAAAAAAAAAAAAAALRiAD+DiUA/xg9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANCgIAknEcAAAAAADz9f0ADQsDAAAAAADK1vYA1+H4AF9JEgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPP1/QANCwMA8/X9AAAAAAANCwMAAAAAAAAAAADz9f0ADQsDAAAAAADl6/sAGxUFAAAAAACvwfAAv870AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAmKUA+HSFAAQAAAABAP8AAAAAAAAAAAD/AAIAEwDnAOYKIQCUImEAHsvoABAgDQDwCwkAAPj7AAABAAAAAAAAAAEAAAAAAQB6yfMA/RUIAHEZBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHRcNAB0XDQAdFw0AAAAAAAAAAAAAAAAAPC8bADwuGgAtIxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8jZkAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAou9AAAAAAAAAAAAATU9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAdiYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPzAMAK/B8ABrjeQADgsDAMrW9gBdguEANyoKAG5UFABrjeQAlKzrAMrW9gCGoukAk6vrAOXr+wBdguEAlKzrAHiX5gDl7PsAXYLhACkhCACFoukAk6vrAL3M8wBrjeQA1+H5AAEAAABdguEA5ev7AAEAAACUrOsAGxUGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/3d8A93SAAAQAAQAAAAAAAAAAAAAAAAAAAAAAAwD7AAQA+wCoSHIA1SAqACbp5ABG4OkAAAAAAAACAQAAAAAAAAAAAAAAAAAAAQAAAAwEAH2z6wDU7fwAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAA1GOIAgjy2ANBgiQDdZoIAmEaqAAAAAAAAAAAALyUVAPG6agDxumoADwwHANSjXQDUo10AU0AkAAAAAABbRigA4q5jALWLTwC1jFAAxJdWADwvGwAAAAAAAAAAAKaASQDxumoA8bpqAEw6IQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+19sA/b7GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEF/wAJJ/UAAAAAAAAAAAAGEfYA/+n+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHrywAB79YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFhEEQDJ1vYAlXMcAKC37gAAAAAANyoKAJOs6wDJ1vYAKR8HAAAAAAAAAAAAAAAAAAEBAAAqIAcAAAAAADYqCwApIAgAGxUFAAAAAACuwPEAUj8QAKR/HwDX4PgAlnMcAK7B8AAAAAAAKSAIAK7B8ADl6/sAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA+5mmAP8ABAAAAP8AAAAAAAAAAAAAAAAAAAAAAA8A7QDSGDsA0Cc9ABzq3gDoDAoAJPD0ABvv8wAABgQAAAAAAAAAAAAAAAAAAAAAAAD+AAAABwMAm+D5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAy+geAH7ESgDODI8AwuQmADAW5QAAAAAAAAAAAHBWMQAAAAAAnrXVAPH0+QAAAAAAAAAAANjg7wA8LxsAlnRCAA8MBwCXr9IAiKPLAKa72QDT3ewAAAAAAC0jFABLOiEAAAAAAAAAAAAtIxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/sHIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAGGvgAAAAAAAAAAAAAAAAAAAAAAAHa+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAOrHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADN2vYADgsDAJOr6wDK1vYA5ev6ADYqCwAAAAAAoLbuAF9KEgAAAAAAAAAAACkfBwA2KgsAAAAAAAAAAAA3KgoAHBUFAOXr+wAAAAAADgsCANfh+ACvwfEA5Ov7AJKr6wAAAAAArsHwAA4KAgB7XhcAhaLpAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/ByQABAP4AAAAAAAAAAAAAAAAAAAAAAAAAAAADAPsA2x0vAPUIDgAG+/kA/AEBAAj9/gAd8vYAAAICAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIBAMPo+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAvdsQAJZzwgC2mEcAIhDsAN7wFABSPyQAAAAAAJ+01QAkGxAAAAAAAAAAAADX4e4AWkUnAAAAAADx9PkApbrYANPd7AAAAAAAAAAAAAAAAABqUi8AAAAAAMTS5gA8LhoAPC8bAACjywAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP7g5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAw79AAAAAAAAAAAAAAAAAAAAAAAA9f0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH15AD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA2+L5AIlpGQDX4PkA/wAAAK7A8AA2KgsAX0oSANfg+AAOCgMAKB8IABsVBQDJ1fUA5Or7ABsVBQA2KQoAAAAAAFI/DwDW4PkANikKAF9JEgD//wAAu8vzAHteFwDl7PsANyoKAISg6QApIAgARDUNAEPM8wAOCgMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/5+kAAAAAAAAAAAAAAAAAAAAAAAAAAAABAP8AAAAAAPIMEgAC/v0A/wEBAAEAAAD+AQEADPv9AAD+/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAADm9P0AAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAKW52ADv8/kAL0yYACQQ7AB0WjMAAAAAAMDP5ADS3ewAKB8RAAAAAADz9voA4ejyAKW62ADy9foADwwHAMSXVgCWdEIADwwHAAAAAAAPDAcAWkUnAAAAAAB4l8QAAAAAADwuGgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACMSsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPvrBQAAAAAAAAAAAAAAAAAAAAAA/xMFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/ESsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABkUBQCSrOwAd5fmAOXr+wA3KwsA5ev7ALzL8wAAAAEArsHwAA4LAwDl6/sANysLADcrCwDl6/sANysLAK7B8AC7y/QA5ev7ADcrCwB4l+YAvczzACkgCADK1/YAhaHpAKC27gA3KwsADgsDAGqN5AAcFQYADgsDAMrW9QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcGAAAAAAAAAAAAAAAAAAAAAAAAAAAA/wAAAAAAAAAE/PsA/wECAAEA/wAAAAAAAf//APwCAQAAAQEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAMBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAz9rqABscIQBZOgMAUT4jAAAAAACbstQAAAAAACggEgAAAAAA2OHvAAAAAADi6fMASnSwAMTS5gAAAAAAW0YoAKZ/SAAAAAAAalEuAAAAAAC1xt8A093sAOPp8wAAAAAALSMUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA0Y/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD76AcA/fUDAAAAAAAAAAAA/vcCAAEyBwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/xk/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACbsu0AvMvzAAAAAACTrOsAk6zrAJOs6wDl6/sAAAD/ABsVBQAAAP8AAAD/ALzM8wC8zPMAAAD/AAAA/wAbFQUA1+D4AOXr+gAAAP8AGxUFAA0KAwDz9v0ADQoCAG1UFAAbFQUA1+H4AOTr+gApHwcAAAD/ANfh+AA2KgoAZE0TAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIpJQD/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAGO3hAAH//gD/AAAA/wAAAAAAAADtCAYAAAEBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAACkOAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAAAAAAAALHD3QAAAAAAGC9pACwiFADu8vgAtMXeAAAAAAAoHxIAAAAAANjh7gAAAAAAAAAAANPd7ABLdLAAl6/SAAAAAAA8LxsAAAAAAGpSLwAAAAAALSMUALWLTwAOCwYAAAAAAD0vGwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAERDwAEY1gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPfXCwAAAAAAAAAAAPr9DAAAAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/yBTAAD9+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANioLAPP2/gDK1vYAytb2ANfh+QCWdBwAe14XAMrW9gDK1vYAytb2ACkgCABSPxAAytb2AMrW9gAcFgUAbVQVAMrW9gDK1vYAytb2AG5UFAABAAAAytb2ABwVBgA3KgoAytb2AM7a9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACVU0A/wACAAAA/wAAAAAAAAAAAAAAAAAAAAAA9gAPAC7bxQAY7eIA8A0UAA36+wDtCQcA2xENAAD7/AAAAAAAAAAAAAAAAAAAAAAAAAEAAAD5/gBTJAcAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAAAAAAAAAAAAAAAACgttYAAAAAADoxJgAAAAAAk6zQAAAAAAAAAAAAKR8SAAAAAADX4e4APC8bAMSXVgB4XTUAeF01ADwuGgAAAAAAtcbfAFtGKAAOCwYAAAAAAB4XDQA8LxsADwwHAAAAAAAtIxQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABXpsAAESEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD31QwA++kGAP30BAD/RAsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQLAP4rbQAACxsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADX4PgANioLADYqCwA3KgoAaozkAHeX5gBENQ0A8vb+AGxUFQDK1vUAvMzzAPL2/gBsVBUA5Ov7AMnW9QDk6/sANioLADYqCwC7y/QAAAAAAEQ1DQAoHwcAoLbuADYqCwBMOg4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABF1RAAY0KgD/AAMAAAAAAAAAAAAAAAAAAAAAAPUADgAX++IAScWiAPENFwAO/AAAyhgRAPgLCAAA/P0AAAAAAAAAAAAAAAAAAAAAAAD9/wAsEgMAYiEJAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAANDb6wAAAAAAAP/+AJev0gAAAAAAAAAAACwiEwAAAAAA2OHuAB8XDQAtIxQAeV01AHldNQAtIxQAxNLmAGmMvgB5XTUAAAAAAIijywAPRpYAD0aWAEt1sQAAAAAAPC4aAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEXFQAHtKAAA0I7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPUAQQD6QEIAAQgAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/xY4AP5AowAAChoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP8AUj8QAPL1/QApIAgAKR8IAOXr+wCTq+sA//8AACkfCADl6/sAk6vrANfg+AApIAgAAAAAAAAA/wAAAP8ARDQMABsVBQC8y/MAvMz0AF9JEgAAAP8Am7LtAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFqpgA/xsZAAAAAQAAAAAAAAAAAAAAAAAAAP8A8QAVAErPowBhtI0ArSUkAMgdFwAA+vsAAAAAAAAAAAAAAAAAAAAAAAAA/wAXCQIArEUTAAIBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7msUAAAAAAAD/AAD3+fwAAAAAAAoIBAA9aqoAAAAAAN7l8QD09/sAw9HlAB4YDgAAAAAA093sAPH0+QAAAAAAaIy+AAAAAADT3ewAAAAAAAAAAADE0eUAS3WxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAi4pAAeyngD9vsYA/bC4AP7EywAAAgEAAj44AARSSAACPDYA/gAAAAHszAAB47cAAerHAAD//QD/FTUA/xtHAP8YPQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADK1vUAAAAAAK7B8QBuVBUA1+H4AIWi6QApHwcAbVQVAMnW9gAbFQUAKR8HAIhqGgCuwPEAvMvzAPP2/gDK1vYAAAAAABwVBgDK1vYA8vb+AA4LAgC8y/MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABYVAAvTuQAGbnwA/aSwAPgAAAD9AAAAAgD/AP4ACQD/Dg0ARnY+AAczGABd2AoA7ubvAAAB+AAA/fsAAAECAAAFCABWHgMAlDIGAAoEAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIFOd/+7y+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABIOCADgrWMBAAAAAAAAAAAAAAAA9fX1/////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPHx8QAPDw8AAAAAAAAAAAAAAAAAAAAAAAEBAQALCwsBAAAAAAAAAAAAAAAAAAAAADZk2f/v8/0AAAAAAAAAAAAAAAAAAAAAAFI/DwBSPxAAAAAAAAAAAAAAAAAArsHwACkgCAApHwgAAAAAAK7B8ACuwfEApH4fAAAAAADX4fgAKR8IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADy9v0ADgoDAAAAAAD4+v4APjAMAQAAAAAAAAAAAAAAAPX19f8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADw8gAEvcQAAtndAP8LCgD+MSwA/TkyAAAFBQAAAAAA+/4AANfw+wDE7wIA8P8IACEI/ABIFf0AEQcCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASBTnf/u8vgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASDggA4K1jAQAAAAAAAAAAAAAAAPX19f////8AAAAAAAAAAAAAAAAAAAAAANLS0gDS0tIAAAAAADAwMADQ0NAAFBQUAPv7+wAhISEAwcHBAC4uLgAAAAAA8PDwABMTEwDe3t4AHx8fAOHh4QAfHx8AHh4eANLS0gDx8fEAXFxcAAAAAAAAAAAAAAAAAAAAAAABAQEACwsLAQAAAAAAAAAAAAAAAAAAAAA2ZNn/7/P9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQ0DAMmbJgEAAAAAAAAAAAAAAAD19fX/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP79/gD6+vkABwgIAAEBAQAAAAAAAAAAAPr5+QD/AAAABAMDAAECAgDt7u4ACwwMAAoICAD///8A9/j4AAgHCAACAgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADh4eEAHx8fAD09PQB+fn4ARUVFALu7uwDa2toAenp6AAAAAACzs7MAEBAQAAAAAAAPDw8ALi4uAMPDwwAAAAAA4uLiAExMTADi4uIADw8PAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAxMMAqrKyABYcGgAUEhIACQcHAP//AQDg398AJxscAPjz8gARDw4A+vn5AA4NCgAEAwMA/fz9ANna2QA/Q0YANTs8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAMCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQDAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALi4uABAQEAAAAAAAc3NzAOHh4QBjY2MA4uLiAC4uLgDx8fEAXFxcAPDw8AAAAAAAHx8fAMPDwwBra2sA4eHhAA8PDwAfHx8AAAAAAB8fHwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMCAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADAgEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQ0OADsvLwAdHB0A6enpAPz7+wAEBAQADgABAA0LCgAFAwMAAAQEACMjJQDi4eAAMjEyAPX19gDT294A9/v9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZGqzv+EocoA+fr9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAcGAwB8XzYAb1YyAQAAAAAAAAAAAAAAAPj4+P/8/PwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEBAQACAgIAQAAAAAAAAAAAAAAAAAAAACcsuv/kKrsAPn7/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHBQEAcFYUAGNNFAEAAAAAAAAAAAAAAAD19fX/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAP//NSlR9gb1CyEAAAAASUVORK5CYII=" />
                                    </template>       
                                </fj-sub-text-input>      
                            </div>
                            <div>
                                <div style="display: inline-block">
                                    <fj-sub-text-input ref="cardDate" :errorText="errorTexts.date" :placeholder="text_('SUB.PAY_CARD_DATE')" stripe="exp">
                                        <template slot="head">
                                            <fj-sub-icon-calendar/>
                                        </template>            
                                    </fj-sub-text-input>      
                                </div>
                                <div style="display: inline-block">
                                    <fj-sub-text-input ref="cardCVC" :errorText="errorTexts.cvc" :placeholder="text_('SUB.PAY_CARD_CVC')" stripe="cvc">
                                        <template slot="head">
                                            <fj-sub-icon-lock/>
                                        </template>            
                                    </fj-sub-text-input>      
                                </div>
                            </div>
                            <div class="u-error" style="margin-top: -21px;">{{errorTexts.response}}</div>
                            <div class="fj-sub-footer">
                                <fj-sub-btn-normal :text="text_('SUB.BUTTON_CANCEL')" :onClick="cancel" btnType="cancel"/>
                                <fj-sub-btn-normal :isLoading="isSubmitting"  :text="text_('SUB.BUTTON_SAVE')" :onClick="submit"/>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            `,
    props: {
        title: {
            type: String,
            default: text_('SUB.CARD_FORM_TITLE')
        },
        shouldHideLoading: {
            type: Boolean,
            default: true,
        },
        callback: {
            type: Function,
            default: () => {}
        }
    },
    data: function () {
        return {
            errorTexts: {
                number: '',
                date: '',
                cvc: '',
                response: ''
            },
            isSubmitting: false,
            showModal: true,
            localLanguage: window.localLanguage,
        }
    },
    methods: {
        submit: function () {
            let number = this.$refs.cardNumber.getValue();
            let date = this.$refs.cardDate.getValue();
            let CVC = this.$refs.cardCVC.getValue();

            this.isSubmitting = true;
            if (this.dataValid({
                number,
                date,
                CVC,
            })) {
                FJGlobalariable.modSubscription.showLoading = true;
                window.FJGlobalariable.modSubscription.network.changeCard().then((response) => {
                    switch (response.code) {
                        case 200:
                            let last4 = response.data.last4;
                            window.fj.currentPlan.last4 = last4;
                            this.callback(last4);
                            this.showModal = false;
                            break;
                        case 214:
                            this.showModal = false;
                            this.shouldHideLoading = true;
                            window.FJGlobalariable.modSubscription.noLoginResponseCallback();
                            break;
                        case 204:
                            //因为customer被删除而无法切换信用卡的情况
                            this.showModal = false;
                            window.fj.currentPlan.last4 = '';
                            break;
                        default:
                            this.errorTexts.response = response.msg;
                            this.shouldHideLoading = true;
                            break;
                    }
                }).catch((error) => {
                    switch (error.type) {
                        case 'stripe':
                            this.errorTexts.response = error.error.message;
                            break;
                        case 'ajax':
                        default:
                            this.errorTexts.response = text_('SUB.CONNECT_NETWORK_FAILED');
                    }
                    FJGlobalariable.modSubscription.showLoading = false;
                }).finally(() => {
                    this.isSubmitting = false;
                    if (this.shouldHideLoading) {
                        FJGlobalariable.modSubscription.showLoading = false;
                    }
                });
            } else {
                this.isSubmitting = false;
            }
        },
        cancel: function () {
            this.showModal = false
        },
        text_: text_,
        dataValid: function (card) {
            // 清空所有错误信息
            Object.keys(this.errorTexts).forEach((key) => {
                this.errorTexts[key] = '';
            });

            let cardType = jQuery.payment.cardType(card.number);
            if (!jQuery.payment.validateCardNumber(card.number)) {
                //信用卡验证失败
                this.errorTexts.number = text_('SUB.INVALID_NUMBER');
                return false;
            }

            if (!jQuery.payment.validateCardExpiry(jQuery('#card-change-element [data-stripe="exp"]').payment('cardExpiryVal'))) {
                //验证过期时间失败
                this.errorTexts.date = text_('SUB.INVALID_EXP_DATE');
                return false;
            }

            if (!jQuery.payment.validateCardCVC(card.CVC, cardType)) {
                //验证安全码失败
                this.errorTexts.cvc = text_('SUB.INVALID_CVC');
                return false;
            }

            //TODO 加入Google验证

            /*if(window.getGcUpgradeId){
                window.gcUpgradeId = window.getGcUpgradeId();
            }

            if (validate && window.grecaptcha && grecaptcha.execute) {
                grecaptcha.execute(window.gcUpgradeId);
            }
            else {
                stripeEnd();
            }*/

            return true;
        },
    },
    mounted: function () {
        jQuery('#card-change-element [data-stripe="number"]').payment('formatCardNumber');
        jQuery('#card-change-element [data-stripe="exp"]').payment('formatCardExpiry');
        jQuery('#card-change-element [data-stripe="cvc"]').payment('formatCardCVC');
    }
})

/**
 * 支付界面组件
 */
Vue.component('fj-sub-pay', {
    template: `
        <div class="fj-sub-pay">
            <fj-sub-pay-head/>
            <div class="fj-sub-pay-body">
                <div class="fj-sub-pay-features">
                    <h1>{{text_(packageName)}}</h1>
                    <span v-if="selectPeriod === 'annual'">{{text_('SUB.PAY_PERIOD_ANNUALLY')}}</span>
                    <span v-if="selectPeriod === 'monthly'">{{text_('SUB.PAY_PERIOD_MONTHLY')}}</span>
                    <fj-sub-plan-features :list="list"/>
                    <i></i>
                    <div>
                        <div>
                            <fj-sub-icon-pay/>
                            <span>{{text_('SUB.DAY_7')}}</span>
                        </div>
                        <div>
                            <fj-sub-icon-shield />
                            <span>{{text_('SUB.PAY_SECURE')}}</span>
                        </div>
                    </div>
                </div> 
                <div class="fl-sup-pay-form">
                    <div class="fj-sub-form-title">{{text_('SUB.PAY_TITLE')}}</div>         
                    <fj-sub-period-select :selectCallback="selectPeriodCallback" 
                                          :selectPeriod="selectPeriod"                                        
                                          />
                    <div class="fj-sub-types" :class="isUpgrade ?'hidden':''">
                        <div class="fj-sub-stripe" :class="isStripe?'active':''" @click="selectPayMethodStripe">
<svg width="23px" height="16px" viewBox="0 0 23 16" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g  stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g  transform="translate(-645.000000, -317.000000)" fill="#344750" fill-rule="nonzero">
            <path d="M645,331.646617 C645,332.39429 645.575094,333 646.284168,333 L666.715832,333 C667.424657,333 668,332.394027 668,331.646617 L668,323 L645,323 L645,331.646617 Z M662,327 L666,327 L666,331 L662,331 L662,327 Z M666.715597,317 L646.284154,317 C645.575087,317 645,317.538551 645,318.20257 L645,321 L668,321 L668,318.20257 C668,317.538551 667.424414,317 666.715597,317 Z"></path>
        </g>
    </g>
</svg>
<span>{{text_('SUB.CREDIT_CARD')}}</span>
</div>
                        <div class="fj-sub-paypal" :class="isStripe?'':'active'" @click="selectPayMethodPaypal">
                        <svg width="80px" height="20px" viewBox="0 0 80 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-928.000000, -315.000000)" fill-rule="nonzero">
            <g transform="translate(928.000000, 315.000000)">
                <path d="M29.8135484,4.35419342 L25.4012903,4.35419342 C25.0995098,4.3540032 24.8424981,4.57351692 24.7954839,4.8716129 L23.0109677,16.1858065 C22.9943648,16.2920581 23.0251034,16.4002531 23.0950901,16.4819043 C23.1650769,16.5635555 23.2672978,16.6104799 23.3748387,16.610323 L25.4812903,16.610323 C25.7832799,16.6104631 26.0403679,16.3906104 26.0870968,16.0922581 L26.5683871,13.0406452 C26.6150781,12.7425342 26.8718032,12.5227579 27.1735484,12.5225806 L28.5703226,12.5225806 C31.4767742,12.5225806 33.1541935,11.116129 33.5922581,8.32903226 C33.7896774,7.10967742 33.6006452,6.1516129 33.0296774,5.48064516 C32.4025806,4.74387097 31.2903226,4.35419342 29.8135484,4.35419342 L29.8135484,4.35419342 Z M30.3225806,8.48645161 C30.0812903,10.0696774 28.8716129,10.0696774 27.7019355,10.0696774 L27.036129,10.0696774 L27.5032258,7.11290323 C27.5314761,6.93419349 27.6855228,6.80258065 27.8664516,6.80258065 L28.1716129,6.80258065 C28.9683871,6.80258065 29.72,6.80258065 30.1083871,7.25677419 C30.34,7.52774194 30.4109677,7.93032258 30.3225806,8.48645161 L30.3225806,8.48645161 Z M43.0025806,8.43548387 L40.8896774,8.43548387 C40.7087486,8.43548669 40.5547019,8.56709672 40.5264516,8.74580645 L40.4329032,9.33677419 L40.2851613,9.12258065 C39.8277419,8.45870968 38.8077419,8.23677419 37.7896774,8.23677419 C35.4548387,8.23677419 33.4606452,10.0051613 33.0722581,12.4858065 C32.8703226,13.7232258 33.1574194,14.9064516 33.8593548,15.7316129 C34.5032258,16.4903226 35.4245161,16.8064516 36.5206452,16.8064516 C38.4019355,16.8064516 39.4451613,15.5967742 39.4451613,15.5967742 L39.3509677,16.183871 C39.3339814,16.2901009 39.3643634,16.3984418 39.434109,16.4803496 C39.5038547,16.5622573 39.6059691,16.609517 39.7135484,16.6096774 L41.6167742,16.6096774 C41.9187638,16.6098179 42.1758518,16.3899653 42.2225806,16.0916129 L43.3645161,8.86 C43.3815263,8.75400303 43.3512016,8.64587803 43.281552,8.56418566 C43.2119024,8.4824933 43.1099338,8.43545068 43.0025806,8.43548387 L43.0025806,8.43548387 Z M40.0574194,12.5477419 C39.8535484,13.7548387 38.8954839,14.5651613 37.6735484,14.5651613 C37.06,14.5651613 36.5696774,14.3683871 36.2548387,13.9954839 C35.9425806,13.6251613 35.823871,13.0980645 35.9232258,12.5109677 C36.1135484,11.3141935 37.0877419,10.4774194 38.2909677,10.4774194 C38.8909677,10.4774194 39.3787097,10.6767742 39.7,11.0529032 C40.0219355,11.4329032 40.1496774,11.9632258 40.0574194,12.5477419 L40.0574194,12.5477419 Z M54.2554839,8.43548257 L52.1322581,8.43548257 C51.9289667,8.43580568 51.7389473,8.53648939 51.6245161,8.70451613 L48.696129,13.0180645 L47.4548387,8.87290323 C47.3766038,8.61331676 47.1375712,8.43561486 46.8664516,8.43548257 L44.78,8.43548257 C44.661169,8.43516787 44.5495091,8.4922923 44.480234,8.58884209 C44.4109589,8.68539187 44.3926077,8.80946588 44.4309677,8.92193548 L46.7696774,15.7851613 L44.5709677,18.8890323 C44.4913082,19.0012213 44.4809419,19.1484947 44.5441001,19.2707364 C44.6072584,19.3929782 44.7333741,19.469678 44.8709677,19.469678 L46.9916129,19.469678 C47.192593,19.4699542 47.3809105,19.3715758 47.4954839,19.2064516 L54.5574194,9.01290323 C54.6354343,8.90049739 54.6445916,8.75407227 54.5811894,8.63282227 C54.5177872,8.51157228 54.39231,8.43548257 54.2554839,8.43548257 L54.2554839,8.43548257 Z" fill="#253B80"></path>
                <path d="M61.2851613,4.35419355 L56.8722581,4.35419355 C56.5707218,4.35432076 56.3140729,4.57375832 56.2670968,4.8716129 L54.4825806,16.1858065 C54.4657832,16.2918752 54.4962739,16.3999803 54.5660195,16.4816397 C54.6357652,16.5632992 54.7377708,16.6103226 54.8451613,16.6103226 L57.1096774,16.6103226 C57.3207315,16.6100131 57.5002138,16.4562493 57.5329032,16.2477419 L58.0393548,13.0406452 C58.0860459,12.7425342 58.342771,12.5227579 58.6445161,12.5225806 L60.0406452,12.5225806 C62.9477419,12.5225806 64.6245161,11.116129 65.0632258,8.32903226 C65.2612903,7.10967742 65.0709677,6.1516129 64.5,5.48064516 C63.8735484,4.74387097 62.7619355,4.35419355 61.2851613,4.35419355 L61.2851613,4.35419355 Z M61.7941935,8.48645161 C61.5535484,10.0696774 60.343871,10.0696774 59.1735484,10.0696774 L58.5083871,10.0696774 L58.976129,7.11290323 C59.0038349,6.93415214 59.1578243,6.80235698 59.3387097,6.80258036 L59.643871,6.80258036 C60.44,6.80258036 61.1922581,6.80258036 61.5806452,7.25677419 C61.8122581,7.52774194 61.8825806,7.93032258 61.7941935,8.48645161 L61.7941935,8.48645161 Z M74.4735484,8.43548387 L72.3619355,8.43548387 C72.1809491,8.43498602 72.0268055,8.56691325 71.9993548,8.74580645 L71.9058065,9.33677419 L71.7574194,9.12258065 C71.3,8.45870968 70.2806452,8.23677419 69.2625806,8.23677419 C66.9277419,8.23677419 64.9341935,10.0051613 64.5458065,12.4858065 C64.3445161,13.7232258 64.6303226,14.9064516 65.3322581,15.7316129 C65.9774194,16.4903226 66.8974194,16.8064516 67.9935484,16.8064516 C69.8748387,16.8064516 70.9180645,15.5967742 70.9180645,15.5967742 L70.823871,16.183871 C70.8068489,16.2903236 70.8373951,16.3988839 70.9074308,16.4808406 C70.9774666,16.5627973 71.0799372,16.609895 71.1877419,16.6096774 L73.0903226,16.6096774 C73.3920677,16.6095002 73.6487928,16.3897238 73.6954839,16.0916129 L74.8380645,8.86 C74.8544558,8.75367707 74.8235519,8.64550154 74.7534689,8.5638828 C74.683386,8.48226407 74.5811273,8.43535824 74.4735484,8.43548387 L74.4735484,8.43548387 Z M71.5283871,12.5477419 C71.3258065,13.7548387 70.3664516,14.5651613 69.1445161,14.5651613 C68.5322581,14.5651613 68.0406452,14.3683871 67.7258065,13.9954839 C67.4135484,13.6251613 67.296129,13.0980645 67.3941935,12.5109677 C67.5858065,11.3141935 68.5587097,10.4774194 69.7619355,10.4774194 C70.3619355,10.4774194 70.8496774,10.6767742 71.1709677,11.0529032 C71.4941935,11.4329032 71.6219355,11.9632258 71.5283871,12.5477419 L71.5283871,12.5477419 Z M76.9645161,4.66451613 L75.1535484,16.1858065 C75.1367509,16.2918752 75.1672416,16.3999803 75.2369873,16.4816397 C75.3067329,16.5632992 75.4087385,16.6103226 75.516129,16.6103226 L77.3367742,16.6103226 C77.6393548,16.6103226 77.896129,16.3909677 77.9425806,16.0922581 L79.7283871,4.77870968 C79.7451641,4.67258012 79.714686,4.56442162 79.6449647,4.48266655 C79.5752434,4.40091149 79.4732537,4.35373854 79.3658065,4.35354839 L77.3270968,4.35354839 C77.1463038,4.35418856 76.9926948,4.48593152 76.9645161,4.66451613 L76.9645161,4.66451613 Z" fill="#179BD7"></path>
                <path d="M4.68774194,18.8090323 L5.02516129,16.6658065 L4.27354839,16.6483871 L0.684516129,16.6483871 L3.17870968,0.833548387 C3.19405702,0.733674783 3.28024581,0.660112378 3.38129032,0.660642286 L9.43290323,0.660642286 C11.4419355,0.660642286 12.8283871,1.07870968 13.5522581,1.90387097 C13.8916129,2.29096774 14.1077419,2.69548387 14.2122581,3.14064516 C14.3219355,3.60774194 14.323871,4.16580645 14.2167742,4.84645161 L14.2090323,4.89612903 L14.2090323,5.33225806 L14.5483871,5.52451613 C14.8074562,5.65576778 15.040323,5.83331504 15.2354839,6.0483871 C15.5258065,6.37935484 15.7135484,6.8 15.7929032,7.29870968 C15.8748387,7.8116129 15.8477419,8.42193548 15.7135484,9.11290323 C15.5587097,9.90774194 15.3083871,10.6 14.9703226,11.1664516 C14.6720438,11.6739009 14.2709961,12.1134052 13.7929032,12.4567742 C13.343871,12.7754839 12.8103226,13.0174194 12.2070968,13.1722581 C11.6225806,13.3245161 10.956129,13.4012903 10.2251613,13.4012903 L9.75419355,13.4012903 C9.41741935,13.4012903 9.09032258,13.5225806 8.83354839,13.74 C8.57713825,13.9597393 8.40704163,14.2633526 8.35354839,14.5967742 L8.31806452,14.7896774 L7.72193548,18.5670968 L7.69483871,18.7058065 C7.68774194,18.7496774 7.67548387,18.7716129 7.65741935,18.7864516 C7.63991996,18.8007627 7.61808787,18.8087224 7.59548387,18.8090323 L4.68774194,18.8090323 Z" fill="#253B80"></path>
                <path d="M14.8696774,4.94645161 C14.8516129,5.06193548 14.8309677,5.18 14.8077419,5.30129032 C14.0096774,9.39870968 11.2793548,10.8141935 7.79225806,10.8141935 L6.01677419,10.8141935 C5.59032258,10.8141935 5.23096774,11.123871 5.16451613,11.5445161 L4.25548387,17.3096774 L3.99806452,18.943871 C3.97731195,19.075056 4.01502012,19.2087516 4.10126151,19.3097595 C4.18750289,19.4107674 4.31363532,19.4690323 4.44645161,19.4690323 L7.59548387,19.4690323 C7.9683871,19.4690323 8.28516129,19.1980645 8.34387097,18.8303226 L8.37483871,18.6703226 L8.96774194,14.9077419 L9.00580645,14.7012903 C9.06387097,14.3322581 9.38129032,14.0612903 9.75419355,14.0612903 L10.2251613,14.0612903 C13.276129,14.0612903 15.6645161,12.8225806 16.3625806,9.23806452 C16.6541935,7.74064516 16.5032258,6.49032258 15.7316129,5.61096774 C15.4870518,5.33894391 15.1949693,5.1137606 14.8696774,4.94645161 L14.8696774,4.94645161 Z" fill="#179BD7"></path>
                <path d="M14.0348387,4.61354839 C13.780017,4.53983303 13.5207905,4.48229896 13.2587097,4.44129032 C12.7408516,4.36170443 12.2174741,4.32351901 11.6935484,4.32709677 L6.95032258,4.32709677 C6.57734053,4.32686687 6.25986448,4.59853978 6.20258065,4.96709677 L5.19354839,11.3580645 L5.16451613,11.5445161 C5.22946913,11.1241256 5.59139545,10.8139813 6.01677419,10.8141935 L7.79225806,10.8141935 C11.2793548,10.8141935 14.0096774,9.39806452 14.8077419,5.30129032 C14.8316129,5.18 14.8516129,5.06193548 14.8696774,4.94645161 C14.6590873,4.83601844 14.4396089,4.7434361 14.2135484,4.66967742 C14.1542826,4.6500128 14.0947051,4.63130071 14.0348387,4.61354839 L14.0348387,4.61354839 Z" fill="#222D65"></path>
                <path d="M6.20258065,4.96709677 C6.25938609,4.59836999 6.57724758,4.32658334 6.95032258,4.32774194 L11.6935484,4.32774194 C12.2554839,4.32774194 12.78,4.36451613 13.2587097,4.44193548 C13.58265,4.49284661 13.902117,4.56899234 14.2141935,4.66967742 C14.4496774,4.74774194 14.6683871,4.84 14.8703226,4.94645161 C15.1077419,3.43225806 14.8683871,2.40129032 14.0496774,1.46774194 C13.1470968,0.44 11.5180645,0 9.43354839,0 L3.38193548,0 C2.95612903,0 2.59290323,0.309677419 2.52709677,0.730967742 L0.0064516129,16.7083871 C-0.0173086674,16.8585079 0.0257996731,17.0115094 0.124436952,17.1271446 C0.22307423,17.2427797 0.367365503,17.3094718 0.519354839,17.3096774 L4.25548387,17.3096774 L5.19354839,11.3580645 L6.20258065,4.96709677 Z" fill="#253B80"></path>
            </g>
        </g>
    </g>
</svg>
                        </div>
                    </div>
                    <div :class="payMethod!=='paypal'?'hidden':''" style="width: 100px; height: 20px;"></div>
                    <div :class="payMethod!=='paypal'?'':'hidden'">
                        <form class="fj-sub-form-body" id="card-element" v-if="showChardForm">   
                            <div>             
                                <fj-sub-text-input ref="cardName" :errorText="errorTexts.name" :placeholder="text_('SUB.PAY_CARD_NAME')" stripe="name">
                                    <template slot="head">
                                        <fj-sub-icon-person/>
                                    </template>
                                    <template slot="foot">
                                        <img src="data:image/png;base64,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" />
                                    </template>
                                </fj-sub-text-input>
                            </div>
                            <div>
                                <fj-sub-text-input ref="cardNumber" :errorText="errorTexts.number" :placeholder="text_('SUB.PAY_CARD_NUMBER')" stripe="number">
                                    <template slot="head">
                                        <fj-sub-icon-card/>
                                    </template>            
                                </fj-sub-text-input>      
                            </div>
                            <div>
                                <div style="display: inline-block">
                                    <fj-sub-text-input ref="cardDate" :errorText="errorTexts.date" :placeholder="text_('SUB.PAY_CARD_DATE')" stripe="exp">
                                        <template slot="head">
                                            <fj-sub-icon-calendar/>
                                        </template>            
                                    </fj-sub-text-input>      
                                </div>
                                <div style="display: inline-block">
                                    <fj-sub-text-input ref="cardCVC" :errorText="errorTexts.cvc" :placeholder="text_('SUB.PAY_CARD_CVC')" stripe="cvc">
                                        <template slot="head">
                                            <fj-sub-icon-lock/>
                                        </template>            
                                    </fj-sub-text-input>      
                                </div>
                            </div>
                            <div class="fj-sub-text-input" style="margin-top: -25px;">
                                <div class="u-error">{{errorTexts.response}}</div>
                            </div>
                        </form>
                        <div v-if="showChardInfo">
                            <div class="fj-sub-card-title">{{text_('SUB.PAYMENT_METHOD')}}</div>
                            <div class="fc-sub-card-info">
                                <div v-if="lastCardNumber">
                                    {{text_('SUB.CREDIT_CARD')}}: ************{{lastCardNumber}}
                                </div>
                                <div>
                                    <span class="fc-sub-card-change-span" @click="handleChangeCard">{{text_('SUB.CHANGE_CARD')}}</span>
                                </div>
                            </div>
                            <div class="fc-sub-card-info-line"></div>
                            <div class="fj-sub-text-input" style="margin: -40px 0 15px 47px;">
                                <div class="u-error">{{errorTexts.response}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="fj-sub-form-total-billed">
                        <span>{{text_('SUB.TOTAL_BILLED')}}:</span>
                        <span>{{'$' + this.realPrice}}</span>
                        <span v-if="appliedCoupon !== null">{{'$' + this.totalPrice}}</span>
                        <div class="fj-sub-coupon">
                            <span class="fj-sub-coupon-entry" @click="showCouponForm" :class="couponFormStatus">{{text_('SUB.HAVE_A_COUPON')}}</span>
                            <div class="fj-sub-coupon-form" :class="couponFormStatus">
                                <input @keyup.enter="redeemCoupon" v-model="coupon"  type="text" :placeholder="text_('SUB.REDEEM_PLACEHOLDER')"/><fj-sub-btn-normal :disabled="isRedeemButtonDisabled" :onClick="redeemCoupon" :isLoading="isRedeeming" :text="text_('SUB.REDEEM')"/>                            
                            </div>                    
                        </div>
                    </div>
                    <div class="fj-sub-redeem-successful" v-if="appliedCoupon !== null">{{text_('SUB.REDEEM_SUCCESSFUL')}}</div>
                    <div class="fj-sub-pay-message" v-if="showChardForm || showChardInfo">
                        <p>{{text_printf(period === 'month'?'SUB.YOU_WILL_CHARGED':'SUB.YOU_WILL_CHARGED_YEAR', totalPrice)}}</p>
                    </div>
                    <div class="fj-sub-pay-submit" :class="payMethod!=='paypal'?'':'hidden'">
                        <fj-sub-btn-normal :isLoading="isSubmitting" :text="text_('SUB.BUTTON_PAY_NOW')" :onClick="submit"/>
                    </div>
                    <div id="paypal-button-container" :class="payMethod!=='paypal'?'hidden':''"></div>
                    <div class="fj-sub-pay-other">
                        <span v-html="termOfUse">{{termOfUse}}</span>                
                    </div>
                    <span class="other-faq" v-html="faq">{{faq}}</span>
                </div>               
            </div>
        </div>
        `,
    data: function () {
        return {
            selectPeriod: window.FJGlobalariable.modSubscription.state.isAnnual ? 'annual' : 'monthly',
            list: window.FJGlobalariable.modSubscription.state.selectPlan.features,
            errorTexts: {
                name: '',
                number: '',
                date: '',
                cvc: '',
                response: ''
            },
            text_: text_,
            isSubmitting: false,
            currentPlan: window.fj.currentPlan,
            isShowCouponForm: false,
            coupon: '', //输入框中的coupon
            appliedCoupon: null, //应用成功的coupon
            freeOfCharge: false, //是否是100%免费coupon
            estimateAmount: null, //应用coupon后预估的价格相关信息
            isRedeeming: false,
            payMethod: window.fj.currentPlan.sub_type,
            localLanguage: window.localLanguage,
        }
    },
    computed: {
        packageName: function () {
            return window.FJGlobalariable.modSubscription.state.selectPlan.name;
        },
        showChardInfo: function () {
            return this.currentPlan.last4;
        },
        showChardForm: function () {
            let flag =  (!this.currentPlan.last4 && (!this.appliedCoupon || !this.freeOfCharge));
            if (flag) {
                setTimeout(() => {
                    jQuery('#card-element [data-stripe="number"]').payment('formatCardNumber');
                    jQuery('#card-element [data-stripe="exp"]').payment('formatCardExpiry');
                    jQuery('#card-element [data-stripe="cvc"]').payment('formatCardCVC');
                }, 0)
            }
            return flag;
        },
        isUpgrade: function () {
            if (this.currentPlan.package !== 'free') {
                return true;
            } else
                return false;
        },
        subType: function () {
            if (this.isUpgrade) {
                return this.currentPlan.sub_type;
            } else {
                return null;
            }
        },
        lastCardNumber: function () {
            return this.currentPlan.last4;
        },
        annualPrice: function () {
            return window.FJGlobalariable.modSubscription.state.selectPlan.price.annual;
        },
        monthlyPrice: function () {
            return window.FJGlobalariable.modSubscription.state.selectPlan.price.monthly;
        },
        totalPrice: function () {
            if(this.selectPeriod == 'monthly')
                return this.monthlyPrice.toFixed(2);
            else
            {
                return (this.annualPrice*12).toFixed(2);
            }
        },
        realPrice: function () {
            if (this.appliedCoupon !== null) {
                let amount = this.estimateAmount.next_amount;
                if (amount < 0)
                    amount = 0;
                return amount / 100;
            } else {
                return this.totalPrice;
            }
        },
        period: function () {
            return this.selectPeriod == "monthly" ? "month" : "year";
        },
        termOfUse: function () {
            return text_printf('SUB.PAY_TERMS_OF_USE', '/terms.html', 'u-link-gray');
        },
        faq: function () {
            if (window.FJGlobalariable.NoJumpFAQPages) {
                return text_printf('SUB.PAY_FAQS', '/contact.html', 'u-link-gray')
            }
            return text_printf('SUB.PAY_FAQS', '/faq.html', 'u-link-gray', '/contact.html', 'u-link-gray');
        },
        paypalPlan: function() {
            let packageName = this.packageName;
            let period = this.period;
            return window.FJGlobalariable.modSubscription.paypalPlan({package: packageName, period: period});
        },

        /**
         * 优惠码表单展开时返回active
         * @returns {string}
         */
        couponFormStatus: function () {
            if (this.isShowCouponForm) {
                return 'active';
            } else {
                return '';
            }
        },
        isRedeemButtonDisabled: function () {
            return this.isRedeeming;
        },
        isStripe: function() {
            if ('paypal' !== this.payMethod) {
                return true;
            } else {
                return false;
            }
        }
    },
    methods: {
        refreshInvoices: function() {
            // 刷新账单列表
            if(window.fj.billing && window.fj.billing.chargeHistory)
            {
                window.FJGlobalariable.modSubscription.network.updateInvoices().then( (res) => {
                    if (res.data.length === window.fj.billing.chargeHistory.length) {
                        setTimeout(() => {this.refreshInvoices()}, 3000);
                    } else {
                        window.fj.billing.chargeHistory = res.data;
                    }
                }).catch((error) => {
                }).finally(() => {
                });
            }
        },
        paypalClick: function() {
        },
        submit: function () {
            let plan = this.getPlan();
            let name;

            let upgrade = () => {
                FJGlobalariable.modSubscription.showLoading = true;
                window.fjuser.getCountryCode().then(countryCode => {
                    window.FJGlobalariable.modSubscription.network.upgrade(plan, this.appliedCoupon, countryCode).then((response) => {
                        let old_plan = window.fj.currentPlan.package + '_'
                            + window.fj.currentPlan.period;
                        window.FJGlobalariable.modSubscription.updateSubscriptionInfo(response.data.subscription);
                        switch (response.code) {
                            case 200:
                                // 订阅成功
                                window.FJGlobalariable.modSubscription.updateSubscriptionInfo(response.data.subscription);
                                window.FJGlobalariable.modSubscription.state.coupon = this.appliedCoupon;
                                window.FJGlobalariable.modSubscription.state.amount = response.data.subscription.amount;
                                window.FJGlobalariable.modSubscription.state.transaction_id = response.data.subscription.transaction_id;
                                window.FJGlobalariable.modSubscription.state.page = 'successful';
                                this.refreshInvoices();
                                //判断是弹出砸蛋弹窗
                                if(true == response.data.draw_egg){
                                    window.fj && window.fj.showEasterEggBox(response.data.subscription);
                                };

                                // 统计事件
                                window.ealog && ealog.setUserProperties({'account type': response.data.subscription.package + ' ' + response.data.subscription.period});
                                window.ealog && ealog.addEvent('revenue', {
                                    'price': response.data.subscription.amount / 100,
                                    'pay_type': old_plan + '-' + plan,
                                    'is coupon code': this.appliedCoupon ? true : false,
                                    'coupon code off': this.appliedCoupon && (this.couponObject.amount_off || this.couponObject.percent_off),
                                    'coupon code': this.appliedCoupon,
                                    'platform': 'stripe'
                                });
                                gaEvent('subscription_upgrade', FJGlobalariable.modSubscription.entry, '');
                                gaPage('subscription/'+old_plan+'-'+plan+'.html', 'Subscription Upgrade');

                                break;
                            case 214:
                                window.FJGlobalariable.modSubscription.noLoginResponseCallback();
                                break;
                            default:
                                this.errorTexts.response = response.msg;
                                break;
                        }
                    }).catch((error) => {
                        this.errorTexts.response = text_('SUB.CONNECT_NETWORK_FAILED');
                    }).finally(() => {
                        this.isSubmitting = false;
                        FJGlobalariable.modSubscription.showLoading = false;
                    });
                });
            };

            let subscription = (sendToken=true) => {
                FJGlobalariable.modSubscription.showLoading = true;
                window.fjuser.getCountryCode().then(countryCode => {
                    window.FJGlobalariable.modSubscription.network.subscription(plan, name, countryCode, sendToken, this.appliedCoupon).then((response) => {

                        window.FJGlobalariable.modSubscription.updateSubscriptionInfo(response.data.subscription);

                        switch (response.code) {
                            case 200:
                                window.FJGlobalariable.modSubscription.state.amount = response.data.subscription.amount;
                                window.FJGlobalariable.modSubscription.state.coupon = this.appliedCoupon;
                                window.FJGlobalariable.modSubscription.state.transaction_id = response.data.subscription.transaction_id;
                                window.FJGlobalariable.modSubscription.state.page = 'successful';
                                this.refreshInvoices();

                                //判断是弹出砸蛋弹窗
                                if(true == response.data.draw_egg){
                                    window.fj && window.fj.showEasterEggBox(response.data.subscription);
                                };
                                // 统计事件
                                window.ealog && ealog.setUserProperties({'account type': response.data.subscription.package + ' ' + response.data.subscription.period});
                                window.ealog && ealog.addEvent('revenue', {
                                    'price': response.data.subscription.amount / 100,
                                    'pay_type': plan,
                                    'is coupon code': this.appliedCoupon ? true : false,
                                    'coupon code off': this.appliedCoupon && (this.couponObject.amount_off || this.couponObject.percent_off),
                                    'coupon code': this.appliedCoupon,
                                    'platform': 'stripe'
                                });
                                gaEvent('subscription_created', FJGlobalariable.modSubscription.entry, '');
                                gaPage('subscription/'+plan+'.html', 'Subscription Created');

                                break;
                            case 214:
                                window.FJGlobalariable.modSubscription.noLoginResponseCallback();
                                break;
                            default:
                                this.errorTexts.response = response.msg;
                                if ('free' === window.fj.currentPlan.package) {
                                    //window.fjmessage.addMessage(text_('SUB.PLEASE_USE_PAYPAL'), 'error');
                                }
                                break;
                        }
                    }).catch((error) => {

                        switch (error.type) {
                            case 'stripe':
                                this.errorTexts.response = error.error.message;
                                break;
                            case 'ajax':
                            default:
                                this.errorTexts.response = text_('SUB.CONNECT_NETWORK_FAILED');
                        }

                    }).finally(() => {
                        this.isSubmitting = false;
                        FJGlobalariable.modSubscription.showLoading = false;
                    });
                });
            };

            this.isSubmitting = true;
            if (this.showChardForm) {
                //free 状态或者是升级时没有信用卡信息时，验证信用卡
                name = this.$refs.cardName.getValue();
                let number = this.$refs.cardNumber.getValue();
                let date = this.$refs.cardDate.getValue();
                let CVC = this.$refs.cardCVC.getValue();
                if (!this.dataValid({name, number, date, CVC,})) {
                    this.isSubmitting = false;
                    return;
                } else {
                    if(this.isUpgrade) {
                        //没有信用卡的升级，需要先更新信用卡信息
                        window.FJGlobalariable.modSubscription.network.changeCard('#card-element').then((response)=>{
                            if(200 == response.code) // 修改成功
                            {

                                let last4 = response.data.last4;
                                window.fj.currentPlan.last4 = last4;
                                upgrade();
                            }
                            else
                            {
                                this.isSubmitting = false;
                                this.errorTexts.response = response.msg || response.message;
                            }
                        }).catch((error)=> {
                            this.isSubmitting = false;
                        })
                    } else {
                        subscription();
                    }
                }
            } else {
                if (this.isUpgrade) {
                    upgrade();
                } else {
                    subscription(false);
                }
            }

            this.collectCheckout();
        },
        dataValid: function (card) {
            let cardType = jQuery.payment.cardType(card.number);
            if (card.name.length < 1) {
                //用户名为空
                this.errorTexts.name = text_('SUB.INVALID_NAME');
                return false
            }

            // 清空所有错误信息
            Object.keys(this.errorTexts).forEach((key) => {
                this.errorTexts[key] = '';
            });

            if (!jQuery.payment.validateCardNumber(card.number)) {
                //信用卡验证失败
                this.errorTexts.number = text_('SUB.INVALID_NUMBER');
                return false;
            }
            if (!jQuery.payment.validateCardExpiry(jQuery('#card-element [data-stripe="exp"]').payment('cardExpiryVal'))) {
                //验证过期时间失败
                this.errorTexts.date = text_('SUB.INVALID_EXP_DATE');
                return false;
            }
            if (!jQuery.payment.validateCardCVC(card.CVC, cardType)) {
                //验证安全码失败
                this.errorTexts.cvc = text_('SUB.INVALID_CVC');
                return false;
            }

            // TODO 加入Google验证
            /*if(window.getGcUpgradeId){
                window.gcUpgradeId = window.getGcUpgradeId();
            }

            if (validate && window.grecaptcha && grecaptcha.execute) {
                grecaptcha.execute(window.gcUpgradeId);
            }
            else {
                stripeEnd();
            }*/

            return true;
        },
        handleChangeCard: function () {
            openChangeCardModal();
        },
        selectPeriodCallback: function (period) {
            this.selectPeriod = period;
            window.FJGlobalariable.modSubscription.state.isAnnual = period === 'annual'? true : false;

            /*if (this.appliedCoupon) {
                this.coupon = this.appliedCoupon;
                FJGlobalariable.modSubscription.showLoading = true;
                this.redeemCoupon(() => {
                    FJGlobalariable.modSubscription.showLoading = false;
                });
            } else {
                this.useCouponByCookie();
            }*/
            if (this.coupon) {
                FJGlobalariable.modSubscription.showLoading = true;
                this.redeemCoupon(() => {
                    FJGlobalariable.modSubscription.showLoading = false;
                });
            } else {
                this.useCouponByCookie();
            }
        },
        getPlan: function () {
            let selectPeriod = this.selectPeriod;
            let selectPackage = window.FJGlobalariable.modSubscription.state.selectPlan.package;
            return selectPackage + '_' + selectPeriod;
        },
        showCouponForm: function () {
            this.isShowCouponForm = !this.isShowCouponForm;
        },
        redeemCoupon:function (callback) {
            if (this.isRedeemButtonDisabled) {
                return;
            }
            let coupon = this.coupon;
            let plan = this.getPlan();

            this.isRedeeming = true;
            FJGlobalariable.modSubscription.network.redeemCoupon(coupon, plan).then(res => {
                switch (res.code) {
                    case 200:
                        if (res.data.allow_coupon) {
                            //可以使用coupon
                            this.appliedCoupon = coupon; //设置应用后的coupon
                            this.couponObject = res.data.coupon_object;
                            this.isShowCouponForm = false; //关闭优惠码输入窗口
                            //展示预估价格
                            this.estimateAmount = res.data;
                            this.freeOfCharge = res.data.free_of_charge;
                        } else {
                            //不可使用coupon
                            this.appliedCoupon = null;
                            window.fjmessage.addMessage(this.text_('SUB.COM_FJ_SP_COUPON_CONTINUOUS'), 'warning');
                        }

                        break;
                    case 214:
                        window.fjmessage.addMessage(this.text_('SUB.PAGE_EXPIRED'), 'warning');
                        break;
                    default:
                        this.appliedCoupon = null;
                        if (res.msg === 'SUB.COM_FJ_SP_COUPON_MATCH_PLAN_ERROR') {
                            let list = res.data.split(', ');
                            list = list.map(item => {
                               let list = item.split(' ');
                               list = list.map(item => {
                                   return text_(`SUB.${item.toUpperCase()}`);
                               });
                               return list.join('');
                            });
                            window.fjmessage.addMessage(text_printf(res.msg, list.join(', ')), 'warning');
                        } else {
                            window.fjmessage.addMessage(this.text_(res.msg), 'warning');
                        }
                }
            }).catch(err => {
                this.appliedCoupon = null;
                window.fjmessage.addMessage(this.text_('SUB.COM_FJ_SP_COUPON_NOT_EXIST'), 'warning');
                console.log(err);
            }).finally(() => {
                this.isRedeeming = false;
                if (typeof callback === "function") {
                    callback();
                }
            });
        },
        useCouponByCookie: function () {
            let coupon = document.cookie.replace(/(?:(?:^|.*;\s*)coupon\s*\=\s*([^;]*).*$)|^.*$/, "$1");
            if (coupon && !this.appliedCoupon) {
                let plan = this.getPlan();
                FJGlobalariable.modSubscription.showLoading = true;
                FJGlobalariable.modSubscription.network.redeemCoupon(coupon, plan).then(res => {
                    switch (res.code) {
                        case 200:
                            if (res.data.allow_coupon) {
                                this.appliedCoupon = coupon;
                                this.coupon = coupon;
                                this.couponObject = res.data.coupon_object;
                                this.estimateAmount = res.data;
                                this.freeOfCharge = res.data.free_of_charge;
                            }
                    }
                }).catch(err => {
                    console.log(err);
                }).finally(() => {
                    FJGlobalariable.modSubscription.showLoading = false;
                });
            }
        },
        selectPayMethodStripe: function () {
            if ('paypal' === window.fj.currentPlan.sub_type) {
                return;
            }
            this.payMethod = 'stripe';
        },
        selectPayMethodPaypal: function () {
            if ('stripe' === window.fj.currentPlan.sub_type) {
                return;
            }
            this.payMethod = 'paypal';
        },
        collectCheckout: function () {
            try {
                let isAnnual = window.FJGlobalariable.modSubscription.state.isAnnual;
                let period = isAnnual ? "annual" : "monthly";
                let package = window.FJGlobalariable.modSubscription.state.selectPlan.package;
                let price = isAnnual ? (12*window.FJGlobalariable.modSubscription.state.selectPlan.price.annual) : window.FJGlobalariable.modSubscription.state.selectPlan.price.monthly;
                gtag('event', 'begin_checkout', {
                    "items": [
                        {
                            "id": package,
                            "name": package,
                            "list_name": package,
                            "brand": "FlexClip",
                            "category": period,
                            "variant": period,
                            "list_position": 1,
                            "quantity": 1,
                            "price": price
                        }
                    ],
                    "coupon": window.FJGlobalariable.modSubscription.state.coupon
                });
            } catch (e){}
        }
    },
    watch: {
        coupon: function (val, oldVal) {
            if (/^(|[a-zA-Z0-9_]{0,50})$/.test(val)) {
                this.coupon = val;
            } else {
                this.coupon = oldVal;
            }
        }
    },
    mounted: function () {
        this.useCouponByCookie();
        let create_plan_lock = null;
        paypal.Buttons({
            style: {
                height: 42,
                color: 'gold',
                shape: 'rect',
                label: 'paypal',
            },

            createSubscription: (data, actions) => {
                if (this.subType && this.subType === 'stripe') {
                    //已经通过stripe进行了订阅，不能进行paypal的相关操作
                    return null;
                }
                this.collectCheckout();

                let selectPlan = this.getPlan();
                return FJGlobalariable.modSubscription.network.createPlan(selectPlan, this.appliedCoupon, create_plan_lock).then((response) => {
                    let plan_id = response.data["plan_id"];
                    this.createPlanOtherMessage = response.data;
                    switch (response.code) {
                        case 200:
                            create_plan_lock = response.data['create_plan_lock'];
                            return actions.subscription.create({
                                'plan_id': plan_id,
                            });
                            break;
                        case 335:
                        case 500:
                            window.fjmessage.addMessage(response.msg, 'error');
                            break;
                        case 214:
                            window.FJGlobalariable.modSubscription.noLoginResponseCallback();
                    }

                }).catch(err => {
                    if ('ajax'=== err.type) {
                        window.fjmessage.addMessage(text_('SUB.CONNECT_NETWORK_FAILED'), 'error');
                    } else {
                        window.fjmessage.addMessage(text_('SUB.PLEASE_USE_STRIPE'), 'error');
                    }
                });
            },


            onApprove: (data) => {
                FJGlobalariable.modSubscription.loadingMessage = text_('SUB.WAIT_FOR_PAYPAL_CHARGE');
                FJGlobalariable.modSubscription.showLoading = true;
                window.fjuser.getCountryCode().then(countryCode => {
                    data = Object.assign(data, this.createPlanOtherMessage);
                    data = Object.assign(data, {coupon: this.appliedCoupon});
                    FJGlobalariable.modSubscription.network.createByPaypal(this.getPlan(), data, countryCode, this.appliedCoupon).then((res) => {
                        let total = 0;
                        let beginTime = Date.now();
                        let draw_egg = res.data.draw_egg;
                        let plan_info = res.data.plan_info;
                        let checkoutStatus = (offset = 0) => {
                            setTimeout(() => {
                                FJGlobalariable.modSubscription.network.checkoutPaypalSubscriptionStatus(data.subscriptionID).then((res) => {
                                    let sub_status = res.data.sub_status;
                                    if (sub_status instanceof Object) {
                                        let lastCurrentPlan = Object.assign({}, window.fj.currentPlan);

                                        window.FJGlobalariable.modSubscription.updateSubscriptionInfo(sub_status);
                                        FJGlobalariable.modSubscription.showLoading = false;
                                        window.FJGlobalariable.modSubscription.state.amount = sub_status.amount;
                                        window.FJGlobalariable.modSubscription.state.coupon = this.appliedCoupon;
                                        window.FJGlobalariable.modSubscription.state.transaction_id = sub_status.transaction_id;
                                        window.FJGlobalariable.modSubscription.state.page = 'successful';
                                        this.refreshInvoices();
                                        //判断是弹出砸蛋弹窗
                                        if(true == draw_egg){
                                            draw_egg = false;
                                            window.fj && window.fj.showEasterEggBox(plan_info);
                                        }
                                        let pay_type = window.fj.currentPlan.package + '_' + window.fj.currentPlan.period;
                                        let text = 'Create';
                                        if ('free' !== lastCurrentPlan.package) {
                                            pay_type = lastCurrentPlan.package + '_' + lastCurrentPlan.period + '-' + pay_type;
                                            text = 'Upgrade';
                                        }

                                        // 统计事件
                                        window.ealog && ealog.setUserProperties({'account type': window.fj.currentPlan.package + ' ' + window.fj.currentPlan.period});
                                        window.ealog && ealog.addEvent('revenue', {
                                            'price': sub_status.amount / 100,
                                            'pay_type': pay_type,
                                            'is coupon code': !!this.appliedCoupon,
                                            'coupon code off': this.appliedCoupon && (this.couponObject.amount_off || this.couponObject.percent_off),
                                            'coupon code': this.appliedCoupon,
                                            'platform': 'paypal',
                                        });
                                        gaEvent('subscription_upgrade', FJGlobalariable.modSubscription.entry, '');
                                        gaPage('subscription/'+pay_type+'.html', 'Subscription ' + text);
                                    } else if ('failed' === sub_status) {
                                        FJGlobalariable.modSubscription.showLoading = false;
                                        if ('free' === window.fj.currentPlan.package) {
                                            window.fjmessage.addMessage(text_('SUB.PLEASE_USE_STRIPE'), 'error');
                                        }
                                    } else {
                                        checkoutStatus();
                                    }
                                }).catch(err => {
                                    let tryAgain = true;
                                    if (err.type === 'ajax') {
                                        total += 1;
                                        if (total > 30 && Date.now() > beginTime + 30 * 1000) {
                                            tryAgain = false;
                                        }
                                    }
                                    if (tryAgain) {
                                        checkoutStatus(500);
                                    } else {
                                        window.fjmessage.addMessage(text_('SUB.CONNECT_NETWORK_FAILED'), 'error');
                                        FJGlobalariable.modSubscription.showLoading = false;
                                    }
                                });
                            }, offset);
                        };
                        switch (res.code) {
                            case 200:
                                checkoutStatus();
                                break;
                            case 500:
                                window.fjmessage.addMessage(res.msg, 'error');
                                throw new Error();
                            case 214:
                                window.FJGlobalariable.modSubscription.noLoginResponseCallback();
                                throw new Error();
                        }
                    }).catch((err) => {
                        if (err.type === 'ajax') {
                            window.fjmessage.addMessage(text_('SUB.CONNECT_NETWORK_FAILED'), 'error');
                        }
                        FJGlobalariable.modSubscription.showLoading = false;
                    });
                });
            },

            onError: (err) => {
                console.error('subscription error: ', err);
            }
        }).render('#paypal-button-container').then(()=> {
        });
    }
});

Vue.component('fj-sub-pay-head', {
    template: `
        <div class="fj-sub-pay-head" ref="head">
            <div class="fj-sub-back" @click="handleBack" v-if="showBack">
                <fj-sub-icon-arrow/>
                <span>{{text_('SUB.BUTTON_BACK')}}</span>
            </div>
            <fj-sub-btn-close :onClick="close"/>
        </div>
        `,
    data: function () {
        return {
            state: window.FJGlobalariable.modSubscription.state,
            localLanguage: window.localLanguage,
        }
    },
    computed: {
        showBack: function () {
            return window.FJGlobalariable.modSubscription.state.page === 'pay' && !window.FJGlobalariable.modSubscription.state.hideBackBtn;
        }
    }
    ,
    methods: {
        close: function () {
            this.state.page= '';
        },
        handleBack: function () {
            window.FJGlobalariable.modSubscription.state.page = "plans";
        },
        fitSize: function () {
            this.$refs.head.style.width = this.$refs.head.parentElement.getBoundingClientRect().width + 'px';

        }
    },
    mounted: function () {
        this.fitSize();
        window.addEventListener('resize', this.fitSize);
    },
    destroyed: function () {
        window.removeEventListener('resize', this.fitSize);
    }
});

Vue.component('fj-sub-pay-package', {
    template: `
        <div class="fj-sub-pay-package" @click="handleClick" @mouseover="hover" @mouseleave="unHover">
            <div class="fj-sub-package-name">{{packageName}}</div>
            <div class="fj-sub-package-price">
                <span>{{'$' + price}}</span>
                <span>{{text_('SUB.PAY_UNIT_PRICE')}}</span>
            </div>
            <div class="fj-sub-package-save" v-if="save !== ''">
                <span>{{text_('SUB.PLANS_SAVE')}} {{this.save}}</span>
            </div>
            <div v-if="canSelect" class="fj-sub-package-choice" :class="objectClass">
                <div>
                </div>         
            </div>
        </div>
        `,
    data: function () {
        return {
            text_: text_,
            isHover: false,
            localLanguage: window.localLanguage,
        }
    },
    props: {
        packageName: {
            type: String,
            default: '',
        },
        price: {
            type: Number,
            default: 0.0,
        },
        save: {
            type: String,
            default: '',
        },
        canSelect: {
            type: Boolean,
            default: true,
        },
        isSelect: {
            type: Boolean,
            default: false,
        },
        onClick: {
            type: Function,
            default: () => {},
        },

    },
    computed: {
        objectClass: function () {
            if (this.isSelect) {
                return 'fj-sub-package-selected';
            } else if (this.isHover) {
                return 'fj-sub-package-hover';
            } else {
                return '';
            }

            return this.isSelect?'fj-sub-package-selected':'';
        }
    },
    methods: {
        handleClick: function () {
            this.onClick();
        },
        hover: function () {
            this.isHover = true;
        },
        unHover: function () {
            this.isHover = false;
        }
    }
});

Vue.component('fj-sub-plan-features', {
    template: `
        <ul class="fj-sub-plan-features">
            <li v-for="item in list">
                <fj-sub-icon-plus v-if="item.icon === 'plus'" />
                <fj-sub-icon-tick v-if="item.icon === 'tick'" />
                <span>{{text_(item.text)}}</span>
            </li>
        </ul>
        `,
    props: {
        list: {
            required: true,
            type: Array,
        }
    },
    data: function () {
        return {
            text_: text_,
            localLanguage: window.localLanguage,
        }
    }
});

Vue.component('fj-sub-plan-popular', {
    template: `
        <div class="fj-sub-plan-popular">
            <div>{{text_('SUB.PLANS_POPULAR')}}</div>
        </div>
        `,
    data: function () {
        return {
            text_: text_,
            localLanguage: window.localLanguage,
        }
    }
});

Vue.component('fj-sub-plans', {
    template: `
        <div class="fj-sub-plans">
            <div class="fj-sub-plans-head">
                <div class="fj-sub-plans-title">
                    {{text_('SUB.PLANS_TITLE')}}
                </div>
                <div class="fj-sub-plans-period">
                    <span>{{text_('SUB.PLANS_MONTHLY')}}</span>
                    <fj-sub-btn-switch :callback="handleSwitchPeriod" :initActive="!isAnnual"/>
                    <span>{{text_('SUB.PLANS_YEARLY')}}</span>
                    <span class="fj-sub-plans-coupon">( {{text_('SUB.SAVE_UP_TO')}} 50% )</span>
                </div>              
                <fj-sub-btn-close :onClick="close"/>
            </div>
            <div class="fj-sub-plans-body">
                <fj-sub-plans-item v-for="item in planData"  :isPopular="item.isPopular" :plan="item"/>
            </div>
            <div class="fj-sub-support">
                <span class="fj-sub-support-title">
                    <span class="support-text">{{text_('SUB.SUPPORT_TYPE')  + ' ' + text_('SUB.SUPPORT')}}</span>
                    </span>
                <svg width="141px" height="20px" viewBox="0 0 141 20" version="1.1" xmlns="http://www.w3.org/2000/svg">
    <g  stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g  transform="translate(-546.000000, -745.000000)">
            <g  transform="translate(546.000000, 745.000000)">
                <image  x="0" y="0" width="141" height="20" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAI0AAAAUCAYAAACwN74uAAAAAXNSR0IArs4c6QAAC4JJREFUaAXtWgtwVNUZ/u7u5kHekYQgj4QEoiRACFUIY4lBIPgC2hLKtJYKI4wjUQod0CI42DLG4ogdEQupogbB2qE8JASkIioFLa8qr0CajEBCQsmjgSSbkNfu7fnO5V52szcxGzDKtP/Mvfc8/vufu3u/fP/3n6yyatOX6gvrD6Op2YHuND9fK56bOQrzp/9AcV23sbFRbW1tdR3qtrbNZoO/v7/b83DxdbmV6qubqtDUonbbs3AhPx8FC6ZHYM6USLdnEt+PumXLFuzbtw8BAQHd8kwNDQ1IS0tDRkYGbKs3H+92wPBTEqRcu605HJ0Hr7PoHBSLBcrAmLZhtL69BFAFAIPjzOfbjLa39lt5l7sdMHw0gpRrt7WcnBxs37697fC33t+4cSPq6upga3U4v/XF2lugK2urJWVoWbsBravfcQvrs/Bx2DIfhRJmhaVoPZQza93m1fiZcMY/CgT2dxvvTMfh7F6GcX0ms7Xz8vJcXbq1vWPHDti6dcUbXKx1zbtofibLNErLK2/AsnkVfMeKFzy2h4ePIoBkFYdz+GKodzzmMX8rDbTHiN3xGZxO560DGse+g+0Chl+WJcCBkLEalTcU+cISbzX9Di3HV8AZEg+1d6rpvNlgcIAFr/26n5yqq3cgOFCLffh0A84UN2Lmg7eZ3eY2pt/HK02PwbY+x3ZZZQv6RvqwiW37ruDTL+2y/X06dYlp+kcFG5/hQnmd0R4zvK/QECpq6ptx8usqY/xmNFpf+VOHYQKSrn+5tlN2kYpC2/VXCrK9Ak1acpB8gR8ftWPNwn44JMCyenMlNi6LQfrIIMxYXoKEGD+MSgzEx0frENzDgqljw7B47UWkJAagVABh1kO3IeuVUnz6+iDM+F0x+kb4IDHWH1v31UjQ0W/G8mLMmxaJfgI0jM9430ez6A81sncJlo/ZhWOzXsLXjy9H9sRN+hSGx0ei5qNMeYQG+eHUhl/KI2PsIOnzi4mDUbJ1Nna+/CPsXPljHFg7HRJA1yL8+bcPGvdPuifWiNvZhvNMERyffNGuu+Kjosed9ca8b3gD1PL2tZpSeQTK5dOG/zc1fjYhXALljwIwOR9WS3e+ZL5YAoiAcTVF1DqJA7QxvviEAf4Ge2z9rAZT08Kw8fkYnDnfKEG4VTAKjX5sk21utgUGXgcg2659b9cymObIpWjw6Jf8GJSzryK5V5kRa8H0EbL99s581NibjPGC85clONYsGifH1m47Ieeje4cYTDNsYAQedgEK+3lfnDNidKbhFKmpI/Pt0+gxrRSK54zy1DaGY8U/gPBEo9tR45+FDQgRKWn1XytRUNKEEJGuCIbDp+uRs6saS2dGYb240gigvpG+RjiCq67BYQAhJNAigbZNMAwZ6DURk0awMO68jAgszv63BxCNgC6NYcOGYf78+aivr8fJkydx6NAhDB06FFFRUXLs7NmzOHfunPSpqKiQPpybPHmyjJKbmyt933//fdB31apVOHXqFFJSUqD7jx49WvpmZWXJMXYM0MgZcdpbFCbQ/3fsyr4fcWFVOHslQvxlaIzyTl4+BvUN011FPq/GI+l3yj7B9N5HBQZYdKfMqcNl88CJixiT1EdjoA1H9OlOXZ3nSzv0s4aYlOnXtEN7Nyr1pehsTVQkgPLS3NsFMzTJe7Z+dkWCZqZIOWSLkAArBsdobHIovx6lFZouGZWg7aFMTQvFaXEv+9Q/IoNjz5E6LH00CmVVLTKFvZBTLplmwshgjBcpjjE7Y3v37gVf+osvvmi81F69ekmAHDx4EEuXLoX+wuPi4jBnzhwj7JQpU7Bu3TrwStDRn1ZeXi7BwzbBRFYKCgoy4hvpiQ609/5WgMt1TRg+KRuDBGgWPXKXHP/sq1KcEDplcEy47Nc1NKP4Uq0ESq3QMExbTEtkHbZpvOqgWrz2gBwjcLw1y4ghHd7SUqkJR1cntafnmNt8eMcxXX1vF/rjtc1V+I3QKEwdKUMC5fVj8eIBRWMJwUT6nD7PKxlkzxG7MUeds1eAgqno8JkGZK0vl2xFX7JZptA9/QRTsU0m64otWbJEMgwB801GZiE7jRs3DgQgrbKy0gAN2YwbewSPbja94Xr9qrAC4+6Kxc/vseKOewfKqTdzT8nr4AFapVBQrFUqJUIIP7ToA6yYO0YyCfVNjBDKDz+9HZk/SZL37BTpiMKYopkiminKG6FsnZjm+nge7ZZLfnDUW2EN1BjHeVVs+KVqwPVwvjag3t5xTNf73sz9j/hD0mKv3qylE84z9bDS0aodjbcolmkT7g6SV85JNhJpSfetrXfKlMWqbN60COnHKox9TR+pgsUFM4n49woRfniddDE9jR8/XqaT/Px8CRQCgKyjCjpjaiIQFixYALvdLoHAfRY9PbFNMJCpCA6mJBpjREZGSn/ezzmmKZ2JlAEZb6nVte6aYNZDiVi1YCy++KoQ94y4A5yPnfa2DLju2XT89L54bNh9Bk/94VM5pp8InLnXgBI6cQ0ubJsj/mJ8QWCVCFYiWMg+z2Z/jjVbj+O2EH+c3zLbbYtc5GfxebUXoMfltXn+82h96y+uQ27tHkPsCLq7Vo412kOASYFu864ddUAGnIlPiY0+Ue25mCIUrKBit+fh9Kg5/1J10Li4y0qHeoWgoLGMpr4pE+nJFVzUP7pwph9ZhlVS5soL7ErjfdRHZCsK5VoRl0wWJNJU9tP93Z5JvHTPL0gP1ImrLoKphXTjmGtfHze7mjJNzq7TEjQEDG315mPGvQkxGtNQz7BCWvHEDw1hq6ceMgsZh4ChRQt24aEbweOt+Sx5Co5tu6FWa5VG2/uv5gfBr38jLIFOqBMCRdJox2yBcA6ZBwR4nybNIhIwemlMkZu5shS1Qk+xxGY5vUToltcFOxFctQ1O2V8vKrBDIvVQCBMgNKYwGjXNYCGmmaY4F9fHF9ly5uadzMBhNtZ2xX6+VzEl/KKnENYdjxVVIlmU2lCdYFWk29C4nrJZIEDDNEQAuIKAgnfuyk/wudA3tBVC9P7+mvAlyFiW6+CSDp08KVGR8MvLQctzL4vy+3PTu+pxH/zEjrDif9J0Xu01GmrSMzcNMO6LqPIlky3IJAlCGJdVVsmKi37sE0SswCh+EwSzaKaRxoS7g+UeD9mF6YuCmUBjavyuLcjaiomh5Xgg7BKCRduUafiQS9+49mLEZ7rapP3XOcDfhtRMbf/mbFkN7FdbsP94GVhi06hT9JL8CQEcfUw2xOmA8KXW6apZkhLgl/u23LNxfLAbzgNHxFawAsu9o2Gb+gAsY0aBuzNK1VEoFz6EUiHKatUBNXIk1L73e7Wh580z6oKVoPiVSDvUJ1nvimpIMAbTEPdyqGfYX5HZB9yrITjqBPNwV5lG8cs22YiMpYlsb57i5vv6KE5MDCtHugBMlM/1rRZTTXPzlzeP6I2mMY/QtdGamhqEhnruGHuraVhK6+lFfxJWSzrTcIx9gom7xzQCiqzTkVHP6CV3Y7MTaSOC3bLtjWqajtbmnJ/FidTgKgmWaD8N1K73tMs0rk7fh/aJEyfAg5acnIxjx44hIiICLS0tiI2Nlb8tSUrSqrUrV66gZ8+esjKIiYlBcXExeI2OjpYxCJoZM2bc8MciGHh4mMkY/0XQFQsP7tx+TVdit70n3t+OlKBqpARXI8J2nVna+t0yoNFffGpqKpYtW4b09HTs2bMHhYWF4L4EjSVkWJgmLMkkBNH+/fvlXElJCSZNmgRezVhGOv0PnqhXJFAEWIYFmPwBmHwnNpvVY3/PxO3bGfJmbQJAB8TChQsle8yePVuCgHM6e5BlaGQWAubJJ5+UvgQKx/Q52ejkySp003dlZmtbxA/P+BOFrlqErRmDBKskBNRKwIRavftfl/L/n3te/+pvlZ97iq1/1Ztf7vUSIpaph0DhdaA4umpf9p6M/wKGghKA7ymeJgAAAABJRU5ErkJggg=="></image>
                <rect  fill="#FFFFFF" x="37" y="0" width="32" height="20" rx="1"></rect>
                <image  x="43" y="2" width="21" height="16" xlink:href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAACcCAYAAAA6R+R/AAAABGdBTUEAALGOfPtRkwAAKP5JREFUeAHtXQl8JEXVf9U9k0yuTbJJ9sidzbIcyyWoK4rIqaAgnx9+yim7nAILCOKtiAhyeIEgsoAg8AECKh9y3yIglwuKLLBL7guyyW7uzSQz3fX9azI96ZlMz3RPZjIzSdUvk67j1atXr+pVvXpV1c1onjhO+7oHaOvOftJWK8RWcKJ6Il5LxJahimXBX35EdXWEh/Abx8+LXz9+bZx4KyPWquDpJ1fTUupoQfy8c+N3VNaSznbCr4E4byCGJ/F6VHQpfrmMKB98XAS/ip/ZCV5tQ1o/Y6wX/k7kb0P+Fo34OwUFJe+wr2yaNGfIVj94kJ3uA1pW7ybX/ujMn0QN9sNvN/xyUlQbITivovO8ppP6qpvcryymFiFYWeP478uLvJT7UVJoP87Zxxnpa4KDRyrq4APSzRCYV0nnLzKFveRZ1/V+KgpKNc6sERCMVup2qjwEzy9wYoeDMatSzZwY+DWkvYjfQ6DlwSXU1RQDNm1J47csr0PnPAo0Hg0iPoOfO23EYGZG2Y+hwz2aW1jyZLbMMBkvIL1UvSdUnZPB3OPwW45fJrp3wci/aKTemm51bMft1VVM4+tAzzEYTPbORGaBJqhn7B48/zf/lC7MzJnrMlJAoD5VuEg9CWz7Gn57ZS77ZlCmo+Gfhip2cwUte5DRRqFqpNzx+0idGK46XFfoDDToF1Bg5Joh5TTMooDNyHsnV9kf8k/u6p4FnpRkzSgB2UZV1Rj1LsLvdNQ2ckGdEgakECkWr/wGlTzXpmq9wu9YWjDuV8+CQeE81KMmhXWZC9RY1PM7mKJe6Vnb2TwXBdopIyME5ENa2oAZ4xsYfc8A0R47hGcRzAgMCTfkkOuqEuoYSAbdfENl/kSOcjrwfod4xqqdiVYVszA9irr9uOCUnjcSRZKsfGkVkD6qqSTSr0Rljscvm9SCRPg/iEy/8hH/ZSX17EgEAd+wr3vc/eF6NNp3kX9JIjiyKI/OGD3A/f5v5Z3e25ouutMiIBghXH1UfQ4KvxTTqrCzLyTXhfpfuIS673dS6fFbag4gRbsBptnVTvLNA9hx4uxqz5jnCnZe08Rc12fOBaSPlu9LpPwOFf3YXFc2w8p7WCP/ecso9ug4elv9MlX3XU2MTgT9c95eGcSzJmxKnov9lMfnkqY5Y/hWqihk5P4V2vi0Bd7Q5vbdwbCOKKOe36IhMLGEu/Hbqk5C7HWILQ5PWcAhTn+c5Oyc4tO6ts8FF+ZEQPpp+a46KfehsN3nolLZVgaME09C6zx5CbV9KGgP7nr/FvOFMHVLN5MDnVzhx+Wv7XlpZlJyY1IuIP1U9TUMjUKlynazbXI5PxNbLwRlbcHvWb/C9LuRvNNMEBlj4oAfa5PLPZ1dl7JLSJypS4lLmYD0UXkRjkbdCJVKWKiks8GBnLrxwfwzdM2/vEAcrpTOBgcw+D7sV2ntopO7t9kAdwySEgER5lschnscxO/hmKKFmAGtUPCRYcrbYyRQe215Afl2wrIDdk7pbHGghensc57Tkn8mLukt0EdVq4D0CQhHva2qLXAgpnIq+vQAYfYI44RemkuTqzGRqElvorBy5lGgVyf++WRvLiaV+0ET7qNg+nzfxEpKv2IuTosO2kbuyujmfb3ITb49yom7laSUtwCQjDLOj/Gc2gOjR3Jc0gSknyoPxSLzAZBVmBzS5jcWlqtT8aHbyFU+GbOiPN9Fk3tCSHLn+0GDmGxwkjjBYf3LX+dsI9aqgKQICCxVB0OlEjNHrlVBMn6aAywHwvFZCEdZbOEwcvA8CMlHKuRMYjAk/lNDfzw2/5TuP8UHjQ0xawEJ3td4HsWUxC5KpgoOBNQqzBzupdHVKisu8QI3Te4l1S0r/kSJn4S6ddRs1a1ZCchWql6JnWCxWSPXHFFaaEaUwqn4EOs1xwz4iAi9KIcm9y7HSZ1ZNVsE1vkcZMO6rh9YcFrPm4nWMuHVH46oL4FwyAW5A84XfnzIckFuB40yMkk57+CEBfQH6exwgC9SFPaE9/aqhK9nJyQgPVSZr5LrCZAod3vttBNg8nYfJc/OYzahrcGUbV5ytWbV+yKsKzM3KRVco0cH76otTaS4hAQkhxRxgC5T7zsnwoeU5nEvn6CCfZLXqV2do6T27kgpzfMMeWPOhHYHh5nVab0cC0gfVR6L216nOC1oocIrBRoVHQC1yHHTxOaY+/1BYjv8sYFkaogDYP+R47dWnR+KsOlx1GzY69gFQvg6cMu9DjsMBndLjugjV4U9c64dlGYYYdmagPlX7rabuRLTP8l19un807peiwllSrQ9g7RSvQfCIV7VIoXDxMBY3vw9R1ImHKJcNuYjV9twLBJkWjgHcpjC7x+6pXpxeLR1yLaAFJLvCqCR6w5rXoaluBb7SAhIqp2ra5SUQWd7KqmmKcPx1+Yo/Fq7NNoSkF6q2gsI19tFuuDhoFoV7j+A/Yq5sce6N6Ms8S4Q6exy4ITx26oPtAMcV0DAdoZTQDcAmcsOQgkDk+6uo+QqnZN3xgXYzbwaudpTP1vNo7bFFh79VrwlJl6d4goIrFanQEg+GQ+RTJ/igJKnUf5ec99ZhaolrVpOeiHfbdz9wQXxcsS0Yg1TVRm02/eABOcbpLPDgSKoVrmN6dmj0Bd7aHKPMjtkSpgpDoxhy2LX/FN6Oq0YEnMGmcTb7ZBRCocV9yLi1RIf5a5Ij3AIUpTtXrlgj2iTOMECzBDixYWWzlJAemnJUph1xSt6pLPJgYJ9YHKNOSfbRDQLMFcLaJDrdQccZF+NdVbLUkAUyrkQpeQ5KGlBg4qLTzk13rTzQBxoFDOJdLY5oHKNfccKOqqADJHYSOFnWWWS8TM5kI/DiJniXJ1zbyTIlLonRgc/SXxsKFreqAIySfq5AMZre6SzwwG1yE85teEvXbCTL1UwyhBmkeHUHG9JFc1pxuvminpRNBpmCAjueRRAkT4vGrCMi86BvNWYPdK89oikTIXZVzr7HMDGyGmjNy9ZGpljhoC4yHUMgKBiSWeHA+IKbTotV1Y0qv3jxCY1q2QZP5MDHkVxixeEh7kZAgIDiHwfbBiLYgdyG9AR3RloNgJJ6ofpMznH5lqGpkZ5F3KYgIhPoIH0gzOU/Iwky7PT7G8JpqpiAQHJQNlNVX1nixda8l4TN1fvacYTJiDY9xBTTFicGVj6wzmgFuIMVIrueoSXlFiIjftJGZWLdSfc42q4BhUmDHh14wlOkC102Jz6zLFcWbWF0pf5NFrRno54HD05Xnw12Cg7JCDiSDummN2NBPmMz4HciPfpxs8x9xBqn9w0dMj1Su+OqgONPCEBgch83oiUz/gcUPL0uK8NjY8l9RDM65enfB2ymel0hJElJCCYWg43IuUzPgfcy7NnZJZHT+K3pxnCLAsBAQluDu5nBpL+2BwQr/LJFqfKK7kOm4qt3nF7dZXIFBAQbA6ugT/u7SqHpcxrcPey7BGQwJ11ae511h81fX+RISAgmFICAWcYFi60uDUoTLxZ4/Cuc7Zj7q4AZw1fYhHK6VMiObgGYR+PBSvTwjngKsu+zqaMZB/N4Vyf2xC+yf4JUWJQQChs93BuScm+0uJ99CYTayQ3DB23ymqxH6IMUuClvjWOsy/gDK5Sf9bVno1mH81pZnL+xHhVozJB/t3STEjWFa/g/ke2OXHsRDpnHNB0vpuiElvhLNsCh8ZxA3VR9nW2wNF3TV/gjees+oyzBgUsq3OWbWFDCwuW+HRzNjplPIssb5nAYM4b8DEvLgXEQWMIAclaJy9QOWs6ptTCiqXg/fnS2eWAOIOVrY75spf2dPAck0cFBISXp6PwbC0zqwVkIotnv3R0GE7lEBCW0Lfb0kFvJpTJ3Fk8Cvuzc+2UtnZntBgCIl8O56gBsnSBPlVHKSCO2hqyIVSsHIeZFjQ4E0NKljomvyHitOVyRXPLU7xO2JbNMwgOLUrniAMuMYNksVLtqLLJAc7mPsYy7O12yWmRVGLhEBAmX3vhhMVaFncy7HpJ54gDE0LFkgLigGd4E7gD6MwCFcOhdE44wCYFy/BBCenscoD7s1dA5PfU7bayAceH8R1W1m8E5TM+B3hg0o0Pl4kQ3B163VMmkpdxNGEo7INWqksBcdA0+ngW6ynuLKbdQRslCxT2mH5wjH2YLIQLAY/uzd5RmEsBcdZFOX0oTvO2Osu1sKH1sSwWEI/81L2j3qtQG9Yg1O4o0wIHFot0fTwLhQR7IDw3C+lOZ3/jvFUopVvSSUM2lq0NZ99IzPNBcxYb4NLSTzi9r5RTTxMKl68Ad9AC2lD2CYiel300O2iSVIByr5LztthbxSUBvikVJcxXnP5t2Xd8jRdmH81p7j8dpevaBg2735tpJiarivdvy74D0HqRFBAnnQz7g/8S8AEBYcRecpJ5ocP6B1yUVUdOoCbwouwT6vT2M/1FUX5AQHRi/0gvMVlWus7I3589HY5j/SH3QBz2MT41aQQEpIK6xEK92yGKBQ3u68nNmvrrpZ6soTVDCB3NKyrZKGgJqljEoWY9kSHEZQUZkx9kj4BopdlDayY0PtYfz7CvbAqccg8IiCAKH/B8LBOIyxYahIqVFQcXsUGol0gBcdKvFM4fN+BDAqLS+JOIlF+eNzgT74kjCBOdma+66IshHKrcIYzXnKZ0TXexh4xwSEDKaDvuhbAHjQT5jM+Byfa8+EBphtAqMp/GNLMosvhn80/uCq3HQwIioDAo3hEJLcPWHJjEQp0H7pxZw6Q1RVxmWJz5s1xaeRRZOKM7zVFhAgJr1lNI/MAMIP0xOABz70Rr5o7QWplHmndjNF+UpDHPjskHzPFhAjJ17ITuMQNIf2wOeDcXxAZIY6q2PHNpSyNbYhX9Z3ZO36gZIExARALeASTVLDOH4vj9A27KxKMn3KOSLs27cVovPBkXAsLUK5E6Q0CWUve/Ef9seFYZisWB8Xczb6TWKgtjkSzTIjjAOb2Vu67nmYjomQIiAKBqXR4JKMPWHBDrkIy6aejCUZjKfGuCZcpMDjD+M3GnLDJhxgwiAMqpW8wg8gBjJLeswlisj7+TOSO2fzloUaM2rVUNFnp8U15hz5+iMSEWF6+IlkHGReeAd0sB6d5Y7IyeL+mx2BTUqjNP5Ut6PZOL8DL2FXEvaqazbNEK6n4EylbgwNbMbDImkgPirvr4W0WR0XMe9lcX4n398u65A8Z3eHzL7raCtxSQqQz8x1YZZfxMDohZRBtNX+cUR9r9NZmj6s3kUAbGcPoRO3Ojz4qymAISnEXk8RMr7kXEi0tUO94ojoidu6C/DjOYXHs4YDh7wXNK9wzTrhlBTAERgLCmn4fHmDmT9FtzQFi0fGk4Cs8L3CRNu9btEiXFr3J+bjTLlRk2roAspp4O2L5+Zs4k/bE5MPpKydxeyYVd3reqRL7WJ3azhKWCZdfmnBrY8wuLjwzEFRCRoYJKfoHHe5GZZTg6B8R7s8bfnru1gFYJC9qi7LkCHJ1rcxrbncsnfmKnRFsCwmjTJCf9DCCMagqzU9BCg9kBi5Z/uzvl1Rb3zX0N6Vv3pLyCyS+AM87PZqf2j9hBjZnGvttKVT9Ehp/az7GwIdViP5UctZVYCr9rOLl3BenFcvaw29Ow5rjGs677AgOe/4Zyx1nxF0lhGs4hthSQu2mH5tspfyJ3C/tW75itGcRABqvWz3BfV9w8lM4GB8QbGMf+mbrR3d+wSAqHjXYwgbyeW1DyHVOY6Fx8YQ3CgU91dsNAf5SXTx6rqHS11+NdIuAcCQhmD10n30nI1xNWiAxYcsD7XgFNNCf/XJQ4qeuvSf/GpGXFMywBhqZB0vxfNV7GYJAnrFgK8VFVd43gwOIYfiWc89Ak4PiFrcuod2sfVZ+A+4dPo5D07YoZNcyCp7Bqucp8pJZY7kc5qoU4yu7bdbG0WtnnGhQfdmre6b2t0bLkuoaegyVKx2ZGC1tHXr4Bn0b/YGq97WgNYkbeT5XrUep15jjpt+aAWqhR8Re2kuKBpjsbh5O6E1h3iH0P6WxygLOf5J3adYlN6DAwRyqWOSfeCn89pOsyc5z0W3NAHEEZfrqMZvURUDB8cjfgkMJhzeiZKTclKhwCVcICIjKXUffFULVuFn7p4nNA3DwceQGqERRixw7C4VtVKm8JOmAcWPYXT2H32Q6yzACdlYCAAI6Z5Cw8o56ln1GajKDJDg+NPO9cSPwriklblvzF/jxukudzmfsEq2Psdus9KwERhUA4tBFyn4RB8Sm7hS50uAm8T2v05VLbM4m/sZjEMXbpbHKA0WseX+7RbF2b12YOSzD07+Q4Tqtz+mnwdmA7NjkY5z+W3BU7qOhTg1B0LXQutI4fu+TyCLuDvsDpGQ9NfMnuTnk8zLOeQYwCxHEUXNU9HuFfGnHyGZsDEy35NPzc4ugHGyEcYs0hhSM2D8NT+d0e/7IjkiUcAnfSZhAzoTiS8gMgFkdSUoLfXNZ88LuXTFLRQdumTcAw5U5in0O+FdF+66Kj/Tp3Xfc34x1ft49xCjJlHRhCshbIf4di5LsvbbSK2CcpOngbqcs5Te4BU674Kq10djjgw+73t/NP7b7GDrBTmJQJiCCkl6r2gg53L7w7OyVsIcKrhf5/5V/Bh7HPccBCrH8CdcZdJX5c/ik9/0ggr60sSVuDRCtNvIQO4+FHYa65K1q6jAtxwA9t9Celo70f9Zy79TPYJzkZKfJTFCH2zPTArPGwT6V9UikcotSUziDmavVT1ddQKaFySWO+mTFE7RgFT1xCPS+aoyduXbabxtV7oFPvaY6XfvLje2iXezq7LmWXiDflptbNmYCIamyl6p0U0q/DGa7PpbZaWYFdNO5NKuV+dzG1DEWjmN9XnTcxRj/B6dJvIF0eviJ6UdHYObmnd70VjV+piJtTATEq0EeVR2HyEgcd64y4BfZ8E7rt2Tiq84qdentvr1rFNboesIfZgZ+HMNsZY5fmtnddNxezhpl/aREQQcBWqihklPtjrE/OR3ChjI4DuH7wwzLquRGMd6QewFLDvLeJawb6zzG4LDM34jz2Cx5tmMhVf1ByQsdAOuqZNgExKttHVatAxPewPkHjz1tBwXY5v8ZFOdeWUhv8iTt+x9KCcb+K82/sW8ASuPWWOLaMzSkE436oUz+bS3UqGjfSLiAGUQO0vE4jdiEGytMRl7mfbTIItvccwQL8hhxyXVVCyR0B+YbK/Ikc5XTg/w6sXsvtkZPxUHgNOP2ZMX4xPkWQEW/RyRgBMZquj2oqoUZciPA6/HDsNfscZsO3oQZhAb7j9qmPo6auDkJQvG4FR3z0M1EmTOpZ6cZgT72T/P6rrW79patWGScgBiOmDj8OfA6qhDgpfDTiM/3VHRNg5l+hSt2ENcYz8IPsuXVjt1buoxA7A6WKM3HZcGH9VbTvrbnce08yz08lk+sZKyDmSg5TVdkkcZwSZsej130CaSnd4DSXHceP9QR7DO8Me9BFnsetzLVxcCQ9ObBO0dwYXPhRENMjUUB50gtJDCGHQLwBg8OfGFPu85zS0ZIYmrnLlRUCYmZHD1WWw+R1mNhLAfH7I63RnJ5i/wQE9E2U+w/8HimjZS8wsn4zeIppsYWe30eqd6RyP2w4HgmefQqZ9sFvLjdrO4jxF7C595TG3E8Urmv70BbhGQKUdQISybetVL8ML/3fDx13L4yYu+O5B2Dq8MuNhHUY7gWuVjCoCR3rdUxZr5ZRMYRj06RDPBkFzi8h147ayj3xnZ1PoF4fwwyzCvp/QxIW+j5UFKcC2Ca0w9uYKv5NnL+CoyCdGcUAh8RkvYBEqy86NttG1ZU66Q3o2OWwGZbhWYboIh1fDjfyoPI78PNyUgbRqHjyAYVcLRPkb62kngV1ForfVu+Z9E80cJfaABVoMfiSr3O9GCqRB1al0CerIAB+ztgI0rdznfqZovWTyto9np7u2V5vNdpFPiUHJAckByQHJAckByQHJAckByQHJAckByQHJAckByQHJAckByQHJAckB5LEAZizpZMcmP8cqIdTdfZZo6Yu7n94c2dnjxG2esp3y1hxRsbPKw7gQzZ748jLBqNSfqYcAr8UEIMhqXo21tbfCMYHzoNhR35zS3vr+lSVJfHOPQfkDDJLnuPM0Rocx9hboMGRjNR9kHCWdMrsiXEgU46NJ0a9zCU5kGIOSAFJMYMl+uzmQFJUrLq6uuWKolTk+P39sAyI8/7i0n1Ut3NNTaWPu8uglozjnGhnU1PTRFTA2JEMRomlil+pULgyULysuHfjxsTvZey8885FPp9vuaJphQrng+7xoq2b+jaNxiYh+akNDQ2BOmmqNupyuT5IkDcBwvbdd1/3aH9/tcZ5nu5ydbe0RH/3llEL8NOjqmoF8/vLwYOhSUXpaWuz/32N1atX50wMTizRmV7K3Xxra2trr4F7Ns+VK1cu4hO8VmW+HVs6OtqBS4uBT0X/Wir6F3jY397eLmiw7Isx8ISSbJt5G+vrN+DSy76BnJw3NXe0Hbuivv44xulHiNs1hJFoG+LunCT90o6OqRcVCOaNj41diPjTABdY0Abhx/F8AkfNf9rU3v6GCUdU76rq6irN5fo27i4cA4AqE9AA7jTcD879WPWrhaTqfwylMX5Zc1vb/4XCQQ8Yn6v7/WcB18lggnh7oXk2xYl5asXR7udQ5z+2dLSIL/oGXGNjYw359QeMMG7WiroHLiAh0xgEf8bLBrA2ebipre2S6TzTvlCddPoS6lAznULjWN88zTX289bO1hdM8WFeGAluw+JH3IGB09+saW8/q6u+/oeo17mgx7jTj++AswuaO1rFu8hC7kAiV0d9/UlolxMRKS6f5YQS8fUFrKpegwHi5pq2trv+hk+VmNJC3p3q69dACC8CDw8HvPkrP82g/5a8goJfjY+O/g8j5QIjk0v3f9FsYl1ZU9PIFde9RjpuaF6s6PpmxF0L/h6BeKNtBnWF7RIpfBDuXVSdvgP+4X1r4lpDyH2AuDuZy3U59/sPBk/M7XZIc3v7syFIC499Aamrfw44DgzgYfQfMPwhEP99C7wiuo009TDNpfWrnAQhH4kB68NdjK+3tLffagWzsrbhJM74jUi3vA2HymzHazEuQoOH8KDDnt7U3nqLGW+gU6rq42jQ3c3xVn7cj3iypaMt8DbIxurGlaRq71vBRo3ndDsGlLWRaajTiajTTYjPi0wLD/Pr0JjfQJweHo/Rpq7+ZcSJa8ioDuHmHvXB99+BsOkfOtYadKzXjKid6up21Yn9GWEh4HEc/6eqaf+1paur2wA8UAhXXcM1GNzORlyMfsQ2guzHAPJDI6+GC1qYndqMcGNN4+6kaP8xwuhXP0W7nWMS8Kkk9DsMdmGvYl1ZX/89vHnyUuCPpQ21QVivRb/4takMWwISC+k0rkgfF29r58FRKzIxFK4n1f+AytlWxMQSDpHBDQ5vQGXfwUj7SghD0NNY23BGUDhiNAQowogJJoRs3ZF4gmGmqSpmGHvCIfJgBgh1LAucjqMxI69FwwpBjlmnKcTs3Ma6OgYhOTdmQZzvZ9FROiAcrxt5Gxoa9tR1/neEbVndMJOW4fbYdiM/nqyzvv5uxvn/mOIsvHxfgId1agtAc7R4T9qMvokLWkKgQw48vAqD17eBPxRn4alHv7jaIi1m9AwiYkJPJwamYlTiX4yzXzOm4zU3lIswpsPAC808U6BhnfADpP2ac+0N4q4hRdHWgPE/ANzyIKygBSMBfXYqPPUfU/jeOufXIWTmwrsYua5H3Ju6rvqhUu0O6TgTAGsQF7oxOIUh/D86muhEQp0wXC8wn0+q+lxzc/O2hoaGcqZpuyukHAqhPBFAHuZ2422GU86n+La5uPJdI8xE3lAdeBfnTNAV7hgX/Am5wCzEtRsQEawTPg7N2S90l3JbaWlp60hfX41G6iFQb64ATNlURra+obbhr60drU+FEM3wBEdRzFig/T6Fse2ksxqOhRpA0TxElZWV+UznQuU0C8cgOtrvMBA8BYKGALgU6QeBvLV4ViiMLujq6hLqcMCtqK0/D9giheMx1OYO0nUxu6L9lU8hfB78VfjFbJMA0rB/oh68H1FXimu7ChZHuoYr1bqCmWjKraxp+CIGGAhHmHsZZd7ENWUT+pfoT7h/z9ajPrvA75CGKbyJCghy8xd1xg5ra2/1TqEK/H8ZagPuI/N7TXHC28P8rjVN3U1dpvh/oqM8AXXl34jLF/Go8EErVqwoNi8oEfdTVNKsG/+xpLzsaxGLcjE6/qGxrgEdmX9T4LJ0XNkXHS+UjI75LahgIXqD+m0vAJ7BQvfi7du379ra1DRsZAiuq64ywivq6o9Fp5oScsY+aGlvC6UZMJFPpmrfBwV5oXjG1je1t20IhYla4G9paGj4N3Txl1D/QDspChfrvRgCIjDwnzd3tJs7zisi1nB57tyzAdNghPHcTC71sJbm5k5TnPA+trpi9aXevB3Hgz8PGmnCoOH3eqEuodZBB/XlrJa2thuNcPD5EtpyA9P1hyBMn45Iixec4Jp6cEtXy39MgGLGMxxEPjB4GGFBztVQv8TANd24RC9j/Xuzd2zsTsR+ZRrYvk+MLAk5jE4XRbNyNHW03gdixCgSchjtL48QjkBac1dzE2DvCwGKjuDDSwSCDouvZZhlvmCE8dwC/XVdhHAYyby5vVW8jvN5IyLakyk8bFBA40JdjO5EORCYt6KnJhYrDBZYSJgb6xU0rFk4QohR9msI3BaKQEcT66dQeKZHn9C0K2dGT8egLU6dDsEipKtfxswZKRwBEGHJw8JerJFCThufPBq9sdyIgJjcGkU4AsmBgU5Vv4zAkAFv54n1x8MRwhGWrbG2FloA7WaKfDaKcASSN23aNDnh969FoNkEb9ubqIAMv9/WJhovumPizYLTTtdU61EvQv1QXLzUyOnS2aHwm4eq66MJpQGPJyYc5Rem8AyvrititjE5/gMsdDdCn70GvzNX1NYeIkyLJoCker0jIx9DhQpCSMMsK6HYkIdx5aFQAB6/y3WAORzh/xCqkHmtEJa8smplNYZXoW4EHXu8ubM5rK2MFKsnRu7DzGkQuJj8hvBtRQv+wZwnrp/xTbFgmKKE0QADzy8Bb545wrIL9RAq5HVhkTYDYaOpzTwCTOiHlgQhqcvcr2E83GqJm7HuMExQ4g1Y+OoNv3hCxXjBHI7m1xX9RVjNLB1Mti9CIB4FwOdNQPuABuiroJopxH1+DTBQ/fhfuKpeb1b5THkS8ypKTVh9GV2FsizVMjR+eDk61YZHmEMM6zxrp6t6fYi5AMOaA+qbM4eFcj3WXUHH+99vb3/XCFk9MWq9gFlBrNVsOcywMeshaDANm+T2eOL2CwXv5oI2Yqt8M1BiMwiPuVmDJmV+cyFutxt1ju6YzrToKSJWNy8khWF+0Bp2KgUzjJjOLcsTUJ4dBV9Fg90Fb0TvE6kBp+K/WOBdhgX72wEzZDBh1g+dFc0GBxqsxCo/rEoxeIlcTAufGbEhaIXLMp6RGUfc9hB40C0HLPFFSUCfiNl+QGjuF9rmzZtHoqAJixIbwGERNgOJziA20c8ODO9fEpuOIeeesq60hSKieBoaGpaQHrDaREmdigrukp+Ijn8lKf6jMWkdgFFxDVLNjA/mZ9WAeQBrh9VCn7VEajOBM307hNMMDd2Y2W48sKPFnNmJX1i1oGpMO8aWTAfs+UC5SYUL5BeDbMwOjSKXh9XYXlGWUBiAt0G1M9LVVZWryrf0bBFajaXTWGLfVMloAcGKYktg/AlWW+dM6J6vWnIBCaqG15LabI2g/i108MsFTqw9KrjPtwe+ZvRZndN6oAmuFdhKWEIOBsjjAm42Dr2pJdS0QATB/H1TW6sw56bcKZM5TZp7UnRm0anFgu0QPC4RftuO0xbIt+CFcItW1tWtwSmIl6eC0f/DUnhY+JgQHc5uLGZKQUPI+d0TYmvg7lBEFA8GwcOmVcMoABZRAUZZpKU/WlWfARHQrAzH14vRwghFPutxnggm5u9FxtsN4+xTnzh+gM1KmAv5eWH5OFsZFp4OTIS8fNrAEIqL8KAzYW0T2O0OpGBEP1Uce4kAS0kwMMriZcLTyNn+2FsRg45th84e2osQmTCaX4yHqbuGoxI79kg9Ljx2diFdZWEDFQa078biIY4HLcF6a30ipWa0gIjFMTh/p6liSzECPtSAQ32muIBXWJ6wcLgXAbP5LxIsEBYWq5UNDWLUsXQ4OxRmTsX5IJNqMZ0NS/q+6RCD6X9FyEwt4kXDiQaahoECyOkWU7gRs9bN4nChKS7kra2tLRWXsnDK4MBQ5Cw80O/DrDkK0+9eUbti/2goRV3Aq2uRJtZkAVe8ZLEQELOadzg2X38jzNdBkNAD7bQzpqu/ImJGWggoAY8wvYOHfw9l5bQHDCv3YN+mMBQX9IiDtMynwRI4bZqOhIkVzmwVC5TjXbGXML/2X1BLFgcr8glF51vQae7GSuO1wCIfn0oGg05E+gzBiaw8GvMIDHvnQ704H9ajN8C4/8PG4euYtqcsbVypginzSOgfp5nyTuLA29OmcMgLte+fmLqPDEYoWNQ/A7Xjd7hdOAyadwVdX4aQiyMSZxuZcjTfL30u91qEl0/FsZMG+7cdgDrdAOXnLdAyhPVXLdLEATsx+hahQxy659Kle73V2zs2lSex/9inuhv1Pgu595vCwMpxEuJ5HDx9BEvjp8HTPpRfCb4cTJp+OGAUpL1r7HWIvSHw8CKkizoFZw623js6dgTicfxE2YJ65xPT98dQ8FWAJFU4pmjGf65chDJehM/A/yVv/tj7oOF/kfYftKGK+nwc6cdD5V4UyufQk/ECIjaxMNofB2Y/iLp5gvVbhKb5OhbwXzfvigfThMWkNOgPe4hRzjs6+htTJCxVXJh4haowFS2sAvgLd/zSgD0/PDIQYrp6FxY+30cg2FBM7DVgTRPCKND9N9LPxS9gZXqvu3sbhOgYxD+JDmSMenUg4SoBHMiJZ4RrHM3N+ybiLo2IdxrU8KHxY9DwGIFDaiOsoDgJi9OwU0aRIC+CmBF32S5VVfcLukUU1NAH0BEvQ/4fmQpvFGGouEYuU1LAihW1TcxATvwtnS2vr6irE99qvBn5lGDeZaABggMOCjLCq2HZL0ReMYMP9PefBHVN535lo7FRaSAO4s/MR1Nr65MYpQ8CdbD4xHLizBM/wQpCWKHAt/ORjsW/LedFud9Hhwgs4qPlmDoNgEaJIlYm+KXY/d3bFCaxsMVxik8iLuamWDAP1mH8Oq9/8hdmHIn6cU/iA+y4r0H+v9jBgU74uNftDgi3AQ+eXIwO+HWE45lY78HsZ7nPY+BL5ClOf0OD+BLy9sbJ/zecPv9GLJiBbdu+LIRDzJ6Kqn3agA3plkaE1XNxSXE5TC5tYMpGNNZrA0NDz1nBlhWXLoJMizsaG8XPp2mPDA4O+qPBlxYvyiMFoh6ExdmdJ7cPDZn0+qlc2wcHuyqrq270T/g70clz0XHFtCmsTKKBNoIBP/cUFZzBx8dHuaoUGviws/7swNBAxxQWGOSHht4fGBq8AfX5O9SgUZgLMUiwfKQHZycckmNsIxr1NnIppza3tj5i5LV6At9rZaUlf0N6CX5ipMSswDFQs2YMZQ/AvHo2BOJ1xIe5geGBrci7obS05D3AQxNgyM/zQA9oEof12Oug4w84d7e2ubP13pGREQhKuEPeCvCiRdQXz1fAJ6F2xHXDw8PjKPu+0kWLH8Xxm3GUJ3gJPgRUIi9apAlxD4CsM3G267doP28k0oHBwY2Ly8t+zzU+BoqRX9zJD+QXu+fPgPcXtXS0XlFavDgPZXiNNsn1+R7rHxlBmVNuSXGhS1eUIiNd19mzg8ODoTYz4KI9tw8Pbl6ybOkG3O0Rs5ugvwjPPNC/Hf5/wKhwCa4afLO8tARe9MpgP0N5T6JOgRlR4C1ZVLpc9CkICdY3rBK8eVXEA09WO0G/mEyT4TIVVzLq5gTHbPkw2/xOaLWCTYgGYbjRdb0CJ7sfNk5P/D89sJO84mJWUwAAAABJRU5ErkJggg=="></image>
            </g>
        </g>
    </g>
</svg><!-- <span class="fj-sub-line">|</span> 
<svg width="80px" height="20px" viewBox="0 0 80 20" version="1.1" xmlns="http://www.w3.org/2000/svg" >
    <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
        <g transform="translate(-716.000000, -745.000000)" fill-rule="nonzero">
            <g transform="translate(716.000000, 745.000000)">
                <path d="M29.8135484,4.35419342 L25.4012903,4.35419342 C25.0995098,4.3540032 24.8424981,4.57351692 24.7954839,4.8716129 L23.0109677,16.1858065 C22.9943648,16.2920581 23.0251034,16.4002531 23.0950901,16.4819043 C23.1650769,16.5635555 23.2672978,16.6104799 23.3748387,16.610323 L25.4812903,16.610323 C25.7832799,16.6104631 26.0403679,16.3906104 26.0870968,16.0922581 L26.5683871,13.0406452 C26.6150781,12.7425342 26.8718032,12.5227579 27.1735484,12.5225806 L28.5703226,12.5225806 C31.4767742,12.5225806 33.1541935,11.116129 33.5922581,8.32903226 C33.7896774,7.10967742 33.6006452,6.1516129 33.0296774,5.48064516 C32.4025806,4.74387097 31.2903226,4.35419342 29.8135484,4.35419342 L29.8135484,4.35419342 Z M30.3225806,8.48645161 C30.0812903,10.0696774 28.8716129,10.0696774 27.7019355,10.0696774 L27.036129,10.0696774 L27.5032258,7.11290323 C27.5314761,6.93419349 27.6855228,6.80258065 27.8664516,6.80258065 L28.1716129,6.80258065 C28.9683871,6.80258065 29.72,6.80258065 30.1083871,7.25677419 C30.34,7.52774194 30.4109677,7.93032258 30.3225806,8.48645161 L30.3225806,8.48645161 Z M43.0025806,8.43548387 L40.8896774,8.43548387 C40.7087486,8.43548669 40.5547019,8.56709672 40.5264516,8.74580645 L40.4329032,9.33677419 L40.2851613,9.12258065 C39.8277419,8.45870968 38.8077419,8.23677419 37.7896774,8.23677419 C35.4548387,8.23677419 33.4606452,10.0051613 33.0722581,12.4858065 C32.8703226,13.7232258 33.1574194,14.9064516 33.8593548,15.7316129 C34.5032258,16.4903226 35.4245161,16.8064516 36.5206452,16.8064516 C38.4019355,16.8064516 39.4451613,15.5967742 39.4451613,15.5967742 L39.3509677,16.183871 C39.3339814,16.2901009 39.3643634,16.3984418 39.434109,16.4803496 C39.5038547,16.5622573 39.6059691,16.609517 39.7135484,16.6096774 L41.6167742,16.6096774 C41.9187638,16.6098179 42.1758518,16.3899653 42.2225806,16.0916129 L43.3645161,8.86 C43.3815263,8.75400303 43.3512016,8.64587803 43.281552,8.56418566 C43.2119024,8.4824933 43.1099338,8.43545068 43.0025806,8.43548387 L43.0025806,8.43548387 Z M40.0574194,12.5477419 C39.8535484,13.7548387 38.8954839,14.5651613 37.6735484,14.5651613 C37.06,14.5651613 36.5696774,14.3683871 36.2548387,13.9954839 C35.9425806,13.6251613 35.823871,13.0980645 35.9232258,12.5109677 C36.1135484,11.3141935 37.0877419,10.4774194 38.2909677,10.4774194 C38.8909677,10.4774194 39.3787097,10.6767742 39.7,11.0529032 C40.0219355,11.4329032 40.1496774,11.9632258 40.0574194,12.5477419 L40.0574194,12.5477419 Z M54.2554839,8.43548257 L52.1322581,8.43548257 C51.9289667,8.43580568 51.7389473,8.53648939 51.6245161,8.70451613 L48.696129,13.0180645 L47.4548387,8.87290323 C47.3766038,8.61331676 47.1375712,8.43561486 46.8664516,8.43548257 L44.78,8.43548257 C44.661169,8.43516787 44.5495091,8.4922923 44.480234,8.58884209 C44.4109589,8.68539187 44.3926077,8.80946588 44.4309677,8.92193548 L46.7696774,15.7851613 L44.5709677,18.8890323 C44.4913082,19.0012213 44.4809419,19.1484947 44.5441001,19.2707364 C44.6072584,19.3929782 44.7333741,19.469678 44.8709677,19.469678 L46.9916129,19.469678 C47.192593,19.4699542 47.3809105,19.3715758 47.4954839,19.2064516 L54.5574194,9.01290323 C54.6354343,8.90049739 54.6445916,8.75407227 54.5811894,8.63282227 C54.5177872,8.51157228 54.39231,8.43548257 54.2554839,8.43548257 L54.2554839,8.43548257 Z"  fill="#253B80"></path>
                <path d="M61.2851613,4.35419355 L56.8722581,4.35419355 C56.5707218,4.35432076 56.3140729,4.57375832 56.2670968,4.8716129 L54.4825806,16.1858065 C54.4657832,16.2918752 54.4962739,16.3999803 54.5660195,16.4816397 C54.6357652,16.5632992 54.7377708,16.6103226 54.8451613,16.6103226 L57.1096774,16.6103226 C57.3207315,16.6100131 57.5002138,16.4562493 57.5329032,16.2477419 L58.0393548,13.0406452 C58.0860459,12.7425342 58.342771,12.5227579 58.6445161,12.5225806 L60.0406452,12.5225806 C62.9477419,12.5225806 64.6245161,11.116129 65.0632258,8.32903226 C65.2612903,7.10967742 65.0709677,6.1516129 64.5,5.48064516 C63.8735484,4.74387097 62.7619355,4.35419355 61.2851613,4.35419355 L61.2851613,4.35419355 Z M61.7941935,8.48645161 C61.5535484,10.0696774 60.343871,10.0696774 59.1735484,10.0696774 L58.5083871,10.0696774 L58.976129,7.11290323 C59.0038349,6.93415214 59.1578243,6.80235698 59.3387097,6.80258036 L59.643871,6.80258036 C60.44,6.80258036 61.1922581,6.80258036 61.5806452,7.25677419 C61.8122581,7.52774194 61.8825806,7.93032258 61.7941935,8.48645161 L61.7941935,8.48645161 Z M74.4735484,8.43548387 L72.3619355,8.43548387 C72.1809491,8.43498602 72.0268055,8.56691325 71.9993548,8.74580645 L71.9058065,9.33677419 L71.7574194,9.12258065 C71.3,8.45870968 70.2806452,8.23677419 69.2625806,8.23677419 C66.9277419,8.23677419 64.9341935,10.0051613 64.5458065,12.4858065 C64.3445161,13.7232258 64.6303226,14.9064516 65.3322581,15.7316129 C65.9774194,16.4903226 66.8974194,16.8064516 67.9935484,16.8064516 C69.8748387,16.8064516 70.9180645,15.5967742 70.9180645,15.5967742 L70.823871,16.183871 C70.8068489,16.2903236 70.8373951,16.3988839 70.9074308,16.4808406 C70.9774666,16.5627973 71.0799372,16.609895 71.1877419,16.6096774 L73.0903226,16.6096774 C73.3920677,16.6095002 73.6487928,16.3897238 73.6954839,16.0916129 L74.8380645,8.86 C74.8544558,8.75367707 74.8235519,8.64550154 74.7534689,8.5638828 C74.683386,8.48226407 74.5811273,8.43535824 74.4735484,8.43548387 L74.4735484,8.43548387 Z M71.5283871,12.5477419 C71.3258065,13.7548387 70.3664516,14.5651613 69.1445161,14.5651613 C68.5322581,14.5651613 68.0406452,14.3683871 67.7258065,13.9954839 C67.4135484,13.6251613 67.296129,13.0980645 67.3941935,12.5109677 C67.5858065,11.3141935 68.5587097,10.4774194 69.7619355,10.4774194 C70.3619355,10.4774194 70.8496774,10.6767742 71.1709677,11.0529032 C71.4941935,11.4329032 71.6219355,11.9632258 71.5283871,12.5477419 L71.5283871,12.5477419 Z M76.9645161,4.66451613 L75.1535484,16.1858065 C75.1367509,16.2918752 75.1672416,16.3999803 75.2369873,16.4816397 C75.3067329,16.5632992 75.4087385,16.6103226 75.516129,16.6103226 L77.3367742,16.6103226 C77.6393548,16.6103226 77.896129,16.3909677 77.9425806,16.0922581 L79.7283871,4.77870968 C79.7451641,4.67258012 79.714686,4.56442162 79.6449647,4.48266655 C79.5752434,4.40091149 79.4732537,4.35373854 79.3658065,4.35354839 L77.3270968,4.35354839 C77.1463038,4.35418856 76.9926948,4.48593152 76.9645161,4.66451613 L76.9645161,4.66451613 Z"  fill="#179BD7"></path>
                <path d="M4.68774194,18.8090323 L5.02516129,16.6658065 L4.27354839,16.6483871 L0.684516129,16.6483871 L3.17870968,0.833548387 C3.19405702,0.733674783 3.28024581,0.660112378 3.38129032,0.660642286 L9.43290323,0.660642286 C11.4419355,0.660642286 12.8283871,1.07870968 13.5522581,1.90387097 C13.8916129,2.29096774 14.1077419,2.69548387 14.2122581,3.14064516 C14.3219355,3.60774194 14.323871,4.16580645 14.2167742,4.84645161 L14.2090323,4.89612903 L14.2090323,5.33225806 L14.5483871,5.52451613 C14.8074562,5.65576778 15.040323,5.83331504 15.2354839,6.0483871 C15.5258065,6.37935484 15.7135484,6.8 15.7929032,7.29870968 C15.8748387,7.8116129 15.8477419,8.42193548 15.7135484,9.11290323 C15.5587097,9.90774194 15.3083871,10.6 14.9703226,11.1664516 C14.6720438,11.6739009 14.2709961,12.1134052 13.7929032,12.4567742 C13.343871,12.7754839 12.8103226,13.0174194 12.2070968,13.1722581 C11.6225806,13.3245161 10.956129,13.4012903 10.2251613,13.4012903 L9.75419355,13.4012903 C9.41741935,13.4012903 9.09032258,13.5225806 8.83354839,13.74 C8.57713825,13.9597393 8.40704163,14.2633526 8.35354839,14.5967742 L8.31806452,14.7896774 L7.72193548,18.5670968 L7.69483871,18.7058065 C7.68774194,18.7496774 7.67548387,18.7716129 7.65741935,18.7864516 C7.63991996,18.8007627 7.61808787,18.8087224 7.59548387,18.8090323 L4.68774194,18.8090323 Z"  fill="#253B80"></path>
                <path d="M14.8696774,4.94645161 C14.8516129,5.06193548 14.8309677,5.18 14.8077419,5.30129032 C14.0096774,9.39870968 11.2793548,10.8141935 7.79225806,10.8141935 L6.01677419,10.8141935 C5.59032258,10.8141935 5.23096774,11.123871 5.16451613,11.5445161 L4.25548387,17.3096774 L3.99806452,18.943871 C3.97731195,19.075056 4.01502012,19.2087516 4.10126151,19.3097595 C4.18750289,19.4107674 4.31363532,19.4690323 4.44645161,19.4690323 L7.59548387,19.4690323 C7.9683871,19.4690323 8.28516129,19.1980645 8.34387097,18.8303226 L8.37483871,18.6703226 L8.96774194,14.9077419 L9.00580645,14.7012903 C9.06387097,14.3322581 9.38129032,14.0612903 9.75419355,14.0612903 L10.2251613,14.0612903 C13.276129,14.0612903 15.6645161,12.8225806 16.3625806,9.23806452 C16.6541935,7.74064516 16.5032258,6.49032258 15.7316129,5.61096774 C15.4870518,5.33894391 15.1949693,5.1137606 14.8696774,4.94645161 L14.8696774,4.94645161 Z" id="路径" fill="#179BD7"></path>
                <path d="M14.0348387,4.61354839 C13.780017,4.53983303 13.5207905,4.48229896 13.2587097,4.44129032 C12.7408516,4.36170443 12.2174741,4.32351901 11.6935484,4.32709677 L6.95032258,4.32709677 C6.57734053,4.32686687 6.25986448,4.59853978 6.20258065,4.96709677 L5.19354839,11.3580645 L5.16451613,11.5445161 C5.22946913,11.1241256 5.59139545,10.8139813 6.01677419,10.8141935 L7.79225806,10.8141935 C11.2793548,10.8141935 14.0096774,9.39806452 14.8077419,5.30129032 C14.8316129,5.18 14.8516129,5.06193548 14.8696774,4.94645161 C14.6590873,4.83601844 14.4396089,4.7434361 14.2135484,4.66967742 C14.1542826,4.6500128 14.0947051,4.63130071 14.0348387,4.61354839 L14.0348387,4.61354839 Z"  fill="#222D65"></path>
                <path d="M6.20258065,4.96709677 C6.25938609,4.59836999 6.57724758,4.32658334 6.95032258,4.32774194 L11.6935484,4.32774194 C12.2554839,4.32774194 12.78,4.36451613 13.2587097,4.44193548 C13.58265,4.49284661 13.902117,4.56899234 14.2141935,4.66967742 C14.4496774,4.74774194 14.6683871,4.84 14.8703226,4.94645161 C15.1077419,3.43225806 14.8683871,2.40129032 14.0496774,1.46774194 C13.1470968,0.44 11.5180645,0 9.43354839,0 L3.38193548,0 C2.95612903,0 2.59290323,0.309677419 2.52709677,0.730967742 L0.0064516129,16.7083871 C-0.0173086674,16.8585079 0.0257996731,17.0115094 0.124436952,17.1271446 C0.22307423,17.2427797 0.367365503,17.3094718 0.519354839,17.3096774 L4.25548387,17.3096774 L5.19354839,11.3580645 L6.20258065,4.96709677 Z"  fill="#253B80"></path>
            </g>
        </g>
    </g>
</svg> -->
            </div>
        </div>
        `,
    props: {
        planData: {
            type: Object,
            required: true,
        }
    },
    data: function () {
        return {
            isAnnual: window.FJGlobalariable.modSubscription.state.isAnnual,
            handleSwitchPeriod: function (active) {
                window.FJGlobalariable.modSubscription.state.isAnnual = !active;

                let isAnnual = window.FJGlobalariable.modSubscription.state.isAnnual;
                let period = isAnnual ? "Annual" : "Monthly";
                gtag('event', 'view_item_list', {
                    "items": [
                        {
                            "id": "basic",
                            "name": "basic",
                            "list_name": "basic",
                            "brand": "FlexClip",
                            "category": period,
                            "variant": period,
                            "list_position": 1,
                            "quantity": 1,
                            "price": (isAnnual ? 4.99 : 8.99)
                        },
                        {
                            "id": "plus",
                            "name": "plus",
                            "list_name": "plus",
                            "brand": "FlexClip",
                            "category": period,
                            "variant": period,
                            "list_position": 1,
                            "quantity": 1,
                            "price": (isAnnual ? 7.99 : 15.99)
                        },
                        {
                            "id": "business",
                            "name": "business",
                            "list_name": "business",
                            "brand": "FlexClip",
                            "category": period,
                            "variant": period,
                            "list_position": 1,
                            "quantity": 1,
                            "price": (isAnnual ? 19.99 : 29.99)
                        }
                    ]
                });
            },
            text_: text_,
            localLanguage: window.localLanguage,

        }
    },
    methods: {
        close: function () {
            window.FJGlobalariable.modSubscription.state.page = '';
        }
    }
});

Vue.component('fj-sub-plans-item', {
    template: `
        <div class = 'fj-sub-plans-item' :class="itemClass">
            <fj-sub-plan-popular v-if="isPopular"/>
            <div class="fj-sub-plan-title">{{text_(this.plan.name)}}</div>
            <i></i>
            <div class="fj-sub-plan-price">
                <div>
                    <span>$</span>
                    <span>{{state.isAnnual?plan.price.annual:plan.price.monthly}}</span>
                    <span>/{{text_('SUB.PLANS_MO')}}</span>
                </div>      
                <div v-if="showSave">{{text_('SUB.PLANS_SAVE')}} {{'$' + (plan.price.monthly * 12 - plan.price.annual*12).toFixed(2)}} {{text_('SUB.PLANS_YEAR')}}</div>    
                <div v-if="isNow">{{text_('SUB.PLANS_NOW_PlAN')}}</div>
                <div v-if="otherShow"></div>
            </div>
            <div class="fj-sub-annual-plan-total">
                <span class="price-without-save">{{planTotalWithoutSave}}</span>
                {{planTotal}}
            </div>
            <fj-sub-btn-normal :text="text_('SUB.BUTTON_SELECT')" :disabled="!canSelect" :onClick="handleSelect"/>
            <fj-sub-plan-features :list="features">
        </div>
        `,
    data: function () {
        return {
            state: window.FJGlobalariable.modSubscription.state,
            text_: text_,
            localLanguage: window.localLanguage,
        }
    },
    computed: {
        features: function () {
            return this.plan.features.map(item => {
                return {...item, text: this.text_(item.text)}
            });
        },
        canSelect: function () {
            if (this.plan.package === 'free') {
                return false;
            }
            if (window.fj.currentPlan.package === 'free') {
                return true;
            }

            var plan = {
                package: this.plan.package,
                period: this.selectedPeriod()
            };
            return window.checkPlanCanUpgrade(window.fj.currentPlan, plan);
        },
        showSave: function () {
            if (this.isNow || this.plan.package === 'free') {
                return false;
            }
            return this.state.isAnnual;
        },
        isNow: function () {
            if (window.fj.currentPlan.package === this.plan.package) {
                if (this.plan.package === 'free') {
                    return true;
                }

                if (window.fj.currentPlan.period === this.selectedPeriod()) {
                    return true;
                }
            }
            return false;
        },
        otherShow: function () {
            return !this.isNow && !this.showSave;
        },
        planTotal: function () {
            if (this.plan.package === 'free' || !this.state.isAnnual) {
                return '';
            }
            return '$' + (this.plan.price.annual * 12) + ' ' + text_('SUB.PLANS_ANNUAL_TOTAL');
        },
        planTotalWithoutSave:function (){
            if (this.plan.package === 'free' || !this.state.isAnnual) {
                return '';
            }
            return  '$' + (this.plan.price.monthly * 12);
        },
        itemClass: function () {
            return this.state.isAnnual ? '' : 'monthly';
        }
    },
    props: {
        plan: {
            type: Object,
            required: true,
        },
        isPopular: {
            type: Boolean,
            default: false,
        },
    },
    methods: {
        handleSelect: function () {
            if(!window.fjuser.isUserLogin())
            {
                window.fjuser.addListener(window.fjuser.eventType.login | window.fjuser.eventType.register, (result, json) => {
                    if(result)
                    {
                        window.FJGlobalariable.modSubscription.showLoading = true;
                        window.FJGlobalariable.modSubscription.network.getSubscription().then((response) => {
                            window.FJGlobalariable.modSubscription.updateSubscriptionInfo(response.data.subscription);
                        }).catch((error) => {
                        }).finally(() => {
                            window.FJGlobalariable.modSubscription.showLoading = false;
                        });
                    }
                }, true);

                window.fjuser.showLoginPanel();
            }
            else
            {
                this.state.selectPlan = this.plan;
                this.state.page = 'pay';
                window.ealog && ealog.addEvent('choose plan select click', {
                    'selectButton': this.plan.package + ' ' + this.selectedPeriod(),
                });
            }
        },
        selectedPeriod: function () {
            return this.state.isAnnual ? 'annual' : 'monthly';
        }
    }
});

Vue.component('fj-sub-successful', {
    template: `
        <div class="fj-sub-successful">
            <fj-sub-pay-head/>
            <div class="fj-sub-successful-body">
                <div>
                    <fj-sub-icon-success/>
                </div>
                <h1>{{text_('SUB.SUCCESSFUL_TITLE')}}</h1>
                <p>{{text_printf('SUB.SUCCESSFUL_DESC','$' + this.price, timestampToDate(this.end))}}</p>
                <div>
                    <fj-sub-btn-normal :text="text_('SUB.BUTTON_GET_START')" :onClick="handleClickStart"/>
                </div>
                <img v-if="showImage" :src="affiliateURL" width="1" height="1">
            </div>
        </div>
        `,
    data: function () {
        return {
            text_: text_,
            end: window.fj.currentPlan.period_end,
            state: window.FJGlobalariable.modSubscription.state,
            localLanguage: window.localLanguage,
        }
    },
    computed: {
        price: function () {
            return this.state.amount / 100;
        },
        showImage: function ()
        {
            let amount = window.FJGlobalariable.modSubscription.state.amount / 100;

            return (amount > 0);
        },
        affiliateURL: function () {
            let coupon = window.FJGlobalariable.modSubscription.state.coupon;
            let amount = window.FJGlobalariable.modSubscription.state.amount / 100;
            let transactionID = window.FJGlobalariable.modSubscription.state.transaction_id;
            if(!transactionID)
                transactionID = window.fjuser.info.id;
            let url = null;

            if (amount > 0) {
                if ((document.domain === "www.designcap.com") || (document.domain === "designcap.com")) {
                    url = "https://shareasale.com/sale.cfm?amount=" + amount + "&tracking=" + transactionID + "&transtype=sale&merchantID=79751&storeid=2";
                    if(coupon && coupon != '')
                    {
                        url += "&couponcode=" + coupon;
                    }
                }
                else if ((document.domain === "www.flexclip.com") || (document.domain === "flexclip.com")) {
                    url = "https://shareasale.com/sale.cfm?amount=" + amount + "&tracking=" + transactionID + "&transtype=sale&merchantID=79751&storeid=3";
                    if(coupon && coupon != '')
                    {
                        url += "&couponcode=" + coupon;
                    }

                    try {
                        let package = window.FJGlobalariable.modSubscription.state.selectPlan.package;
                        let period = window.FJGlobalariable.modSubscription.state.isAnnual ? 'annual' : 'monthly';
                        gtag('event', 'purchase', {
                            "transaction_id": transactionID,
                            "affiliation": "",
                            "value": amount,
                            "currency": "USD",
                            "tax": 0,
                            "shipping": 0,
                            "items": [
                                {
                                    "id": package,
                                    "name": package,
                                    "list_name": package,
                                    "brand": "FlexClip",
                                    "category": period,
                                    "variant": period,
                                    "list_position": 1,
                                    "quantity": 1,
                                    "price": amount
                                }
                            ]
                        });
                    } catch (e) {
                    }
                }

                if(window.affiliateStatistics)
                    window.affiliateStatistics({transactionID, amount});
            }

            return url;
        }
    },
    methods: {
        handleClickStart: function () {
            //window.open('/editor', '_self');
            window.FJGlobalariable.modSubscription.getStartCallback();
        }
    },
    mounted: function () {
    }
});

Vue.component('fj-sub-btn-close', {
    template: `
        <div class="fj-sub-btn-close" @click="click">
            <fj-sub-icon-close/>
        </div>
        `,
    props: {
        onClick: {
            type: Function,
            default: () => {},
        }
    },
    methods: {
        click: function () {
            this.onClick();
        },
    },
});

Vue.component('fj-sub-btn-normal', {
    template: `
        <div class="fj-sub-btn-normal" :class="objectClass" @click="handleClick" :disabled="disabled">
           <span v-if="!isLoading">{{text}}</span>
            <div  v-if="isLoading" class="fc-profile-button-loader">
                <div></div>
                <div></div>
                <div></div>
            </div>   
        </div>
        `,
    props: {
        text: {
            type: String,
            required: true,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
        onClick: {
            type: Function,
            default: () => {},
        },
        isLoading: {
            type: Boolean,
            default: false,
        },
        btnType: {
            type: String,
            default: 'normal',
        },
    },
    computed: {
        objectClass: function () {
            if (this.disabled) {
                return "disabled";
            } else {
                if (this.btnType === 'normal') {
                    if (this.isLoading) {
                        return 'loading';
                    }
                } else {
                    return 'cancel';
                }

                return this.btnType === 'normal' ? '' : 'cancel';
            }
        }
    },
    methods: {
        handleClick: function () {
            if (!this.disabled && !this.isLoading) {
                this.onClick();
            }
        }
    }
});

Vue.component('fj-sub-btn-switch', {
    template: `
        <div class="fj-sub-btn-switch" @click="handleClick">
            <div>
                <div :class="objectClass"></div>
            </div>
        </div>
        `,
    props: {
        callback: {
            type: Function,
            default: () => {},
        },
        initActive: {
            type: Boolean,
            default: false,
        }
    },
    data: function () {
        return {
            active: this.initActive,
        }
    },
    computed: {
        objectClass: function () {
            return this.active ? 'active' : '';
        }
    },
    methods: {
        handleClick: function () {
            this.active = !this.active;
            this.callback(this.active);
        }
    }
});

Vue.component('fj-sub-text-input', {
    template: `
        <div class="fj-sub-text-input">
            <div class="fj-sub-head-icon">
                <slot name="head"></slot>
            </div>
            <div class="fj-sub-foot-icon">
                <slot name="foot"></slot>
            </div>
            <input ref="input" type="text" :placeholder="placeholder" :data-stripe="stripe"/>
            <div class="u-error">{{errorText}}</div>
        </div>
        `,
    props: {
        errorText: {
            type: String,
            default: '',
        },
        placeholder: {
            type: String,
            default: '',
        },
        stripe: {
            type: String,
            default: '',
        }
    },
    data: function () {
        return {
            value: '',
        }
    },
    methods: {
        getValue: function () {
            return this.$refs.input.value;
        }
    },
});

Vue.component('fj-sub-icon-arrow', {
    template: `
        <svg width="17px" height="18px" viewBox="0 0 17 18" version="1.1">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(-24.000000, -23.000000)">
                    <g transform="translate(26.000000, 22.000000)">
                        <g transform="translate(0.000000, 2.000000)">
                            <polyline stroke="#FFFFFF" stroke-width="2" points="8 0 0 8 8 16"/>
                            <rect fill="#FFFFFF" x="1" y="7" width="14" height="2"/>
                        </g>
                    </g>
                </g>
            </g>
        </svg>
        `
});

Vue.component('fj-sub-icon-pay', {
    template: `
    <svg version="1.1"  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 21 24" xml:space="preserve">
        <g >
            <g  transform="translate(-212.000000, -557.000000)">
                <path  fill="#44C573" d="M225.408,575.28c1.338,0.007,2.443-1.039,2.512-2.375v-0.035l2.436-2.736
c0.515-0.596,1.406-0.683,2.025-0.196c0.297,0.246,0.482,0.604,0.516,0.987c0.031,0.387-0.094,0.768-0.35,1.061l-4.863,5.576
c-0.647,0.742-1.586,1.168-2.574,1.168h-7.311l-1.27,1.271L212,575.583l3.245-3.217c1.345-1.336,3.334-1.787,5.124-1.16
l0.712,0.251h4.386c0.374,0,0.73,0.151,0.992,0.419c0.262,0.27,0.4,0.631,0.391,1.005c-0.051,0.755-0.684,1.341-1.439,1.327
h-2.631c-0.296,0-0.536,0.24-0.536,0.537c0,0.296,0.24,0.535,0.536,0.535H225.408z M222.753,565.021
c0.354,0.201,0.724,0.373,1.104,0.515c0.162,0.064,0.326,0.131,0.485,0.202c0.193,0.082,0.373,0.19,0.535,0.322
c0.19,0.132,0.294,0.361,0.263,0.592s-0.189,0.426-0.41,0.501c-0.291,0.123-0.609,0.164-0.922,0.12
c-0.517-0.057-1.019-0.206-1.48-0.442c-0.097-0.06-0.207-0.095-0.32-0.103c-0.257,0-0.336,0.26-0.382,0.399
c-0.083,0.268-0.159,0.539-0.231,0.809c-0.12,0.442-0.045,0.607,0.369,0.809c0.455,0.207,0.938,0.345,1.433,0.412
c0.078,0.009,0.156,0.024,0.23,0.049c0.018,0.083,0.022,0.167,0.02,0.251v0.529c-0.008,0.137,0.041,0.271,0.139,0.369
c0.096,0.099,0.229,0.148,0.365,0.143h0.365h0.43c0.133,0.008,0.264-0.044,0.355-0.141c0.094-0.096,0.141-0.229,0.129-0.361v-0.24
v-0.49c0-0.164,0.037-0.215,0.213-0.265c0.568-0.149,1.076-0.476,1.449-0.929c0.485-0.587,0.686-1.361,0.545-2.11
c-0.16-0.799-0.668-1.485-1.385-1.872c-0.402-0.213-0.818-0.402-1.244-0.566l-0.162-0.066c-0.25-0.1-0.482-0.234-0.695-0.399
c-0.148-0.108-0.23-0.286-0.215-0.47c0.035-0.188,0.168-0.342,0.346-0.407c0.129-0.051,0.266-0.078,0.404-0.08
c0.566-0.034,1.133,0.078,1.645,0.326c0.527,0.255,0.645-0.129,0.686-0.292c0.072-0.214,0.135-0.429,0.195-0.654l0.073-0.257
c0.045-0.123,0.038-0.257-0.019-0.375s-0.158-0.207-0.281-0.248c-0.363-0.16-0.746-0.272-1.139-0.333
c-0.354-0.056-0.354-0.056-0.354-0.412c0-0.749-0.06-0.858-0.79-0.858h-0.395c-0.43,0.013-0.545,0.14-0.557,0.56v0.292v0.156
c0,0.315,0,0.315-0.313,0.429c-1.141,0.414-1.754,1.194-1.823,2.318C221.355,563.7,221.794,564.446,222.753,565.021z"/>
            </g>
        </g>
    </svg>
    `
});
Vue.component('fj-sub-icon-calendar', {
    template: `
        <svg version="1.1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
            <path fill="#C2C2C2" d="M20.281,3.95h-1.066V3.648C19.215,2.742,18.441,2,17.496,2c-0.971,0-1.744,0.742-1.744,1.648  V3.95H6.247V3.648C6.247,2.742,5.473,2,4.528,2C3.557,2,2.783,2.742,2.783,3.648V3.95H1.719C0.773,3.95,0,4.691,0,5.598v15.753  C0,22.258,0.773,23,1.719,23h18.563C21.227,23,22,22.258,22,21.352V5.598C22,4.691,21.227,3.95,20.281,3.95z M16.439,3.767  c0-0.568,0.461-1.032,1.031-1.032h0.024c0.567,0,1.03,0.463,1.03,1.032v3.057c0,0.568-0.463,1.031-1.03,1.031h-0.024  c-0.57,0-1.031-0.463-1.031-1.031V3.767z M3.471,3.767c0-0.568,0.462-1.032,1.031-1.032h0.026c0.568,0,1.031,0.463,1.031,1.032  v3.057c0,0.568-0.464,1.031-1.031,1.031H4.502c-0.569,0-1.031-0.463-1.031-1.031V3.767z M19.678,21H2.322  C2.147,21,2,20.848,2,20.668V9h18v11.668C20,20.848,19.854,21,19.678,21z"/>
        </svg>
        `
});

Vue.component('fj-sub-icon-card', {
    template: `
        <svg width="24px" height="18px" viewBox="0 0 24 18" version="1.1">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(-585.000000, -417.000000)" fill="#C2C2C2">
                    <path d="M605.891139,417 L588.108861,417 C586.394519,417 585,418.379545 585,420.075478 L585,431.924522 C585,433.620455 586.394781,435 588.108861,435 L605.8914,435 C607.605742,435 609,433.620455 609,431.924522 L609,420.075478 C609,418.379545 607.605481,417 605.891139,417 Z M606.999743,431.767489 C606.999743,432.447157 606.435339,433 605.741715,433 L588.258285,433 C587.564404,433 587,432.447157 587,431.767489 L587,426 L607,426 L607,431.767489 L606.999743,431.767489 Z M607,422 L587,422 L587,420.36574 C587,419.612603 587.564404,419 588.258285,419 L605.741715,419 C606.435339,419 606.999743,419.612603 606.999743,420.36574 L606.999743,422 L607,422 Z M591,429 L588,429 L588,431 L591,431 L591,429 Z M595,429 L592,429 L592,431 L595,431 L595,429 Z M599,429 L596,429 L596,431 L599,431 L599,429 Z M603,429 L600,429 L600,431 L603,431 L603,429 Z"/>
                </g>
            </g>
        </svg>
        `
})

    Vue.component('fj-sub-icon-close', {
        template: `
        <svg width="13px" height="13px" viewBox="0 0 13 13" version="1.1" >
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(-1248.000000, -20.000000)" fill-rule="nonzero" fill="#FFFFFF">
                    <g transform="translate(1239.000000, 11.000000)">
                        <path d="M16.9142136,15.5 L21.6974009,10.7168127 C22.0879252,10.3262884 22.0879252,9.69312339 21.6974009,9.3025991 C21.3068766,8.91207481 20.6737116,8.91207481 20.2831873,9.3025991 L15.5,14.0857864 L10.7168127,9.3025991 C10.3262884,8.91207481 9.69312339,8.91207481 9.3025991,9.3025991 C8.91207481,9.69312339 8.91207481,10.3262884 9.3025991,10.7168127 L14.0857864,15.5 L9.3025991,20.2831873 C8.91207481,20.6737116 8.91207481,21.3068766 9.3025991,21.6974009 C9.69312339,22.0879252 10.3262884,22.0879252 10.7168127,21.6974009 L15.5,16.9142136 L20.2831873,21.6974009 C20.6737116,22.0879252 21.3068766,22.0879252 21.6974009,21.6974009 C22.0879252,21.3068766 22.0879252,20.6737116 21.6974009,20.2831873 L16.9142136,15.5 Z"></path>
                    </g>
                </g>
            </g>
        </svg>
        `
    });

Vue.component('fj-sub-icon-lock', {
    template: `
        <svg version="1.1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
            <g >
                <g transform="translate(-864.000000, -476.000000)">
                    <g transform="translate(864.000000, 476.000000)">
                        <path fill="#C2C2C2" d="M4.293,24h14.414C19.984,24,21,23.016,21,21.775V10.967c0-1.24-1.016-2.225-2.293-2.225V7.057     C18.707,3.179,15.464,0,11.5,0S4.293,3.179,4.293,7.057v1.685C3.016,8.742,2,9.727,2,10.967v10.809C2,23.016,3.016,24,4.293,24z      M19,22H4V11h15V22z M7,7.098C7,4.297,9.025,2,11.5,2C13.975,2,16,4.297,16,7.098V9H7V7.098z"/>
                        <rect x="10" y="15" fill="#C2C2C2" width="2.525" height="4.421"/>
                    </g>
                </g>
            </g>
        </svg>
        `
});

Vue.component('fj-sub-icon-person', {
    template: `
        <svg version="1.1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
            <g>
                <g transform="translate(-589.000000, -354.000000)">
                    <path fill="#C2C2C2" d="M609.318,376.361c0,0.899-0.729,1.639-1.635,1.639h-14.05c-0.901,0-1.635-0.734-1.635-1.639    c0-4.782,3.877-8.659,8.659-8.659C605.441,367.702,609.318,371.579,609.318,376.361z M600.66,370.043    c-3.253,0-5.932,2.457-6.281,5.617h12.561C606.591,372.5,603.912,370.043,600.66,370.043z M600.66,366.766    c-2.973,0-5.383-2.41-5.383-5.383c0-2.973,2.41-5.383,5.383-5.383c2.973,0,5.383,2.41,5.383,5.383    C606.043,364.356,603.633,366.766,600.66,366.766z M600.66,364.426c1.68,0,3.042-1.362,3.042-3.043    c0-1.68-1.362-3.042-3.042-3.042c-1.681,0-3.042,1.362-3.042,3.042C597.617,363.063,598.979,364.426,600.66,364.426z"/>
                </g>
            </g>
        </svg>
        `
})

Vue.component('fj-sub-icon-plus', {
    template: `
        <svg width="15px" height="15px" viewBox="0 0 15 15" version="1.1">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(-873.000000, -513.000000)" fill-rule="nonzero" fill="#FF822C">
                    <path d="M879,519 L874.007484,519 C873.451066,519 873,519.44266 873,519.998957 L873,521.001043 C873,521.552752 873.44892,522 874.007484,522 L879,522 L879,526.992516 C879,527.548934 879.44266,528 879.998957,528 L881.001043,528 C881.552752,528 882,527.55108 882,526.992516 L882,522 L886.992516,522 C887.548934,522 888,521.55734 888,521.001043 L888,519.998957 C888,519.447248 887.55108,519 886.992516,519 L882,519 L882,514.007484 C882,513.451066 881.55734,513 881.001043,513 L879.998957,513 C879.447248,513 879,513.44892 879,514.007484 L879,519 Z"/>
                </g>
            </g>
        </svg>
        `
});

Vue.component('fj-sub-icon-question', {
    template: `
        <svg width="20px" height="20px" viewBox="0 0 20 20" version="1.1">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(-1073.000000, -481.000000)">
                    <g transform="translate(1073.000000, 481.000000)">
                        <path d="M10,0 C4.48,0 0,4.48 0,10 C0,15.52 4.48,20 10,20 C15.52,20 20,15.52 20,10 C20,4.48 15.52,0 10,0 L10,0 Z" fill-opacity="0.2" fill="#01CDE7"></path>
                        <path d="M13.07,9.66666667 L12.17,10.648 C11.45,11.4266667 11,12.0666667 11,13.6666667 L9,13.6666667 L9,13.1333333 C9,11.96 9.45,10.8933333 10.17,10.1146667 L11.41,8.77066667 C11.78,8.38666667 12,7.85333333 12,7.26666667 C12,6.09333333 11.1,5.13333333 10,5.13333333 C8.9,5.13333333 8,6.09333333 8,7.26666667 L6,7.26666667 C6,4.90933333 7.79,3 10,3 C12.21,3 14,4.90933333 14,7.26666667 C14,8.20533333 13.64,9.05866667 13.07,9.66666667 L13.07,9.66666667 Z" fill="#FFFFFF"></path>
                        <rect fill="#FFFFFF" x="9" y="15" width="2" height="2"></rect>
                    </g>
                </g>
            </g>
        </svg>
        `
});

Vue.component('fj-sub-icon-shield', {
    template: `
        <svg version="1.1" x="0px" y="0px" width="24px" height="24px" viewBox="0 0 24 24" enable-background="new 0 0 24 24" xml:space="preserve">
            <g>
                <g transform="translate(-215.000000, -592.000000)">
                    <path fill="#44C573" d="M234.766,596.222c0,0-0.822,0.556-2.222,0.556c-0.622,0-1.378-0.111-2.224-0.444    c-1-0.4-2.133-1.111-3.333-2.333c-1.2,1.2-2.333,1.934-3.333,2.333c-0.844,0.333-1.6,0.466-2.222,0.466    c-1.4,0-2.222-0.555-2.222-0.555s-2.222,11.133,7.778,17.755C236.988,607.378,234.766,596.222,234.766,596.222z M226.988,612.645    c-3.511-2.512-5.711-5.91-6.534-10.133c-0.377-1.934-0.377-3.645-0.311-4.756c0.378,0.089,0.8,0.133,1.289,0.133    c0.867,0,1.755-0.178,2.645-0.533c0.978-0.4,1.956-1.022,2.911-1.844l0,0V612.645L226.988,612.645z"/>
                </g>
            </g>
        </svg>
        `
});

Vue.component('fj-sub-icon-success', {
    template: `
        <svg version="1.1" x="0px" y="0px" width="228px" height="198px" viewBox="0 0 228 198" enable-background="new 0 0 228 198" xml:space="preserve">
            <path  opacity="0.3" fill="#44C573" enable-background="new    " d="M193,116.5c0-45.012-36.488-81.5-81.5-81.5C66.489,35,30,71.488,30,116.5S66.489,198,111.5,198C156.512,198,193,161.512,193,116.5"/>
            <g>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M29,162.429c-1.34,0-2.428-1.087-2.428-2.429c0-1.341,1.088-2.429,2.428-2.429c1.343,0,2.429,1.088,2.429,2.429C31.429,161.342,30.342,162.429,29,162.429z M29,154c-3.313,0-6,2.688-6,6c0,3.314,2.687,6,6,6c3.315,0,6-2.686,6-6C35,156.688,32.314,154,29,154L29,154z"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M222,127.43c-1.342,0-2.43-1.088-2.43-2.43s1.088-2.428,2.43-2.428c1.34,0,2.428,1.086,2.428,2.428S223.34,127.43,222,127.43z M222,119c-3.314,0-6,2.687-6,6c0,3.314,2.686,6,6,6c3.313,0,6-2.686,6-6C228,121.687,225.313,119,222,119L222,119z"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M208,89.619c-0.895,0-1.619-0.724-1.619-1.619s0.725-1.619,1.619-1.619s1.619,0.724,1.619,1.619S208.895,89.619,208,89.619z M208,84c-2.209,0-4,1.792-4,4s1.791,4,4,4s4-1.792,4-4S210.209,84,208,84L208,84z"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M150.502,25.322c-1.006,0-1.822-0.815-1.822-1.822c0-1.006,0.816-1.821,1.822-1.821c1.005,0,1.82,0.815,1.82,1.821C152.322,24.506,151.507,25.322,150.502,25.322z M150.502,19c-2.486,0-4.502,2.015-4.502,4.5c0,2.486,2.016,4.5,4.502,4.5c2.484,0,4.498-2.015,4.498-4.5C155,21.015,152.986,19,150.502,19L150.502,19z"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M4.5,126c-2.484,0-4.5,2.015-4.5,4.5s2.016,4.5,4.5,4.5c2.486,0,4.5-2.015,4.5-4.5S6.986,126,4.5,126"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M199.5,143c-1.932,0-3.5,1.568-3.5,3.5c0,1.934,1.568,3.5,3.5,3.5s3.5-1.566,3.5-3.5C203,144.568,201.432,143,199.5,143"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M40.5,35c-3.038,0-5.5,2.462-5.5,5.5s2.462,5.5,5.5,5.5s5.5-2.462,5.5-5.5S43.538,35,40.5,35"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M6.5,178c-1.934,0-3.5,1.566-3.5,3.5s1.567,3.5,3.5,3.5c1.933,0,3.5-1.566,3.5-3.5S8.433,178,6.5,178"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M181.5,41c-2.486,0-4.5,2.015-4.5,4.5c0,2.484,2.014,4.5,4.5,4.5c2.484,0,4.5-2.016,4.5-4.5C186,43.015,183.984,41,181.5,41"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M25.5,75c-1.381,0-2.5,1.12-2.5,2.5c0,1.38,1.119,2.5,2.5,2.5s2.5-1.12,2.5-2.5C28,76.12,26.881,75,25.5,75"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M211.998,41C209.79,41,208,42.791,208,45s1.79,4,3.998,4c2.211,0,4.002-1.791,4.002-4S214.209,41,211.998,41"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M3,89c-1.657,0-3,1.344-3,3c0,1.657,1.343,3,3,3s3-1.343,3-3C6,90.344,4.657,89,3,89"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M82.001,4l1.586-1.587c0.55-0.55,0.55-1.45,0-2c-0.551-0.55-1.451-0.55-2,0L80,2l-1.588-1.587c-0.549-0.55-1.45-0.55-2,0c-0.55,0.55-0.55,1.45,0,2L77.999,4l-1.586,1.587c-0.55,0.55-0.55,1.45,0,2c0.549,0.55,1.451,0.55,2,0L80,6l1.587,1.587c0.549,0.55,1.449,0.55,2,0c0.55-0.55,0.55-1.45,0-2L82.001,4"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M8,53.999l1.587-1.587c0.55-0.549,0.55-1.45,0-2c-0.55-0.55-1.45-0.55-2,0L6,52l-1.587-1.587c-0.55-0.55-1.45-0.55-2,0c-0.55,0.549-0.55,1.451,0,2L4,53.999l-1.587,1.587c-0.55,0.551-0.55,1.451,0,2.001c0.55,0.549,1.45,0.549,2,0L6,56.001l1.587,1.587c0.55,0.549,1.45,0.549,2,0c0.55-0.55,0.55-1.45,0-2.001L8,53.999"/>
                <path  opacity="0.6" fill="#44C573" enable-background="new    " d="M202.25,167.5l1.389-1.389c0.481-0.48,0.481-1.27,0-1.75c-0.482-0.481-1.27-0.481-1.75,0l-1.389,1.388l-1.389-1.388c-0.482-0.481-1.27-0.481-1.752,0c-0.479,0.48-0.479,1.27,0,1.75l1.391,1.389l-1.391,1.389c-0.479,0.48-0.479,1.27,0,1.75c0.482,0.481,1.27,0.481,1.752,0l1.389-1.388l1.389,1.388c0.48,0.481,1.268,0.481,1.75,0c0.481-0.48,0.481-1.27,0-1.75L202.25,167.5"/>
            </g>
            <g  transform="translate(26.000000, 92.000000)">
                <path  fill="#41423F" d="M160,92H13V7.365C13,3.298,16.285,0,20.337,0h132.325C156.715,0,160,3.298,160,7.365V92"/>
                <polygon  fill="#44C573" points="21,84 152,84 152,8 21,8 "/>
                <path  fill="#FFFFFF" d="M164.891,101H9.109C4.079,101,0,96.969,0,92h174C174,96.969,169.922,101,164.891,101"/>
                <polygon  fill="#AEAEAE" points="74,95 99,95 99,92 74,92 "/>
            </g>
            <g  transform="translate(66.000000, 55.000000)">
                <g >
                    <path  fill="#FFFFFF" d="M71.279,0H9.678C4.394,0,0.11,4.277,0.11,9.551v92.991c0,5.274,4.284,9.551,9.568,9.551h77.189c5.283,0,9.567-4.276,9.567-9.551V25.114L71.279,0"/>
                    <path  fill="#F7F8FA" d="M70.879,15.563c0,5.275,4.284,9.551,9.566,9.551h15.588L70.879,0V15.563"/>
                </g>
                <path  fill="#FF822C" d="M65.24,44.001c-0.898,0.026-1.752,0.401-2.38,1.045c-5.405,5.418-10.817,10.813-16.23,16.23l-7.953-6.637c-1.469-1.221-3.65-1.021-4.874,0.445c-1.224,1.468-1.028,3.648,0.438,4.875l10.387,8.656c1.378,1.148,3.405,1.055,4.67-0.217c6.15-6.163,12.306-12.292,18.467-18.466c1.017-0.998,1.318-2.517,0.761-3.827C67.969,44.796,66.664,43.96,65.24,44.001L65.24,44.001z"/>
            </g>
        </svg>
        `
});

Vue.component('fj-sub-icon-tick', {
    template: `
        <svg width="14px" height="14px" viewBox="0 0 16 12" version="1.1">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(-130.000000, -477.000000)" fill-rule="nonzero" fill="#FF822C">
                    <path d="M144.408021,477.000643 C144.006173,477.012354 143.624655,477.179991 143.344238,477.468063 C140.928611,479.888909 138.510406,482.299994 136.091169,484.72114 L132.537178,481.755433 C131.880547,481.20964 130.905959,481.29869 130.359117,481.954446 C129.812274,482.610203 129.899765,483.584932 130.554646,484.132822 L135.19661,488.001126 C135.812394,488.5144 136.71821,488.472432 137.283895,487.904418 C140.032351,485.150057 142.783127,482.411118 145.536276,479.652043 C145.990724,479.206136 146.125686,478.527398 145.876393,477.941558 C145.627099,477.355718 145.044434,476.982353 144.408021,477.000643 L144.408021,477.000643 Z"/>
                </g>
            </g>
        </svg>
       `
});

/**
 * polyfill
 */
Promise.prototype.finally = Promise.prototype.finally || {
    finally (fn) {
        const onFinally = value => Promise.resolve(fn()).then(() => value);
        return this.then(
            result => onFinally(result),
            reason => onFinally(Promise.reject(reason))
        );
    }
}.finally;

/**
 * 打开订阅面板
 *
 * @param subSuccessCallback
 * @param entry，订阅入口来源
 */
let subscription = null;
let bodyOverflow = 'auto';
window.openSubscription = (entry, page = 'plans', isAnnual = true, selectPlanIndex = 1) => {
    //初始化state
    FJGlobalariable.modSubscription.state.page = page;
    FJGlobalariable.modSubscription.state.hideBackBtn = page !== 'plans';
    FJGlobalariable.modSubscription.state.isAnnual = isAnnual;
    FJGlobalariable.modSubscription.entry = entry;
    FJGlobalariable.modSubscription.state.selectPlan = window.FJGlobalariable.modSubscription.planData[selectPlanIndex];

    subscription = subscription || new Vue({
        el: '#subscribe',
        data: function() {
            return {
                state: window.FJGlobalariable.modSubscription.state,
                planData: window.FJGlobalariable.modSubscription.planData,
                localLanguage: window.localLanguage,
            };
        },
        template: `
            <div id = 'subscribe' :class="'fj-sub-'+window.FJGlobalariable.productName" >
                <div ref="page" v-if="state.page !== ''">
                    <fj-sub-plans v-if="state.page==='plans'" :planData="planData"/>
                    <fj-sub-pay   v-if="state.page==='pay'" />
                    <fj-sub-successful v-if="state.page==='successful'"/>
                </div>
            </div>
            `,
        mounted: function () {
            bodyOverflow = document.body.style.overflow;
            this.updateView(true);
            this.collectViewList();
        },
        watch: {
            'state.page': function (val) {
                this.updateView(val);
                if (val === '') {
                    jQuery('.addthis-smartlayers-desktop').show();
                    window.callbackWhenCloseSubscription && callbackWhenCloseSubscription();
                }

                try {
                    let isAnnual = window.FJGlobalariable.modSubscription.state.isAnnual;
                    let period = isAnnual ? "annual" : "monthly";
                    if(val == 'plans')
                    {
                        this.collectViewList();
                    }
                    else if(val == 'pay')
                    {
                        let package = window.FJGlobalariable.modSubscription.state.selectPlan.package;
                        let price = isAnnual ? (12*window.FJGlobalariable.modSubscription.state.selectPlan.price.annual) : window.FJGlobalariable.modSubscription.state.selectPlan.price.monthly;
                        gtag('event', 'add_to_cart', {
                            "items": [
                                {
                                    "id": package,
                                    "name": package,
                                    "list_name": package,
                                    "brand": "FlexClip",
                                    "category": period,
                                    "variant": period,
                                    "list_position": 1,
                                    "quantity": 1,
                                    "price": price
                                }
                            ],
                            "coupon": window.FJGlobalariable.modSubscription.state.coupon
                        });
                    }
                }catch (e) {}
            }
        },
        methods: {
            updateView: function (val) {
                window.scrollTo(0, 0);
                if (this.$refs.page) {
                    this.$refs.page.scrollTop = 0;
                }
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = setTimeout(() => {
                    document.body.style.overflow = val ? 'hidden' : bodyOverflow;
                });
            },
            collectViewList: function () {
                try {
                    let isAnnual = window.FJGlobalariable.modSubscription.state.isAnnual;
                    let period = isAnnual ? "Annual" : "Monthly";
                    gtag('event', 'view_item_list', {
                        "items": [
                            {
                                "id": "basic",
                                "name": "basic",
                                "list_name": "basic",
                                "brand": "FlexClip",
                                "category": period,
                                "variant": period,
                                "list_position": 1,
                                "quantity": 1,
                                "price": (isAnnual ? 4.99 : 8.99)
                            },
                            {
                                "id": "plus",
                                "name": "plus",
                                "list_name": "plus",
                                "brand": "FlexClip",
                                "category": period,
                                "variant": period,
                                "list_position": 1,
                                "quantity": 1,
                                "price": (isAnnual ? 7.99 : 15.99)
                            },
                            {
                                "id": "business",
                                "name": "business",
                                "list_name": "business",
                                "brand": "FlexClip",
                                "category": period,
                                "variant": period,
                                "list_position": 1,
                                "quantity": 1,
                                "price": (isAnnual ? 19.99 : 29.99)
                            }
                        ]
                    });
                }catch (e) {}
            }
        }
    });

    window.FJGlobalariable.modSubscription.network.getSubscription().then((response) => {
        window.FJGlobalariable.modSubscription.updateSubscriptionInfo(response.data.subscription);
    }).catch((error) => {
    }).finally(() => {
    });


    window.ealog && ealog.addEvent('choose plan page visit', {
        'open page': document.location.pathname,
    });

    //隐藏分享挂件
    jQuery('.addthis-smartlayers-desktop').hide();

    //弹出套餐选择面板之后的回调
    window.callbackWhenOpenSubscription && callbackWhenOpenSubscription();
};

/**
 * 打开修改信用卡面板
 *
 * @param title
 * @param shouldHideLoading
 * @param callback
 */
window.openChangeCardModal = (title, shouldHideLoading, callback = ()=>{}) => {
    new Vue({
        el: '#cardChangeModal',
        template: `
            <div id="cardChangeModal" :class="'fj-sub-'+window.FJGlobalariable.productName">
                <fj-sub-modal-change-card :shouldHideLoading="shouldHideLoading" :title="title" :callback="callback"/>
            </div>
            `,
        data: function () {
            return {
                title:  title,
                shouldHideLoading:  shouldHideLoading,
                callback:  callback,
                localLanguage: window.localLanguage,
            }
        }
    });
};


//挂载笑脸loading
new Vue({
   el: '#sub-smile-loading',
   template: `
   <div>
        <fj-sub-modal-loading/>
   </div>
   `
});


/**
 * 头像下拉菜单升级订阅按钮
 */
new Vue({
    el: '#profile-upgrade-btn',
    template: `
    <div>
        <div id="profile-upgrade-btn" @click="openSubscription" v-if="showBtn">       
            <span>{{text_('SUB.UPGRADE')}}</span>
            <svg width="54px" height="28px" viewBox="0 0 54 28" version="1.1">
                <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g  transform="translate(-818.000000, -343.000000)" fill="#FFFFFF">
                        <g  transform="translate(818.000000, 343.000000)">
                            <path d="M54,14.2938088 L54,25.9982567 C54,27.103789 53.1095591,28 52.0001888,28 L0.0673162857,28 C1.15537943,24.3095912 4.56914894,21.6161017 8.61205468,21.6161017 C11.1433256,21.6161017 13.4277569,22.6717682 15.0496799,24.3674326 C16.7096378,20.9469954 20.2154598,18.5888227 24.2724017,18.5888227 C25.6502018,18.5888227 26.9639632,18.8612778 28.1636196,19.3545691 C28.9126771,15.7268798 32.1250858,13 35.9739993,13 C39.8050597,13 43.0050488,15.7016524 43.773512,19.3033382 C45.1322945,18.2709584 46.8271826,17.6573523 48.6652843,17.6573523 C49.6305206,17.6573523 50.5557812,17.8265694 51.4138984,18.1362833 C51.5344189,16.4470958 52.5555623,15.0069844 54,14.2938088 Z"  opacity="0.2"></path>
                            <g  transform="translate(25.000000, 0.000000)" fill-rule="nonzero">
                                <path d="M11.5521488,18.4623921 C11.3933999,18.4623921 11.2505259,18.335393 11.2505259,18.1607692 C11.2505259,17.8750212 11.2822757,17.3828996 11.377525,16.8272784 L10.520281,15.9541595 C9.26616463,17.4305243 9.12329062,19.5418847 9.10741572,20.3038794 C9.10741572,20.4626283 9.23441485,20.6055023 9.40903864,20.6055023 C10.1710334,20.5896274 12.2823938,20.4467534 13.7587586,19.1926371 L12.8856396,18.335393 C12.3300185,18.4306424 11.8378969,18.4465172 11.5521488,18.4623921 Z"  transform="translate(11.433087, 18.279831) rotate(-45.000000) translate(-11.433087, -18.279831) "></path>
                                <path d="M15.4949584,12.9580824 L15.4632087,12.8787079 C19.0191841,9.11635893 18.9556845,5.22701079 18.7969356,3.90939489 C18.7651859,3.62364687 18.5429374,3.4013984 18.2571894,3.36964862 C16.9395735,3.21089972 13.0502253,3.14740016 9.28787632,6.70337559 L9.22437676,6.6875007 C7.98613531,6.11600465 6.54152029,6.38587779 5.57315198,7.33837121 L4.19203652,8.71948667 C3.87453871,9.03698448 3.96978805,9.56085586 4.36666031,9.73547965 L6.60501985,10.7673475 L5.84302511,11.9738392 C5.66840132,12.2595872 5.7001511,12.6405846 5.95414935,12.8945828 L9.28787632,16.2283098 C9.52599968,16.4664332 9.90699704,16.5140578 10.20862,16.339434 L11.4151116,15.5774393 L12.4469795,17.8157988 C12.6374782,18.2126711 13.1613496,18.3079204 13.4629725,17.9904226 L14.8440879,16.6093072 C15.8124563,15.6409389 16.0664545,14.1804489 15.4949584,12.9580824 Z M12.3358553,9.84660388 C11.6691099,9.17985849 11.6691099,8.11624084 12.3358553,7.44949544 C13.0026007,6.78275005 14.0662183,6.78275005 14.7329637,7.44949544 C15.3997091,8.11624084 15.3838342,9.17985849 14.7329637,9.84660388 C14.0820932,10.4974744 13.0026007,10.4974744 12.3358553,9.84660388 Z"  transform="translate(11.427475, 10.747047) rotate(-45.000000) translate(-11.427475, -10.747047) "></path>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
        <div id="current-plan" v-if="showBtn !== true" @click="gotoBilling">{{current_plan}}</div>
    </div>    
    `,
    data: function () {
        return {
            currentPlan: window.fj.currentPlan,
            localLanguage: window.localLanguage,
        }
    }
    ,
    methods: {
        openSubscription: function () {
            window.openSubscription('profile');
        },
        gotoBilling: function () {
            window.open('/profile.html?page=billing');
        }
    },
    computed: {
        showBtn: function () {
            let package = this.currentPlan.package;
            return package === "free";
        },
        current_plan: function () {
            return [this.currentPlan.package.charAt(0).toUpperCase() + this.currentPlan.package.slice(1), 'Plan'].join(' ');
        }
    }
});

/**
 * 页面打开时，将uri中的coupon保存到cookie中
 */

!function (search) {
    let result = /(\?|&)(coupon=.*?)(&|$)/.exec(search);
    if (result) {
        document.cookie = result[2] + '; expires=' + (new Date((new Date).getTime() + 24 * 60 * 60 * 1000)).toUTCString();
    }
}(location.search);

window.changeSubscriptionLocalLanguage = async (tag) => {
    try {
        let form = new FormData();
        form.append('tag', tag);
        let result = await fetch(`/subscription/getLocalLanguage`, {
            body : form,
            method: 'POST',
        }).then(response => response.json());
        window.localLanguage.SUB = result.data;
    } catch (e) {
        console.error(e);
    }
};

