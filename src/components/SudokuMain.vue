<template>
  <div class="flex h-full justify-center">
    <div class="place-self-center flex flex-col">
      <p class="self-center text-3xl">Sudoku Solver 1.0</p>
      <p class="self-center text-sm mb-5">By 
        <a class="hover:cursor-pointer hover:opacity-30" href="https://github.com/TormodKv">Tormod Kvitberg</a>
      </p>
      <div class="grid grid-cols-9 self-center">
        <div v-for="x in 9">
          <div v-for="y in 9">
            <div class="border h-10 w-10 flex place-content-center hover:cursor-pointer" 
            @click="routeClicked(x,y)" 
            :class="{
              'border-t-4' : y === 1 || y === 4 || y === 7,
              'border-b-4' : y === 9,
              'border-l-4' : x === 1 || x === 4 || x === 7,
              'border-r-4' : x === 9,
              }">
              <p class="self-center">{{(matrix[x-1][y-1].number ?? "").toString()}}</p>
            </div>
            <Numpad class="absolute -translate-y-[calc(100%+2.5rem)] -translate-x-[calc(50%-1.25rem)]" 
                v-show="numpads[(x.toString() + y.toString())] === true"
                @numpad="(n: number) => {numpadClicked(n, x-1, y-1)}" 
                @close ="()=> {numpads[(x.toString() + y.toString())] = false}"
                />
          </div>
        </div>
      </div>
      <div id="buttons" class="flex gap-2 place-content-around mt-2">
        <button class="p-1 border-[d1d1d1] border-2 hover:bg-white/30" @click="async ()=> {await solveRecursively(-1,0)}">Solve recursively 🔁</button>
        <button class="p-1 border-[d1d1d1] border-2 hover:bg-white/30" @click="async ()=> {await solveSmart()}">Solve smart 🧠</button>
        <button class="p-1 border-[d1d1d1] border-2 hover:bg-white/30">Hint 💡</button>
        <button class="p-1 border-[d1d1d1] border-2 hover:bg-white/30">New ✏</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted, computed } from 'vue'
import Numpad from './Numpad.vue';
import Route from '../classes/Route'

let lastOpenNumpad: [number, number] = reactive([0,0]);
let numpads: { [name: string]: boolean } = reactive({});
let matrix : Route[][] = reactive([[],[],[],[],[],[],[],[],[]]);
for (let x = 0; x < 9; x++) {
  for (let y = 0; y < 9; y++) {
    matrix[x][y] = new Route;
  }
}

//Test naked row
matrix[0][0].number = 4
matrix[6][0].number = 9
matrix[7][0].number = 3
matrix[8][0].number = 8
matrix[1][1].number = 3
matrix[2][1].number = 2
matrix[4][1].number = 9
matrix[5][1].number = 4
matrix[6][1].number = 1
matrix[1][2].number = 9
matrix[2][2].number = 5
matrix[3][2].number = 3
matrix[6][2].number = 2
matrix[7][2].number = 4
matrix[0][3].number = 3
matrix[1][3].number = 7
matrix[3][3].number = 6
matrix[5][3].number = 9
matrix[8][3].number = 4
matrix[0][4].number = 5
matrix[1][4].number = 2
matrix[2][4].number = 9
matrix[5][4].number = 1
matrix[6][4].number = 6
matrix[7][4].number = 7
matrix[8][4].number = 3
matrix[0][5].number = 6
matrix[2][5].number = 4
matrix[3][5].number = 7
matrix[5][5].number = 3
matrix[7][5].number = 9
matrix[0][6].number = 9
matrix[1][6].number = 5
matrix[2][6].number = 7
matrix[5][6].number = 8
matrix[6][6].number = 3
matrix[2][7].number = 3
matrix[3][7].number = 9
matrix[6][7].number = 4
matrix[0][8].number = 2
matrix[1][8].number = 4
matrix[4][8].number = 3
matrix[6][8].number = 7
matrix[8][8].number = 9

async function solveSmart(){
  while (true){
    if (hiddenSingles()) continue;
    console.log("No more hiddenSingles");
    if (nakedRow(2)) continue;
    console.log("No more nakedRow");
    break;
  }
}

async function solveRecursively(x: number, y: number): Promise<boolean> {

  await delay(10);
  console.log("Solving");

  do {
    x += 1;
    if (x == 9){
      y += 1;
      x = 0;
      if (y == 9) return true
    }
  } while (matrix[x][y].number !== null)
  
  for (let n = 1; n < 10; n++) {
    if (!isLegalPlacement(n,x,y)) continue;
    matrix[x][y].number = n;
    if (x == 8 && y == 8) return true;
    if (!await solveRecursively(x,y)) {
      matrix[x][y].number = null
    } else return true;
  }

  return false;
}

function isLegalPlacement(n: number,checkX: number, checkY: number): boolean {
  for (let x = 0; x < 9; x++) {
    if (x == checkX) continue;
    if (matrix[x][checkY].number == n) return false;
  }
  for (let y = 0; y < 9; y++) {
    if (y == checkY) continue;
    if (matrix[checkX][y].number == n) return false;
  }

  let bigRouteX = Math.floor(checkX / 3);
  let bigRouteY = Math.floor(checkY / 3);

  for (let x = 0; x < 3; x++) {
    for (let y = 0; y < 3; y++) {
      if (x + (3 * bigRouteX) == checkX && y + (3 * bigRouteY) == checkY) continue;
      if (matrix[x + (3 * bigRouteX)][y + (3 * bigRouteY)].number == n) return false;
    }
  }

  return true;
}

function delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
}

function numpadClicked(n: number | null, x: number, y: number){
  matrix[x][y].number = n;
  numpads[((x+1).toString() + (y+1).toString())] = false;
  if (n == null) matrix[x][y].candidates = [1,2,3,4,5,6,7,8,9];
}

