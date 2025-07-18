/*The Game Project Game interaction*/
var gameChar_x;
var gameChar_y;
var floorPos_y;
var t_collectable;
var collectables;
var t_canyon;
var canyon;
var trees_x;
var trees_y;
var clouds;
var mountainX;
var mountainY;
var house;
var heart;
var platforms;
var enemies;

var isLeft;
var isRight;
var isFalling;
var isPlummeting;
var isFound;
var isReached;
var isContact;
var isContactE;
var die;
var lives;
var bgmPlaying;

var cameraPosX;
var game_score;

var walkSound;
var jumpSound;
var gameSound;
var collectableSound;
var enemySound;

function preload()
{
    soundFormats('mp3','wav');
    
    //load your sounds here
    walkSound = loadSound('assets/walk.wav');
    walkSound.setVolume(0.3);
    jumpSound = loadSound('assets/jump.wav');
    jumpSound.setVolume(0.1);
    gameSound = loadSound('assets/bgm.wav');
    gameSound.setVolume(0.2);
    collectableSound = loadSound('assets/collectables.wav');
    collectableSound.setVolume(0.2);
    enemySound = loadSound('assets/dog.wav');
    enemySound.setVolume(0.15);
}

function setup()
{
    //console.log("setup is running")
	createCanvas(1024, 576);
    floorPos_y = height*3/4;
	
    lives = 3;

    bgmPlaying = 0;

    startGame();
}

function startGame()
{
    gameChar_x = width/2;
	gameChar_y = floorPos_y;
    trees_x = [width/2-2500,width/2-2000,width/2-1500,width/2-1000,width/2-500,width/2,width/2+500,width/2+1000,width/2+1500,width/2+2000];
    trees_y = height/2+75;
    clouds = 
        {
            x_pos: [-2300,-1800,-1300,-800,-300,200,700,1200,1700,2200,2700],
            y_pos: [89,85,190],
            size: [59,90],          
        }    
    mountainX = [-2200,-1600,-1000,-400,100,600,1200,1800,2400];
    mountainY = floorPos_y;
    collectables = 
        [
            {x_pos:(width/2)-95-2100, y_pos:floorPos_y+3, size:45, isFound:false},
            {x_pos:(width/2)-95-1100, y_pos:floorPos_y+3, size:45, isFound:false},
            {x_pos:(width/2)-95-100, y_pos:floorPos_y+3, size:45, isFound:false},
            {x_pos:(width/2)-95+400, y_pos:floorPos_y+3, size:45, isFound:false},
            {x_pos:(width/2)-95+900, y_pos:floorPos_y+3, size:45, isFound:false},
            {x_pos:(width/2)-95+1400, y_pos:floorPos_y+3, size:45, isFound:false}
        ];
    platforms = [];
    platforms.push(createPlatforms(100,floorPos_y-80,120));
    platforms.push(createPlatforms(500,floorPos_y-80,120));
    platforms.push(createPlatforms(-500,floorPos_y-80,120));
    platforms.push(createPlatforms(1000,floorPos_y-80,120));
    platforms.push(createPlatforms(1400,floorPos_y-80,120));
    platforms.push(createPlatforms(1800,floorPos_y-80,120));
    platforms.push(createPlatforms(-1000,floorPos_y-80,120));
    enemies = [];
    enemies.push(new Enemy(300,floorPos_y-40,50));
    enemies.push(new Enemy(800,floorPos_y-40,50));
    enemies.push(new Enemy(1450,floorPos_y-40,50));
    enemies.push(new Enemy(-300,floorPos_y-40,50));
    enemies.push(new Enemy(-1200,floorPos_y-40,50));
// {} - is for objects
// [] - is for array
// need to use [{}]
    canyon =
        [
            {x_pos:-2000, width:100},
            {x_pos:-1500, width:100},
            {x_pos:-1000, width:100},
            {x_pos:-500, width:100},
            {x_pos:0, width:100},
            {x_pos:400, width:100},
            {x_pos:600, width:100},
            {x_pos:1000, width:100},
            {x_pos:1500, width:100},
            {x_pos:2000, width:100},
        ];
    house =
        {
            isReached: false,
            xRoof: 1200,
            xBody: 1223,
            yBody: floorPos_y-60,
            xDoor: 1240,
            yDoor: floorPos_y-48,
        };
    heart = 
        [
            {x:890, y:7, lostLive:false},
            {x:915, y:7, lostLive:false},
            {x:940, y:7, lostLive:false},
        ]
    
    isLeft = false;
    isRight = false;
    isFalling = false;
    isPlummeting = false;
    die = false;

    cameraPosX = 0;

    game_score = 0;
}

