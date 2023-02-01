const express = require('express');
//add for DB
const { PrismaClient } = require('@prisma/client');

//add for fetch(source1)
// const serveStatic = require('serve-static');
// const cors = require('cors');

const app = express();
const port = 3000;

//add for fetch(source2)
const cors = require('cors');
app.use(cors());

app.use(express.json());

//add for DB
const prisma = new PrismaClient();


//add for fetch(source1)
// const port = process.env.PORT || 3000;
// if (process.env.NODE_ENV !== 'production') {
// 	app.use(cors())
// }

//add for fetch(source1)
// app.use(serveStatic(__dirname + '/dist'));

app.get('/', (req, res) => res.send('Hello World!'));

app.get('/backend-express-db', async(req, res) => {
	const tasks = await prisma.task.findMany();
 	return res.json(tasks);
});

app.post('/backend-express-db', async(req, res) => {
	const { task, completed } = req.body;
	const newTask = await prisma.task.create({
		data: {
		  task,
		  completed,
		},
	});
	// console.log(req.body);
	return res.json(newTask);
});

app.put(`/backend-express-db/update/:id`, async(req, res) => {
	console.log(req.params);
	const id = req.params.id;
	const {completed} = req.body;
	console.log(id, completed);
	const ID = Number(id);

	const updateTask = await prisma.task.update({
		where: {
		  id: ID,
		},
		data: {
			completed,
		},
	});
	return res.status(200).end();
})

app.delete('/backend-express-db/delete/:id', async (req, res) => {
	console.log("req params", req.params.id);
		const id = req.params.id;
		const ID = Number(id);
	console.log(typeof id);
//   //   try {
	  const deleteTask = await prisma.task.delete({
		where: {
		  id: ID,
		},
	  });
// // 	  res.set({ 'Access-Control-Allow-Origin': '*' });
	  return res.status(201).end();
// //   //   } catch (e) {
// //   //     return res.status(400).json(e);
// //   //   }
  });

app.listen(port, () => console.log(`Example app listening on port ${port}!`));