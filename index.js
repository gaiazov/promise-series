'use strict';

const async = require('async');
const _ = require('lodash');

module.exports = function(promiseFunctions) {
    if (!Array.isArray(promiseFunctions)) {
        throw new TypeError('You must pass an array');
    }

    return new Promise(function(resolve, reject) {
        function runPromise(i, callback) {
            let promiseFunction = promiseFunctions[i];
            let promise = promiseFunction();

            if (_.isFunction(promise.then)) {
                promise.then(result => callback(null, result), error => callback(error));
            } else {
                callback(null, promise);
            }
        }

        async.timesSeries(
            promiseFunctions.length,
            runPromise,
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(results);
                }
            });
    });
};