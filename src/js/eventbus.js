import Vue from 'vue';

let bus = new Vue({
    methods: {
        publish: function (eventName, msg) {
            this.$emit(eventName, msg)
        },
        subscribe: function (eventName, callback) {
            this.$on(eventName, callback)
        },
        unsubscribe: function (eventName) {
            this.$off(eventName)
        }
    }
});

export {bus}