var getCurrentTimeString = function() {
    'use strict';
    var d = new Date();
    return d.toLocaleDateString() + " " + d.toLocaleTimeString();
}