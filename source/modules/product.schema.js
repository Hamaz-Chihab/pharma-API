"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductModel = void 0;
var mongoose_1 = require("mongoose");
var slugify_1 = require("slugify");
var mongoose_2 = require("mongoose");
var brandValidator = {
    validator: function (value) {
        // Custom validation logic: Allow only letters and spaces
        return /^[A-Za-z\s]+$/.test(value);
    },
    message: "Brand should contain only characters and spaces",
};
// Define the Promotion schema
var PromotionSchema = new mongoose_1.Schema({
    type: { type: String, required: true },
    value: { type: mongoose_1.Schema.Types.Mixed, required: true }, // Allow for numbers or descriptive text
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
});
// Define the Product schema
var productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        maxlength: [40, "the max length is 40"],
    },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    stockQuantity: { type: Number, required: true, min: 0 },
    imageCover: {
        type: String,
        required: [true, "a product must have an image cover"],
        validate: function (val) { return val.startsWith("http"); },
    },
    createdAt: { type: Date, default: Date.now() },
    expiryDate: {
        type: Date,
        required: true,
        validate: {
            validator: function (value) {
                // Custom validation logic: Check if expiryDate is in the future
                return value >= new Date();
            },
            message: "Expiry date must be in the future",
        },
    },
    category: { type: String },
    brand: {
        type: String,
        required: true,
        trim: true,
        validate: brandValidator,
    }, //trim is to delete the space in the beginning
    activeIngredients: [{ type: String, required: true }],
    dosage: String,
    promotions: [PromotionSchema],
}, {
    versionKey: false, // This line disables the __v field
    toJSON: { virtuals: true }, //to make the virtual properties apeare in the json format sorted from the dataBase
    toObject: { virtuals: true },
});
//query middleware with the hock of find : to manipulate the q
// productSchema.pre("find", function (next) {
//   this.find({ expiryDate: { $gte: new Date(2024, 0, 1) } });
//   next();
// });
//virtual Propertie middleware : for the calculated data to show them in the response
productSchema
    .virtual("discountedPrice")
    .get(function calculateDiscountedPrice(next) {
    var discountedPrice = this.price;
    if (this.promotions && this.promotions.length > 0) {
        var promotion = this.promotions[0];
        if (promotion.type === "discount") {
            // Calculate the discounted price
            var discount = promotion.value;
            return discountedPrice * (1 - discount / 100);
        }
    }
});
//document middleware :it runs befor .save() and .create()
productSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log("this is the slugify middleware👋");
            this.brand = (0, slugify_1.default)(this.brand).toUpperCase();
            // Perform any actions before saving the document
            // For example, you could normalize images URLs or create unique slugs based on the name
            next();
            return [2 /*return*/];
        });
    });
});
productSchema.post("save", function (doc, next) {
    console.log(doc);
    next();
});
// Export the ProductModel
exports.ProductModel = mongoose_2.default.model("Product", productSchema);
