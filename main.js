const prompt = require("prompt-sync")({ sigint: true });

const hat = "^";
const hole = "O";
const fieldPatch = "░";
const player = "*";

class Field {
  constructor(field = [[]]) {
    this.field = field;
    this.locationX = 0;
    this.locationY = 0;
    //i put it as [0][0] so that it is start at the 00 location
    this.field[0][0] = player;
  }

  static generateField(height, width, percentage = 0.1) {
    const field = new Array(height).fill(0).map((el) => new Array(width));
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const prob = Math.random();
        field[y][x] = prob > percentage ? fieldPatch : hole;
      }
    }
    // this is to set the location of the hat using a random number * the width and height
    const hatLocation = {
      x: Math.floor(Math.random() * width),
      y: Math.floor(Math.random() * height),
    };
    // using the condition that if the hat is at 0, it would give a random position
    while (hatLocation.x === 0 && hatLocation.y === 0) {
      hatLocation.x = Math.floor(Math.random() * width);
      hatLocation.y = Math.floor(Math.random() * height);
    }
    field[hatLocation.y][hatLocation.x] = hat;
    return field;
  }

  //return the location of the hat
  isHat() {
    return this.field[this.locationY][this.locationX] === hat;
  }

  //return the location of the hole
  isHole() {
    return this.field[this.locationY][this.locationX] === hole;
  }

  // to print our the field
  print() {
    const displayString = this.field
      .map((row) => {
        return row.join("");
      })
      .join("\n");
    console.log(displayString);
  }

  runGame() {
    let playing = true;
    while (playing) {
      this.print();
      this.askQuestion();
      if (!this.withinField()) {
        console.log("You are not within the field! Bye!!");
        playing = false;
        break;
        //the game will end as playing is false
      } else if (this.isHole()) {
        console.log("Congrats, you found a hole!! Bye!!");
        playing = false;
        break;
      } else if (this.isHat()) {
        console.log("Congrats, you found the hat!!");
        playing = false;
        break;
      }
      //  this will update the location of the pathCharacter
      this.field[this.locationY][this.locationX] = player;
    }
  }

  askQuestion() {
    const response = prompt(
      "Which way? Please enter U, D, L or R. Or Q to quit. "
    ).toLowerCase();
    switch (response) {
      case "u":
        this.locationY -= 1;
        break;
      case "d":
        this.locationY += 1;
        break;
      case "l":
        this.locationX -= 1;
        break;
      case "r":
        this.locationX += 1;
        break;
      case "q":
        process.exit();
      default:
        console.log("Please enter U, D, L or R. Or Q to quit. ");
        this.askQuestion();
        break;
    }
  }

  withinField() {
    return (
      this.locationY >= 0 &&
      this.locationX >= 0 &&
      this.locationY < this.field.length &&
      this.locationX < this.field[0].length
    );
  }
}

const newField = new Field(Field.generateField(10, 10, 0.18));
newField.runGame();
