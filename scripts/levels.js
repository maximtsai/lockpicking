
function setRoom(room) {
    for (let i in globalObjects.extras) {
        globalObjects.extras[i].destroy();
    }
    globalObjects.extras = [];
    globalObjects.playUponUnlock = [];
    updatePickSpot();
    for (let i in globalObjects.indicators) {
        globalObjects.indicators[i].visible = false;
    }
    if (room === "practice") {
        loadPracticeRoom();
    } else if (room === "escape") {
        loadEscapeRoom();
    }
    resetPick()
}

function loadPracticeRoom() {
    createPins(3);
    setPicksLeft(99);
    for (let i in globalObjects.indicators) {
        globalObjects.indicators[i].visible = true;
    }
    globalObjects.currBackground.setFrame('door.png').setScale(2);
    globalObjects.mechanism.setFrame('mechanism.png');
    globalObjects.lock.setFrame('lock.png');
    let arrowLeft = PhaserScene.add.image(42, gameConsts.height - 112, 'ui', 'arrow.png').setRotation(Math.PI*-0.5).setScale(0.8);
    let arrowRight = PhaserScene.add.image(77, gameConsts.height - 112, 'ui', 'arrow.png').setRotation(Math.PI*0.5).setScale(0.8);
    let arrowUp = PhaserScene.add.image(42, gameConsts.height - 78, 'ui', 'arrow.png').setScale(0.8);
    globalObjects.extras.push(arrowLeft);
    globalObjects.extras.push(arrowRight);
    globalObjects.extras.push(arrowUp);

    globalObjects.roomTitle.setText('TRAINING LOCK')
    let instructions = PhaserScene.add.text(25, gameConsts.height - 155, "CONTROLS:", {fontFamily: 'kingthings', fontSize: 20, color: '#FFFFFF', align: 'left'}).setDepth(99).setStroke('#000000', 4).setOrigin(0, 0);
    globalObjects.extras.push(instructions);
    let instructions2 = PhaserScene.add.text(97, gameConsts.height - 126, "Move pick", {fontFamily: 'kingthings', fontSize: 20, color: '#FFFFFF', align: 'left'}).setDepth(99).setStroke('#000000', 4).setOrigin(0, 0);
    globalObjects.extras.push(instructions2);
    let instructions3 = PhaserScene.add.text(64, gameConsts.height - 92, "Lift tumbler", {fontFamily: 'kingthings', fontSize: 20, color: '#FFFFFF', align: 'left'}).setDepth(99).setStroke('#000000', 4).setOrigin(0, 0);
    globalObjects.extras.push(instructions3);
    let instructions4 = PhaserScene.add.text(30, gameConsts.height - 62, "Space/Enter to set tumbler when\nit reaches the top of the lock", {fontFamily: 'kingthings', fontSize: 20, color: '#FFFFFF', align: 'left'}).setDepth(99).setStroke('#000000', 4).setOrigin(0, 0);
    globalObjects.extras.push(instructions4);
    // let goalText = PhaserScene.add.text(570, gameConsts.height - 135, 'GOAL:\nSet all the\ntumblers\nin place ->', {fontFamily: 'kingthings', fontSize: 20, color: '#FFFFFF', align: 'left'}).setDepth(99).setOrigin(0, 0);
    // goalText.setStroke('#000000', 4)
    // globalObjects.extras.push(goalText);
    // let goalPic = PhaserScene.add.image(720, gameConsts.height - 72, 'lock', 'goal.png').setScale(0.8);
    // globalObjects.extras.push(goalPic);
    for (let i in globalObjects.extras) {
        globalObjects.extras[i].alpha = 0.1;
    }
    PhaserScene.tweens.add({
        targets: globalObjects.extras,
        alpha: 1,
        duration: 1000
    })
}

function loadEscapeRoom() {
    globalObjects.currBackground.setFrame('bars.png').setScale(2);
    globalObjects.mechanism.setFrame('mechanism_bar.png');
    globalObjects.lock.setFrame('padlock.png');


    let lockswivel = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'lock', 'padlock_swivel.png').setDepth(-1);
    globalObjects.extras.push(lockswivel);
    globalObjects.playUponUnlock = [() => {
        PhaserScene.tweens.add({
            targets: lockswivel,
            y: "-=22",
            ease: 'Quart.easeOut',
            duration: 400
        })
    }]
    createPins(2);
    setPicksLeft(3);
    globalObjects.roomTitle.setText('ESCAPE')
}

function gotoNextLevel() {
    let levelToGo = (gameVars.currLevel !== undefined) ? gameVars.currLevel + 1 : 0;
    gotoLevel(levelToGo);
}

