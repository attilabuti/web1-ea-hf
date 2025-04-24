class Shape {
    constructor(x, y, color) {
        this.x = x || 0;
        this.y = y || 0;
        this.color = color || 'gray';
        this.element = null;
    }

    draw() {
        this.element = document.createElement('div');
        this.element.classList.add('shape');

        this.element.style.left = `${this.x}px`;
        this.element.style.top = `${this.y}px`;
        this.element.style.backgroundColor = this.color;

        document.body.appendChild(this.element);
    }

    getInfo() {
        return `${this.constructor.name} - Szín: ${this.color}, Pozíció: (${this.x}, ${this.y})`;
    }

    remove() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
            this.element = null;
        }
    }
}

class Circle extends Shape {
    constructor(x, y, color, radius) {
        super(x, y, color);
        this.radius = radius || 10;
    }

    draw() {
        super.draw();

        if (this.element) {
            const diameter = this.radius * 2;
            this.element.style.width = `${diameter}px`;
            this.element.style.height = `${diameter}px`;
            this.element.style.borderRadius = '50%';
        }
    }

    getInfo() {
        return `${super.getInfo()}, Sugár: ${this.radius}`;
    }
}

class Rectangle extends Shape {
    constructor(x, y, color, width, height) {
        super(x, y, color);
        this.width = width || 50;
        this.height = height || 30;
    }

    draw() {
        super.draw();

        if (this.element) {
            this.element.style.width = `${this.width}px`;
            this.element.style.height = `${this.height}px`;
        }
    }

    getInfo() {
        return `${super.getInfo()}, Méret: ${this.width}x${this.height}`;
    }
}

const colors = [
    'GhostWhite', 'AntiqueWhite', 'Aqua', 'Aquamarine', 'Black',
    'BlueViolet', 'BurlyWood', 'Chartreuse', 'DarkGrey', 'SaddleBrown',
    'CornflowerBlue', 'Crimson', 'DodgerBlue'
];

var drawings = [];

var extraPadding = 25;
var yMin = 0;
var yMax = 0;
var xMin = 0;
var xMax = 0;

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function setXY() {
    yMin = document.querySelector('header').offsetHeight + document.querySelector('.wrapper').offsetHeight + extraPadding;
    yMax = document.body.offsetHeight - document.querySelector('footer').offsetHeight - extraPadding;
    xMin = extraPadding;
    xMax = document.body.offsetWidth + extraPadding;
}

document.addEventListener('DOMContentLoaded', () => {
    setXY();

    window.addEventListener('resize', e => {
        setXY();
    }, true);

    document.querySelector('.draw-circle').addEventListener('click', () => {
        let rRadius = randomInt(10,100);

        let drawing = new Circle(
            randomInt(xMin, xMax-(rRadius*2)),
            randomInt(yMin, yMax-(rRadius*2)),
            colors[randomInt(0, colors.length-1)],
            rRadius
        );

        drawings.push(drawing);
        drawing.draw();

        console.log(drawing.getInfo());
    });

    document.querySelector('.draw-rectangle').addEventListener('click', () => {
        let rWidth = randomInt(10,150);
        let rHeight = randomInt(10,150);

        let drawing = new Rectangle(
            randomInt(xMin, xMax-rWidth),
            randomInt(yMin, yMax-rHeight),
            colors[randomInt(0, colors.length-1)],
            rWidth,
            rHeight
        );

        drawings.push(drawing);
        drawing.draw();

        console.log(drawing.getInfo());
    });

    document.querySelector('.clear').addEventListener('click', () => {
        for (let i = 0; i < drawings.length; i++) {
            drawings[i].remove();
        }

        drawings = [];
    });
});
