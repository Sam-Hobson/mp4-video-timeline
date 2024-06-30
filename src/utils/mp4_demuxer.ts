import { DataStream, createFile, type MP4ArrayBuffer, type MP4File, type MP4Info, type MP4VideoTrack, type Sample } from "mp4box";

class Mp4FileSink implements UnderlyingSink {
    #file: MP4File
    #offset: number = 0

    constructor(f: MP4File) {
        this.#file = f;
    }

    write(chunk: Uint8Array) {
        // MP4Box requires buffers to be ArrayBuffers
        const buffer: MP4ArrayBuffer = { ...new ArrayBuffer(chunk.byteLength), fileStart: this.#offset };
        new Uint8Array(buffer).set(chunk);

        // Inform MP4Box where in the file this chunk is from.
        this.#offset += buffer.byteLength;

        // Append chunk.
        // TODO: Set the status here
        // this._setStatus("fetch", (this.m_offset / (1024 ** 2)).toFixed(1) + " MiB");
        //
        this.#file.appendBuffer(buffer);
    }

    close() {
        // this._setStatus("fetch", "Done");
        this.#file.flush();
    }
}


function description(track: MP4VideoTrack, file: MP4File) {
    // Get the appropriate `description` for a specific track. Assumes that the
    // track is H.264, H.265, VP8, VP9, or AV1.
    const trak = file.getTrackById(track.id);

    for (const entry of trak.mdia.minf.stbl.stsd.entries) {
        const box = entry.avcC || entry.hvcC || entry.vpcC || entry.av1C;

        if (box) {
            const stream = new DataStream(undefined, 0, DataStream.BIG_ENDIAN);
            box.write(stream);
            // Remove the box header.
            return new Uint8Array(stream.buffer, 8);
        }
    }

    throw new Error("avcC, hvcC, vpcC, or av1C box not found");
}


export class Mp4Demuxer {
    #file: MP4File | null = null;
    #onConfig: (config: VideoDecoderConfig) => void;
    #onChunk: (chunk: EncodedVideoChunk) => void;

    constructor(
        onConfig: (config: VideoDecoderConfig) => void,
        onChunk: (chunk: EncodedVideoChunk) => void
    ) {
        this.#onConfig = onConfig;
        this.#onChunk = onChunk;
    }

    writeFrom(stream: ReadableStream) {
        // Callbacks from  the MP4File will callback onConfig & onChunk which can then
        // allow data to be passed to a decoder.
        this.#file = this.#bindFile(createFile())
        const sink = new Mp4FileSink(this.#file);
        stream.pipeTo(new WritableStream(sink, { highWaterMark: 2 }))
    }

    #bindFile(file: MP4File): MP4File {
        file.onReady = this.#onReady.bind(this);
        file.onSamples = this.#onSamples.bind(this);
        return file;
    }

    #onReady(info: MP4Info): void {
        // TODO: This
        // this._setStatus("demux", "Ready");

        const track = info.videoTracks[0];

        // Generate and emit an appropriate VideoDecoderConfig.
        this.#onConfig({
            // Browser doesn't support parsing full vp8 codec (eg: `vp08.00.41.08`),
            // they only support `vp8`.
            codec: track.codec.startsWith('vp08') ? 'vp8' : track.codec,
            codedHeight: track.video.height,
            codedWidth: track.video.width,
            description: description(track, this.#file!),
        });

        // Start demuxing.
        this.#file!.setExtractionOptions(track.id);
        this.#file!.start();
    }

    #onSamples(id: number, user: any, samples: Sample[]): void {
        // Generate and emit an EncodedVideoChunk for each demuxed sample.
        const self = this;

        samples.forEach(sample => {
            self.#onChunk(new EncodedVideoChunk({
                type: sample.is_sync ? "key" : "delta",
                timestamp: 1e6 * sample.cts / sample.timescale,
                duration: 1e6 * sample.duration / sample.timescale,
                data: sample.data
            }));
        })
    }

}
