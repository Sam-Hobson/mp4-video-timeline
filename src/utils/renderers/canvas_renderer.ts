export class CanvasRenderer {
    #canvas: OffscreenCanvas;
    #ctx: OffscreenCanvasRenderingContext2D;

    constructor(canvas: OffscreenCanvas) {
        this.#canvas = canvas;
        this.#ctx = canvas.getContext("2d")!;
    }

    render(frame: VideoFrame) {
        this.#canvas.width = frame.displayWidth;
        this.#canvas.height = frame.displayHeight;
        this.#ctx.drawImage(frame, 0, 0, frame.displayWidth, frame.displayHeight);
        frame.close();
    }
}

