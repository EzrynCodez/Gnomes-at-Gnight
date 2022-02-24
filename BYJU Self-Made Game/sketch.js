let coinImg;
let backgroundImg;
let gnomeImg;
let ghostImg;
let gnome;
const PLAY = 1;
const END = 0;
const START = 2;
let gameState = START;
let platform;
let score;
let ghostGroup;
let jumpSound, rewardSound, gameOverSound;
let coin1, coin2, coin3;
let fireImg, fireGroup, potionGroup;
let potionImg, getReadyImg;
let speedy = 0;

function preload() {
  coinImg = loadImage("./images/coin.png");
  backgroundImg = loadImage("./images/platform.png");
  gnomeImg = loadImage("./images/gnome.png");
  ghostImg = loadImage("./images/ghost.png");
  fireImg = loadImage("./images/fire.png");
  potionImg = loadImage("./images/potion.png");
  getReadyImg = loadImage("./images/getReady.png");
  
  jumpSound = loadSound("./sounds/jump.mp3");
  rewardSound = loadSound("./sounds/coinsound.wav");
  gameOverSound = loadSound("./sounds/gameOver.wav");
}

function setup() {
  createCanvas(windowWidth, windowHeight);

  ghostGroup = new Group();
  fireGroup = new Group();
  potionGroup = new Group();
}

function draw() {
  background(0);
  drawSprites();

  if(gameState === START){
    textSize(20);
    text("Use the arrow keys to move.", width/2-125, height/2+100);
    text("Avoid the ghosts and fire.", width/2-120, height/2+150);
    text("Collect the potions!.", width/2-120, height/2+200);
    text("Press the up arrow key to start!", width/2-125, height/2+250);
    image(getReadyImg, width/2-200, height/2-100);

    if(keyIsDown(UP_ARROW)){
      gnome = createSprite(width / 2, height - 305);
      gnome.addImage("gnome", gnomeImg);
    
      platform = createSprite(width / 2, height);
      platform.addImage("background", backgroundImg);
      platform.scale = 5;
    
      score = 0;
    
      coin1 = createSprite(width - 400, height - 310);
      coin2 = createSprite(10, height - 310);
      coin3 = createSprite(width - 200, height - 310);
    
      coin1.addImage("coin1", coinImg);
      coin2.addImage("coin1", coinImg);
      coin3.addImage("coin1", coinImg);

      gameState = PLAY;
    }
  }else if (gameState === PLAY) {

    gnome.setCollider("rectangle", 6, 0, 30, 130);

    spawnFire();
    runControls();
    spawnGhosts();
    spawnPotion();

    textSize(20);

    text("Score: " + score, 50, 50);

    if (ghostGroup.isTouching(gnome)) {
      gameState = END;
      gameOverSound.play();
      gameOver();
    }

    if (potionGroup.isTouching(gnome)) {
      potionGroup.destroyEach();
      randomNum = Math.round(random(1, 2));
      if(randomNum === 1){
        ghostGroup.destroyEach();
      }else{
        speedy = 1;

        setTimeout(() => {
          speedy = 0;
        }, 7000)
      }
    }


    if (fireGroup.isTouching(gnome)) {
      gameState = END;
      gameOverSound.play();
      gameOver();
    }

    if (coin1.isTouching(gnome)) {
      coin1.x = -100;
      score += 50;
      rewardSound.play();
      repositionCoin1();
    }

    if (coin2.isTouching(gnome)) {
      coin2.x = -100;
      score += 50;
      rewardSound.play();
      repositionCoin2();
    }

    if (coin3.isTouching(gnome)) {
      coin3.x = -100;
      score += 50;
      rewardSound.play();
      repositionCoin3();
    }

  } else if (gameState === END) {
    gameOver();
  }
}

function runControls() {
  if (keyIsDown(LEFT_ARROW)) {
    if(speedy===0){    
      gnome.x -= 10;
    }else{
      gnome.x -= 15;
    }
  }
  if (keyIsDown(RIGHT_ARROW)) {
    if(speedy===0){    
      gnome.x += 10;
    }else{
      gnome.x += 15;
    }
  }

  if (gnome.y < height - 305) {
    gnome.velocityY += 1;
  } else {
    gnome.velocityY = 0;
    if (keyIsDown(UP_ARROW)) {
      if(speedy===0){
        gnome.velocityY = -18;
      }else{
        gnome.velocityY = -25;
      }
      jumpSound.play();
    }
  }
}

function spawnFire(){
  if(frameCount % 100 === 0){
    let randomX = Math.round(random(1, width));
    let fire = createSprite(randomX, 0, 10, 10);
    fire.addImage("fire", fireImg);
    fire.scale = 0.2

    fire.depth = platform.depth;
    platform.depth += 1;

    if(score < 2000){
      fire.velocityY = 5 + score/200;
    }else{
      fire.velocityY = 15;
    }
    fireGroup.add(fire);
    fire.lifetime = 300;
  }
}

function spawnPotion(){
  if(frameCount % 250 === 0){
    let randomX = Math.round(random(1, width));
    let potion = createSprite(randomX, height - 305);
    potion.addImage("potion", potionImg);
    potion.scale = 0.2;
    potion.lifetime = 300;
    potionGroup.add(potion);
  }
}

function spawnGhosts() {
  if (frameCount % 80 === 0) {
    let randomNum = Math.round(random(1, 2))
    let xPosition = 0;
    if (randomNum === 1) {
      xPosition = width;
    } else {
      xPosition = 0;
    }
    let ghost = createSprite(xPosition, height - 310);
    ghost.addImage("ghost", ghostImg);
    if (randomNum === 1) {
      if (score < 1000) {
        ghost.velocityX = -3 - score / 200;
      } else {
        ghost.velocityX = -8
      }
    } else {
      if (score < 1000) {
        ghost.velocityX = 3 + score / 100;
      } else {
        ghost.velocityX = 13
      }
    }

    ghostGroup.add(ghost);

    ghost.lifetime = 500;

    score += 10;
  }
}

function gameOver() {
  swal(
    {
      title: `Game Over!!!`,
      imageUrl: "https://images.freeimages.com/images/premium/previews/5110/51104032-cartoon-sad-gnome.jpg",
      imageSize: "160x160",
      text: "Thanks for playing, your score was: " + score + "!!",
      confirmButtonText: "Play Again"
    },
    function (isConfirm) {
      if (isConfirm) {
        location.reload();
      }
    }
  );
  ghostGroup.setVelocityXEach(0);
  ghostGroup.setLifetimeEach(-1);
  fireGroup.setVelocityYEach(0);
  fireGroup.setLifetimeEach(-1);

  gnome.velocityY = 0;
}

function repositionCoin1() {

  coin1.visible = false;

  setTimeout(() => {
    coin1.x = random(0, width),
      coin1.visible = true
  }, 1000)
}

function repositionCoin2() {

  coin2.visible = false;

  setTimeout(() => {
    coin2.x = random(0, width),
      coin2.visible = true
  }, 1000)
}

function repositionCoin3() {

  coin3.visible = false;

  setTimeout(() => {
    coin3.x = random(0, width),
      coin3.visible = true
  }, 1000)
}
