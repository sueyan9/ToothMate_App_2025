const mongoose = require("mongoose"),
  Pdf = require("./PdfModel.js"),
  PdfSchema = mongoose.model("Pdf").schema,
  Img = require("./ImgModel.js"),
  ImgSchema = mongoose.model("Img").schema;
const NZ_TZ = 'Pacific/Auckland';

const appointmentSchema = mongoose.Schema({
  nhi: {
    type: String,
    required: true,
    uppercase: true,
    index: true,
    set: v => (v ? v.toUpperCase() : v),
    trim: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // 内嵌，无独立 collection
  dentist: {
    name: {
      type: String,
      enum: ['Dr. Toothmate', 'Dr. Williams', 'Dr. Chen', 'Dr. Patel', 'Dr. Singh'],
      required: true,
    },
  },
  clinic: {
    name: String,
    location: String,
    phone: String,
  },

  purpose: {
    type: String,
    enum: ['Check-up', 'Cleaning', 'Root canal', 'Crown', 'Other'],
    required: true,
  },
  pdfs: [PdfSchema],
  images: [ImgSchema],
      notes: String,
      status: {
        type: String,
        enum: ['scheduled', 'completed', 'cancelled', 'no_show'],
        default: 'scheduled',
        index: true,
      },
      treatments: [{ name: String }],

      startAt: { type: Date, required: true, index: true },
      endAt: { type: Date, required: true },
      timezone: { type: String, default: NZ_TZ },
    },
    { timestamps: true }
);

appointmentSchema.path('endAt').validate(function (v) {
  return this.startAt && v && this.startAt < v;
}, 'endAt must be after startAt');

appointmentSchema.index({ nhi: 1, startAt: -1 });


mongoose.model("Appointment", appointmentSchema);
