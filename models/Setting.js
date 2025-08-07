const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema({
    sellerInvitationCode: {
        type: String,
        default: 'AURA_TEA_SELLER_CODE_2024'
    },
    shippingFee: {
        type: Number,
        default: 350
    }
});

module.exports = mongoose.model('Setting', settingSchema);