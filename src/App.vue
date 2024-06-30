<script setup lang="ts">
import FileUpload from './components/FileUpload.vue'
</script>

<template>
    <FileUpload @fileLoaded="onFileUploaded" />
    <canvas></canvas>
</template>

<script lang="ts">
function onFileUploaded(ab: ArrayBuffer) {
    debugger;
    const canvas = document.querySelector("canvas").transferControlToOffscreen();
    const worker = new Worker("@/workers/video_processor.ts");
    worker.postMessage({ "video": ab, rendererSelection: "2d", canvas: canvas }, [canvas]);
}
</script>
