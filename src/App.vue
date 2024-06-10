<script setup lang="ts">
import VideoPlayer from './components/VideoPlayer.vue'
import FileUpload from './components/FileUpload.vue'
import Rick from './assets/Rick.mp4'
</script>

<template>
    <videoPlayer :src="Rick" @play="onPlayerPlay" @pause="onPlayerPause" @ended="onPlayerEnded"
        @loadeddata="onPlayerLoadeddata" @waiting="onPlayerWaiting" @playing="onPlayerPlaying"
        @timeupdate="onPlayerTimeupdate" @canplay="onPlayerCanplay" @canplaythrough="onPlayerCanplaythrough"
        @statechanged="playerStateChanged">
        <template v-slot:controls="{ togglePlay, toggleMute, playing, videoMuted }">
            <div class="videoplayer-controls">
                <button @click="togglePlay()">{{ playing ? "pause" : "play" }}</button>
                <button @click="toggleMute()">{{ videoMuted ? "unmute" : "mute" }}</button>
            </div>
        </template>
    </videoplayer>


    <FileUpload />
</template>

<script lang="ts">

let vueDev = document.createElement('script');
vueDev.setAttribute('src', 'http://localhost:8098');
document.head.appendChild(vueDev);

function onPlayerPlay({ event, player }: any) {
    console.log(event.type);
    player.setPlaying(true);
}

function onPlayerPause({ event, player }: any) {
    console.log(event.type);
    player.setPlaying(false);
}

function onPlayerEnded({ event, player }: any) {
    console.log(event.type);
    player.setPlaying(false);
}

function onPlayerLoadeddata({ event }: any) {
    console.log(event.type);
}

function onPlayerWaiting({ event }: any) {
    console.log(event.type);
}

function onPlayerPlaying({ event }: any) {
    console.log(event.type);
}

function onPlayerTimeupdate({ event }: any) {
    console.log({ event: event.type, time: event.target.currentTime });
}

function onPlayerCanplay({ event }: any) {
    console.log(event.type);
}

function onPlayerCanplaythrough({ event }: any) {
    console.log(event.type);
}

function playerStateChanged({ event }: any) {
    console.log(event.type);
}

</script>
