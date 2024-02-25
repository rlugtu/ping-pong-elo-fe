<template>
    <div class="p-4 grid grid-rows-2 gap-2.5 h-full">
        <div class="p-6 flex flex-col h-full row-span-1 bg-blue-500">
            <slot name="top" />
        </div>
        <div class="p-6 flex flex-col h-full row-span-1 bg-blue-500">
            <slot name="bottom" />
        </div>
    </div>
</template>
