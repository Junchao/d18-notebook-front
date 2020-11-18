<template>
    <div id="authComp">
        <div class="notAuth" v-if="!isAuth">
            <p>Hi Stranger!</p>
            <input type="password" placeholder="password" v-on:keyup.enter="auth" v-model="password">
        </div>
        <div v-else class="auth">
            <p class="welcome">Welcome Back!</p>
            <button class="logout" @click="logout">LOGOUT</button>
        </div>
    </div>
</template>

<script>
    import config from '../js/config'
    import {bus} from "../js/eventbus";
    import {sendReq, checkAuth, handleServerError} from "../js/utils";

    export default {
        data: function () {
            return {
                password: "",
                isAuth: false
            }
        },
        created: function () {
            checkAuth(this)
        },
        methods: {
            auth: function () {
                let self = this;
                let payload = {
                    password: self.password
                };
                sendReq('/auth', payload).then(function (response) {
                    if (response.data['status'] === 0) {
                        bus.publish(config.noticeEvent, {
                            type: config.noticeLevel.info,
                            msg: '认证成功！'
                        });
                        self.isAuth = true
                    } else {
                        bus.publish(config.noticeEvent, {
                            type: config.noticeLevel.warn,
                            msg: '认证失败！'
                        })
                    }
                }).catch(function (error) {
                    handleServerError()
                })
            },
            logout: function () {
                if (!this.isAuth) {
                    return
                }
                let self = this;
                let payload = {};
                sendReq('/logout', payload).then(function (response) {
                    if (response.data['status'] === 0) {
                        bus.publish(config.noticeEvent, {
                            type: config.noticeLevel.info,
                            msg: '注销成功！'
                        });
                        self.isAuth = false;
                    } else {
                        bus.publish(config.noticeEvent, {
                            type: config.noticeLevel.warn,
                            msg: '注销失败！'
                        })
                    }
                }).catch(function (error) {
                    handleServerError()
                })
            }
        }
    }
</script>

<style scoped>
    #authComp {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .notAuth {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .notAuth p {
        font-family: sans-serif;
        font-size: 25px;
        font-weight: bold;
    }

    .notAuth input {
        transition: 0.3s;
        border-width: 1px;
        border-color: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        margin-top: 40px;
        height: 42px;
        width: 20%;
        font-size: 18px;
        font-family: sans-serif;
        padding-left: 15px;
    }

    .notAuth input:focus {
        box-shadow: 0 0 6px 2pt cornflowerblue;
        outline: none;
        transition: 0.3s;
    }

    ::placeholder {
        color: grey;
        font-size: 18px;
        opacity: 0.5;
    }

    .auth {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .welcome {
        font-family: sans-serif;
        font-size: 25px;
        font-weight: bold;
    }

    .logout {
        transition: background-color, color 0.3s;
        margin-top: 30px;
        font-size: 15px;
        background-color: white;
        color: brown;
        border-style: solid;
        border-width: 1px;
        border-color: brown;
        border-radius: 2px;
        padding: 5px;
    }

    .logout:hover {
        transition: background-color, color 0.3s;
        cursor: pointer;
        background-color: brown;
        color: white;
    }

    .logout:focus {
        outline: none;
    }
</style>