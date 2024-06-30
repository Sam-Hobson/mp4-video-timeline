import { Mp4Demuxer } from "@/utils/mp4_demuxer";
import { CanvasRenderer } from "@/utils/renderers/canvas_renderer";

let pendingFrame: VideoFrame | null = null;

function renderFrame(renderer: any, frame: VideoFrame) {
    if (pendingFrame) {
        pendingFrame.close();
    } else {
        requestAnimationFrame(() => {
            renderer.render(pendingFrame);
            pendingFrame = null;
        });
    }

    pendingFrame = frame;
}

type VideoProcessingOptions = {
    video: ArrayBuffer,
    rendererSelection: string,
    canvas: OffscreenCanvas
}

const renderers = {
    "2d": (canvas: OffscreenCanvas) => new CanvasRenderer(canvas),
} as any

function start({
    video,
    rendererSelection,
    canvas
}: VideoProcessingOptions) {
    const renderer = renderers[rendererSelection](canvas);

    const decoder = new VideoDecoder({
        output(frame: VideoFrame) {
            renderFrame(renderer, frame);
        },
        error(e: DOMException) {
            console.log(e);
        }
    });

    const demuxer = new Mp4Demuxer(decoder.configure, decoder.decode);

    demuxer.fromStream(new ReadableStream({
        start(controller) {
            controller.enqueue(video);
            controller.close();
        },
    }));
}

this.addEventListener("message", (m: any) => start(m.data), { once: true });
