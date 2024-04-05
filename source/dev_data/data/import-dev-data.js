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
var dotenv = require("dotenv");
dotenv.config();
var config_1 = require("../../config");
var mongoose_1 = require("mongoose");
var fs = require("fs/promises");
var product_schema_1 = require("../../modules/product.schema");
// Access the database URL from the nested secrets object
var DB = config_1.default.secrets.dbUrl;
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var products, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 8, 9, 11]);
                    // Connect to MongoDB
                    return [4 /*yield*/, mongoose_1.default.connect(DB)];
                case 1:
                    // Connect to MongoDB
                    _a.sent();
                    console.log("MongoDB connected");
                    return [4 /*yield*/, readProductsFile()];
                case 2:
                    products = _a.sent();
                    if (!(process.argv[2] === "--import")) return [3 /*break*/, 4];
                    return [4 /*yield*/, importData(products)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 4:
                    if (!(process.argv[2] === "--delete")) return [3 /*break*/, 6];
                    return [4 /*yield*/, deleteData()];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    console.error("Invalid command. Please use either '--import' or '--delete'.");
                    process.exit(1); // Exit with an error code
                    _a.label = 7;
                case 7: return [3 /*break*/, 11];
                case 8:
                    err_1 = _a.sent();
                    console.error(err_1);
                    process.exit(1); // Exit with an error code
                    return [3 /*break*/, 11];
                case 9: 
                // Close the MongoDB connection (if needed)
                return [4 /*yield*/, mongoose_1.default.disconnect()];
                case 10:
                    // Close the MongoDB connection (if needed)
                    _a.sent();
                    return [7 /*endfinally*/];
                case 11: return [2 /*return*/];
            }
        });
    });
}
main(); // Start the script
// Read products from JSON file
function readProductsFile() {
    return __awaiter(this, void 0, void 0, function () {
        var path, filePath, data, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    path = require("path");
                    filePath = path.join(process.cwd(), // Or any base path
                    "source", "dev_data", "data", "products.json");
                    return [4 /*yield*/, fs.readFile(filePath, "utf-8")];
                case 1:
                    data = _a.sent();
                    return [2 /*return*/, JSON.parse(data)];
                case 2:
                    err_2 = _a.sent();
                    console.error("Error reading products file:", err_2);
                    return [2 /*return*/, undefined]; // Indicate error by returning undefined
                case 3: return [2 /*return*/];
            }
        });
    });
}
// Import data function
function importData(products) {
    return __awaiter(this, void 0, void 0, function () {
        var err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!products || !products.length) {
                        console.error("No products found to import. Skipping.");
                        return [2 /*return*/];
                    }
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, product_schema_1.ProductModel.create(products)];
                case 2:
                    _a.sent();
                    console.log("Data successfully loaded");
                    return [3 /*break*/, 4];
                case 3:
                    err_3 = _a.sent();
                    console.error("Error importing data:", err_3);
                    process.exit(1); // Exit with an error code
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
// Delete data function
function deleteData() {
    return __awaiter(this, void 0, void 0, function () {
        var err_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, product_schema_1.ProductModel.deleteMany()];
                case 1:
                    _a.sent();
                    console.log("Data successfully deleted");
                    return [3 /*break*/, 3];
                case 2:
                    err_4 = _a.sent();
                    console.error("Error deleting data:", err_4);
                    process.exit(1); // Exit with an error code
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
