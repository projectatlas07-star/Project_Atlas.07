"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tailwind_config_1 = __importDefault(require("@project-atlas/ui/tailwind.config"));
const config = {
    ...tailwind_config_1.default,
    content: [
        './src/**/*.{js,ts,jsx,tsx}',
        '../../packages/ui/src/**/*.tsx',
    ],
};
exports.default = config;
