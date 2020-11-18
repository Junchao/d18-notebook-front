<template>
    <div id="searchComp">
        <div class="search">
            <form>
                <label>
                    <input type="text" placeholder="search notes...">
                </label>
            </form>
        </div>
        <div class="tags">
            <router-link v-for="tag in tags" v-bind:to="{ name: 'notes', query: { tag: tag.id } }"
                         v-bind:style="tagStyle(tag.tagged)">
                {{ tag.name }}
            </router-link>
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
                tags: [],
                totalTagged: 0
            }
        },
        created: function () {
            this.fetchTags()
        },
        methods: {
            fetchTags: function () {
                let self = this;
                let payload = {};

                sendReq('/tags', payload).then(function (response) {
                    if (response.data['status'] === 0) {
                        let data = response.data['data'];
                        if (data['tags'].length <= 0) {
                            bus.publish(config.noticeEvent, {
                                type: config.noticeLevel.info,
                                msg: '还没有标签哦！'
                            })
                        }
                        let tags = data['tags'];
                        for (let i = 0; i < tags.length; i++) {
                            self.totalTagged += tags[i]['tagged'];
                        }
                        self.tags = tags;
                    } else {
                        bus.publish(config.noticeEvent, {
                            type: config.noticeLevel.warn,
                            msg: '获取标签失败！'
                        })
                    }
                }).catch(function (error) {
                    handleServerError()
                })
            },
            tagStyle: function (tagged) {
                // font-size: [15, 35]
                let fontSize = 15 + 15 * (35 / 15 - 1) * (tagged / this.totalTagged);
                return "font-size: " + fontSize.toFixed(2) + "px"
            }
        }
    }
</script>

<style scoped>
    #searchComp {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 35%;
    }

    .search, form, label {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
    }

    .search input {
        transition: 0.3s;
        border-width: 1px;
        border-color: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        height: 42px;
        width: 60%;
        font-size: 18px;
        font-family: sans-serif;
        padding-left: 15px;
    }

    .search input:focus {
        box-shadow: 0 0 6px 2pt cornflowerblue;
        outline: none;
        transition: 0.3s;
    }

    ::placeholder {
        color: grey;
        font-size: 18px;
        opacity: 0.5;
    }

    .tags {
        margin-top: 60px;
        width: 65%;
    }

    .tags a {
        text-decoration: none;
        color: grey;
        font-family: sans-serif;
        margin: 0 1px;
    }

    .tags a:hover {
        text-decoration-line: underline;
        -webkit-text-decoration-line: underline;
        color: black;
    }
</style>