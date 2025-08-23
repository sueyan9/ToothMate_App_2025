const mongoose = require("mongoose");

const treatmentSchema = mongoose.Schema({
    toothId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tooth",
        required: true,
    },
    userNhi: {
        type: String,
        required: true,
    },
    tooth_number: {
        type: Number,   // e.g., 33, 32
        required: true,
    },
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Appointment", // Optional for planned/in-progress; often present for completed
    },
    plannedFor: { type: Date },   // Planned date (for future treatments)
    treatmentDate: { type: Date },// Actual completion date (required when status is "completed")
    doctor: {
        type: String,
        required: true,
    },
    treatmentType: {
        type: String,
        required: true,
    },
    treatmentDetails: { type: String },
    status: {
        type: String,
        enum: ["planned", "in-progress", "completed"],
        default: "planned",
    },
});

// Common query indexes
treatmentSchema.index({ userNhi: 1, status: 1, plannedFor: 1 });     // Future plans
treatmentSchema.index({ userNhi: 1, status: 1, treatmentDate: -1 });  // Completed history
treatmentSchema.index({ userNhi: 1, tooth_number: 1 });               // Per-tooth lookup

// Constraints and synchronization checks
treatmentSchema.pre("validate", async function (next) {
    try {
        const Tooth = mongoose.model("Tooth");
        const tooth = await Tooth.findById(this.toothId)
            .select("userNhi tooth_number")
            .lean();

        if (!tooth) return next(new Error("Invalid toothId"));
        if (tooth.userNhi !== this.userNhi) {
            return next(new Error("toothId does not belong to userNhi"));
        }

        // Enforce tooth_number consistency with Tooth; propagate from Tooth
        if (
            this.tooth_number != null &&
            this.tooth_number !== tooth.tooth_number
        ) {
            return next(new Error("tooth_number mismatch with Tooth"));
        }
        this.tooth_number = tooth.tooth_number;

        // Business rules by status
        if (this.status === "completed") {
            if (!this.treatmentDate) {
                return next(new Error("completed treatment requires treatmentDate"));
            }
        } else {
            // For planned or in-progress: require at least one of appointmentId or plannedFor
            if (!this.appointmentId && !this.plannedFor) {
                return next(
                    new Error("planned/in-progress requires appointmentId or plannedFor")
                );
            }
        }

        return next();
    } catch (err) {
        return next(err);
    }
});

// Convenience virtual
treatmentSchema.virtual("hasAppointment").get(function () {
    return Boolean(this.appointmentId);
});

mongoose.model("Treatment", treatmentSchema);