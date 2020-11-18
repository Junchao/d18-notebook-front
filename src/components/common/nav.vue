<template>
    <div id="navComp">
        <div class="title">
            <a href="/">{{ title }}</a>
        </div>
        <div class="tab">
            <ul>
                <li v-for="tab in tabs">
                    <router-link v-bind:to="tab.path">{{ tab.name }}</router-link>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {
                title: "D18's Notebook",
                tabs: [
                    {name: 'NOTES', path: {name: 'notes'}},
                    {name: 'WRITING', path: {name: 'writing'}},
                    {name: 'ABOUT', path: {name: 'about'}},
                    {name: 'SEARCH', path: {name: 'search'}},
                    {name: 'AUTH', path: {name: 'auth'}}
                ]
            }
        }
    }
</script>

<style scoped>
    #navComp {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .title a {
        color: black;
        text-decoration: none;
        font-family: sans-serif;
        font-weight: bold;
        font-size: 30px;
    }

    .tab {
        display: flex;
        flex-direction: row;
        justify-content: center;
        margin-top: 38px;
    }

    .tab ul li {
        display: inline-block;
        padding: 0 5px;
    }

    .tab ul li a {
        color: grey;
        font-family: sans-serif;
        font-size: 14px;
        text-decoration: none;
    }

    .tab ul li a:hover {
        color: black;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: black;
    }

    .router-link-active {
        color: black !important;
        border-bottom-style: solid;
        border-bottom-width: 1px;
        border-bottom-color: black;
    }
</style>