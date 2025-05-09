const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  day: {
    type: String,
    enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
    required: true
  },
  start: {
    type: String,
    required: true
  },
  end: {
    type: String,
    required: true
  },
  isAvailable: {
    type: Boolean,
    default: true
  }
});

const doctorSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    specialization: {
      type: String,
      required: true,
    },
    qualifications: {
      type: String,
      required: true,
    },
    yearsOfExperience: {
      type: Number,
      required: true,
    },
    avatar: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    availability: [availabilitySchema],
    isActive: {
      type: Boolean,
      default: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for doctor's full name
doctorSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

const Doctor = mongoose.model('Doctor', doctorSchema);

module.exports = Doctor; 