function draw()
{
	///////////DRAWING CODE//////////
	//the background
    if(bgmPlaying == 0)
    {
        gameSound.loop();
        bgmPlaying += 1;
    }
    background(100,155,255);
    
    //the ground
	noStroke();
	fill(0,155,0);
	rect(0,floorPos_y,width,height-floorPos_y);
    
    //implement scrolling
    push();
    translate(-cameraPosX,0);
    cameraPosX = gameChar_x-(width/2);

    //the mountain
    drawMountains();
    
    //the trees
    drawTrees();
    
    //the clouds *from left*
    drawClouds();

	//the canyon
    for(i=0;i<canyon.length;i++)
    {
        //console.log('canyon')
        drawCanyon(canyon[i]);
        //detect when the character is over the canyon
        checkCanyon(canyon[i]);
    }
    
    //the collectable(leaf)
    for(i=0;i<collectables.length;i++)
    {
        if(collectables[i].isFound==false) //to make the points ADD 1 only
        {
            drawCollectable(collectables[i]);
            //collectable item interaction
            checkCollectable(collectables[i]);
        }
    }

    //the duck house
    renderHouse();
    if(house.isReached==false)
    {
        checkHouse();
    }
    
    //duck's life
    if(die==false) //if the duck NEVER die, then it will check for 'checkPlayerDie'
    {
        checkPlayerDie();
    }

    //platforms
    for(i=0;i<platforms.length;i++)
    {
        platforms[i].draw();
    }

    //enemies
    for(i=0;i<enemies.length;i++)
    {
        isContactE = false;
        enemies[i].draw();
        isContactE = enemies[i].checkContact(gameChar_x,gameChar_y);
        if(isContactE)
        {
                console.log("enemy restart");
                startGame();
                //break;
        }
    }

	//the game character
	if(isLeft&&isFalling)
	{
		//jumping-LEFT
        fill(252,245,154);
        //head
        ellipse(gameChar_x-5,gameChar_y-30,25,21);
        //eyes
        fill(0);
        ellipse(gameChar_x-8,gameChar_y-32.5,2.5,2.5);
        //mouth
        fill(236,182,55);
        //top (mouth)
        push();
        translate(gameChar_x-16,gameChar_y-30);
        rotate(10);
        ellipse(0,0,9,5);
        pop();
        //bottom (mouth)
        push();
        translate(gameChar_x-14.5,gameChar_y-27);
        rotate(-50);
        ellipse(0,0,4,8);
        pop();
        //left leg
        fill(236,182,55);
        push();
        translate(gameChar_x-15,gameChar_y-7);
        rotate(10);
        fill(236,182,55);
        ellipse(0,0,10,5);
        pop();
        //body
        fill(252,245,154);
        ellipse(gameChar_x,gameChar_y-15,35,25);
        //tail
        push();
        translate(gameChar_x+13.5,gameChar_y-15);
        rotate(5.1);
        ellipse(0,0,20,8);
        pop();
        //right leg
        fill(236,182,55);
        push();
        translate(gameChar_x+10,gameChar_y-4);
        rotate(-10);
        fill(236,182,55);
        ellipse(0,0,10,5);
        pop();
        
	}
	else if(isRight&&isFalling)
	{
		//jumping-RIGHT
        fill(252,245,154);
        //head
        ellipse(gameChar_x+5,gameChar_y-30,25,21);
        //eyes
        fill(0);
        ellipse(gameChar_x+8,gameChar_y-32.5,2.5,2.5);
        //mouth
        fill(236,182,55);
        //top (mouth)
        push();
        translate(gameChar_x+16,gameChar_y-30);
        rotate(-10);
        ellipse(0,0,9,5);
        pop();
        //bottom (mouth)
        push();
        translate(gameChar_x+14.5,gameChar_y-27);
        rotate(50);
        ellipse(0,0,4,8);
        pop();
        //left leg
        fill(236,182,55);
        push();
        translate(gameChar_x+15,gameChar_y-7);
        rotate(-10);
        fill(236,182,55);
        ellipse(0,0,10,5);
        pop();
        //body
        fill(252,245,154);
        ellipse(gameChar_x,gameChar_y-15,35,25);
        //tail
        push();
        translate(gameChar_x-13.5,gameChar_y-15);
        rotate(-5.1);
        ellipse(0,0,20,8);
        pop();
        //right leg
        fill(236,182,55);
        push();
        translate(gameChar_x-10,gameChar_y-4);
        rotate(10);
        fill(236,182,55);
        ellipse(0,0,10,5);
        pop();
	}
	else if(isLeft)
	{
		//walking LEFT
        fill(252,245,154);
        //head
        ellipse(gameChar_x-5,gameChar_y-30,25,21);
        //eyes
        fill(0);
        ellipse(gameChar_x-8,gameChar_y-32.5,2.5,2.5);
        //mouth
        fill(236,182,55);
        ellipse(gameChar_x-16,gameChar_y-29,9,5);
        //left leg
        fill(236,182,55);
        ellipse(gameChar_x-11,gameChar_y-7,10,5);
        //body
        fill(252,245,154);
        ellipse(gameChar_x,gameChar_y-15,35,25);
        //tail
        push();
        translate(gameChar_x+13.4,gameChar_y-15);
        rotate(5.1);
        ellipse(0,0,20,8);
        pop();
        //right leg
        fill(236,182,55);
        ellipse(gameChar_x+4,gameChar_y-3,10,5);
	}
	else if(isRight)
	{
		//walking RIGHT
        fill(252,245,154);
        //head
        ellipse(gameChar_x+5,gameChar_y-30,25,21);
        //eyes
        fill(0);
        ellipse(gameChar_x+8,gameChar_y-32.5,2.5,2.5);
        //mouth
        fill(236,182,55);
        ellipse(gameChar_x+16,gameChar_y-29,9,5);
        //right leg
        fill(236,182,55);
        ellipse(gameChar_x+11,gameChar_y-7,10,5);
        //body
        fill(252,245,154);
        ellipse(gameChar_x,gameChar_y-15,35,25);
        //tail
        push();
        translate(gameChar_x-13.4,gameChar_y-15);
        rotate(-5.1);
        ellipse(0,0,20,8);
        pop();
        //left leg
        fill(236,182,55);
        ellipse(gameChar_x-4,gameChar_y-3,10,5);
	}
	else if(isFalling||isPlummeting)
	{
		//jumping facing forward
        fill(252,245,154);
        //head
        ellipse(gameChar_x,gameChar_y-30,25,21);
        //eyes
        fill(0);
        ellipse(gameChar_x-6,gameChar_y-32,2.5,2.5);
        ellipse(gameChar_x+6,gameChar_y-32,2.5,2.5);
        //body
        fill(252,245,154);
        ellipse(gameChar_x,gameChar_y-15,35,25);
        //left wing
        push();
        translate(gameChar_x-15,gameChar_y-22);
        rotate(-9);
        ellipse(0,0,15,8.2);
        pop();
        //right wing
        push();
        translate(gameChar_x+15,gameChar_y-22);
        rotate(-10);
        ellipse(0,0,15,8.2);
        pop();
        //mouth
        fill(236,182,55);
        //top (mouth)
        ellipse(gameChar_x,gameChar_y-29,10,5);
        //bottom (mouth)
        beginShape();
        vertex(gameChar_x-3.6,gameChar_y-28);
        bezierVertex(gameChar_x-2.5,gameChar_y-23,gameChar_x+2.5,gameChar_y-23,gameChar_x+3.6,gameChar_y-28);
        endShape();
        //inside (mouth)
        fill(210,98,0);
        beginShape();
        vertex(gameChar_x-2.7,gameChar_y-27.8);
        bezierVertex(gameChar_x-1.5,gameChar_y-24,gameChar_x+1.5,gameChar_y-24,gameChar_x+2.7,gameChar_y-27.8);
        endShape();
        //nose
        fill(191,157,128);
        ellipse(gameChar_x-2,gameChar_y-30,1,0.9);
        ellipse(gameChar_x+2,gameChar_y-30,1,0.9);
        //leg
        fill(236,182,55);
        //left leg
        push();
        translate(gameChar_x-9,gameChar_y-3);
        rotate(-10);
        fill(236,182,55);
        ellipse(0,0,10,5);
        pop();
        //right leg
        push();
        translate(gameChar_x+9,gameChar_y-3);
        rotate(10);
        fill(236,182,55);
        ellipse(0,0,10,5);
        pop();
	}
	else
	{
		//standing, front facing
        fill(252,245,154);
        //head
        ellipse(gameChar_x,gameChar_y-30,25,21);
        //eyes
        fill(0);
        ellipse(gameChar_x-6,gameChar_y-32,2.5,2.5);
        ellipse(gameChar_x+6,gameChar_y-32,2.5,2.5);
        //mouth
        fill(236,182,55);
        ellipse(gameChar_x,gameChar_y-29,10,5);
        //body
        fill(252,245,154);
        ellipse(gameChar_x,gameChar_y-15,35,25);
        //leg
        fill(236,182,55);
        //left leg
        ellipse(gameChar_x-9,gameChar_y-3,10,5);
        //right leg
        ellipse(gameChar_x+9,gameChar_y-3,10,5);   
	}
    
    pop();

    //the score on screen
    gameScore();

    //the life on screen
    lifeTokens();

    //conditional statement for game over
    gameOver();

    //when survived
    nextLevel();

    //game limit
    if(gameChar_x>2400)
    {
        isRight = false;
    }
    if(gameChar_x<-2100)
    {
        isLeft = false;
    }

	///////////INTERACTION CODE//////////
	//conditional statements to move the game character
    //move left, right
    if(isLeft==true)
    {
        gameChar_x -= 4;
    }
    if(isRight==true)
    {
        gameChar_x += 4;
    }
    //gravity, make the duck fall BACK to the ground
    if(gameChar_y <= floorPos_y || isPlummeting == true) //so when duck 'jumps' it falls back to ground or is falling in canyon
    {
        isContact = false;
        for(i=0;i<platforms.length;i++)
        {
           if(platforms[i].checkContact(gameChar_x,gameChar_y) == true)
           {
                console.log("isContact w platform");
                isContact = true;
                isFalling = false; //wont show falling action on platform
                break;
           }  
        }
        if(isContact==false)
        {
            gameChar_y += 3;
            isFalling = true; //so the 'isFalling' image appears when its 'jumping'
        }
        if(isPlummeting == true)
        {
            gameChar_y += 2;
            isLeft = false; //to prevent it from moving left when its in the canyon
            isRight = false; //to prevent it from moving right when its in the canyon
        }
    }
    else
    {
        isFalling = false; //so when duck touches ground the 'isFalling' image disappears
    }
}

