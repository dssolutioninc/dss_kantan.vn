/**
 * Created by DongDL1 on 7/9/2015.
 */
/*http://blog.tompawlak.org/how-to-generate-random-values-nodejs-javascript*/
/*
 How to Generate Random Values in JavaScript and Node.js?
 There are several different ways of generating random values in Node.js (JavaScript).
 Some methods use only base JavaScript functions (e.g. Math.random()) whereas others require additional modules.
 Generated values also differ from method to method.
 Some may return only numbers whereas others return base64 string or universally unique identifiers (UUID).

 1. Generate random number using Math.random()
 The easiest way is to generate numbers using Math.random().
 That function returns a floating-point, pseudo-random number that is from 0 (inclusive) up to 1 (exclusive) ([0, 1)).
 It is also supported by most of the currently available browsers if you need random numbers generation functionality in a browser.

 Note that Math.random() returns pseudo-random number. The pseudo-random number appears to be random but it is not.
 In order to increase "randomness" of that number, the random generator is seeded from the current time.

 If you would like to get random numbers generated in a specific range (e.g. [low, high))
 you would need to scale generated number to your desired range.

 A few examples of scaling generated number to your desired range:
 */
module.exports = {
    /*This function generates floating-point between two numbers low (inclusive) and high (exclusive) ([low, high))*/
    random: function (low, high) {
        return Math.random() * (high - low) + low;
    },

    /*This function generates random integer between two numbers low (inclusive) and high (exclusive) ([low, high))*/
    randomInt: function (low, high) {
        return Math.floor(Math.random() * (high - low) + low);
    },
    /*This function generates random integer between two numbers low (inclusive) and high (inclusive) ([low, high])*/
    randomIntInc: function (low, high) {
        return Math.floor(Math.random() * (high - low + 1) + low);
    },

    // generate random password
    randomPassword: function (length) {

        var baseString = 'qwertyuiopasdfghjklzxcvbnm1234567890QWERTYUIOPASDFGHJKLZXCVBNM';
        var baseStringLen = baseString.length;

        var randomPass = '';
        var i, index;

        for (i = 0; i < length; i++) {
            index = (Math.random() * (baseStringLen - 1)).toFixed(0);
            randomPass += baseString[index];
        }

        return randomPass;
    },


    /* EXAMPLE:
     Let's create an array and populate it with random numbers from range: [1, 10].
     var numbers = new Array(10);
     for (var i = 0; i < numbers.length; i++) {
     numbers[i] = randomIntInc(1,10)
     }
     It will give something like:
     [ 4, 6, 9, 9, 9, 8, 4, 1, 10, 1 ]
     */



    /*
     Sometimes a single number is not enough and you would need a number composed of exactly certain amount of digits.
     Note that generated values will be JavaScript strings, not numbers.
     In that case you can perform modifications of generated values with another function e.g. padding function.

     Below there is an example of a left padding function. You can find many more examples also on
     Internet e.g. pad, lpad, rpad etc. from underscore.string.
     */

    leftPad: function (str, length) {
        str = str == null ? '' : String(str);
        length = ~~length;
        pad = '';
        padLength = length - str.length;

        while (padLength--) {
            pad += '0';
        }

        return pad + str;
    }

    /* EXAMPLE
     Let's perform padding transformation with leftPad function with padding length set to 3.


     var numbers = new Array(10);
     for (var i = 0; i < numbers.length; i++) {
     numbers[i] = leftPad(randomIntInc(1,10), 3);
     }

     // output
     [ '007', '006', '009', '010', '002', '005', '003', '006', '004', '009' ]


     Alternative to padding function might be number conversion to string using different base e.g.
     base 2 for binary representation of base 16 for hexadecimal representation.

     ...
     numbers[i] = randomIntInc(1, 10).toString(2); // base 2 - binary format
     ...
     A few output examples:

     // output - base 2 - binary format
     [ '10001', '110', '11101', '11110', '10',
     '1111', '100000', '1000000', '1110', '1001' ]

     // output - base 8 - octal format
     [ '21', '6', '35', '36', '2', '17', '40', '100', '16', '11' ]

     // output - base 16 - hexadecimal format
     [ '11', '6', '1d', '1e', '2', 'f', '20', '40', 'e', '9' ]

     */
}

