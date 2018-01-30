"use strict";

const functions = require('firebase-functions');

const MM_INTEGRATION_TOKEN = functions.config().mattermost.token;
const SLASH_COMMAND = functions.config().mattermost.slash || 'rnd';
const BASE_URL = functions.config().functions.baseurl;

function isValidToken(token) {
    var tokens = MM_INTEGRATION_TOKEN ? MM_INTEGRATION_TOKEN.split(',') : [];
    return token && tokens.indexOf(token) !== -1;
}

function isValidSlashRequest(req) {
    if (req.body && isValidToken(req.body.token)) {
        return true;
    } else {
        console.warn('Invalid request or missing token');
        return false;
    }
}

function ephemeralResponse(text) {
    return {
        response_type: 'ephemeral',
        text: text
    }
}

function multiline() {
    let args = Array.from(arguments);
    let reducer = (acc, v) => acc + '\n' + v;
    return args.reduce(reducer);
}

function slashCommandName() {
    return SLASH_COMMAND;
}

module.exports = {
    ephemeralResponse,
    multiline,
    isValidSlashRequest,
    slashCommandName
};