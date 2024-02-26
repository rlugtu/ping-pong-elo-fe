<template>
    <div class="px-4 py-5">
        <div class="grid grid-cols-3 py-3.5 rounded-lg bg-[#212121]">
            <router-link to="/" class="flex justify-center items-center">
                <font-awesome-icon icon="fa-solid fa-ranking-star" class="text-2xl" />
            </router-link>
            <router-link to="/lobbies" class="flex justify-center items-center">
                <font-awesome-icon icon="fa-solid fa-table-tennis-paddle-ball" class="text-2xl" />
            </router-link>
            <router-link to="/profile" class="flex justify-center items-center">
                <font-awesome-icon icon="fa-solid fa-user" class="text-2xl" />
            </router-link>
        </div>
    </div>
</template>
<style>
.router-link-active {
    color: #FF7C4D;
    opacity: 0.8;
}
</style>
<script script lang="ts"></script>
