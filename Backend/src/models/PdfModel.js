var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var PdfSchema = new Schema({
    pdf: {
        data: Buffer,
        contentType: String
    },
    name: { type: String, trim: true },
    category: {
        type: String,
        enum: ['invoice', 'referral', 'acc', 'report', 'other'],
        default: 'other',
        index: true
    },
    }, {
    timestamps: true
});

//auto classify these pdf files
PdfSchema.pre('save', function (next) {
    if (!this.category || this.category === 'other') {
        const hint = (this.name || '').toLowerCase();
        if (hint.includes('acc')) {
            this.category = 'acc';
        } else if (hint.includes('invoice')) {
            this.category = 'invoice';
        } else if (hint.includes('referral')) {
            this.category = 'referral';
        }
    }
    next();
});
module.exports = mongoose.model('Pdf', PdfSchema);
