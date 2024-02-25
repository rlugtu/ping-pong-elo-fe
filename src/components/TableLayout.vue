<template>
    <div class="grid grid-rows-2 gap-2.5 h-full">
        <div class="px-6 h-full row-span-1 bg-blue-500">
            <slot name="top" />
        </div>
        <div class="px-6 h-full row-span-1 bg-blue-500">
            <slot name="bottom" />
        </div>
    </div>
</template>
