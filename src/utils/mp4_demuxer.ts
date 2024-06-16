import type { MP4ArrayBuffer, MP4File } from "mp4box";

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
