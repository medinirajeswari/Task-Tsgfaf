const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;


app.use(bodyParser.json());
app.use(express.json());

const db = mysql.createConnection({
   host:bpg24venmviqi1adrery-mysql.services.clever-cloud.com,
  user:uoapiuydgtagtu2q,
  password:LWKKCWTmX6a3F6p47ubs,
  database:bpg24venmviqi1adrery
});
app.listen(3000, () => {
    console.log("Server is running....")
})
// FOR TESTIMONALS
app.post('/api/testimonials', (req, res) => {
  const newClass = req.body; 

  db.query('INSERT INTO testimonials SET ?', newClass, (err, result) => {
    if (err) {
      console.error('Error creating class:', err);
      res.status(500).json({ error: 'Error creating class' });
    } else {
      res.status(201).json({ message: 'class created successfully' });
    }
  });
});


app.get('/api/testimonials', (req, res) => {
  db.query('SELECT * FROM testimonials', (err, results) => {
    if (err) {
      console.error('Error fetching testimonials:', err);
      res.status(500).json({ error: 'Error fetching testimonials' });
    } else {
      res.status(200).json(results);
    }
  });
});


app.put('/api/testimonials/:_id', (req, res) => {
  const classId = req.params._id;
  const updatedclass = req.body; 

  db.query('UPDATE testimonials SET? WHERE _id = ?', [updatedclass, classId], (err, result) => {
    if (err) {
      console.error('Error updating class:', err);
      res.status(500).json({ error: 'Error updating class' });
    } else {
      res.status(200).json({ message: 'class updated successfully' });
    }
  });
});


app.delete('/api/testimonials/:_id', (req, res) => {
  const classId = req.params._id;

  db.query('DELETE FROM testimonials WHERE _id = ?', classId, (err, result) => {
    if (err) {
      console.error('Error deleting class:', err);
      res.status(500).json({ error: 'Error deleting class' });
    } else {
      res.status(200).json({ message: 'class deleted successfully' });
    }
  });
});


// FOR CLASSES


app.post('/api/classes', (req, res) => {
  const newClass = req.body;
  newClass.reviews = JSON.stringify(newClass.reviews);

  const sql = 'INSERT INTO yoga_classes SET ?';

  db.query(sql, newClass, (err, result) => {
    // console.log("err",err);
    // console.log("result",result);
    if (err) {
      console.error('Error creating yoga class:', err);
      res.status(500).json({ error: 'Error creating yoga class' });
    } else {
      res.status(201).json({ message: 'Yoga class created successfully' });
    }
  });
});


app.get('/api/classes', (req, res) => {
  const sql = 'SELECT * FROM yoga_classes';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error fetching yoga classes:', err);
      res.status(500).json({ error: 'Error fetching yoga classes' });
    } else {
      res.status(200).json(results);
    }
  });
});



app.put('/api/classes/:id', (req, res) => {
  const classId = req.params.id;
  const updatedclass = req.body; 

  db.query('UPDATE yoga_classes SET? WHERE id = ?', [updatedclass, classId], (err, result) => {
    if (err) {
      console.error('Error updating class:', err);
      res.status(500).json({ error: 'Error updating class' });
    } else {
      res.status(200).json({ message: 'class updated successfully' });
    }
  });
});


app.delete('/api/classes/:id', (req, res) => {
  const classId = req.params.id;

  db.query('DELETE FROM yoga_classes WHERE id = ?', classId, (err, result) => {
    if (err) {
      console.error('Error deleting class:', err);
      res.status(500).json({ error: 'Error deleting class' });
    } else {
      res.status(200).json({ message: 'class deleted successfully' });
    }
  });
});

// FOR users
function validateUserId(req, res, next) {
  const userId = parseInt(req.params.id);
  if (!isNaN(userId)) {
    req.userId = userId;
    next();
  } else {
    res.status(400).json({ error: 'Invalid user ID' });
  }
}
// Create a new user
app.post('/api/users', (req, res) => {
const newUser = req.body;
const sql = 'INSERT INTO users (id, username, email, password) VALUES (?, ?, ?, ?)';
const values = [newUser.id, newUser.username,newUser.email,newUser.password];

db.query(sql, values, (err, result) => {
  if (err) {
    console.error('Error creating user:', err);
    res.status(500).json({ error: 'Error creating user' });
  } else {
    newUser.id = result.insertId;
    res.status(201).json(newUser);
  }
});
});

// Read all users
app.get('/api/users', (req, res) => {
const sql = 'SELECT * FROM users';

db.query(sql, (err, results) => {
  if (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Error fetching users' });
  } else {
    res.status(200).json(results);
  }
});
});

// Read a single user by ID
app.get('/api/users/:id',validateUserId, (req, res) => {
const sql = 'SELECT * FROM users WHERE id = ?';

db.query(sql, [req.userId], (err, results) => {
  if (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ error: 'Error fetching user' });
  } else if (results.length === 0) {
    res.status(404).json({ error: 'User not found' });
  } else {
    res.status(200).json(results[0]);
  }
});
});


app.put('/api/users/:id', validateUserId, (req, res) => {
  const userId = req.params.id;
  const updatedUser = req.body;

  const allowedProperties = ['username', 'email'];
  const sanitizedUpdates = {};
  
  for (const key of allowedProperties) {
    if (updatedUser[key] !== undefined) {
      sanitizedUpdates[key] = updatedUser[key];
    }
  }

 
  if (Object.keys(sanitizedUpdates).length === 0) {
    return res.status(400).json({ error: 'No valid updates provided' });
  }

  const sql = 'UPDATE users SET ? WHERE id = ?';
  const values = [sanitizedUpdates, userId];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error updating user:', err);
      res.status(500).json({ error: 'Error updating user' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.status(200).json({ message: 'User updated successfully' });
    }
  });
});

// Delete a user by ID
app.delete('/api/users/:id',validateUserId, (req, res) => {
const sql = 'DELETE FROM users WHERE id = ?';

db.query(sql, [req.userId], (err, result) => {
  if (err) {
    console.error('Error deleting user:', err);
    res.status(500).json({ error: 'Error deleting user' });
  } else if (result.affectedRows === 0) {
    res.status(404).json({ error: 'User not found' });
  } else {
    res.status(200).json({ message: 'User deleted successfully' });
  }
});
});



