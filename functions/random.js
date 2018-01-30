"use strict";

function random(choices, iterations) {
    const nbIterations = Number.isInteger(iterations) ? iterations : 1;
    const hits = [];

    if (typeof choices == 'undefined') {
        throw `random function expects at least one argument`;
    }
    
    if (!Number.isInteger(choices)) {
        throw `given value ${choices} must be an integer greater than 1`;
    } else {
        if (choices < 2) {
            throw `given integer value ${choices} must be greater than 1`;
        }
    }

    for (let choice = 0; choice < choices; choice++) {
        hits[choice] = 0;
    }

    function randomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    function indexOfMax(arrayOfInts) {
        let idxOfMax = 0;

        for (let index = 0; index < arrayOfInts.length; index++) {
            idxOfMax = arrayOfInts[index] > arrayOfInts[idxOfMax] ? index : idxOfMax;
        }

        return idxOfMax;
    }

    for (let iteration = 0; iteration < nbIterations; iteration++) {
        const choice = randomInt(choices);
        hits[choice] = hits[choice] + 1;
    }

    const choice = indexOfMax(hits);
    return {
        index: choice,
        iterations: nbIterations,
        freq: hits[choice] / nbIterations
    }
}

module.exports = {
    random
};