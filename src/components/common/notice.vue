<template>
    <div id="notice" v-bind:class="noticeLevel()" v-if="showNotice" @click="clickNotice">
        {{ noticeObj.msg }}
    </div>
</template>

<script>
    import config from '../../js/config'
    import {bus} from "../../js/eventbus";

    export default {
        data: function () {
            return {
                showNotice: false,
                noticeObj: {
                    msg: "MESSAGE",
                    type: "warn"
                }
            }
        },
        created: function () {
            let self = this;
            bus.subscribe(config.noticeEvent, function (noticeObj) {
                self.showNotice = true;
                self.noticeObj = noticeObj;
                setTimeout(function () {
                    self.showNotice = false;
                }, config.closeNoticeTimeout)
            })
        },
        beforeDestroy: function () {
            // 其实不用取消订阅也行，因为notice组件只初始化一次
            bus.unsubscribe(config.noticeEvent)
        },
        methods: {
            clickNotice: function () {
                this.showNotice = false;
            },
            noticeLevel: function () {
                let type = this.noticeObj['type'];
                if (type === config.noticeLevel.warn) {
                    return 'noticeWarn'
                } else if (type === config.noticeLevel.info) {
                    return 'noticeInfo'
                } else if (type === config.noticeLevel.error) {
                    return 'noticeError'
                }
            }
        }
    }
</script>

<style scoped>
    #notice {
        text-align: center;
        padding: 5px;
        color: white;
        font-size: 16px;
        font-family: sans-serif;
        font-weight: bold;
        position: fixed;
        width: 100%;
        box-shadow: 0 0 5pt 1pt grey;
        z-index: 999999;
    }

    .noticeWarn {
        background-color: orangered;
    }

    .noticeInfo {
        background-color: forestgreen;
    }

    .noticeError {
        background-color: red;
    }
</style>