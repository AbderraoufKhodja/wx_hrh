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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = require("./db");
const dotenv_1 = __importDefault(require("dotenv"));
const handlePublishArticles_1 = require("./handlePublishArticles");
dotenv_1.default.config();
const logger = (0, morgan_1.default)("tiny");
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use((0, cors_1.default)());
app.use(logger);
app.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.sendFile(path_1.default.join(__dirname, "index.html"));
}));
app.post("/api/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { action } = req.body;
    if (action === "inc") {
        yield db_1.Counter.create();
    }
    else if (action === "clear") {
        yield db_1.Counter.destroy({
            truncate: true,
        });
    }
    res.send({
        code: 0,
        data: yield db_1.Counter.count(),
    });
}));
app.post("/api/publishArticles", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { action } = req.body;
    try {
        yield (0, handlePublishArticles_1.handlePublishArticles)();
        res.send({
            code: 0,
            data: "Published",
        });
    }
    catch (e) {
        console.error(e);
        res.send({
            code: 1,
            data: e,
        });
    }
}));
app.get("/api/count", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield db_1.Counter.count();
    res.send({
        code: 0,
        data: result,
    });
}));
app.get("/api/wx_openid", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.headers["x-wx-source"]) {
        res.send(req.headers["x-wx-openid"]);
    }
}));
const port = process.env.PORT || 80;
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        // await initDB();
        app.listen(port, () => {
            console.log("Server started on port", port);
        });
    });
}
bootstrap();
