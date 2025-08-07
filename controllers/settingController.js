
const Setting = require('../models/Setting');

exports.getSettings = async (req, res) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            settings = new Setting();
            await settings.save();
        }
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch settings' });
    }
};

exports.updateSettings = async (req, res) => {
    try {
        const { sellerInvitationCode, shippingFee } = req.body;
        const settings = await Setting.findOneAndUpdate({}, 
            { sellerInvitationCode, shippingFee }, 
            { new: true, upsert: true, runValidators: true }
        );
        res.status(200).json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update settings' });
    }
};