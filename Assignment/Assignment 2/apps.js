const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Initialize tasks.json if it doesn't exist
const initializeTasksFile = () => {
    if (!fs.existsSync('tasks.json')) {
        fs.writeFileSync('tasks.json', JSON.stringify({ tasks: [] }, null, 2));
    }
};

initializeTasksFile();

app.get('/tasks', (req, res) => {
    const data = JSON.parse(fs.readFileSync('tasks.json', 'utf8'));
    res.render('tasks', { tasks: data.tasks });
});

app.post('/add-task', (req, res) => {
    const data = JSON.parse(fs.readFileSync('tasks.json', 'utf8'));
    const newTask = {
        id: Date.now(),
        title: req.body.title,
        completed: false,
        createdAt: new Date().toISOString()
    };
    data.tasks.push(newTask);
    fs.writeFileSync('tasks.json', JSON.stringify(data, null, 2));
    res.redirect('/tasks');
});

app.post('/toggle-task/:id', (req, res) => {
    const data = JSON.parse(fs.readFileSync('tasks.json', 'utf8'));
    const task = data.tasks.find(t => t.id === parseInt(req.params.id));
    if (task) {
        task.completed = !task.completed;
        fs.writeFileSync('tasks.json', JSON.stringify(data, null, 2));
    }
    res.json({ success: true });
});

// Redirect root to tasks
app.get('/', (req, res) => {
    res.redirect('/tasks');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});