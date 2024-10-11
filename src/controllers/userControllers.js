const User = require('../models/Users');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Assignment = require('../models/Assignment');
const Admin = require('../models/Admin');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.uploadAssignment = async (req, res) => {
    try {
        const { task } = req.body;
        const assignment = new Assignment({ userId: req.user.id, task });
        await assignment.save();
        res.status(201).json({ message: 'Assignment uploaded successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.getAdmins = async (req, res) => {
    try {
        // const { task } = req.body;
        const admins = await Admin.find({}, 'username');
        // await assignment.save();
        res.status(201).json({ usernames: admins.map(admin => admin.username) });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