function keyPressed()
{
    //console.log("keypressed is running")
    //left arrow
    if(keyCode==65 && isPlummeting==false)
    //when its moving left + NOT falling -> isLeft=TRUE
    {
        isLeft = true;
        walkSound.loop();
    }
    //right arrow
    else if(keyCode==68 && isPlummeting==false)
    //when its moving right + NOT falling -> isRight=TRUE
    {
        isRight = true;
        walkSound.loop();
    }
    //up arrow
    else if(keyCode==87)
    {   
        if(
            isFalling==false && 
            isPlummeting==false &&
            house.isReached==false &&
            lives>0) //ONLY allows the duck to jump when its on the floor,,if its in the air the duck WONT jump!!!!,,dont allow the duck to jump out of the canyon
        {
            if(gameChar_y>=floorPos_y)//jump on the platform
            {
                isFalling = true;
                gameChar_y -= 100; //duck falling
                jumpSound.play();
            }
            else//jump on floor
            {
                gameChar_y -= 100; //duck falling
                jumpSound.play();
            }
            
        }
    }
}

function keyReleased()
{
    //left arrow
    if(keyCode==65)
    {
        //console.log("no left arrow");
        isLeft = false;
        if(walkSound.isLooping())
        {
            walkSound.stop();
        }
    }
    //right arrow
    else if(keyCode==68)
    {
        //console.log("no right arrow");
        isRight = false;
        if(walkSound.isLooping())
        {
            walkSound.stop();
        }
    }
    //up arrow
    else if(keyCode==87)
    {
        //console.log("no up arrow");
        isFalling = false; //so the 'isFalling' image will disappear
    }
}

