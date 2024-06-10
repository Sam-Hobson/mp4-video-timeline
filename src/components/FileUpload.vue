<template>
    <div>
        <input type="file" @change="handleFileUpload" />
    </div>
</template>


<script lang="ts">
export default {
    name: "FileUpload",

    data() { },

    methods: {
        handleFileUpload(event: any) {
            const file: Blob = event.target.files[0];

            if (!file) {
                console.log("[Error] Uploaded file unavailable.");
                return;
            }

            const reader = new FileReader();

            reader.onload = () => {
                this.$emit("fileLoaded", reader.result);
            };

            reader.readAsArrayBuffer(file);
        },
    }

};
</script>
