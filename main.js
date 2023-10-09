
const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = 6000;


app.use(bodyParser.json());
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
   host:"bpg24venmviqi1adrery-mysql.services.clever-cloud.com",
  user:"uoapiuydgtagtu2q",
  password:"LWKKCWTmX6a3F6p47ubs",
  database:"bpg24venmviqi1adrery"
});
app.listen(6000, () => {
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
//for instructors
app.get("/", (req, res) => {
  connection.query("select * from events",(err,result)=>{
    if(err){
      response.send("errr")
    }else{
      response.send(result)
    }
  })
  res.send("Uinty Yoga Studio is running");
});

//get for instructors
app.get("/api/instructors",(req, res)=>{
  const query = 'SELECT * FROM instructors';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query: ' + error);
      res.status(500).send('Error fetching data from MySQL');
      return;
    }

    // Send the results as a response
    res.json(results);
  });
});
//get for instructors by Id
app.get("/api/instructors/id/:id",(req, res) => {
  const instructorsId = req.params.id;
  const query = 'SELECT * FROM instructors WHERE id = ?';
  
  connection.query(query, [instructorsId], (error, results) => {
    if (error) {
      console.error('Error fetching instructors by ID: ' + error);
      res.status(500).send('Error fetching instructors by ID');
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'instructor not found' });
    } else {
      res.json(results[0]);
    }
  });
});

//get instructor by email
app.get('/api/instructors/email/:email', (req, res) => {

const email = req.params.email;

  // Perform a MySQL query to retrieve the instructor by email
  const query = 'SELECT * FROM instructors WHERE email = ?';

  connection.query(query, [email], (error, results) => {
    if (error) {
      console.error('Error fetching instructor by email: ' + error);
      res.status(500).send('Error fetching instructor by email');
      return;
    }

    if (results.length === 0) {
      res.status(404).json({ message: 'Instructor not found' });
    } 
    else {
      res.json(results[0]);
    }
  });
});
//post for instructors
app.post('/api/instructors', (req, res) => {
  const newClass = req.body;
  newClass.reviews = JSON.stringify(newClass.reviews);
  newClass.social_media = JSON.stringify(newClass.social_media);
  newClass.upcoming_events = JSON.stringify(newClass.upcoming_events);

  const sql = 'INSERT INTO instructors SET ?';
  connection.query(sql, newClass, (error) => {
    
    if (error) {
      console.error('Error creating instructor:', err);
      res.status(500).json({ error: 'Error creating instructor' });
    } else {
      res.status(201).json({ message: 'instructors created successfully' });
    }
  });
});





// update instructor

app.put('/api/instructors/update/:id', (req, res) => {
  const Id = req.params.id;
  const updatedclass = req.body; 
  updatedclass.reviews = JSON.stringify(updatedclass.reviews);
  updatedclass.social_media = JSON.stringify(updatedclass.social_media);
  updatedclass.upcoming_events = JSON.stringify(updatedclass.upcoming_events);

  connection.query('UPDATE instructors SET? WHERE id = ?', [updatedclass, Id], (error, result) => {
    if (error) {
      console.error('Error updating instructor: ' + error);
      res.status(500).send('Error updating instructor');
      return;
    }

    res.status(200).json({ message: 'instructor updated successfully' });
  });
});



//delete instructors
app.delete('/api/instructors/delete/:id', (req, res) => {
  const instructorsId = req.params.id;
  const query = 'DELETE FROM instructors WHERE id = ?';
  connection.query(query, [instructorsId], (error, result) => {
    if (error) {
      console.error('Error deleting instructor: ' + error);
      res.status(500).send('Error deleting instructor');
      return;
   } 

    res.status(204).send(); // No content, successful deletion
  });
});


//get for events
app.get("/api/events",(req, res)=>{
  const query = 'SELECT * FROM events';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query: ' + error);
      res.status(500).send('Error fetching data from MySQL');
      return;
    }

    // Send the results as a response
    res.json(results);
  
  });
 
});

