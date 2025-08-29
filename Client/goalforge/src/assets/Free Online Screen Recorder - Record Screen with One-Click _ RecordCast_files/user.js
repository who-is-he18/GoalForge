window.fjuser = {
    eventType: {
        login: 0x0001,
        register: 0x0010,
        logout: 0x0100,
        showLoginPanel:0x1001,
        hideLoginPanel:0x1002,
        showRegisterPanel:0x1003,
        hideRegisterPanel:0x1004,
    },

    info: null,

    _listeners: [],
    _showLoginFunc: null,
    _showRegisterFunc: null,
    _logoutHooks: [],

    getUserCountryCode: function()
    {
        return new Promise(resolve => {
           if(this.localCountryCode)
               resolve(this.localCountryCode);
           else
           {
               $.ajax({
                   type:    "POST",
                   url:     "https://www.cloudflare.com/cdn-cgi/trace",
                   data:    {},
                   success: (data) => {
                       this.localCountryCode = data.split('\n')[8].match(/=(.*)/)[1];

                       resolve(this.localCountryCode);
                   },
                   error:   function(jqXHR, textStatus, errorThrown) {
                       resolve(null);

                       console.log("Error, status = " + textStatus + ", " +
                           "error thrown: " + errorThrown
                       );
                   }
               });
           }
        });
    },

    initWithMethods: function(showLoginFunc, showRegisterFunc)
    {
        this._showLoginFunc = showLoginFunc;
        this._showRegisterFunc = showRegisterFunc;
    },

    // callback(result, info)
    addListener: function(type, callback, once = false)
    {
        this._listeners.push({
            type: type,
            callback: callback,
            once: once
        });
    },
    //移除事件监听
    removeListener: function(type, callback, once = false)
    {
        let removeIndex = -1;
        let length = this._listeners.length;
        for (let i = 0; i < length; i++) {
            let {type: _type, callback: _callback, once: _once} = this._listeners[i];
            if (type === _type && callback === _callback && once === _once) {
                removeIndex = i;
                break;
            }
        }
        if (removeIndex !== -1) {
            this._listeners.splice(removeIndex, 1);
        }
    },

    dispatchCallbacks: function(type)
    {
        var args = [...arguments].slice(1);
        for(var i = 0; i < this._listeners.length; i++)
        {
            var item = this._listeners[i];

            if(item.type === type)
            {
                item.callback(...args);
                if(item.once)
                {
                    this._listeners.splice(i, 1);
                    i--;
                }
            }
        }
    },

    showLoginPanel: function()
    {
        if(this._showLoginFunc)
            this._showLoginFunc();
    },

    showRegisterPanel: function()
    {
        if(this._showRegisterFunc)
            this._showRegisterFunc();
    },

    loginPost:function (data, callback) {
        if(window.csrf_token){
            data[window.csrf_token] = 1;
        };
        $.post("/user/login", data, (json) => {
            var result = (json.code === 200);
            if(result)
            {
                window.fjuser.info = json.data;
                window.csrf_token = json.token;
            }
            window.fjuser.dispatchCallbacks(window.fjuser.eventType.login, result, json);

            if(callback)
                callback(result, json.data);
        });
    },

    registerPost: function(data, callback) {
        $.post("/user/register", data, (json) => {
            var result = (json.code === 200);
            if(result)
            {
                window.fjuser.info = json.data;
                window.csrf_token = json.token;
            }
            window.fjuser.dispatchCallbacks(window.fjuser.eventType.register, result, json);

            if(callback)
                callback(result, json);
        });
    },

    connectFacebook: function(data, callback) {
        $.post("/user/connectFacebookUser", data, (json) => {
            var result = (json.code === 200);
            if(result)
            {
                window.fjuser.info = json.data;
                window.csrf_token = json.token;
            }

            if(json.data.register)
            {
                window.fjuser.dispatchCallbacks(window.fjuser.eventType.register, result, json);
            }
            else
            {
                window.fjuser.dispatchCallbacks(window.fjuser.eventType.login, result, json);
            }

            if(callback)
                callback(result, json);
        });
    },

    connectGoogle: function(data, callback) {
        $.post("/user/connectGoogleUser",data,function (json) {
            var result = (json.code === 200);
            if(result)
            {
                window.fjuser.info = json.data;
                window.csrf_token = json.token;
            }

            if(json.data.register)
            {
                window.fjuser.dispatchCallbacks(window.fjuser.eventType.register, result, json);
            }
            else
            {
                window.fjuser.dispatchCallbacks(window.fjuser.eventType.login, result, json);
            }

            if(callback)
                callback(result, json);
        });
    },

    logoutPost: async function(callback) {
        Promise.all(this._logoutHooks.map((hook) => {
            return hook();
        })).then(() => {
            if(!window.FJTools){
                FJTools = $;
            }
            post_data = {};
            post_data[window.csrf_token] = 1;
            FJTools.post("/user/logout",post_data, (json) => {
                var result = (json.code === 200);
                if(result)
                {
                    window.csrf_token = json.token;
                    window.fjuser.info = {result: false};
                }
                window.fjuser.dispatchCallbacks(window.fjuser.eventType.logout, result);

                if(callback)
                    callback(result);
            })
        }).catch((e) => {
            console.log(e);
        });
    },

    addLogoutHook: function(hook) {
        this._logoutHooks.push(hook);
    },

    isUserLogin:function () {
        return this.info && this.info.result;
    },

    getCountryCode: function()
    {
        return new Promise(resolve => {
            if(this.localCountryCode)
                resolve(this.localCountryCode);
            else
            {
                $.ajax({
                    type:    "POST",
                    url:     "https://www.cloudflare.com/cdn-cgi/trace",
                    data:    {},
                    success: (data) => {
                        this.localCountryCode = data.split('\n')[8].match(/=(.*)/)[1];

                        resolve(this.localCountryCode);
                    },
                    error:   function(jqXHR, textStatus, errorThrown) {
                        // TODO 容错
                        resolve(null);
                        console.log("Error, status = " + textStatus + ", " +
                            "error thrown: " + errorThrown
                        );
                    }
                });
            }
        });
    },

    getBrowser: function (n) {
        var ua = navigator.userAgent.toLowerCase(),
            s,
            name = '',
            ver = 0;
        (s = ua.match(/msie ([\d.]+)/)) ? _set("IE", _toFixedVersion(s[1])) :
            (s = ua.match(/firefox\/([\d.]+)/)) ? _set("Firefox", _toFixedVersion(s[1])) :
                (s = ua.match(/chrome\/([\d.]+)/)) ? _set("Chrome", _toFixedVersion(s[1])) :
                    (s = ua.match(/opera.([\d.]+)/)) ? _set("Opera", _toFixedVersion(s[1])) :
                        (s = ua.match(/version\/([\d.]+).*safari/)) ? _set("Safari", _toFixedVersion(s[1])) : 0;

        function _toFixedVersion(ver, floatLength) {
            ver = ('' + ver).replace(/_/g, '.');
            floatLength = floatLength || 1;
            ver = String(ver).split('.');
            ver = ver[0] + '.' + (ver[1] || '0');
            ver = Number(ver).toFixed(floatLength);
            return ver;
        }

        function _set(bname, bver) {
            name = bname;
            ver = bver;
        }

        return (n == 'n' ? name : (n == 'v' ? ver : name + " " + ver));
    },

    getOS: function () {
        var sUserAgent = navigator.userAgent;
        var isWin = (navigator.platform == "Win32") || (navigator.platform == "Windows");
        var isMac = (navigator.platform == "Mac68K") || (navigator.platform == "MacPPC") || (navigator.platform == "Macintosh") || (navigator.platform == "MacIntel");
        if (isMac) return "Mac";
        var isUnix = (navigator.platform == "X11") && !isWin && !isMac;
        if (isUnix) return "Unix";
        var isLinux = (String(navigator.platform).indexOf("Linux") > -1);
        if (isLinux) return "Linux";
        if (isWin) {
            var isWin2K = sUserAgent.indexOf("Windows NT 5.0") > -1 || sUserAgent.indexOf("Windows 2000") > -1;
            if (isWin2K) return "Win2000";
            var isWinXP = sUserAgent.indexOf("Windows NT 5.1") > -1 || sUserAgent.indexOf("Windows XP") > -1;
            if (isWinXP) return "WinXP";
            var isWin2003 = sUserAgent.indexOf("Windows NT 5.2") > -1 || sUserAgent.indexOf("Windows 2003") > -1;
            if (isWin2003) return "Win2003";
            var isWinVista = sUserAgent.indexOf("Windows NT 6.0") > -1 || sUserAgent.indexOf("Windows Vista") > -1;
            if (isWinVista) return "WinVista";
            var isWin7 = sUserAgent.indexOf("Windows NT 6.1") > -1 || sUserAgent.indexOf("Windows 7") > -1;
            if (isWin7) return "Win7";
            var isWin10 = sUserAgent.indexOf("Windows NT 10") > -1 || sUserAgent.indexOf("Windows 10") > -1;
            if (isWin10) return "Win10";
        }
        return "Unknown";
    },
    getDeviceInfo: function () {
        let os = this.getOS();
        if(os != "Unknown")
        {
            os = os + " " + window.screen.width + " x " + window.screen.height;
        }

        return os;
    }
};
