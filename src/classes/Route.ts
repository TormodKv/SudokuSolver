export default class Route {
    candidates: number[];
    private _number: number | null; 

    constructor(){
        //Fill up candidates
        this.candidates = [];
        for (let i = 1; i < 10; i++){
            this.candidates.push(i);
        }
        //Set number to null
        this._number = null;
    }

    get number(): number | null {
        return this._number;
    }

    set number(n: number | null) {
        if (n === null) {
            this._number = null;
            return;
        }
        if (n < 1 || n > 9) return;
        this._number = n;
        this.candidates = [];
    }

    hiddenSingles(): boolean {
        if (this.candidates.length === 1){
            this.number = this.candidates[0];
            return true;
        }
        return false;
    }

    removeCandidate(candidate: number): void {
        this.candidates.splice(this.candidates.indexOf(candidate), 1);
    }

    removeCandidateByIndex(index: number): void {
        this.candidates.splice(index, 1);
    }
}