function drawClouds()
{
    for(var i = 0; i < clouds.x_pos.length; i++)
    {
        fill(255);
        //high.1
        ellipse(clouds.x_pos[i],clouds.y_pos[0],clouds.size[0]);
        //high.2
        ellipse(clouds.x_pos[i]+45,clouds.y_pos[1],clouds.size[1]);
        //high.3
        ellipse(clouds.x_pos[i]+90,clouds.y_pos[0],clouds.size[0]);
        //low.1
        ellipse(clouds.x_pos[i]-100,clouds.y_pos[2],clouds.size[0]);
        //low.2
        ellipse(clouds.x_pos[i]-55,clouds.y_pos[2],clouds.size[1]);
        //low.3
        ellipse(clouds.x_pos[i]-10,clouds.y_pos[2],clouds.size[0]);        
    }
}

function drawMountains()
{
    for(var i = 0; i < mountainX.length; i++)
    {
        fill(112,213,225);
        //big; bl>br>top
        triangle(mountainX[i],mountainY,mountainX[i]+200,mountainY,mountainX[i]+100,mountainY-260);
        //small; bl>br>top
        triangle(mountainX[i]+130,mountainY,mountainX[i]+310,mountainY,mountainX[i]+220,mountainY-200);
        //shadow
        fill(21,98,149);
        //big
        triangle(mountainX[i]+150,mountainY,mountainX[i]+200,mountainY,mountainX[i]+100,mountainY-260);
        //small
        triangle(mountainX[i]+275,mountainY,mountainX[i]+310,mountainY,mountainX[i]+220,mountainY-200); 
    }
}

