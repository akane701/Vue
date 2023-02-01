<template>
    <div>
        <input type="text" v-model="aisatu">
        {{ aisatu }}
        <h4 v-if="aisatu === 'hello'">12:00</h4>
        <h4 v-if="flag">{{ change }}</h4>
        <button @click="daytonight">夜へ</button>
    </div>
</template>

<script>
import { ref } from "vue";
import HelloWorld from "./HelloWorld.vue";

export default {
    // setup() {
    //     const aisatu = ref("Hello"); // reactive
    //     const userName = ref("user name");

    //     const daytonight = function() {
    //         this.aisatu = "bye";
    //         console.log("aisatu changed");
    //     };
    //     let change;
    //     const flag = false;
        
    //     return {
    //     flag,
    //     aisatu,
    //     daytonight,
    //     userName,
    //     change,
    //     };
    // },
    //↑だと、daytunightが発火したときにundefined at Instanceみたいなエラーが出る。
    //↓でdata, methodsで書くとでなくなった。
    data: () =>({
        aisatu: "Hello",
        change: undefined,
        flag: false,
    }),
    methods: {
        daytonight() {
            this.aisatu = "bye";
            console.log("aisatu changed");
        }
    },
    watch: {
        aisatu(newValue, oldValue) {
            this.flag = true;
            this.change = "You changed aisatu";
        }
    }
};
</script>