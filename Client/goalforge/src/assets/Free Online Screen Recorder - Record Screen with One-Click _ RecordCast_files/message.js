Vue.component('fj-msg-message-icon', {
    template: `
    <div class="fj-msg-icon fj-msg-message-icon">
        <svg width="11px" height="10px" viewBox="0 0 11 10" version="1.1">
            <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                <g transform="translate(-519.000000, -26.000000)" fill="#FFFFFF">
                    <g transform="translate(515.000000, 22.000000)">
                        <path d="M7.7922087,10.5427303 C7.7922087,10.542501 11.3626783,6.12612096 14.7400201,4 L15,4.74133592 C13.7721927,5.55854596 10.0625604,10.0356776 8.60885774,14 C8.60885774,14 4.7375519,9.98455657 4,9.06969651 L5.17624859,8.115863 C6.24063435,9.07748693 7.79198674,10.5427303 7.7922087,10.5427303 Z" />
                    </g>
                </g>
            </g>
        </svg>
    </div>
    `
});

Vue.component('fj-msg-warning-icon', {
    template: `
    <svg class="fj-msg-icon fj-msg-warning-icon" width="19px" height="18px" viewBox="0 0 19 18" version="1.1">
        <g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
            <g transform="translate(-367.000000, -22.000000)">
                <g transform="translate(367.000000, 22.000000)">
                    <path d="M9.02207137,18 C14.0048235,18 18.0441427,13.9705627 18.0441427,9 C18.0441427,4.02943725 14.0048235,0 9.02207137,0 C4.03931925,0 0,4.02943725 0,9 C0,13.9705627 4.03931925,18 9.02207137,18 Z" fill="#FFC16A" fill-rule="nonzero"></path>
                    <polygon fill="#FFFFFF" points="8 12 10 12 10 14 8 14"></polygon>
                    <polygon fill="#FFFFFF" points="8 3 10 3 10 11 8 11"></polygon>
                </g>
            </g>
        </g>
    </svg>
    `
});

Vue.component('fj-msg-error-icon', {
    template: `
    <div class="fj-msg-icon fj-msg-error-icon" >
        <img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAABaklEQVQ4T62Uvy9DURTHv+d4aVRisZraGiRNOwlThbAS6cAkEtG/wNAYGBjE4B9oRSImhkZYNUQnYqo0DOhk7UC08vLcI/fpa9+jfgz3Ti/n3PO533PeOYfQ4TSiyQmQzIpgFEB/88oTES4gdBh+LBe/hpHf8BaLDyjFeSGMdXrAs5HgnFlluh8q9y2b99GIJFMKcgRC32+Qlk9QY9BMuFouaZurSCt5V3z5b4hHE9S6WI1oZS6oHkmc/ZXOTyp1mj3Vm3HShVWQU/9FHh4CJ+NwdvcBpT5dzLAW56HKFair6wCXQZP0GkvkIMj4PdbSAkIry3AKx7Cza64rtLUOKz0Ne3Mbzs5eUCAhT/Vo4laAweAT3Ap0Cieuy0pPtcGeymYQAXca9CxA77casIZtuAB9NNDOrrZT9QUQ8GIUZCY1E8VmQs7c7zfWkEZHRMOMDK3XEkbWiL8h3fkjmSNByr/YhFBioYNOi+0DC3jWjOf9lK4AAAAASUVORK5CYII="/>
    </div>
    `
});

Vue.component('fj-msg-container', {
    template: `
    <div id="fj-msg-container">
        <fj-msg-item v-for="(item, key) in messageList" 
                     :content="item.content"
                     :type="item.type"
                     :duration="item.duration"
                     :itemKey="key"
                     :key="key"
                     :hiddenCallback="handleHidden"
        />
    </div>
    `,
    data: function () {
        return {
            currentKey: 100000,
            messageList: {},
        }
    }
    ,
    mounted: function () {
        let that = this;
        window.fjmessage = {
            addMessage: (content, type='message', duration = 6) => {
                that.addMessage(content, type, duration);
            },
            flush: () => {
                that.flush();
            }
        }
    },

    methods: {
        addMessage: function (content, type='message', duration = 6) {
            Vue.set(this.messageList, this.createKey(), {content: content, type: type, duration: duration});
        },
        flush: function () {
            this.messageList = {};
        },
        createKey: function () {
            return this.currentKey--;
        },
        handleHidden: function (key) {
            delete this.messageList[key];
            this.messageList = Object.assign({}, this.messageList);
        }
    }
});

