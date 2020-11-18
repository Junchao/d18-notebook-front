import axios from 'axios'
import config from './config'
import {bus} from "./eventbus";

let sendReq = function (path, data) {
    let basePath = config.basePath;
    return axios.post(basePath + path, data, {
        headers: {'Content-Type': 'application/json'}
    })
};

let checkAuth = function (self) {
    let payload = {};
    sendReq('/is_auth', payload).then(function (response) {
        if (response.data['status'] === 0) {
            let data = response.data['data'];
            self.isAuth = data['is_auth'];
        } else {
            self.isAuth = false
        }
    }).catch(function (error) {
        self.isAuth = false
    });
};


let handleServerError = function () {
    bus.publish(config.noticeEvent, {
        type: config.noticeLevel.error,
        msg: config.serverError
    })
};

export {sendReq, checkAuth, handleServerError}