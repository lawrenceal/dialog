(function (window) {
    const CONFIRM = 'confirm', CANCEL  = 'cancel';

    let defaultOpt = {
        width: 360,
        height: 200,
        zIndex: 1000,
        title: 'Prompt information',
        close: null,
        showClose: true,
        content: null,
        buttons: [
            {
                name: CONFIRM,
                callback: null
            },
            {
                name: CANCEL,
                callback: null
            }
        ],
        confirm: null,
        cancel: null,
        instance: null
    };

    const isType = (target, type) => Object.prototype.toString.call(target).toLowerCase() === `[object ${type}]`;

    const isPlainObject = (obj) => {
        if(!obj){
            return false;
        }

        if(!isType(obj, 'object')){
            return false;
        }

        let proto = Object.getPrototypeOf(obj);

        if(!proto){
            return true;
        }

        let constructor = !obj.hasOwnProperty('constructor') && obj.constructor;

        return typeof constructor === 'function' && constructor === Object;
    };

    const deepExtend = (target, ...args) => {
        if(typeof target !== 'object' && typeof target !== 'function'){
            target = {};
        }

        for(let item of args){
            let option = item;

            if(option != null){

                for(let key of Object.keys(option)){
                    let copy = option[key],
                        src = target[key],
                        copyIsArray = false;

                    if(isPlainObject(copy) || (copyIsArray = Array.isArray(copy))){
                        let clone = null;

                        if(copyIsArray){
                            clone = Array.isArray(src) ? src : [];
                        }else {
                            clone = isPlainObject(src) ? src : {};
                        }

                        target[key] = extend(clone, copy);
                    }else if(copy !== undefined){
                        target[key] = copy;
                    }
                }
            }
        }

        return target;
    };

    const extend = (sub, sup) => {
        for(let key in sup){
            sub[key] = sup[key];
        }
        return sub;
    };

    const getBody = () => document.body || document.getElementsByName('body')[0];

    class Dialog{
        constructor(options){
            this.init(options);
        }

        init (options){
            this.options = extend(defaultOpt, options);

            if(this.options.instance){
                this.close();
            }

            create.call(this, this.options);
        }

        close(){
            let nodes = this.options.instance, buttons = nodes.querySelectorAll('button');
            for(let button of buttons){
                button.onclick = null;
            }
            getBody().removeChild(nodes);
            this.options.instance = null;
        }
    }

    function create(options){
        let {nodes, dialogEle, dialogHeaderEle, dialogTitleEle, dialogCancelEle,  dialogContentEle, dialogFooterEle} = getNode();

        dialogEle.style.width = `${options.width}px`;
        dialogEle.style.minHeight = `${options.height}px`;
        dialogEle.style.zIndex = options.zIndex;

        dialogTitleEle.innerHTML = options.title;

        if(!options.showClose){
            dialogHeaderEle.removeChild(dialogCancelEle);
        }else{
            dialogCancelEle.addEventListener('click', (event) => {
                event.preventDefault();
                event.stopPropagation();
                this.close();
                if(isType(options.cancel, 'function')){
                    options.cancel();
                }
            }, false);
        }

        dialogContentEle.innerHTML = options.content || '';

        for(let button of options.buttons){
            let buttonEle = document.createElement('button');
            buttonEle.innerHTML = button.name;

            buttonEle.onclick = (event) => {
                event.preventDefault();
                event.stopPropagation();

                if(isType(button.callback, 'function')){

                    //TODO param
                    button.callback(this);
                }else{
                    this.close();
                    if(button.name === CONFIRM && isType(options.confirm, 'function')){

                        //TODO param
                        options.confirm();
                    }else if(button.name === CANCEL && isType(options.cancel, 'function')){

                        //TODO param
                        options.cancel();
                    }
                }
            };

            dialogFooterEle.appendChild(buttonEle);
        }

        getBody().appendChild(nodes);
        this.options.instance = nodes;
    }

    function getNode(){
        let div = document.createElement('div'), nodes, dialogEle, dialogChilds, dialogHeaderEle;

        div.innerHTML = `<div class="lrc_dialog_mask" id="lrc_dialog"><div class="lrc_dialog"><div class="lrc_dialog_header"><div class="lrc_dialog_tlt"></div><div class="lrc_dialog_close">close</div></div><div class="lrc_dialog_content"></div><div class="lrc_dialog_footer"></div></div></div>`;

        nodes = div.firstChild;
        dialogEle = nodes.firstChild;
        dialogChilds = dialogEle.childNodes;
        dialogHeaderEle = dialogChilds[0];

        return {
            nodes: nodes,
            dialogEle: dialogEle,
            dialogHeaderEle: dialogHeaderEle,
            dialogTitleEle: dialogHeaderEle.firstChild,
            dialogCancelEle: dialogHeaderEle.lastChild,
            dialogContentEle: dialogChilds[1],
            dialogFooterEle: dialogChilds[2]
        }
    }

    //export Dialog;
    window.Dialog = Dialog;

})(window);