function drawTrees()
{
    for(var i = 0; i < trees_x.length; i++)
    {
        //trunk
        fill(120,100,40)
        rect(trees_x[i],trees_y,30,70,0,0,5,5);
        //top crown
        fill(0,155,0);
        ellipse(trees_x[i]+16,trees_y-120,40);
        //middle crown
        ellipse(trees_x[i]+16,trees_y-82,65);
        //bottom crown
        ellipse(trees_x[i]+16,trees_y-30,95);
    }
}

function drawCanyon(t_canyon)
{
    //console.log("canyon drawn");
    fill(88,73,30);
    rect(t_canyon.x_pos,floorPos_y,100,height);
}

function checkCanyon(t_canyon)
{
    //console.log("jumped over canyon");
    //detect when the character is over the canyon
    if
    (
        t_canyon.x_pos<gameChar_x &&
        gameChar_x<(t_canyon.x_pos+100) &&
        gameChar_y>=floorPos_y
    )
    {
        isPlummeting = true;
        // isLeft = false; //to prevent it from moving left when its in the canyon
        // isRight = false; //to prevent it from moving right when its in the canyon
    }
}

function drawCollectable(t_collectable)
{
    if(t_collectable.isFound==false)
    {
        //console.log("leaf not collected")
        fill(85,174,103);
        //stalk; tr>bm>br
        triangle(t_collectable.x_pos+30,t_collectable.y_pos-18,t_collectable.x_pos+50,t_collectable.y_pos-1,t_collectable.x_pos+54,t_collectable.y_pos-3);
        //leaf
        push();
        translate(t_collectable.x_pos+50,t_collectable.y_pos-4);
        rotate(3);
        rect(0,0,t_collectable.size,t_collectable.size,10,30,10,30);
        pop();
        //line
        stroke(0);
        strokeWeight(3);
        beginShape(LINES);
        vertex(t_collectable.x_pos+12,t_collectable.y_pos-34);
        vertex(t_collectable.x_pos+36,t_collectable.y_pos-14);
        endShape();
        noStroke();
    }
}

function checkCollectable(t_collectable)
{
    //console.log("leaf collected")
    //collectable item interaction
    if(dist(gameChar_x,gameChar_y,t_collectable.x_pos,t_collectable.y_pos)<40)
    {
        t_collectable.isFound = true;
        game_score += 1;
        collectableSound.play();
    }
}

function createPlatforms(x,y,length)
{
    var p = {
        x: x,
        y: y,
        length: length,
        draw: function()
        {
            fill(88,73,30);
            triangle(this.x, this.y + 15, this.x + this.length/2, this.y + 30, this.x + this.length, this.y + 15);
            // rect(this.x,this.y,this.length,30);
            fill(14,132,42);
            rect(this.x,this.y,this.length,15);
        },
        checkContact: function(gc_x,gc_y)
        {
            if(gc_x>this.x && gc_x<this.x+this.length)
            {
                console.log("in line w platform");
                var d = this.y-gc_y;
                if(d>=-2 && d<1)
                {
                    console.log("on platform");
                    return true; //if duck is on platform
                }
            }
            return false; //if duck is NOT on platform
        }
    }
    return p;
}

