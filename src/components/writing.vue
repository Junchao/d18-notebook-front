<template>
    <div id="writingComp">
        <div id="menu"></div>
        <div class="title">
            <input type="text" placeholder="标题" autofocus="autofocus" v-model="title" id="title" autocomplete="off">
        </div>
        <div class="tags">
            <input type="text" placeholder="标签 (network,algorithms,redis...)" v-model="tags" id="tags"
                   autocomplete="off">
        </div>
        <div class="private">
            <input type="checkbox" id="private" v-model="private">
            <label for="private"></label><span>THIS IS A PRIVATE NOTE</span>
        </div>
        <div id="editor"></div>
        <div>
            <button v-bind:class="{ btn: isAuth, btnDisable: !isAuth }" @click="postNote">{{ btn }}</button>
        </div>
    </div>
</template>

<script>
    import E from 'wangeditor'
    import config from '../js/config'
    import {bus} from "../js/eventbus";
    import {sendReq, checkAuth, handleServerError} from "../js/utils";

    export default {
        data: function () {
            return {
                isUpdate: false,
                editor: null,
                note_id: "",
                title: '',
                tags: '',
                private: false,
                isAuth: false,
                btn: "PUBLISH",
            }
        },
        created: function () {
            checkAuth(this);
        },
        mounted: function () {
            let editor = new E('#menu', '#editor');
            editor.customConfig.menus = [
                'head',
                'bold',
                'italic',
                'underline',
                'strikeThrough',
                'foreColor',
                'link',
                'quote',
                'image',
                'table',
                'code',
                'undo',
                'redo'
            ];
            editor.create();
            this.editor = editor;
            this.populate();
        },
        methods: {
            populate: function () {
                let key = 'note:' + this.$route.query['noteID'];
                let val = sessionStorage.getItem(key);
                if (val == null) {
                    this.isUpdate = false;
                    return
                }

                let note = JSON.parse(val);
                this.note_id = note['id'];
                this.title = note['title'];
                let tags = [];
                for (let i = 0; i < note['tags'].length; i++) {
                    tags.push(note['tags'][i]['name'])
                }
                this.tags = tags.join(',');
                this.editor.txt.html(note['content']);
                this.btn = "UPDATE";
                this.isUpdate = true;
            },

            postNote: function () {
                let noticeObj = {
                    type: config.noticeLevel.warn,
                    msg: ""
                };

                let content = this.editor.txt.html();
                if (!this.isAuth) {
                    noticeObj['msg'] = '没有权限！';
                } else if (this.title === "") {
                    noticeObj['msg'] = '标题不能为空！';
                } else if (this.tags === "") {
                    noticeObj['msg'] = '标签不能为空！';
                } else if (content === "<p><br></p>") {
                    noticeObj['msg'] = '内容不能为空！';
                }

                if (noticeObj['msg'] !== "") {
                    bus.publish(config.noticeEvent, noticeObj);
                    return
                }

                let self = this;
                let url = '/note/publish';
                let payload = {
                    title: this.title,
                    content: content,
                    tags: this.tags.split(','),
                    private: this.private
                };

                if (this.isUpdate) {
                    url = '/note/update';
                    payload['note_id'] = this.note_id
                }

                sendReq(url, payload).then(function (response) {
                    if (response.data['status'] === 0) {
                        bus.publish(config.noticeEvent, {
                            type: config.noticeLevel.info,
                            msg: '发布成功！' + config.redirectTimeout / 1000 + 's后自动跳转...'
                        });
                        setTimeout(function () {
                            self.$router.push({name: 'notes'})
                        }, config.redirectTimeout);
                    } else {
                        bus.publish(config.noticeEvent, {
                            type: config.noticeLevel.warn,
                            msg: '发布失败！'
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
    #writingComp {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .title {
        margin-top: 40px;
    }

    .title input {
        text-align: center;
        font-size: 27px;
        font-family: sans-serif;
        border-style: none;
        width: 800px;
    }

    .title input:focus {
        outline: 0;
    }

    .tags {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 45px;
        width: 100%;
    }

    .tags input {
        font-size: 20px;
        font-family: sans-serif;
        border-style: none;
        border-bottom-style: solid;
        border-bottom-color: rgba(0, 0, 0, 0.2);
        border-bottom-width: 1px;
        width: 40%;
    }

    .tags input:focus {
        outline: 0;
    }

    ::placeholder {
        color: grey;
        opacity: 0.5;
        font-family: sans-serif;
    }

    .private {
        margin: 50px;
        display: inline-block;
    }

    .private label {
        width: 14px;
        height: 14px;
        border-style: solid;
        border-width: 1px;
        border-color: brown;
        display: inline-block;
        vertical-align: middle;
    }

    .private span {
        margin-left: 8px;
        font-size: 13px;
        font-family: sans-serif;
        vertical-align: middle;
    }

    #private:checked + label {
        transition: 0.3s;
        background-color: brown;
    }

    #private {
        position: absolute;
        visibility: hidden;
    }

    #editor {
        width: 70%;
        min-height: 300px;
        border-style: solid;
        border-width: 1px;
        border-color: rgba(0, 0, 0, 0.2);
        font-size: 18px;
        font-family: sans-serif;
    }

    .btn {
        transition: background-color, color 0.5s;
        font-family: sans-serif;
        font-size: 16px;
        color: brown;
        margin-top: 75px;
        border-style: solid;
        border-width: 1px;
        border-color: brown;
        border-radius: 2px;
        background-color: white;
        padding: 6px 8px;
    }

    .btnDisable {
        font-family: sans-serif;
        font-size: 16px;
        color: brown;
        opacity: 0.5;
        text-decoration-line: line-through;
        -webkit-text-decoration-line: line-through;
        margin-top: 75px;
        border-style: solid;
        border-width: 1px;
        border-color: brown;
        border-radius: 2px;
        background-color: white;
        padding: 6px 8px;
    }

    .btnDisable:focus {
        outline: 0;
    }

    .btn:hover {
        transition: background-color, color 0.5s;
        cursor: pointer;
        background-color: brown;
        color: white;
    }

    .btn:focus {
        outline: 0;
    }
</style>