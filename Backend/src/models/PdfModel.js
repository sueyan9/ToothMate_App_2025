var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PdfSchema = new Schema({
    pdf: {
        data: Buffer,
        contentType: String
    }}, {
    timestamps: true
});

module.exports = mongoose.model('Pdf', PdfSchema);
