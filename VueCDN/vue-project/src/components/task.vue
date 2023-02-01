<script setup>
import { ref } from 'vue';
let id = 0;

//登録タスク
const tasks = ref([]);

//テキストボックスの中の文字を管理するための変数
const task = ref('');

const addTask = () => {
  tasks.value.push({ id: id, task: task.value, complted: false });
  console.log(tasks);
  console.log(tasks.value);
  task.value = '';
  id++;
};

const deleteTask = (id) => {
  const index = tasks.value.findIndex((task) => task.id === id);
  tasks.value.splice(index, 1);
};
</script>

<template>
  <h1>Tasks</h1>
  <ul>
    <li
      v-for="task in tasks"
      :key="task.id"
      :style="task.completed ? 'text-decoration:line-through' : ''"
    >
    <!-- なぜkeyをつけるか
    https://progtext.net/programming/react-key/ -->
      <span><input type="checkbox" v-model="task.completed" /></span>
      <span>{{ task.task }}</span>
      <button @click="deleteTask(task.id)">削除</button>
    </li>
  </ul>
  <form @submit.prevent="addTask">
    <div>
      <input v-model="task" />
    </div>
    <div>
      <button>タスクを登録</button>
    </div>
  </form>
</template>