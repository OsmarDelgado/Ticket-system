'use strict'

const crypto = require( 'crypto' );

const helpers = {};

helpers.matchPasswords = async (password, savedPassword) => {
    try{
        const hash = await crypto.createHash('md5').update(password).digest('hex');
        if(hash === savedPassword) {
            return true;
        } else {
            return false;
        }
    } catch (e) {
        console.log(e);
    }
};

module.exports = helpers;