function gameScore()
{
    fill(255);
    noStroke();
    text("score: "+game_score,20,20);
}

function lifeTokens()
{
    //life in HEARTS
    for(i=0;i<heart.length;i++)
    {        
        if(heart[i].lostLive==false) //red heart
        {
            fill(220,0,0);
            beginShape();
            vertex(heart[i].x+10,heart[i].y+5);
            bezierVertex(heart[i].x+2,heart[i].y,heart[i].x,heart[i].y+12,heart[i].x+10,heart[i].y+15);
            bezierVertex(heart[i].x+20,heart[i].y+12,heart[i].x+18,heart[i].y,heart[i].x+10,heart[i].y+5);
            endShape();    
        }
        else //grey heart
        {
            fill(220,0,0,100);
            beginShape();
            vertex(heart[i].x+10,heart[i].y+5);
            bezierVertex(heart[i].x+2,heart[i].y,heart[i].x,heart[i].y+12,heart[i].x+10,heart[i].y+15);
            bezierVertex(heart[i].x+20,heart[i].y+12,heart[i].x+18,heart[i].y,heart[i].x+10,heart[i].y+5);
            endShape();    
        }
    }
    //life in TEXT
    fill(255);
    noStroke();
    text("lives: ",860,20);
}

function checkPlayerDie()
{
    //DONT USE WHILE LOOP,, it crashes the code easily because the system will constantly loop it and repeat it >> too much = system crash
    if(gameChar_y>height+70 || isContactE == true)
    {
        die = true; //if the DUCK DIES
        lives -= 1;
        
        if(lives>0) 
        {
            startGame();
        }
        
        //runs ACCORDING TO THE CURRENT AMOUNT of life
        for(i=0;i<lives;i++)
        {
            heart[i].lostLive = false;
        }
        //draws the no of GREY hearts ACCORDING TO THE CHANGE IN LIFE(from above)
        for(i=lives;i<heart.length;i++)
        {
            heart[i].lostLive = true;
        }

        console.log("lives: ", lives);
    }
}

function gameOver()
{
    if(lives<1)
    {
        gameSound.stop();
        push(); //so the other texts("score" & "lives") will NOT change its alignment
        fill(255);
        noStroke();
        textAlign(CENTER,CENTER);
        text("Game over. Press space to continue.",width/2,height/2);
        pop();
        
        if(keyCode==32)
        {
            setup(); //to restart everything
        }
    }
    return;
}

function nextLevel()
{
    if(house.isReached == true) //change to gameWon
    {
        gameSound.stop();
        push();
        noStroke();
        textAlign(CENTER,CENTER);
        text("Level complete. Press space to continue.",width/2,height/2);
        pop();
    }
    return;
}

