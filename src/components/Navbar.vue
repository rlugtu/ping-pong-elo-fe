<template>
    <div class="grid grid-cols-4 text-slate-300 font-semibold animate-fadeIn">
        <router-link
            to="/"
            class="flex justify-center items-center border-r border-gray-400 pb-[20px]"
            >Feed</router-link
        >
        <router-link
            to="/player/search"
            class="flex justify-center items-center pb-[20px] border-r border-gray-400"
            >Players</router-link
        >
        <router-link to="/lobbies" class="flex justify-center items-center pb-[20px]"
            >Play</router-link
        >
        <router-link
            to="/profile"
            class="flex justify-center items-center border-l border-gray-400 pb-[20px]"
            >Profile</router-link
        >
    </div>
</template>
<script script lang="ts"></script>
