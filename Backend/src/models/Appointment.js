const mongoose = require("mongoose"),
  Pdf = require("./PdfModel.js"),
  PdfSchema = mongoose.model("Pdf").schema,
  Img = require("./ImgModel.js"),
  ImgSchema = mongoose.model("Img").schema;

const appointmentSchema = mongoose.Schema({
  nhi: {
    type: String,
    required: true,
  },
  treatments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Treatment" }],
  date: {
    type: Date,
    required: true,
  },
  dentalData: {
    type: Array,
  },
  pdfs: [PdfSchema],
  images: [ImgSchema],
  notes: {
    type: String,
  },
});

appointmentSchema.index({ nhi: 1, date: -1 });
appointmentSchema.index({ treatments: 1 });

mongoose.model("Appointment", appointmentSchema);
