<script setup lang="ts">
import FileUpload from './components/FileUpload.vue'
import { CanvasRenderer } from './utils/renderers/CanvasRenderer';
</script>

<template>
    <FileUpload @fileLoaded="onFileUploaded" />
</template>

<script lang="ts">
    const renderer = new CanvasRenderer();

    function onFileUploaded(ab: ArrayBuffer) {
    }
</script>
