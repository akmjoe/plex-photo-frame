/**
 * Non angular javascript lib
 */

/**
 * Shuffles the provided array
  */
Array.prototype.shuffle = function(){
    var counter = this.length, temp, index;
    while (counter > 0) {
        index = (Math.random() * counter--) | 0;
        temp = this[counter];
        this[counter] = this[index];
        this[index] = temp;
    }
};


/**
 * Creates shallow copy of an array
 * @returns {Array} copied array
 */
Array.prototype.copy = function() {
    var copy = [];
    this.forEach(function(element) {
        copy.push(element);
    });
    return copy;
};