function routeClicked(x: number, y: number){
  
  if (lastOpenNumpad[0] == x && lastOpenNumpad[1] == y){
    //Clicked the same route
    numpads[x.toString() + y.toString()] = !numpads[x.toString() + y.toString()];
  } else {
    //Clicked different route
    numpads[x.toString() + y.toString()] = true;
    numpads[lastOpenNumpad[0].toString() + lastOpenNumpad[1].toString()] = false;
  }

  lastOpenNumpad = [x,y]
}

function keyUp(event: KeyboardEvent){

  if (currentNumpad.value === undefined) return;

  let x = +(currentNumpad.value + " ")[0] - 1
  let y = +(currentNumpad.value + " ")[1] - 1

  if (event.key.match(/[1-9]/g)){
      numpadClicked(+event.key, x, y);
      return;
  }
  if (event.key == "Escape") {
      numpads[currentNumpad.value] = false;
      return;
  }
  if (event.key == " " || event.key == "0" || event.key == "Backspace"){
      numpadClicked(null, x, y);
  }
}

const currentNumpad = computed(() => {
  for (let key in numpads) {
    let value = numpads[key];
    if (value == true){
      return key;
    }
  }
  return undefined;
})

function hiddenSingles(): boolean {
  trimCandidates()
  let foundHiddenSingle = false;
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      if (matrix[x][y].number !== null) continue;
      foundHiddenSingle ||= matrix[x][y].hiddenSingles();
    }
  }
  return foundHiddenSingle;
}

function trimCandidates() {
  for (let x = 0; x < 9; x++) {
    for (let y = 0; y < 9; y++) {
      if (matrix[x][y].number !== null) continue;
      for (let cIndex = 8; cIndex >= 0; cIndex--) {
        if (!isLegalPlacement(matrix[x][y].candidates[cIndex], x, y)){
          matrix[x][y].removeCandidateByIndex(cIndex);
        }
      }
    }
  }
}

function nakedRow(length: number): boolean {
  let foundNakedRow = false;

  for (let x = 0; x < 9; x++) {
    let routes: Array<Route> = [];
    for (let y = 0; y < 9; y++) {
      routes.push(matrix[x][y])
    }
    if (nakedRowAnalyseSet(routes, length)) foundNakedRow = true;
  }
  for (let y = 0; y < 9; y++) {
    let routes: Array<Route> = [];
    for (let x = 0; x < 9; x++) {
      routes.push(matrix[x][y])
    }
    if (nakedRowAnalyseSet(routes, length)) foundNakedRow = true;
  }
  for (let bigX = 0; bigX < 3; bigX++) {
    for (let bigY = 0; bigY < 3; bigY++) {
      let routes: Array<Route> = [];
      for (let smallX = 0; smallX < 3; smallX++) {
        for (let smallY = 0; smallY < 3; smallY++) {
          routes.push(matrix[smallX + (3 * bigX)][smallY + (3 * bigY)])
        }
      }
      if (nakedRowAnalyseSet(routes, length)) foundNakedRow = true;
    }
  }

  return foundNakedRow;
}

//Analyzes a set og nine routes that can't contain a pait of two equal pairs AND those numbers appearing in different squares at the same time
function nakedRowAnalyseSet(routes: Route[], length: number) : Boolean {
  routes = routes.filter(x => x.candidates.length > 0);
  console.log("Filtered routes: ", routes)
  let foundNakedRow = false;
  routes.sort((a, b) => {
      let aNum: number = (a.candidates.length * 100) + a.candidates.reduce((x, current) => x + current, 0);
      let bNum: number = (b.candidates.length * 100) + b.candidates.reduce((x, current) => x + current, 0);
      return aNum - bNum;
    })
    for (let i = 0; i < routes.length-1; i++) {
      if (routes[i].candidates.length == length && equalArrays(routes[i].candidates, routes[i+1].candidates) && nakedRowTrimCandidates(routes, i)){
        foundNakedRow = true;
      }
    }
  return foundNakedRow;
}

function nakedRowTrimCandidates(routes : Route[], index: number) : boolean {
  console.log("nakedRowTrim");
  let trimmedCandidates = false;
  let removeNumbers = routes[index].candidates;

  for (let i = 0; i < routes.length; i++) {

    if (i == index || i == index+1) continue;

    const route = routes[i];

    for (let candIndex = route.candidates.length-1; candIndex >= 0; candIndex--) {
      const numb = route.candidates[candIndex];

      if (removeNumbers.includes(numb)){
        let sum = 0;
        matrix.forEach(x => {
          x.forEach(y => {
            y.candidates.forEach(z => {
              sum += z;
            })
          })
        })
        console.log("SUM: ", sum);

        route.candidates.slice(candIndex, 1)
        trimmedCandidates = true;

        sum = 0;
        matrix.forEach(x => {
          x.forEach(y => {
            y.candidates.forEach(z => {
              sum += z;
            })
          })
        })
        console.log("SUM: ", sum);
      }
    }
  }

  return trimmedCandidates;
}

function equalArrays(array1: Array<any>, array2: Array<any>, array3: Array<any> | undefined = undefined): boolean{

  let equal = true;

  if (array3 === undefined) array3 = array1;
  if (array1.length != array2.length || array1.length != array3.length) equal = false;

  for (let i = 0; i < array1.length; i++) {
    if (array1[i] != array2[i] || array1 != array3) equal = false;
  }

  console.log("Arrays are equal? " , equal);
  console.log("A1: ",array1);
  console.log("A2: ",array2);

  return equal;
}

onMounted(() => {
  window.addEventListener('keyup', keyUp)
})


</script>

<style>
  p, button {
    color: rgb(209, 209, 209);
  }
</style>
