const mongoose = require('mongoose');

const menuItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    trim: true,
    maxlength: 500
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  cost: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    enum: ['appetizer', 'main', 'dessert', 'beverage', 'side']
  },
  subcategory: String,
  images: [{
    url: String,
    isPrimary: Boolean
  }],
  ingredients: [{
    name: String,
    quantity: String,
    containsAllergens: Boolean
  }],
  dietaryTags: [{
    type: String,
    enum: ['vegetarian', 'vegan', 'gluten-free', 'halal', 'kosher', 'spicy']
  }],
  preparationTime: {
    type: Number,
    min: 0
  },
  availability: {
    always: Boolean,
    schedule: [{
      day: String,
      available: Boolean,
      timeSlots: [{
        start: String,
        end: String
      }]
    }]
  },
  restaurant: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'seasonal', 'sold_out'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
menuItemSchema.index({ restaurant: 1 });
menuItemSchema.index({ category: 1 });
menuItemSchema.index({ status: 1 });
menuItemSchema.index({ price: 1 });
menuItemSchema.index({ name: 'text', description: 'text' });

// Middleware
menuItemSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set first image as primary if none marked
  if (this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
    this.images[0].isPrimary = true;
  }
  
  next();
});

// Virtuals
menuItemSchema.virtual('promotions', {
  ref: 'Promotion',
  localField: '_id',
  foreignField: 'menuItems'
});

// Instance methods
menuItemSchema.methods.isAvailableNow = function() {
  if (this.availability.always) return true;
  
  const now = new Date();
  const currentDay = now.toLocaleString('en-US', { weekday: 'long' });
  const currentTime = now.toTimeString().substring(0, 5);
  
  const daySchedule = this.availability.schedule.find(
    s => s.day.toLowerCase() === currentDay.toLowerCase()
  );
  
  if (!daySchedule || !daySchedule.available) return false;
  
  return daySchedule.timeSlots.some(slot => 
    currentTime >= slot.start && currentTime <= slot.end
  );
};

// Transform for output
menuItemSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    delete ret.id;
    return ret;
  }
});

module.exports = mongoose.model('MenuItem', menuItemSchema);