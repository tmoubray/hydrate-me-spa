/**
 * Throttle function calls so they are triggered once every X milliseconds.
 *
 * @author underscore.js
 * @see https://github.com/jashkenas/underscore/blob/master/underscore.js#L842
 * @param {Function} func Function to call.
 * @param {Number}   wait Minimum time to wait between function calls, in
 *                        milliseconds.
 * @param {Object}   options Options to control function execution. You can pass
 *                           `leading` and/or `trailing` properties to enable or
 *                           disable the leading/trailing edge executions of the
 *                           function. i.e. `{ leading: false }`.
 * @return {Function} A function that will execute once every X milliseconds.
 */
 function throttle( func, wait, options ) {
  var timeout, context, args, result;
  var previous = 0;
  if (!options) options = {};

  var later = function() {
    previous = options.leading === false ? 0 : Date.now();
    timeout = null;
    result = func.apply(context, args);
    if (!timeout) context = args = null;
  };

  var throttled = function() {
    var now = Date.now();
    if (!previous && options.leading === false) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0 || remaining > wait) {
      if (timeout) {
        clearTimeout(timeout);
        timeout = null;
      }
      previous = now;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    } else if (!timeout && options.trailing !== false) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };

  throttled.cancel = function() {
    clearTimeout(timeout);
    previous = 0;
    timeout = context = args = null;
  };

  return throttled;

};



module.exports = throttle;
