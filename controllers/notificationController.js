const Notification = require('../models/notificationModel');
const User = require('../models/userModel');




exports.createNotification = async (req, res) => {
    try {
        const { recipient, content } = req.body;

        const notification = new Notification({ recipient, content });
        await notification.save();

        return res.status(201).json({ status: 201, message: 'Notification created successfully', data: notification });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error creating notification', error: error.message });
    }
};


exports.markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.notificationId;

        const notification = await Notification.findByIdAndUpdate(
            notificationId,
            { status: 'read' },
            { new: true }
        );

        if (!notification) {
            return res.status(404).json({ status: 404, message: 'Notification not found' });
        }

        return res.status(200).json({ status: 200, message: 'Notification marked as read', data: notification });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error marking notification as read', error: error.message });
    }
};


exports.getNotificationsForUser = async (req, res) => {
    try {
        const userId = req.params.userId;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ status: 404, message: 'User not found' });
        }

        const notifications = await Notification.find({ recipient: userId });

        return res.status(200).json({ status: 200, message: 'Notifications retrieved successfully', data: notifications });
    } catch (error) {
        return res.status(500).json({ status: 500, message: 'Error retrieving notifications', error: error.message });
    }
};

