"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildFastify = void 0;
const fastify_1 = __importDefault(require("fastify"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const auth_1 = require("./middleware/auth");
const role_1 = require("./middleware/role");
const routes_1 = require("./routes");
const buildFastify = () => {
    const server = (0, fastify_1.default)({ logger: true });
    // Register plugins
    server.register((0, fastify_plugin_1.default)(auth_1.authMiddleware));
    server.register((0, fastify_plugin_1.default)(role_1.roleMiddleware));
    // Register all API routes under /api/v1
    server.register(routes_1.registerRoutes, { prefix: '/api/v1' });
    // Health check
    server.get('/health', async (request, reply) => {
        return { status: 'ok' };
    });
    return server;
};
exports.buildFastify = buildFastify;
if (require.main === module) {
    const server = (0, exports.buildFastify)();
    const start = async () => {
        try {
            await server.listen({ port: Number(process.env.PORT) || 3000, host: '0.0.0.0' });
            server.log.info(`Server listening on ${server.server.address()?.toString()}`);
        }
        catch (err) {
            server.log.error(err);
            process.exit(1);
        }
    };
    start();
}
