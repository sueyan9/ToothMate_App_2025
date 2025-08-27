const mongoose = require("mongoose"),
  Pdf = require("./PdfModel.js"),
  PdfSchema = mongoose.model("Pdf").schema,
  Img = require("./ImgModel.js"),
  ImgSchema = mongoose.model("Img").schema;
const NZ_TZ = 'Pacific/Auckland';
// setting default treatment time
const DEFAULT_DURATION_BY_PURPOSE = {
  'Check-up': 30,
  'Cleaning': 60,
  'Root canal': 90,
  'Crown': 60,
  'Other': 30,
};
const appointmentSchema = new mongoose.Schema({
  nhi: {
    type: String,
    required: true,
    uppercase: true,
    index: true,
    set: v => (v ? v.toUpperCase() : v),
    trim: true,
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

  // independent no the other collection
  dentist: {
    name: {
      type: String,
      enum: ['Dr. Toothmate', 'Dr. Williams', 'Dr. Chen', 'Dr. Patel', 'Dr. Singh'],
      required: true,
    },
  },
  clinic: { type: mongoose.Schema.Types.ObjectId, ref: 'Clinic', required: true },
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
      treatments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Treatment' }],

      startAt: { type: Date, required: true, index: true },
      endAt: { type: Date },
      timezone: { type: String, default: NZ_TZ },
    },
    { timestamps: true }
);

// auto fill endAt；
appointmentSchema.pre('validate', function (next) {
  if (this.startAt && !this.endAt) {
    const minutes = DEFAULT_DURATION_BY_PURPOSE[this.purpose] ?? 30;
    this.endAt = new Date(new Date(this.startAt).getTime() + minutes * 60 * 1000);
  }
  next();
});

// check
appointmentSchema.path('endAt').validate(function (v) {
  if (!this.startAt || !v) return true;
  return this.startAt < v;
}, 'endAt must be after startAt');

// general check
appointmentSchema.index({ nhi: 1, startAt: -1 });
appointmentSchema.index({ status: 1, startAt: -1 });

mongoose.model("Appointment", appointmentSchema);
