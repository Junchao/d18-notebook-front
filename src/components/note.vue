<template>
    <div class="noteComp">
        <div class="note">
            <div>
                <span class="title">{{ note.title }}</span>
                <span v-if="note.private" class="private">private</span>
            </div>
            <div class="meta">
                <span>{{ note.author }}</span>
                <span>•</span>
                <span>创建于&nbsp;{{ note.created_at }}</span>
                <span>•</span>
                <span>更新于&nbsp;{{ note.update_at }}</span>
                <span>•</span>
                <span>字数：{{ note.words }}</span>
            </div>
            <div class="tags">
                <router-link v-bind:to="{ name: 'notes', query: { tag: tag.id} }" v-for="tag in note.tags">
                    #{{ tag.name }}
                </router-link>
            </div>
            <div class="modify">
                <button v-bind:class="{ modifyEnable: isAuth, modifyDisable: !isAuth }" @click="updateNote">
                    更新笔记
                </button>
                <button v-bind:class="{ modifyEnable: isAuth, modifyDisable: !isAuth }" @click="deleteNote">
                    删除笔记
                </button>
            </div>
            <hr class="line">
            <div class="content" v-html="note.content" v-highlight></div>
        </div>
    </div>
</template>

<script>
    import hljs from 'highlight.js';
    import 'highlight.js/styles/a11y-light.css'
    import config from '../js/config'
    import {bus} from "../js/eventbus";
    import {sendReq, checkAuth, handleServerError} from "../js/utils";

    export default {
        data: function () {
            return {
                note: {},
                isAuth: true
            }
        },
        created: function () {
            checkAuth(this);
            this.fetchNote()
        },
        methods: {
            fetchNote: function () {
                let self = this;
                let noteID = Number(this.$route.params['noteID']);
                let payload = {
                    note_id: noteID
                };
                sendReq('/note', payload).then(function (response) {
                    if (response.data['status'] === 0) {
                        let data = response.data['data'];
                        let note = data['note'];
                        self.note = {
                            id: note['id'],
                            title: note['title'],
                            author: note['author'],
                            content: note['content'],
                            plain_text: note['plain_text'],
                            private: note['private'],
                            words: note['words'],
                            created_at: note['created_at'],
                            update_at: note['update_at'],
                            tags: note['tags']
                        };
                        if (!self.isAuth && note['private']) {
                            bus.publish(config.noticeEvent, {
                                type: config.noticeLevel.warn,
                                msg: '私有笔记！'
                            })
                        }
                    } else {
                        bus.publish(config.noticeEvent, {
                            type: config.noticeLevel.warn,
                            msg: '获取笔记失败！'
                        })
                    }
                }).catch(function (error) {
                    handleServerError()
                })
            },
            updateNote: function () {
                if (!this.isAuth) {
                    bus.publish(config.noticeEvent, {
                        type: config.noticeLevel.warn,
                        msg: '没有权限！'
                    });
                    return
                }
                let key = 'note:' + this.note['id'];
                let val = JSON.stringify(this.note);
                sessionStorage.setItem(key, val);
                this.$router.push({name: 'writing', query: {noteID: this.note['id']}})
            },
            deleteNote: function () {
                if (!this.isAuth) {
                    bus.publish(config.noticeEvent, {
                        type: config.noticeLevel.warn,
                        msg: '没有权限！'
                    });
                    return
                }

                let self = this;
                let noteID = Number(this.$route.params['noteID']);
                let payload = {
                    note_id: noteID
                };
                sendReq('/note/delete', payload).then(function (response) {
                    if (response.data['status'] === 0) {
                        bus.publish(config.noticeEvent, {
                            type: config.noticeLevel.info,
                            msg: '删除成功！'
                        });
                        self.$router.push({name: 'notes'})
                    } else {
                        bus.publish(config.noticeEvent, {
                            type: config.noticeLevel.warn,
                            msg: '删除失败！'
                        })
                    }
                }).catch(function (error) {
                    handleServerError()
                })
            }
        },
        directives: {
            highlight: {
                componentUpdated: function (el) {
                    let codeBlocks = el.querySelectorAll('pre code');
                    codeBlocks.forEach((codeBlock) => {
                        hljs.highlightBlock(codeBlock)
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .noteComp {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .note {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 50%;
    }

    .title {
        font-size: 28px;
        font-family: sans-serif;
        font-weight: bold;
        color: black;
    }

    .private {
        margin-left: 2px;
        border-style: solid;
        border-color: brown;
        border-width: 1px;
        border-radius: 2px;
        color: brown;
        font-size: 10px;
        padding: 0 2px;
        text-decoration: none;
    }

    .meta {
        margin-top: 30px;
    }

    .meta span {
        margin: 0 1px;
        font-size: 16px;
        font-family: sans-serif;
        color: grey;
    }

    .tags {
        margin-top: 20px;
    }

    .tags a {
        font-family: sans-serif;
        margin: 0 4px;
        color: grey;
        font-size: 16px;
    }

    .tags a:hover {
        color: black;
    }

    .modify {
        margin-top: 20px;
    }

    .modifyEnable {
        color: grey;
        font-family: sans-serif;
        font-weight: bold;
        font-size: 17px;
        margin: 0 1px;
        border-style: none;
        text-decoration-line: underline;
        -webkit-text-decoration-line: underline;
        background-color: white;
    }

    .modifyEnable:hover {
        cursor: pointer;
        color: black;
    }

    .modifyEnable:focus {
        outline: none;
    }

    .modifyDisable {
        border-style: none;
        font-family: sans-serif;
        font-weight: bold;
        font-size: 17px;
        color: grey;
        margin: 0 3px;
        text-decoration-line: line-through;
        -webkit-text-decoration-line: line-through;
        background-color: white;
    }

    .modifyDisable {
        outline: none;
    }

    .modify a:hover {
        color: black;
    }

    .line {
        display: inline-block;
        margin-top: 20px;
        opacity: 0.2;
        width: 50%;
    }

    .content {
        font-family: sans-serif;
        margin-top: 80px;
        width: 100%;
        color: black;
        font-size: 18px;
    }
</style>