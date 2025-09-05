const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// --------- MongoDB Atlas connection ---------
const uri = "mongodb+srv://zhoelzhelev:painmainyasuo1@zhoeldb.apg76eo.mongodb.net/fitnessApp";
mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// --------- Middleware ---------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'your-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: false,   // true only if using HTTPS
    maxAge: 1000 * 60 * 60 // 1 hour
  }
}));

app.use(express.static('public'));

app.set('view engine', 'ejs');

const User = require('./models/User');
const Meal = require('./models/Meal');

// --------- Routes ---------

app.use((req, res, next) => {
  res.locals.user = req.session.user; // now `user` is available in every EJS file
  next();
});


// Serve HTML pages
app.get('/', (req, res) => {
  res.render('fitness-and-health', { user: req.session.user });
});

app.get('/calculator', (req, res) => {
  res.render('fitness-and-health-calorie-calculator', { user: req.session.user });
});

app.get('/tracker', async (req, res) => {
  const user = await User.findById(req.session.user.id); 
  res.render('fitness-and-health-calorie-tracker', { user });
});

app.get('/register', (req, res) => {
  res.render('register', {user: req.session.user});
})

app.get('/login', (req, res) => {
  res.render('login', {user: req.session.user});
})

app.get('/profile', async (req, res) => {
  const user = await User.findById(req.session.user.id); 
  res.render('profile', { user });
});




// Register new user
app.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    // Store user in session
    req.session.user = { id: newUser._id, username: newUser.username };

    res.redirect('/'); // Redirect to homepage
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Login user
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found");

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).send("Incorrect password");

    // Store user in session
    req.session.user = { id: user._id, username: user.username };

    res.redirect('/'); // Redirect to homepage
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Logout
app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Set calories

app.post('/set-calories', async (req, res) => {
    try {
        if (!req.session.user) {
            return res.status(401).json({ error: 'Not logged in' });
        }

        const { calories } = req.body; 
        const user = await User.findById(req.session.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.dailyCalorieGoal = calories;
        user.remainingCalories = calories;
        user.carbohydrates = 0;
        user.fats = 0;
        user.proteins = 0;
        user.sodiums = 0;
        user.sugers = 0;
        await user.save();

        res.json({ dailyCalories: user.dailyCalories });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


app.post('/add-food', async (req, res) => {
    try {
        const { calories, carbohydrates, fats, proteins, sodiums, sugars } = req.body;
        const user = await User.findById(req.session.user.id); // full user

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Update user macros
        user.remainingCalories -= Number(calories);
        user.carbohydrates = (user.carbohydrates || 0) + Number(carbohydrates);
        user.fats = (user.fats || 0) + Number(fats);
        user.proteins = (user.proteins || 0) + Number(proteins);
        user.sodiums = (user.sodiums || 0) + Number(sodiums);
        user.sugars = (user.sugars || 0) + Number(sugars);

        await user.save();

        res.json({
            message: 'Food added successfully',
            remainingCalories: user.remainingCalories,
            carbohydrates: user.carbohydrates,
            fats: user.fats,
            proteins: user.proteins,
            sodiums: user.sodiums,
            sugars: user.sugars
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});



// --------- Start Server ---------
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
