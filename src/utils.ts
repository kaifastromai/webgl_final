function resize_canvas(canvas: HTMLCanvasElement) {
    var cssToRealPixels = 1;
    var displayWidth = Math.floor(canvas.clientWidth * cssToRealPixels);
    var displayHeight = Math.floor(canvas.clientHeight * cssToRealPixels);
    if (canvas.width != displayWidth ||
        canvas.height != displayHeight) {

        canvas.width = displayWidth;
        canvas.height = displayHeight;

    }
}
export { resize_canvas };