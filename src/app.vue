<template>
    <div id="app">
        <notice-comp></notice-comp>
        <nav-comp class="navComp"></nav-comp>
        <router-view class="routerView"></router-view>
    </div>
</template>

<script>
    import noticeComp from './components/common/notice'
    import navComp from './components/common/nav'

    export default {
        data: function () {
            return {}
        },
        components: {
            'nav-comp': navComp,
            'notice-comp': noticeComp
        }
    }
</script>

<style scoped>
    #app {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .navComp {
        margin-top: 60px;
    }

    .routerView {
        margin-top: 75px;
        margin-bottom: 200px;
    }

</style>