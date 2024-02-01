<template>
    <div class="grid grid-cols-3 text-slate-500 font-semibold animate-fadeIn">
        <router-link to="/" class="flex justify-center items-center pb-[20px]">
            <font-awesome-icon icon="fa-solid fa-ranking-star" class="text-2xl" />
        </router-link>

        <router-link to="/lobbies" class="flex justify-center items-center pb-[20px]">
            <font-awesome-icon icon="fa-solid fa-table-tennis-paddle-ball" class="text-2xl" />
        </router-link>
        <router-link to="/profile" class="flex justify-center items-center pb-[20px]">
            <font-awesome-icon icon="fa-solid fa-user" class="text-2xl" />
        </router-link>
    </div>
</template>
<style>
.router-link-active {
    color: #ef6c00;
    opacity: 0.8;
}
</style>
<script script lang="ts"></script>
