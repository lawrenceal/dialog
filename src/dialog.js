(function (window) {

    function Dialog(type, option){
        return new Dialog.prototype.init(type, option);
    }

    Dialog.prototype = {
        constructor: Dialog,
        init: function(type, option){
            alert(type);
        }
    };

    Dialog.prototype.init.prototype = Dialog.prototype;
    window.Dialog = Dialog;



})(window);