<template>
    <div class="flex flex-col justify-center items-center py-2 px-2">
        <h1 class="text-3xl font-semibold text-blue-500">Account Setup</h1>
        <form
            @submit.prevent
            @submit="createUser(userInfo)"
            class="mt-8 w-full grid gap-8 rounded-lg text-slate-600"
        >
            <div class="flex flex-col border-b border-b-slate-600">
                <label for="firstName" class="text-slate-500 text-2xl">First Name</label>
                <input
                    class="bg-transparent placeholder-slate-700 py-2 outline-none text-orange-500 text-lg"
                    type="text"
                    name="firstName"
                    placeholder="John"
                    required
                    minlength="1"
                    v-model="userInfo.firstName"
                />
            </div>
            <div class="flex flex-col border-b border-b-slate-600">
                <label for="lastName" class="text-slate-500 text-2xl"
                    >Last Name <span class="text-slate-600 text-xs"> (Optional) </span></label
                >
                <input
                    class="bg-transparent placeholder-slate-700 py-2 outline-none text-orange-500 text-lg"
                    type="text"
                    name="lastName"
                    placeholder="(Optional) Doe "
                    v-model="userInfo.lastName"
                />
            </div>
            <div class="flex flex-col border-b border-b-slate-600">
                <label for="department" class="text-slate-500 text-2xl"
                    >Department <span class="text-slate-600 text-xs"> (Optional) </span></label
                >
                <input
                    class="bg-transparent placeholder-slate-700 py-2 outline-none text-orange-500 text-xl"
                    type="text"
                    name="department"
                    placeholder="Engineeriing "
                    v-model="userInfo.department"
                />
            </div>
            <button
                class="py-4 px-8 bg-orange-500 mx-auto rounded-md text-white font-semibold mt-4 text-lg"
            >
                {{ userStore.user ? 'Update ' : 'Create' }}
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
