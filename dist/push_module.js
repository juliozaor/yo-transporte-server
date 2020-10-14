"use strict";
var vapid = require('./vapid.json');
var URLSafeBase64 = require('urlsafe-base64');
module.exports.getKey = function () {
    return URLSafeBase64.decode(vapid.publicKey);
};
