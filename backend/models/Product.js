const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: String,
    rating: { type: Number, required: true },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameUnsigned: {type: String},
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  discount: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  sold: { type: Number, default: 0 },
  mainImage:{type: String},
  subImages: [{ type: String }], // lưu tên file ảnh
  description: String,
  specifications: [
    {
      name: String,
      value: String,
    },
  ],
  category: String,
  numReviews: { type: Number, default: 0 },
  reviews: [reviewSchema],

  flashSale: {
        isActive: Boolean,
        price: Number,
        discountPercent: Number,
        startTime: Date,
        endTime: Date
      },

      status: { type: String, default: 'in stock' }, 

},
{timestamps: true}
);

productSchema.methods.isFlashSaleActive = function () {
  const currentTime = new Date();
  return (
    this.flashSale.isActive &&
    currentTime >= this.flashSale.startTime &&
    currentTime <= this.flashSale.endTime
  );
};

module.exports = mongoose.model("Product", productSchema);
