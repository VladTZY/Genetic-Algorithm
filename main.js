GENES = 250
VEL = 35
BALLS = 100
MUTATION_RATE = 0.02

balls = [];
generation = 0;
fitness = 0;

document.addEventListener("DOMContentLoaded", setup);

class Ball {
    constructor(x, y, context) {
        this.x = x;
        this.y = y;
        this.context = context;
        this.index = 0;
        this.fitness = 0;
        this.genes = [];
        this.done = false;
    }

    draw() {
        this.context.fillStyle = 'blue';

        if (this.done) 
            this.context.fillStyle = 'green';

        this.context.beginPath();
        this.context.arc(this.x, this.y, 10, 0, 2 * Math.PI, false);
        this.context.fill();
    }

    update() {
        this.context.fillStyle = 'rgb(231, 231, 231)';
        this.context.fillRect(this.x, this.y, 10, 10);

        if (380 < this.x && 420 > this.x && 745 < this.y && 785 > this.y) {
            this.done = true;
            this.index++;
        } else {
            this.x = this.x + VEL * this.genes[this.index][0];
            this.y = this.y + VEL * this.genes[this.index][1];
            this.index++;
        }
    }

    createGenes() {
        for (let i = 0; i < GENES; i++) {
            this.genes[i] = [Math.random() - 0.5, Math.random() - 0.5];
        }
    }

    getGenesFromParents(mom, dad) {
        for (let i = 0; i < GENES; i++) {

            if (i % 2 == 0) {
                this.genes[i] = mom.genes[i];
            } else {
                this.genes[i] = dad.genes[i];
            }
        }
    }

    calcFitness() {
        var d = Math.sqrt((this.x - 400) ** 2 + (this.y - 765) ** 2);
        this.fitness = Math.max(0, 1 - d/800);
    }

    mutate() {
        for (let i = 0; i < GENES; i++) {

            if (Math.random() <= MUTATION_RATE) {
                this.genes[i] = [Math.random() - 0.5, Math.random() - 0.5];
            }
        }
    }
}

function setup() {
    var canvas = document.querySelector('#canvas');
    var context = canvas.getContext('2d');

    for (let i = 0; i < BALLS; i++) {
        var newBall = new Ball(395, 25, context);
        newBall.createGenes();
        newBall.draw();
        balls[i] = newBall;
    }

    startEvolution();
}

function startEvolution() {
    var canvas = document.querySelector('#canvas');
    var context = canvas.getContext('2d');

    requestAnimationFrame(startEvolution);
    context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight);

    context.fillStyle = 'blue';
    context.fillRect(380, 745, 40, 40);
    context.fillStyle = 'black';
    context.fillText("Generation: " + generation.toString(), 15, 45);
    context.fillText("Avg Fitness: " + fitness.toFixed(2).toString(), 15, 60);

    for (let i = 0; i < BALLS; i++) {
        balls[i].update();
        balls[i].draw();
    }
    
    if (balls[0].index == GENES) {
        nextGeneration();
    }
}

function nextGeneration() {
    generation++;

    var totalFitness = 0;
    for (let i = 0; i < BALLS; i++) {
        balls[i].calcFitness();
        totalFitness = totalFitness + balls[i].fitness;
    }
    
    fitness = totalFitness / BALLS;

    var matingPool = [];
    for (let i = 0; i < BALLS; i++) {

        for (let j = 0; j < Math.floor(balls[i].fitness * 100); j++) {
            matingPool.push(balls[i]);
        }
    }

    reproducePopulation(matingPool);
}

function reproducePopulation(matingPool) {
    var canvas = document.querySelector('#canvas');
    var context = canvas.getContext('2d');

    var newGeneration = [];

    for (let i = 0; i < BALLS; i++) {
        var mom = matingPool[Math.floor(Math.random() * matingPool.length)];
        var dad = matingPool[Math.floor(Math.random() * matingPool.length)];
        var newBall = new Ball(395, 25, context);

        newBall.getGenesFromParents(mom, dad);
        newBall.mutate();
        newGeneration[i] = newBall;
    }

    balls = newGeneration;
}