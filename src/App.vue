<script setup lang="ts">
import VideoPlayer from './components/VideoPlayer.vue'
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
</template>

<script lang="ts">

function onPlayerPlay({ event, player }) {
    console.log(event.type);
    player.setPlaying(true);
}

function onPlayerPause({ event, player }) {
    console.log(event.type);
    player.setPlaying(false);
}

function onPlayerEnded({ event, player }) {
    console.log(event.type);
    player.setPlaying(false);
}

function onPlayerLoadeddata({ event }) {
    console.log(event.type);
}

function onPlayerWaiting({ event }) {
    console.log(event.type);
}

function onPlayerPlaying({ event }) {
    console.log(event.type);
}

function onPlayerTimeupdate({ event }) {
    console.log({ event: event.type, time: event.target.currentTime });
}

function onPlayerCanplay({ event }) {
    console.log(event.type);
}

function onPlayerCanplaythrough({ event }) {
    console.log(event.type);
}

function playerStateChanged({ event }) {
    console.log(event.type);
}

</script>
