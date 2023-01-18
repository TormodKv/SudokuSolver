<template>
    <div class="grid grid-cols-3 p-3 rounded-lg border-4 h-min w-40 place-items-center gap-3 bg-black">
        <div @click="closeClicked()" class="hover:bg-white/20 border rounded-md w-8 h-8 flex place-content-center hover:cursor-pointer place-items-center">
            <div class="self-center justify-center ">
                X
            </div>
        </div>
        <div class="flex hover:bg-white/20 col-span-2 border rounded-md h-8 w-full place-content-center hover:cursor-pointer" @click="numpadClicked(null)">
            <div class="self-center justify-center ">
                Clear
            </div>
        </div>
        <div v-for="x in 9" class="flex hover:bg-white/20 border rounded-md h-8 w-8 place-content-center hover:cursor-pointer" @click="numpadClicked(x)">
            <div class="self-center justify-center ">
                {{ x }}
            </div>
        </div>
    </div>
</template>
  
<script setup lang="ts">

const emit = defineEmits(['numpad', 'close'])

function numpadClicked(x : number | null){
    emit("numpad",x);
}

function closeClicked(){
    emit("close",true);
}

</script>

<style scoped>
  div {
    color: rgb(209, 209, 209);
  }
</style>
  