function renderHouse()
{
    if(house.isReached) //door OPEN,,isReached = true
    {
    //the house body
    fill(243,221,150);
    //noFill();
    beginShape();
    curveVertex(house.xBody,house.yBody); //1 top right
    curveVertex(house.xBody,house.yBody); //1,,,, floorPos_y-60
    curveVertex(house.xBody-2,house.yBody+28); //2
    curveVertex(house.xBody-8,house.yBody+45); //3-
    curveVertex(house.xBody+2,house.yBody+60); //4 bottom left
    curveVertex(house.xBody+70,house.yBody+60); //5 bottom right
    curveVertex(house.xBody+80,house.yBody+45); //6-
    curveVertex(house.xBody+74,house.yBody+28); //7
    curveVertex(house.xBody+70,house.yBody); //8 top left
    curveVertex(house.xBody+70,house.yBody); //8
    endShape();
    noStroke();

    //the roof
    fill(212,71,71);
    //noFill();
    beginShape();
    curveVertex(house.xRoof,floorPos_y-78); //1 
    curveVertex(house.xRoof,floorPos_y-78); //1 
    curveVertex(house.xRoof+20,floorPos_y-97); //2-
    curveVertex(house.xRoof+45,floorPos_y-104); //3 top left
    curveVertex(house.xRoof+75,floorPos_y-104); //4 top right
    curveVertex(house.xRoof+95,floorPos_y-97); //5-
    curveVertex(house.xRoof+115,floorPos_y-78); //6 top(right-corner)
    curveVertex(house.xRoof+120,floorPos_y-70); //7 middle(right-corner)
    curveVertex(house.xRoof+116,floorPos_y-62); //8 bottom(right-corner)
    curveVertex(house.xRoof+95,floorPos_y-58); //9-
    curveVertex(house.xRoof+75,floorPos_y-56); //10 bottom right
    curveVertex(house.xRoof+45,floorPos_y-56); //11 bottom left
    curveVertex(house.xRoof+20,floorPos_y-58); //12-
    curveVertex(house.xRoof,floorPos_y-63); //13
    curveVertex(house.xRoof-5,floorPos_y-71); //14
    curveVertex(house.xRoof-5,floorPos_y-71); //14
    endShape();

    fill(219);
    //left roof circle
    push();
    translate(house.xRoof+20,floorPos_y-90);
    rotate(-8.4);
    ellipse(0,0,15,26);
    pop();
    //middle roof circle
    push();
    translate(house.xRoof+60,floorPos_y-77);
    rotate(9.6);
    ellipse(0,0,36,27);
    pop();
    //right roof circle
    push();
    translate(house.xRoof+97,floorPos_y-90);
    rotate(5.3);
    ellipse(0,0,14,20);
    pop();

    //inside
    fill(74,43,23);
    rect(house.xDoor,house.yDoor,32,49,7,7);
    //the door
    fill(202,183,107);
    rect(house.xDoor+25,house.yDoor,14,49,5,10,0,0); //height of duck: 51
    //doorknob
    fill(102,60,18);
    ellipse(house.xDoor+39.5,house.yDoor+26,4,6);
    }
    else //door CLOSED,, isReached = false
    {
    //the house body
    fill(243,221,150);
    //noFill();
    beginShape();
    curveVertex(house.xBody,house.yBody); //1 top right
    curveVertex(house.xBody,house.yBody); //1,,,, floorPos_y-60
    curveVertex(house.xBody-2,house.yBody+28); //2
    curveVertex(house.xBody-8,house.yBody+45); //3-
    curveVertex(house.xBody+2,house.yBody+60); //4 bottom left
    curveVertex(house.xBody+70,house.yBody+60); //5 bottom right
    curveVertex(house.xBody+80,house.yBody+45); //6-
    curveVertex(house.xBody+74,house.yBody+28); //7
    curveVertex(house.xBody+70,house.yBody); //8 top left
    curveVertex(house.xBody+70,house.yBody); //8
    endShape();
    noStroke();

    //the roof
    fill(212,71,71);
    //noFill();
    beginShape();
    curveVertex(house.xRoof,floorPos_y-78); //1 
    curveVertex(house.xRoof,floorPos_y-78); //1 
    curveVertex(house.xRoof+20,floorPos_y-97); //2-
    curveVertex(house.xRoof+45,floorPos_y-104); //3 top left
    curveVertex(house.xRoof+75,floorPos_y-104); //4 top right
    curveVertex(house.xRoof+95,floorPos_y-97); //5-
    curveVertex(house.xRoof+115,floorPos_y-78); //6 top(right-corner)
    curveVertex(house.xRoof+120,floorPos_y-70); //7 middle(right-corner)
    curveVertex(house.xRoof+116,floorPos_y-62); //8 bottom(right-corner)
    curveVertex(house.xRoof+95,floorPos_y-58); //9-
    curveVertex(house.xRoof+75,floorPos_y-56); //10 bottom right
    curveVertex(house.xRoof+45,floorPos_y-56); //11 bottom left
    curveVertex(house.xRoof+20,floorPos_y-58); //12-
    curveVertex(house.xRoof,floorPos_y-63); //13
    curveVertex(house.xRoof-5,floorPos_y-71); //14
    curveVertex(house.xRoof-5,floorPos_y-71); //14
    endShape();
    
    fill(219);
    //left roof circle
    push();
    translate(house.xRoof+20,floorPos_y-90);
    rotate(-8.4);
    ellipse(0,0,15,26);
    pop();
    //middle roof circle
    push();
    translate(house.xRoof+60,floorPos_y-77);
    rotate(9.6);
    ellipse(0,0,36,27);
    pop();
    //right roof circle
    push();
    translate(house.xRoof+97,floorPos_y-90);
    rotate(5.3);
    ellipse(0,0,14,20);
    pop();

    //the door
    fill(202,183,107);
    rect(house.xDoor,house.yDoor,32,49,7,7); //height of duck: 51
    //doorknob
    fill(102,60,18);
    ellipse(house.xDoor+4,floorPos_y-22,4);
    }
}

