window.fj = window.fj || {}
window.fj.event = {}
/**
 * @description 事件系统
 */
window.fj.event = (function () {

  let _eventFuncData = {};
  
  function removeFromArray(array, item) {
    if (!Array.isArray(array)) {
      console.error(new TypeError('ERR_ARGUMENTS'));
      return;
    }
    let index = array.indexOf(item);
    if (index !== -1) {
      array.splice(index, 1);
    }
  }

  function deleteCache(cache) {
    for (let key in _eventFuncData) {
      if (_eventFuncData.hasOwnProperty(key)) {
        removeFromArray(_eventFuncData[key], cache);
      }
    }
  }

  return {
    /**
     * @description 监听时间
     * @param eventType
     * @param callback
     * @param once
     */
    subscribe: function (eventType, callback, once) {
      let cache = {callback, once};
      _eventFuncData[eventType] = _eventFuncData[eventType] || [];
      _eventFuncData[eventType].push(cache);
      return () => {
        deleteCache(cache);
      };
    },

    /**
     * @description 触发监听
     * @param eventType
     * @param data
     */
    dispatch: function (eventType, data) {
      if (_eventFuncData[eventType]) {
        let shouldDeleteOnceCache = [];
        _eventFuncData[eventType].forEach(cache => {
          cache.callback(data);
          if (cache.once) {
            shouldDeleteOnceCache.push(cache);
          }
        });
        shouldDeleteOnceCache.forEach((cache) => {
          deleteCache(cache);
        })
      }
    },
  }
})();
