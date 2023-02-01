<script setup>
import HelloWorld from './components/HelloWorld.vue'
import TheWelcome from './components/TheWelcome.vue'
import CountUp from './components/CountUp.vue'
import inputForm from './components/inputForm.vue';
// import task from './components/task.vue';

import { ref, watch } from 'vue';
const tasks = ref([]);
const task = ref('');

const getTasks = async () => {
  const response = await fetch('http://localhost:3000/backend-express-db');
  const data = await response.json();

  
  tasks.value = data;
};

getTasks();


const addTask = async() => {
  const response = await fetch('http://localhost:3000/backend-express-db', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({task: task.value, completed: false}),
  });

  const data = await response.json();
  console.log(data);
  tasks.value.push(data);
  task.value = '';
};

const updateTask = async(id, completed) => {
  console.log("update method called");
  console.log(completed);
  console.log(id);

  const response = await fetch('http://localhost:3000/backend-express-db/update/' + id, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({id: id, completed: completed}),
  });
};

//watchプロパティでは値の変更を検知することが出来るが、オブジェクト内の各プロパティの値を検知することは難しい？？
//watch(task.complete, console.log("changed"))
//->ディレクティブ重ねてつけられるので、v-model="task.completed" @change=とかにする
//changeは変更したことを検知。テキストとかで入力検知→発火させたいならinputとか使う

const deleteTask = async(id) => {
  console.log("called");
  const response = await fetch('http://localhost:3000/backend-express-db/delete/' + id, {
    method: 'DELETE',
  });
 
  const index = tasks.value.findIndex((task) => task.id === id);
  tasks.value.splice(index, 1);
  // this.getTasks();
};
</script>

<template>
  <header>
    <img alt="Vue logo" class="logo" src="./assets/logo.svg" width="125" height="125" />
    <!-- <div>
      <task />
    </div> -->

    <h1>Tasks</h1>
  <ul>
    <li
      v-for="task in tasks"
      :key="task.id"
      :style="task.completed ? 'text-decoration:line-through' : ''"
    >
      <span><input type="checkbox" v-model="task.completed" @change="updateTask(task.id, task.completed)"/></span>
      <span>{{ task.task }}</span>
      <button @click="deleteTask(task.id)">削除</button>
    </li>
  </ul>
  <form @submit.prevent="addTask">
    <div>
      <input v-model="task" />
    </div>
    <div>
      <button type="submit">タスクを登録</button>
    </div>
  </form>

    <!-- <div>
      <CountUp />
    </div> -->
  </header>

  <!-- <main>
    <TheWelcome />
  </main> -->
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
