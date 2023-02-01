<template>
    <div>
        <p>現在のカウント数:{{ count }}</p>
        <button @click="count++">カウントアップ</button>
        <button @click="clearCount">Clear</button>
        <button @click="decrement">カウントダウン</button>
    </div>
</template>

<script>
import { ref } from "vue";

export default {
    data: () => ({
        count: 0,
    }),
    methods:{
        increment: function(){
            this.count++;
        },
        decrement() {
            this.count--;
        },
        clearCount(event) {
            this.count = 0;
            console.log(event)
        }

    },
</script>

