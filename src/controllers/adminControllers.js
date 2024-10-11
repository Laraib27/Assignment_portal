const Admin = require('../models/Admin');
const Assignment = require('../models/Assignment');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
    try {
        const { username, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ username, password: hashedPassword });
        await admin.save();
        res.status(201).json({ message: 'Admin registered successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        if (!admin) return res.status(404).json({ message: 'Admin not found' });

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getAssignments = async (req, res) => {
    try {
        const assignments = await Assignment.find({ adminId: req.admin.id }).populate('userId');
        res.json(assignments);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.acceptAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        assignment.status = 'Accepted';
        assignment.adminId = req.admin.id;
        await assignment.save();

        res.json({ message: 'Assignment accepted successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

exports.rejectAssignment = async (req, res) => {
    try {
        const assignment = await Assignment.findById(req.params.id);
        if (!assignment) return res.status(404).json({ message: 'Assignment not found' });

        assignment.status = 'Rejected';
        assignment.adminId = req.admin.id;
        await assignment.save();

        res.json({ message: 'Assignment rejected successfully.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