function gotoLevel(lvl, skipIntro = false) {
    console.log("going to level ", lvl);
    gameVars.showNextButton = false;
    gameVars.currLevel = lvl;
    createGlobalClickBlocker(false)

    let blackPixelTemp = PhaserScene.add.image(-gameConsts.halfWidth - 300,gameConsts.halfHeight, 'blackPixel').setScale(500,600).setRotation(0.3).setDepth(999).setAlpha(0.1);

    playSound('whoosh');
    blackPixelTemp.currAnim = PhaserScene.tweens.add({
        targets: blackPixelTemp,
        alpha: 1,
        x: gameConsts.halfWidth,
        ease: 'Quad.easeOut',
        duration: 200,
        onComplete: () => {
            hideGlobalClickBlocker();
            PhaserScene.tweens.add({
                targets: blackPixelTemp,
                x: "+=2300",
                ease: 'Cubic.easeIn',
                duration: 300,
                alpha: 0,
                onComplete: () => {
                    blackPixelTemp.destroy();
                }
            })
            if (globalObjects.victory) {
                for (let i in globalObjects.victory) {
                    globalObjects.victory[i].destroy();
                }
            }

            let flavorStory = [
                "",
                "I've been imprisoned for slipping into\nrestricted places and claiming protected\ntreasures.\n\nThe bars of this cell are strong, but the lock\nis crude. It should be an easy thing to pick.",
                "I have escaped, but to reach the castle’s treasure, I need finer clothes to be presentable. The clothier’s lock is sturdy, a step above the prison’s, but I’m confident I can slip in and claim the attire I need.",
                "The castle looms, its treasures calling, but sturdy outer gates bar my path. Their locks are well-crafted, yet familiar. I find a blind spot in the security patrols and begin.",
                "An unassuming door blocks my way, its plain facade hiding a tricky lock enchanted to reset if I falter. One wrong move could undo my progress. I steady my hands and listen closely to crack its magic.",
                "The princess's door stands before me, its locks a masterpiece of craft and enchantment. Every safeguard known protects this final barrier. Failure is not an option, but victory is within reach.",
                "I’ve reached the true treasure: Princess Liora's guarded heart, protected by the most intricate lock of all. Each move must be deliberate, each word precise, to unlock her trust and love. I tread with utmost care, knowing this is my greatest challenge yet.",
                "The final tumbler clicks, and Liora's heart opens, her warm smile inviting me to talk by the fire for hours, undisturbed by guards. As dawn approaches, I slip out the tower window, heart full, certain I’ll return to her another night."
            ]

            switch(lvl) {
                case 0:
                    setRoom("practice");
                    break;
                case 1:
                    setRoom("escape");
                    break;
            }
            let levelNames = [
                "Training Lock",
                "Level 1: Escape",
                "Level 2: Dressing Up",
                "Level 3: Palace Gate",
                "Level 4: Tricky Door",
                "Level 5: Bedroom",
                "Level 6: Her Heart"];
            if (lvl > 0 && !skipIntro) {
                setTimeout(() => {
                    openFlavorPopup(levelNames[lvl], flavorStory[lvl], 'flavorimage' + lvl + '.png')

                }, 0)
            }
        }
    })
    // globalObjects.extras.flavorText = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 50, flavorStory[lvl], {fontFamily: 'kingthings', fontSize: 24, color: '#FFFFFF', align: 'center'}).setStroke('#000000', 4).setOrigin(0.5, 0.5)
}


function openLevelPopup() {
    let lvlContents = {};
    lvlContents.title = PhaserScene.add.text(gameConsts.halfWidth, 123, 'LEVEL SELECT', {fontFamily: 'kingthings', fontSize: 32, color: '#000000', align: 'center'}).setDepth(102).setOrigin(0.5, 0.5);
    openPopup(lvlContents)
    let extraContents = {};

    let levelNames = [
        "Training Lock",
        "Level 1: Escape",
        "Level 2: Dressing Up",
        "Level 3: Palace Gate",
        "Level 4: Tricky Door",
        "Level 5: Bedroom",
        "Level 6: Her Heart"];
    let levelNamesAlt = [
        "Training Lock",
        "Level 1: Chains",
        "Level 2",
        "Level 3",
        "Level 4",
        "Level 5",
        "Level 6",
        "Level 7"];
    for (let i = 0; i < levelNames.length; i++) {
        let btnName = "level_"+i;
        let levelButton = new Button({
            normal: {
                atlas: 'buttons',
                ref: "menu_btn_normal.png",
                x: gameConsts.halfWidth,
                y: gameConsts.halfHeight - 140 + i * 41,
                scaleX: 1,
                scaleY: 0.65,
                alpha: 1,
            },
            hover: {
                atlas: 'buttons',
                ref: "menu_btn_hover.png",
                alpha: 1,
            },
            press: {
                atlas: 'buttons',
                ref: "menu_btn_press.png",
                alpha: 1,
            },
            disable: {
                atlas: 'buttons',
                ref: "menu_btn_press.png",
                alpha: 0.5,
            },
            onHover: () => {
                if (canvas) {
                    canvas.style.cursor = 'pointer';
                }
            },
            onHoverOut: () => {
                if (canvas) {
                    canvas.style.cursor = 'default';
                }
            },
            onMouseUp: () => {
                gotoLevel(i);
                closePopup();
            }
        });
        levelButton.addText(levelNames[i], {fontFamily: 'kingthings', fontSize: 20, color: '#000000', align: 'center'})

        //closeButton.setTextOffset(1, 0)
        levelButton.setDepth(102);
        if (i > gameVars.latestLevel) {
            levelButton.setState(DISABLE);
            levelButton.setText(levelNamesAlt[i]);
        }


        extraContents[btnName] = levelButton;
    }

    addPopupContents(extraContents);
}

function addPopupContents(contents) {
    for (let i in contents) {
        globalObjects.currPopup[i] = contents[i];
    }
}
