<template>
    <div id="notesComp">
        <div class="notes">
            <ul>
                <li v-for="note in notes">
                    <div class="note">
                        <div class="title">
                            <router-link v-bind:to="{ name: 'note', params: { noteID: note.id } }">
                                {{ note.title }}
                            </router-link>
                            <span v-if="note.private">private</span>
                        </div>
                        <div class="meta">
                            <span>{{ note.author }}</span>
                            <span>•</span>
                            <span>{{ note.created_at }}</span>
                            <span>•</span>
                            <span>{{ note.words }} words</span>
                        </div>
                        <div class="tags">
                            <router-link v-bind:to="{ name: 'notes', query: { tag: tag.id} }" v-for="tag in note.tags">
                                #{{ tag.name }}
                            </router-link>
                        </div>
                        <div class="content">
                            <span>{{ note.plain_text }}</span>
                            <router-link v-bind:to="{ name: 'note', params: { noteID: note.id} }">
                                READ MORE...
                            </router-link>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
        <div class="pagination">
            <ul>
                <li>
                    <router-link v-bind:to="page.first.path"
                                 v-bind:class="{ navPage: page.first.pageNo > 0, navPageDisabled: page.first.pageNo <= 0 }">
                        First
                    </router-link>
                </li>
                <li>
                    <router-link v-bind:to="page.prev.path"
                                 v-bind:class="{ navPage: page.prev.pageNo > 0, navPageDisabled: page.prev.pageNo <= 0 }">
                        Prev
                    </router-link>
                </li>
                <li v-for="p in page.pages">
                    <router-link v-bind:to="p.path" class="genPage" v-bind:class="{ active: p.active }">
                        {{ p.pageNo }}
                    </router-link>
                </li>
                <li>
                    <router-link v-bind:to="page.next.path"
                                 v-bind:class="{ navPage: page.next.pageNo > 0, navPageDisabled: page.next.pageNo <= 0 }">
                        Next
                    </router-link>
                </li>
                <li>
                    <router-link v-bind:to="page.last.path"
                                 v-bind:class="{ navPage: page.last.pageNo > 0, navPageDisabled: page.last.pageNo <= 0 }">
                        Last
                    </router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import config from '../js/config'
    import {bus} from "../js/eventbus";
    import {sendReq, handleServerError} from "../js/utils";

    export default {
        data: function () {
            return {
                page: {
                    pages: [],
                    prev: {pageNo: 0, path: {name: 'notes'}},
                    next: {pageNo: 0, path: {name: 'notes'}},
                    first: {pageNo: 0, path: {name: 'notes'}},
                    last: {pageNo: 0, path: {name: 'notes'}},
                },
                notes: []
            }
        },
        created: function () {
            this.fetchNotes()
        },
        watch: {
            $route: function (to, from) {
                this.fetchNotes()
            }
        },
        methods: {
            fetchNotes: function () {
                let self = this;
                let pageNo = Number(this.$route.query['pageNo'] || 1);
                let tag = Number(this.$route.query['tag'] || 0);
                let payload = {
                    page_no: pageNo,
                    tag: tag
                };

                sendReq('/notes', payload).then(function (response) {
                    if (response.data['status'] === 0) {
                        let data = response.data['data'];
                        if (data['notes'].length <= 0) {
                            bus.publish(config.noticeEvent, {
                                type: config.noticeLevel.info,
                                msg: '还没有笔记哦！'
                            })
                        }
                        self.notes = data['notes'];

                        let page = {};
                        let pages = [];
                        let rawPage = data['page'];

                        for (let i = rawPage['left']; i <= rawPage['right']; i++) {
                            pages.push({
                                pageNo: i,
                                active: i === rawPage['cur'],
                                path: {name: 'notes', query: {pageNo: i, tag: tag}}
                            })
                        }
                        page['pages'] = pages;

                        let first = rawPage['total'] > 0 ? 1 : 0;
                        page.first = {
                            pageNo: first,
                            path: {name: 'notes', query: {pageNo: first, tag: tag}}
                        };
                        let last = rawPage['total'] > 0 ? rawPage['total'] : 0;
                        page.last = {
                            pageNo: last,
                            path: {name: 'notes', query: {pageNo: last, tag: tag}}
                        };
                        let prev = rawPage['cur'] - 1 > 0 ? rawPage['cur'] - 1 : 0;
                        page.prev = {
                            pageNo: prev,
                            path: {name: 'notes', query: {pageNo: prev, tag: tag}}
                        };
                        let next = rawPage['cur'] + 1 <= rawPage['total'] ? rawPage['cur'] + 1 : 0;
                        page.next = {
                            pageNo: next,
                            path: {name: 'notes', query: {pageNo: next, tag: tag}}
                        };

                        self.page = page;
                    } else {
                        bus.publish(config.noticeEvent, {
                            type: config.noticeLevel.warn,
                            msg: '获取笔记失败！'
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
    #notesComp {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .notes {
        width: 32%;
    }

    .notes ul li {
        list-style: none;
    }

    .note {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .notes ul li:not(:last-child):after {
        content: "";
        height: 1px;
        display: block;
        background-color: gray;
        opacity: 0.2;
        margin: 50px 0;
    }

    .title a {
        text-decoration: none;
        color: black;
        font-family: sans-serif;
        font-size: 20px;
    }

    .title a:hover {
        text-decoration-line: underline;
        -webkit-text-decoration-line: underline;
    }

    .title span {
        border-style: solid;
        border-color: brown;
        border-width: 1px;
        border-radius: 2px;
        color: brown;
        font-size: 10px;
        padding: 0 1px;
    }

    .meta {
        margin-top: 10px;
    }

    .meta span {
        font-size: 15px;
        font-family: sans-serif;
        margin: 0 1px;
        color: grey;
        opacity: 0.7;
    }

    .tags {
        margin-top: 10px;
    }

    .tags a {
        color: grey;
        margin: 0 3px;
    }

    .tags a:hover {
        color: black;
    }

    .content {
        width: 100%;
        margin-top: 15px;
    }

    .content span {
        word-wrap: break-word;
        color: grey;
        font-family: sans-serif;
        font-size: 15px;
        line-height: 200%;
    }

    .content a {
        margin-left: 3px;
        color: brown;
        font-size: 12px;
    }

    .content a:hover {
        font-weight: bold;
    }

    .pagination {
        margin-top: 125px;
    }

    .pagination ul li {
        display: inline-block;
        margin: 0 5px;
    }

    .navPage {
        text-decoration-line: underline;
        font-family: sans-serif;
        font-size: 19px;
        color: black;
    }

    .navPage:hover {
        font-weight: bold;
    }

    .navPageDisabled {
        text-decoration-line: line-through;
        -webkit-text-decoration-line: line-through;
        font-family: sans-serif;
        font-size: 19px;
        color: grey;
        pointer-events: none;
    }

    .genPage {
        transition: font-size 0.2s;
        border-width: 1px;
        text-decoration: none;
        font-family: sans-serif;
        font-size: 18px;
        color: black;
        border-radius: 2px;
        margin: 10px;
    }

    .genPage:hover {
        transition: font-size 0.2s;
        font-size: 22px;
        color: brown;
    }

    .active {
        font-size: 22px;
        color: brown;
    }
</style>