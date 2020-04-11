"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function resize_canvas(canvas) {
    var cssToRealPixels = 1;
    var displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
    var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);
    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
    }
}
exports.resize_canvas = resize_canvas;
//# sourceMappingURL=utils.js.map