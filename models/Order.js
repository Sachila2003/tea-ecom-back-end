const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },orderItems: [
        {
            name: { type: String, required: true },
            qty: {
                type: Number,
                required: true
            },
            image: { type: String, required: true },
            price: { type: Number, required: true },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            }
        }
    ],
    shippingAddress: {
        address: { type:String, required: true},
        city: { type:String, required: true},
        postalCode: { type:String, required: true},
    },
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0
    },
    orderStatus: {
        type: String,
        required: true,
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },
    deliveredAt: {
        type: Date
    }
}, {
    timestamps: true 

});

module.exports = mongoose.model('Order', orderSchema);