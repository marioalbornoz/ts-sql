"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateIdentifier = void 0;
const generateIdentifier = (name) => {
    return `${name}-${Math.random().toString(36).substr(2, 9)}`;
};
exports.generateIdentifier = generateIdentifier;
//# sourceMappingURL=generateID.js.map