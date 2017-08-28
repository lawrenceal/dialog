(function(){
    
    var Dialog = function(options) {
        return new Dialog.prototype.init(options);
    };

    Dialog.prototype = {
        constructor: Dialog,
        init: function(options){console.log(options)}
    };

    Dialog.prototype.init.prototype = Dialog.prototype;
    
    window.Dialog = Dialog;

})();