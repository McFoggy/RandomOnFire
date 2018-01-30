"use strict";

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const rnd = require('./random');
const utils = require('./utils');

admin.initializeApp(functions.config().firebase);

function usage(httpRes) {
    const slash = utils.slashCommandName();
    const returnObject = utils.ephemeralResponse(utils.multiline(
        'Usage:',
        `- \`/${slash}\`: prints this usage`,
        `- \`/${slash} MAX [ITERATIONS] \`: choose a number between 1 and MAX, making ITERATIONS (default 1) trials.`,
        `- \`/${slash} Item1 | Item2 | ... | ItemN\`: choose one the given item (separated by \`|\`)`,
        `- \`/${slash} ITERATIONS | Item1 | Item2 | ... | ItemN\`: choose one the given item (separated by \`|\`) by making ITERATIONS trials`
    )); 
        
    httpRes.set('Content-Type', 'application/json');
    return httpRes.status(200).send(JSON.stringify(returnObject));
}

function answer(httpRes, result, choiceTextFn) {
    const msg = `"${choiceTextFn(result.index)}" has been chosen after ${result.iterations} iterations and a frequency of ${Math.floor(result.freq * 100)}%`;
    const returnObject = utils.ephemeralResponse(msg);

    httpRes.set('Content-Type', 'application/json');
    return httpRes.status(200).send(JSON.stringify(returnObject));
}

exports.slashChoices = functions.https.onRequest((req, res) => {
    console.log('Received body: ', req.body);
    if (!utils.isValidSlashRequest(req)) {
        return res.status(401).send('Invalid request or missing token');
    }
    
    // choices 6
    // choices 6 150
    // choices choice 1 | choice 2 | choice 3
    // choices 100 | choice 1 | choice 2 | choice 3
    
    let textPieces = req.body.text ? req.body.text.split("|").map(s => s.trim()) : [];
    
    let randomResult;
    let choiceTextFunction = idx => idx+1;
    
    try {
        if (textPieces.length > 1) {
            // we consider textual choices
            let iterations = Number.parseInt(textPieces[0]);
            if (Number.isInteger(iterations)) {
                textPieces = textPieces.slice(1);
            } else {
                // no iterations number provided, only textual choices
                iterations = 1;
            }

            choiceTextFunction = idx => textPieces[idx];
            console.log(`computing random item over ${iterations} iterations using following items`, textPieces);
            randomResult = rnd.random(textPieces.length, iterations)
        } else {
            let numericPieces = textPieces[0].split(/\s+/).map(s => s.trim());
            console.log(`computing random using max: ${numericPieces[0]} over ${numericPieces[1]} iterations`);
            randomResult = rnd.random(Number.parseInt(numericPieces[0], 10), Number.parseInt(numericPieces[1], 10));
        }
        
        return answer(res, randomResult, choiceTextFunction);
    } catch (err) {
        console.log('cannot compute random', err);
        return usage(res);
    }
});
