const mongoose = require('mongoose');
const slugify = require('slugify');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "A tour must have a name"],
        unique: true,
        trim: true,
        maxLength: [40, 'A tour name cannot be longer than 40 characters'],
        minLength: [15, 'A tour name cannot be less than 15 characters']
    },
    slug: String,
    duration: {
        type: Number,
        required: [true, "A tour must have a durations"],
    },
    maxGroupSize: {
        type: Number,
        required: [true, "A tour must have a group size"]
    },
    difficulty: {
        type: String,
        required: [true, "A tour must have a difficulty"],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficluty is either: easy, medium or difficult'
        } 
    },
    ratingsAverage: {
        type: Number,
        default: 4.5,
        minLength: [1, 'A tour must have a rating more than 1'],
        maxLength: [5, 'A tour must have a rating less than 5']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        required: [true, "A tour must have a price"]
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: val => {
                return val < this.price;
            },
            message: 'Discount must have less than price'
        } 
    },
    summary: {
        type: String,
        trim: true,
        required: [true, "A tour must have a summary"]
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, "A tour must have a cover i mage"]
    },
    images: [String],
    createdAt: {
        type: Date,
        default: Date.now(),
        select: false
    },
    startDates: [Date],
    secretTour: {
        type: Boolean,
        default: false
    },
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    guides: [
        {
            type: mongoose.Schema.ObjectId,
            ref: 'User'
        }
    ]
}, {
    toJSON: {virtuals: true},
    toObject: {virtuals: true}
});

tourSchema.virtual('durationWeeks').get(function() {
    return this.duration / 7;
});

tourSchema.virtual('reviews', {
    ref: 'Review',
    localField: '_id',
    foreignField: 'tour'
});

tourSchema.pre('save', function(next) {
    this.slug = slugify(this.name, {lower: true});
    next();
});

// tourSchema.pre('save', async function(next) {
//     const guides = this.guides.map(async id => await User.findById(id));
//     await Promise.all(guides);
//     next();
// });

tourSchema.pre(/^find/, function(next) {
    this.find({$secretTour: {$ne: true}});

    this.start = Date.now();
    next();
});

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guieds',
        select: '-__v -passwordChangedAt'
    });
    next();
});

tourSchema.pre('aggergate', function(next) {
    this.pipeline().unshift({$match: {$secretTour: {$ne: true}}});

    console.log(this.pipeline(0));
    next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;