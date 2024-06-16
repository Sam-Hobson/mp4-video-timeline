<script setup lang="ts">
import FileUpload from './components/FileUpload.vue'
</script>

<template>
    <FileUpload @fileLoaded="onFileUploaded" />
</template>

<script lang="ts">
    function onFileUploaded(ab: ArrayBuffer) {
    }
</script>
