//Tested in FireFox and Chrome

//known major bugs in FireFox:
//after game over: player moves 
//enemies/bonuses/roadstripes don't get removed immediately after gameover

//known major bugs in Chrome:
//after gam eover: player moves 
//lifeBoard updates after clicking cancel in confirm-box

(function () {
    "use strict";

    var game = {
        animationId: null,
        player: null,
        playerSpeed: 5,
        timer: null,
        keys: {},
        keyLeft: 37,
        keyRight: 39,
        enemyCount: 1,
        enemySpeed: 5,
        enemies: [],//
        bonusCount: 2,
        bonusSpeed: 6,
        bonuses: [],
        windowRight: window.innerWidth - 80 - (window.innerWidth*15/100),
        windowLeft: (window.innerWidth*15)/100,
        windowBottom: window.innerHeight,
        timerEnemyID: null,
        timerBonusID: null,
        timerRoadStripeID: null,
        roadSpeed: 3,
        roadStripes: [],
        lifeCount: 3,
        score: 0,
        scoreBoard: null,
        lifeBoard: null
    }

    //the setup
    var init = function () {

        //a little hack to prevent the body from moving/scrolling when key up/down and space is pressed
        window.addEventListener("keydown", function (e) {
            // space and up/down arrow keys
            if ([32, 38, 40].indexOf(e.keyCode) > -1) {
                e.preventDefault();
            }
        }, false);

        registerKeyboardEvents();

        addGreenLeft();
        addGreenRight();

        createScoreBoard();
        updateScoreBoard();

        createLifeBoard();
        updateLifeBoard();


        createRoadStripes();
        game.timerRoadStripeID = setInterval(function(){
            createRoadStripes();
        }, game.roadSpeed * 1000);

        createPlayer();

        game.timerEnemyID = setInterval(function () {
            createEnemies();
        }, 2 * 500);

        game.timerBonusID = setInterval(function () {
            createBonuses();
        }, game.bonusSpeed * 1000);

        console.log("Game started");
        render();
    }

    var createGreen = function () {
        var element = document.createElement("div");
        element.className = "green";
        document.body.appendChild(element);
        return element;
    }

    var addGreenLeft = function () {
        var green = createGreen();
        green.style.cssFloat = "left";
        green.style.styleFloat = "left";
        green.style.width = 15 + "%";
        green.style.height = window.innerHeight + "px";
        console.log("her: " +window.innerHeight);
        
    }

    var addGreenRight = function () {
        var green = createGreen();
        green.style.cssFloat = "right";
        green.style.styleFloat = "right";
        green.style.width = 15 + "%";
        green.style.height = window.innerHeight + "px";
    }

    var createScoreBoard = function () {
        var element = document.createElement("div");
        element.className = "scoreBoard";
        document.body.appendChild(element);
        game.scoreBoard = element;
        return element;
    }

    var updateScoreBoard = function () {
        var score = game.scoreBoard;
        score.innerHTML = "Score: " + game.score;
    }

    var createLifeBoard = function () {
        var element = document.createElement("div");
        element.className = "lifeBoard";
        document.body.appendChild(element);
        game.lifeBoard = element;
        return element;
    }

    var updateLifeBoard = function () {
        var life = game.lifeBoard;
        life.innerHTML = "Life: " + game.lifeCount;
    }

    var createPlayer = function () {
        var element = document.createElement("div");
        element.className = "player";
        element.style.left = 49 + "%";
        element.style.bottom = 0 + "px";
        document.body.appendChild(element);
        game.player = element;
    };

    var createEnemies = function () {
        for (var i = 0; i < game.enemyCount; i++) {
            var enemy = createEnemy();
            game.enemies.push(enemy);
        }
    };

    var createEnemy = function () {
        var element = document.createElement("div");
        element.className = "enemy";
        element.style.left = getRandomNumber(game.windowLeft, game.windowRight) + "px";
        element.style.top = 0 + "px";
        document.body.appendChild(element);
        return element;
    };

    var createBonuses = function () {
        for (var i = 0; i < game.bonusCount; i++) {
            var bonus = createBonus();
            game.bonuses.push(bonus);
        }
    };

    var createBonus = function () {
        var element = document.createElement("div");
        element.className = "bonus";
        element.style.left = getRandomNumber(game.windowLeft, game.windowRight) + "px";
        element.style.top = 0 + "px";
        document.body.appendChild(element);
        return element;
    };

    var createRoadStripes = function () {
            var roadStripe = createRoadStripe();
            game.roadStripes.push(roadStripe);
    }

    var createRoadStripe = function () {
        var element = document.createElement("div");
        element.className = "roadStripe";
        element.style.left = 49 + "%";
        element.style.top = -150 + "px";
        document.body.appendChild(element);
        return element;
    }


    var registerKeyboardEvents = function () {
        document.body.addEventListener("keydown", function (e) {
            game.keys[e.keyCode] = true;
        });
        document.body.addEventListener("keyup", function (e) {
            delete game.keys[e.keyCode];
        });
    };

    var getRandomNumber = function (min, max) {
        return Math.round(Math.random() * (max - min) + min);
    }

    //returns true if any part of element is in viewport
    function isElementInViewport(element) {
        var rect = element.getBoundingClientRect();
        return rect.bottom > 0 &&
            rect.right > 0 &&
            rect.left < (window.innerWidth || document.documentElement.clientWidth) &&
            rect.top < (window.innerHeight || document.documentElement.clientHeight);
    }

    var deleteElementsInViewport = function (list) {
        list.forEach(function (element) {
            if (isElementInViewport(element)) {
                list.splice(list.indexOf(element), 1);
                document.body.removeChild(element);
            }
        });
    }

    var deleteElementsNotInViewport = function (list) {
        list.forEach(function (element) {
            if (!isElementInViewport(element)) {
                list.splice(list.indexOf(element), 1);
                document.body.removeChild(element);
            }
        });
    }
    
    var collision = function (list) {
        var playerLeft = game.player.offsetLeft,
        playerTop = game.player.offsetTop,
        playerBottom = game.player.offsetTop + 160,
        playerRight = game.player.offsetLeft + 80;

        var collided = null;

        list.forEach(function (element, i, arr) {
            var elementLeft = element.offsetLeft - 5,
				elementTop = element.offsetTop - 5,
				elementBottom = element.offsetTop + 45,
				elementRight = element.offsetLeft + 45;

            if (playerLeft < elementRight && playerRight > elementLeft && playerTop < elementBottom && playerBottom > elementTop) {
                collided = element;
            }
        });
        return collided;
    }


    //when hit by enemy three times call this---------------------------------
    //var hitme = function () {
    //    cancelAnimationFrame(game.animationId);
    //    var gameElapsed = (new Date() - game.timer) / 1000;
    //    console.log("Game over in " + gameElapsed + " seconds");
    //}

    //render = (the loop)
    var render = function () {
        //console.log(game.animationId);

        //roadStripes
        game.roadStripes.forEach(function (roadStripe) {
            roadStripe.style.top = roadStripe.offsetTop + game.roadSpeed + "px";
        });

        ////bonuses
        game.bonuses.forEach(function (bonus) {
            bonus.style.top = bonus.offsetTop + game.bonusSpeed + "px"; 
        });

        //enemies
        game.enemies.forEach(function (enemy) {
           enemy.style.top = enemy.offsetTop + game.enemySpeed + "px";
        });

        //key right
        if (game.keys[game.keyRight]) {
            if (game.player.offsetLeft < game.windowRight) {
                game.player.style.left = game.player.offsetLeft + game.playerSpeed + "px";
            }
        }

        //key left
        if (game.keys[game.keyLeft]) {
            if (game.player.offsetLeft > game.windowLeft) {
                game.player.style.left = game.player.offsetLeft - game.playerSpeed + "px";
            }
        }
        game.animationId = requestAnimationFrame(render);//??

        var collisionEnemy = collision(game.enemies);
        if (collisionEnemy) {
            game.enemies.splice(game.enemies.indexOf(collisionEnemy), 1);
            document.body.removeChild(collisionEnemy);

            if (game.lifeCount > 1) {
                //console.log("life: " + game.lifeCount);
                game.lifeCount--;
                updateLifeBoard();
                //console.log(game.lifeCount);
            }
            else {
                //gameover
                game.lifeCount--;//=0
                updateLifeBoard();

                if (window.confirm("GAME OVER. Do you want to play again?")) {
                    //reload. NOT from cache
                    document.location.reload(true);
                }
                else {
                    clearInterval(game.timerEnemyID);
                    clearInterval(game.timerRoadStripeID);
                    clearInterval(game.timerBonusID);

                    //doesn't work in FireFox
                    //window.close();
                    console.log("enemies length " + game.enemies.length);
                    console.log("bonuses length " + game.bonuses.length);
                    console.log("roadstripes length " + game.roadStripes.length);
                    //doesn't work in FireFox - (couldn't figure out why!)
                    deleteElementsInViewport(game.enemies);
                    deleteElementsInViewport(game.bonuses);
                    deleteElementsInViewport(game.roadStripes);

                    console.log("enemies length "+game.enemies.length);
                    console.log("bonuses length "+game.bonuses.length);
                    console.log("roadstripes length " +game.roadStripes.length);
                }
            }
        }

        var collisionBonus = collision(game.bonuses);
        if (collisionBonus) {
            game.bonuses.splice(game.bonuses.indexOf(collisionBonus), 1);
            document.body.removeChild(collisionBonus);
           
            //var newScore = game.score;
            game.score++;
           updateScoreBoard();
            //console.log(newScore);
        }
       
        //removes enemies, bonuses and roadstripes not in viewport
        deleteElementsNotInViewport(game.enemies);
        deleteElementsNotInViewport(game.bonuses);
        deleteElementsNotInViewport(game.roadStripes);
    }

    init();

})();