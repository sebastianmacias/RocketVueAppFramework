'use strict';

var _vue = require('vue');

var _vue2 = _interopRequireDefault(_vue);

var _vueResource = require('vue-resource');

var _vueResource2 = _interopRequireDefault(_vueResource);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_vue2.default.use(_vueResource2.default);
_vue2.default.http.interceptors.push(function (request, next) {

    next(function (response) {
        if (response.status !== 200) {
            _vue2.default.prototype.$snackbar('An error has occurred', 'error');
            console.error(response.statusText);
        }
    });
});