function checkHouse()
{
    if
    (
        (dist(gameChar_x,gameChar_y,house.xDoor,house.yDoor+40)<15 || //going FROM left
        dist(house.xDoor+40,house.yDoor+40,gameChar_x,gameChar_y)<15) //going FROM right
        && game_score == 4
    )
    {
        house.isReached = true;
        isLeft = false;
        isRight = false;
    }
}

function Enemy(x,y,range)
{
    this.x = x;
    this.y = y;
    this.range = range;

    this.currentX = x;
    this.inc = 1; //increment

    this.update = function()
    {
        this.currentX += this.inc; //increase the value of the enemy by increments
        if(this.currentX>this.x+this.range) //if the enemy is OUTSIDE of the range
        {
            this.inc = -1; //moves back
        }
        else if(this.currentX<this.x)
        {
            this.inc += 1;
        }
    },
    this.draw = function() //draw the enemy
    {
        this.update(); //to draw the enemy in the right updated location
        //dog body
        fill(96);
        rect(this.x-20,this.y+10,this.range,25,10,10,10,10);
        //legs
        rect(this.x-15,this.y+30,this.range-43,15,5,5,5,5);
        rect(this.x-5,this.y+30,this.range-43,15,5,5,5,5);
        rect(this.x+10,this.y+30,this.range-43,15,5,5,5,5);
        rect(this.x+21,this.y+30,this.range-43,15,5,5,5,5);
        //tail
        push();
        translate(this.x-22,this.y+28);
        rotate(10);
        rect(0,0,this.range-45,10,5,5,5,5);
        pop();
        //face
        // stroke(5);
        // point(this.x-1,this.y+5); //1 anchor pt
        // point(this.x+3,this.y-40); //1st control pt,, acts like a GRAVITATIONAL PULL, top left(ear tip)
        // point(this.x+5,this.y-2); //2nd control pt left-R earMiddle-head
        // point(this.x+10,this.y-7); //2nd anchor pt(end)//start(1st anchor point) for the NEXT 'bezierVertex' /// left ear-head

        // point(this.x+15,this.y-11); //5 1st control pt leftOfhead,, GRAVITATIONAL PULL
        // point(this.x+21,this.y-11); //6 2nd control pt rightOfhead
        // point(this.x+28,this.y-7); //7 2nd anchor pt(end)//start(1st anchor point) for the NEXT 'bezierVertex' /// right ear-head

        // point(this.x+30,this.y-3); //8 1st control pt,, acts like a GRAVITATIONAL PULL
        // point(this.x+33,this.y-40); //9 2nd control pt top right(ear tip)
        // point(this.x+40,this.y+5) //10 2nd anchor pt(end)//start(1st anchor point) for the NEXT 'bezierVertex' /// right-R ear

        // point(this.x+30,this.y+25); //11 1st control pt,, acts like a GRAVITATIONAL PULL right bottom face
        // point(this.x+10,this.y+25); //12 2nd control pt left bottom face
        // point(this.x-2,this.y+5) //13 2nd anchor pt(end)//start(1st anchor point) for the NEXT 'bezierVertex'// go back to start point
        // noStroke();
        fill(100);
        beginShape();
        vertex(this.x-1,this.y+10);
        bezierVertex(this.x+3,this.y-45,this.x+5,this.y-3,this.x+10,this.y-7);
        bezierVertex(this.x+13,this.y-11,this.x+19,this.y-11,this.x+26,this.y-7);
        bezierVertex(this.x+28,this.y-3,this.x+31,this.y-45,this.x+38,this.y+5);
        bezierVertex(this.x+33,this.y+35,this.x+3,this.y+35,this.x-1,this.y+5); 
        endShape();
        //dog eyes
        fill(0);
        //left
        ellipse(this.x+10,this.y+5,7);
        //right
        ellipse(this.x+25,this.y+5,5);
        //nose
        triangle(this.x+11,this.y+11,this.x+24,this.y+11,this.x+17,this.y+15);
        //mouth
        fill(189,41,41);
        ellipse(this.x+17,this.y+21,8,9);
    },
    this.checkContact = function(gc_x,gc_y)
    {
        var d = dist(gc_x,gc_y,this.currentX,this.y+50);
        //console.log(d);
        if(d<20) //when enemy has made contact w duck
        {
            enemySound.play();
            lives -= 1;
            return true; 
        }
        return false;
    }
}