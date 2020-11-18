<template>
    <div id="aboutComp">
        <div>
            <p class="quote">"至于有法无法，有相无相，如鱼饮水，冷暖自知"</p>
            <p class="author">——南宋·岳珂《桯史·记龙眠海会图》</p>
        </div>
        <div class="statistics"></div>
    </div>
</template>

<script>
    export default {
        data: function () {
            return {}
        }
    }
</script>

<style scoped>
    #aboutComp {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 40%;
    }

    .quote {
        font-family: sans-serif;
        font-size: 18px;
        font-style: italic;
        color: grey;
    }

    .author {
        font-size: 16px;
        margin-top: 10px;
        font-family: sans-serif;
        text-align: right;
    }

    .statistics {
        margin-top: 70px;
    }

    .statistics p {
        color: grey;
        font-family: sans-serif;
        font-size: 18px;
    }
</style>