Vue.component('fj-msg-item', {
    template: `
    <div class="fj-msg-item" :class="ObjectClass" @click="handleClick">
        <fj-msg-message-icon v-if="type === 'message'" /><fj-msg-warning-icon v-if="type === 'warning'" /><fj-msg-error-icon v-if="type === 'error'" /><span class="fj-msg-content">{{content}}</span>
    </div>
    `,
    props: {
        content: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            default: 'message',
        },
        itemKey: {
            type: Number,
            required: true,
        },
        hiddenCallback: {
            type: Function,
            required: true,
        },
        duration: {
            type: Number,
            default: 3,
        }
    },
    mounted: function () {
        let key = this.itemKey;
        setTimeout(() => {
            this.hidden(key);
        }, this.duration * 1000);
    },
    computed: {
        ObjectClass: function () {
            let classMap = {
                'message': 'fj-msg-type-message',
                'warning': 'fj-msg-type-warning',
                'error': 'fj-msg-type-error',
            };
            return classMap[this.type];
        }
    },
    methods: {
        hidden: function (key) {
            this.hiddenCallback(key);
        },

        handleClick: function () {
            this.hidden(this.itemKey);
        }
    }
});

new Vue({
    el: '#fj-msg-container',
    template: `
    <fj-msg-container/>
    `
});
Vue.component('fj-popup-container', {
    template: `
    <div class="fj-popup-container" v-show="show">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="fl-modal-header">{{title}}</div>
                <div class="fl-modal-content">{{description}}</div>
                <div class="fl-modal-footer fl-footer-two">
       
                    <!--fl-btn-group-type1-->
                    <div class="fl-btn fl-btn__cancel" @click="btnLeftClick" v-show="btnGroupType == 1">
                        <span>{{btnTextLeft}}</span> 
                    </div>
                    <div class="fl-btn fl-btn__green" @click="btnRightClick" v-show="btnGroupType == 1">
                        <span>{{btnTextRight}}</span>
                    </div>
                    
                </div>
            </div>
        </div>
    </div>
    `,
    data: function () {
        return {
            title:"",
            description:"",
            btnTextLeft:"",
            btnTextRight:"",
            btnCallbackLeft:null,
            btnCallbackRight:null,
            show:false,
            btnGroupType:1,
        }
    }
    ,
    mounted: function () {
        var _this = this;
        window.fjpopup = {
            openType1:function (title,description,btnTextRight,btnCallbackRight, closeText = 'Close') {
                _this.btnGroupType = 1;
                _this.title = title;
                _this.description = description;
                _this.btnTextLeft = closeText;
                _this.btnTextRight = btnTextRight;
                _this.btnCallbackLeft = () =>{
                  _this.close();
                };
                _this.btnCallbackRight = btnCallbackRight;
                _this.open();
            },
            test:function () {
                _this.test();
            }
        };
    },

    methods: {
        initData:function () {
            this.title = "";
            this.description = "";
            this.btnTextLeft = "";
            this.btnTextRight = "";
        },
        open:function () {
            this.show = true;
        },
        close:function () {
            this.show = false;
            this.initData();
        },
        test(){
            window.fjpopup.openType1("Login Expired","Your account info is invalid now, please refresh the page.","Refresh",function () {
                alert("刷新页面");
            });
        },
        btnLeftClick:function () {
            if(this.btnCallbackLeft){
                this.btnCallbackLeft();
            }
        },
        btnRightClick:function () {
            if(this.btnCallbackRight){
                this.btnCallbackRight();
            }
        }
    }
});


new Vue({
    el: '#fj-popup-container',
    template: `
    <fj-popup-container/>
    `
});
