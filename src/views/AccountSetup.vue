<template>
    <div class="flex flex-col justify-center items-center p-2">
        <h1 class="text-3xl font-semibold text-blue-500">Account Setup</h1>
        <form
            @submit.prevent
            @submit="createUser(userInfo)"
            class="mt-8 grid gap-6 rounded-lg w-[80%] text-slate-600"
        >
            <div class="flex flex-col border-b border-b-slate-400">
                <label for="firstName" class="text-slate-400 text-lg">First Name</label>
                <input
                    class="bg-transparent placeholder-slate-700 py-2 outline-none text-slate-400"
                    type="text"
                    name="firstName"
                    placeholder="John"
                    required
                    v-model="userInfo.firstName"
                />
            </div>
            <div class="flex flex-col border-b border-b-slate-400">
                <label for="lastName" class="text-slate-400 text-lg"
                    >Last Name <span class="text-slate-600 text-xs"> (Optional) </span></label
                >
                <input
                    class="bg-transparent placeholder-slate-700 py-2 outline-none text-slate-400"
                    type="text"
                    name="lastName"
                    placeholder="(Optional) Doe "
                    v-model="userInfo.lastName"
                />
            </div>
            <div class="flex flex-col border-b border-b-slate-400">
                <label for="department" class="text-slate-400 text-lg"
                    >Department <span class="text-slate-600 text-xs"> (Optional) </span></label
                >
                <input
                    class="bg-transparent placeholder-slate-700 py-2 outline-none text-slate-400"
                    type="text"
                    name="department"
                    placeholder="Engineeriing "
                    v-model="userInfo.department"
                />
            </div>
            <button
                class="bg-orange-500 h-[50px] w-[125px] mx-auto rounded-md text-white font-semibold mt-4"
            >
                Create
            </button>
        </form>
    </div>
</template>
<script lang="ts" setup>
import router from '@/router'
import { useAuthStore } from '@/stores/auth'
import { useUserStore } from '@/stores/user'
import type { CreateUser } from '@/types/users'
import { ref } from 'vue'
const authInfo = useAuthStore()
const userStore = useUserStore()
const userInfo = ref<CreateUser>({
    id: authInfo.user?.sub ?? '',
    email: authInfo.user?.email ?? '',
    firstName: userStore.user?.firstName ?? '',
    lastName: userStore.user?.lastName ?? '',
    department: userStore.user?.department ?? ''
})
async function createUser(info: CreateUser): Promise<void> {
    try {
        await userStore.createUser(info)

        await userStore.getUser(info.id)

        router.push('/')
    } catch (error) {}
}
</script>