//get for events by Id
app.get("/api/events/id/:id",(req, res) => {
  const eventId = req.params.id;
  const query = 'SELECT * FROM events WHERE id = ?';
  
  connection.query(query, [eventId], (error, results) => {
    if (error) {
      console.error('Error fetching event by ID: ' + error);
      res.status(500).send('Error fetching event by ID');
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'event not found' });
    } else {
      res.json(results[0]);
    }
  });
});






//post for events
app.post('/api/events/add',(req, res)=>{
  const newClass = req.body;
  //newClass.reviews = JSON.stringify(newClass.reviews);
  //newClass.social_media = JSON.stringify(newClass.social_media);
  //newClass.upcoming_events = JSON.stringify(newClass.upcoming_events);
  const sql = 'INSERT INTO events SET ?';
  connection.query(sql, newClass, (error) => {
    if (error) {
      console.error('Error creating event ', error);
      res.status(500).json({ error: 'Error creating events' });
    } else {
      res.status(200).json({ message: 'event created successfully' });
    }
  });
});
  
//update for events
app.put('/api/events/update/:id', (req, res) => {
  const eventId = req.params.id;
  const { name, discription, date, url, image } = req.body; 

  
  const query = 'UPDATE events SET name = ?, discription = ?, date =?, url = ?, image = ? WHERE id = ?';
  connection.query(query, [name, discription, date, url, image, eventId], (error, result) => {
    if (error) {
      console.error('Error updating event: ' + error);
      res.status(500).send('Error updating event');
      return;
    }

    res.status(200).json({ message: 'event updated successfully' });
  });
});
 
 

//delete for events
app.delete('/api/events/delete/:id', (req, res) => {
  const eventId = req.params.id;
  const query = 'DELETE FROM events WHERE id = ?';
  connection.query(query, [eventId], (error, result) => {
    if (error) {
      console.error('Error deleting instructor: ' + error);
      res.status(500).send('Error deleting instructor');
      return;
    }

    res.status(204).send(); // No content, successful deletion
  });
});


//get for blogs
app.get("/api/blogs",(req, res)=>{
  const query = 'SELECT * FROM blogs';

  connection.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query: ' + error);
      res.status(500).send('Error fetching data from MySQL');
      return;
    }

    // Send the results as a response
    res.json(results);
  
  });
 
});

//get for blogs by Id
app.get("/api/blogs/id/:id",(req, res) => {
  const blogsId = req.params.id;
  const query = 'SELECT * FROM blogs WHERE id = ?';
  
  connection.query(query, [blogsId], (error, results) => {
    if (error) {
      console.error('Error fetching blog by ID: ' + error);
      res.status(500).send('Error fetching blog by ID');
      return;
    }
    if (results.length === 0) {
      res.status(404).json({ message: 'blog not found' });
    } else {
      res.json(results[0]);
    }
  });
});




//post for blogs
app.post('/api/blogs/add',(req, res)=>{
  const { title, discription, date, image } = req.body;

  const query = 'INSERT INTO blogs (title, discription,date,image) VALUES (?, ?, ?, ?)';
  connection.query(query, [title, discription,date,image], (error, result) => {
    if (error) {
      console.error('Error creating blog: ' + error);
      res.status(500).send('Error creating blog');
      return;
    }

    res.status(201).json({ message: 'blog created successfully', id: result.insertId });
  });
});

 //update for blogs
 app.put('/api/blogs/update/:id', (req, res) => {
  const blogId = req.params.id;
  const { title, discription, date, image } = req.body; 

  
  const query = 'UPDATE blogs SET title = ?, discription = ?, date =?, image = ? WHERE id = ?';
  connection.query(query, [title, discription, date,image, blogId], (error, result) => {
    if (error) {
      console.error('Error updating blog: ' + error);
      res.status(500).send('Error updating blog');
      return;
    }

    res.status(200).json({ message: 'blog updated successfully' });
  });
});

//delete for blogs
app.delete('/api/blogs/delete/:id', (req, res) => {
  const blogsId = req.params.id;
  const query = 'DELETE FROM blogs WHERE id = ?';
  connection.query(query, [blogsId], (error, result) => {
    if (error) {
      console.error('Error deleting blog: ' + error);
      res.status(500).send('Error deleting blog');
      return;
    }

    res.status(204).send(); // No content, successful deletion
  });
});













