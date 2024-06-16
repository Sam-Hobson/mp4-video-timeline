import { DataStream, createFile, type MP4ArrayBuffer, type MP4File, type MP4Info, type MP4VideoTrack, type Sample } from "mp4box";

class Mp4FileSink implements UnderlyingSink {
    _file: MP4File
    _offset: number = 0

    constructor(f: MP4File) {
        this._file = f;
    }

    write(chunk: Uint8Array) {
        // MP4Box requires buffers to be ArrayBuffers
        const buffer: MP4ArrayBuffer = { ...new ArrayBuffer(chunk.byteLength), fileStart: this._offset };
        new Uint8Array(buffer).set(chunk);

        // Inform MP4Box where in the file this chunk is from.
        this._offset += buffer.byteLength;

        // Append chunk.
        // TODO: Set the status here
        // this._setStatus("fetch", (this.m_offset / (1024 ** 2)).toFixed(1) + " MiB");
        this._file.appendBuffer(buffer);
    }

    close() {
        // this._setStatus("fetch", "Done");
        this._file.flush();
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

function onReady(info: MP4Info, file: MP4File, onConfig: (config: VideoDecoderConfig) => void): void {
    // TODO: This
    // this._setStatus("demux", "Ready");

    const track = info.videoTracks[0];

    // Generate and emit an appropriate VideoDecoderConfig.
    onConfig({
        // Browser doesn't support parsing full vp8 codec (eg: `vp08.00.41.08`),
        // they only support `vp8`.
        codec: track.codec.startsWith('vp08') ? 'vp8' : track.codec,
        codedHeight: track.video.height,
        codedWidth: track.video.width,
        description: description(track, file),
    });

    // Start demuxing.
    file.setExtractionOptions(track.id);
    file.start();
}

function onSamples(samples: Sample[], onChunk: (chunk: EncodedVideoChunk) => void): void {
    // Generate and emit an EncodedVideoChunk for each demuxed sample.
    for (const sample of samples) {
        onChunk(new EncodedVideoChunk({
            type: sample.is_sync ? "key" : "delta",
            timestamp: 1e6 * sample.cts / sample.timescale,
            duration: 1e6 * sample.duration / sample.timescale,
            data: sample.data
        }));
    }
}


export function mp4Demux(
    stream: ReadableStream,
    onConfig: (config: VideoDecoderConfig) => void,
    onChunk: (chunk: EncodedVideoChunk) => void,
) {
    // Configure an MP4Box File for demuxing.
    const file = createFile();

    // TODO: Set
    // file.onError = error => setStatus("demux", error);
    file.onReady = info => onReady(info, file, onConfig);
    file.onSamples = (_1, _2, samples) => onSamples(samples, onChunk);

    const sink = new Mp4FileSink(file);
    stream.pipeTo(new WritableStream(sink, { highWaterMark: 2 }))
}
