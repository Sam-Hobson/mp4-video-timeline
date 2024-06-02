<template>
    <div>
        <video :src="src" :muted="muted" :autoplay="autoplay" :controls="controls" :loop="loop" :width="width"
            :height="height" :poster="poster" :preload="preload" :playsinline="true" ref="player" />
        <slot name="controls" *:play="play" :pause="pause" :playing="playing" :toggle-play="togglePlay"
            :video-muted="videoMuted" :toggle-mute="toggleMute" *></slot>
    </div>
</template>
<script lang="ts">

const EVENTS = [
    "play",
    "pause",
    "ended",
    "loadeddata",
    "waiting",
    "playing",
    "timeupdate",
    "canplay",
    "canplaythrough",
    "statechanged",
];

export default {

    name: "VideoPlayer",

    props: {
        src: { type: String, required: true },
        controls: { type: Boolean, required: false, default: false },
        loop: { type: Boolean, required: false, default: false },
        width: { type: Number, required: false, default: 500 },
        height: { type: Number, required: false, default: 281 },
        autoplay: { type: Boolean, required: false, default: false },
        muted: { type: Boolean, required: false, default: false },
        poster: { type: String, required: false },
        preload: { type: String, required: false, default: "auto" },
    },

    data() {
        return {
            playing: false,
            videoMuted: false,
        }
    },

    mounted() {
        EVENTS.forEach(this.bindVideoEvent);
    },

    methods: {
        bindVideoEvent(eventName: string) {
            this.player.addEventListener(
                eventName,
                e => { this.$emit(eventName, {event: e, player: this}) }
            );
        },

        play() {
            this.player.play();
            this.setPlaying(true);
        },

        pause() {
            this.player.pause();
            this.setPlaying(false);
        },

        togglePlay() {
            if (this.playing) {
                this.pause();
            } else {
                this.play();
            }
        },

        setPlaying(state: boolean) {
            this.playing = state;
        },

        mute() {
            this.player.muted = true;
            this.setMuted(true);
        },

        unmute() {
            this.player.muted = false;
            this.setMuted(false);
        },

        toggleMute() {
            if (this.videoMuted) {
                this.unmute();
            } else {
                this.mute();
            }
        },

        setMuted(state: boolean) {
            this.videoMuted = state;
        }
    },

    computed: {
        player(): HTMLVideoElement {
            return this.$refs.player as HTMLVideoElement
        }
    },

}


</script>
