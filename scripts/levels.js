
function setRoom(room) {
    if (globalObjects.infoText.currAnim) {
        globalObjects.infoText.currAnim.stop();
    }
    globalObjects.infoText.alpha = 0;
    for (let i in globalObjects.extras) {
        globalObjects.extras[i].destroy();
    }
    gameVars.currRoom = room;
    gameVars.pinsFixed = 0;
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
    } else if (room === "clothes") {
        loadClothesRoom();
    } else if (room === "gate") {
        loadGateRoom();
    } else if (room === "enchanted") {
        loadEnchantedRoom();
    } else if (room === "bedroom") {
        loadBedRoom();
    } else if (room === "princess") {
        loadPrincessRoom();

    } else if (room === "challenge") {
        loadChallengeRoom();

    }
    resetPick()
}

function loadPracticeRoom() {
    swapMusic('quietshadows');
    createPins(5);
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
    swapMusic('lili');
    globalObjects.currBackground.setFrame('bars.png').setScale(2);
    globalObjects.mechanism.setFrame('mechanism_bar.png');
    globalObjects.lock.setFrame('padlock.png');


    let lockswivel = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'padlock_swivel.png').setDepth(-1);
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

function loadClothesRoom() {
    swapMusic('lili');
    globalObjects.currBackground.setFrame('clothes.png').setScale(2);
    globalObjects.mechanism.setFrame('mechanism_bar.png');
    globalObjects.lock.setFrame('padlock.png');


    let lockswivel = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'padlock_swivel.png').setDepth(-1);
    globalObjects.extras.push(lockswivel);
    globalObjects.playUponUnlock = [() => {
        PhaserScene.tweens.add({
            targets: lockswivel,
            y: "-=22",
            ease: 'Quart.easeOut',
            duration: 400
        })
    }]
    createPins(3);
    setPicksLeft(3);
    globalObjects.roomTitle.setText('CLOTHIER')
}

function loadGateRoom() {
    swapMusic('indeep');
    globalObjects.currBackground.setFrame('gate.png').setScale(2);
    globalObjects.mechanism.setFrame('mechanism_bar.png');
    globalObjects.lock.setFrame('security_lock.png');

    let lockPin1 = PhaserScene.add.image(gameConsts.halfWidth + 5, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'security_pin.png').setDepth(-2);
    globalObjects.extras.push(lockPin1);
    let lockPin2 = PhaserScene.add.image(gameConsts.halfWidth + 85, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'security_pin.png').setDepth(-2);
    globalObjects.extras.push(lockPin2);
    let lockPin3 = PhaserScene.add.image(gameConsts.halfWidth + 5, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'security_pin.png').setDepth(-2).setScale(1, -1);
    globalObjects.extras.push(lockPin3);
    let lockPin4 = PhaserScene.add.image(gameConsts.halfWidth + 85, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'security_pin.png').setDepth(-2).setScale(1, -1);
    globalObjects.extras.push(lockPin4);
    globalObjects.playUponUnlock = [() => {
        PhaserScene.tweens.add({ targets: lockPin1, y: "-=45", ease: 'Quint.easeOut', duration: 100,
            onComplete: () => {
                PhaserScene.tweens.add({delay: 100, targets: lockPin1, y: "-=400", ease: 'Quad.easeInOut', duration: 1500,})
            }
        });
        PhaserScene.tweens.add({targets: lockPin2, y: "-=45", ease: 'Quint.easeOut', duration: 100,
            onComplete: () => {
                PhaserScene.tweens.add({ delay: 250, targets: lockPin2, y: "-=400", ease: 'Quad.easeInOut', duration: 1200})
            }
        });
        PhaserScene.tweens.add({targets: lockPin3, y: "+=70", ease: 'Quint.easeOut', duration: 100,
            onComplete: () => {
                PhaserScene.tweens.add({ delay: 200, targets: lockPin3, y: "+=400", ease: 'Quad.easeInOut', duration: 1200})
            }
        });
        PhaserScene.tweens.add({targets: lockPin4, y: "+=70", ease: 'Quint.easeOut', duration: 100,
            onComplete: () => {
                PhaserScene.tweens.add({ delay: 350, targets: lockPin4, y: "+=400", ease: 'Quad.easeInOut', duration: 1200})
            }
        });
    }]
    createPins(4);
    setPicksLeft(3);
    globalObjects.roomTitle.setText('GATES')
}

function loadEnchantedRoom() {
    swapMusic('indeep');
    globalObjects.currBackground.setFrame('door.png').setScale(2);
    globalObjects.mechanism.setFrame('mechanismgold.png');
    globalObjects.lock.setFrame('goldenlock.png');

    createPins(3, true);
    setPicksLeft(3);
    globalObjects.roomTitle.setText('ENCHANTED DOOR')
}

function loadBedRoom() {
    swapMusic('indeep');
    globalObjects.currBackground.setFrame('bedroom.png').setScale(2);
    globalObjects.mechanism.setFrame('mechanismgold.png');
    globalObjects.lock.setFrame('goldenlock.png');


    let lockswivel = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'padlock_swivel.png').setDepth(-1);
    globalObjects.extras.push(lockswivel);
    globalObjects.playUponUnlock = [() => {
        PhaserScene.tweens.add({
            targets: lockswivel,
            y: "-=22",
            ease: 'Quart.easeOut',
            duration: 400
        })
    }]
    createPins(4, true);
    setPicksLeft(3);
    globalObjects.roomTitle.setText("PRINCESS DOOR")
}

function loadPrincessRoom() {
    swapMusic('princess');
    gameVars.princessCounter = 1;
    globalObjects.currBackground.setFrame('princess.png').setScale(1.3);
    globalObjects.mechanism.setFrame('blank.png');
    globalObjects.lock.setFrame('heartlock.png');


    let lockswivel = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'padlock_swivel.png').setDepth(-1);
    globalObjects.extras.push(lockswivel);
    globalObjects.playUponUnlock = [() => {
        PhaserScene.tweens.add({
            targets: lockswivel,
            y: "-=22",
            ease: 'Quart.easeOut',
            duration: 400
        })
    }]
    createPins(5, true);
    setPicksLeft(4);
    globalObjects.roomTitle.setText('PRINCESS')
}

function loadChallengeRoom() {
    globalObjects.currBackground.setFrame('workbench2.png').setScale(2);
    globalObjects.mechanism.setFrame('mechanism_bar.png');
    globalObjects.lock.setFrame('padlock.png');

    let lockswivel = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'padlock_swivel.png').setDepth(-1);
    globalObjects.extras.push(lockswivel);
    globalObjects.playUponUnlock = [() => {
        PhaserScene.tweens.add({
            targets: lockswivel,
            y: "-=22",
            ease: 'Quart.easeOut',
            duration: 400
        })
    }]
    createPins(5, true, true);
    setPicksLeft(4);
    globalObjects.roomTitle.setText('ESCAPE')
}



function gotoNextLevel() {
    let levelToGo = (gameVars.currLevel !== undefined) ? gameVars.currLevel + 1 : 0;
    gotoLevel(levelToGo);
}

function gotoLevel(lvl, skipIntro = false) {
    gameVars.showNextButton = false;
    gameVars.currLevel = lvl;
    createGlobalClickBlocker(false)
    gameVars.pinsFixed = 0;

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
                "I have escaped, but to reach the castle’s\ntreasure, I must first make myself presentable.\n\nThe clothier store is closed, but I’m confident\nI can slip in and acquire the attire I need.",
                "The castle looms ahead, but sturdy gates\nbar the path. Their locks are well crafted,\nbut familiar.\n\nI find a blind spot in the security patrols\nand begin.",
                "Inside the castle, a simple wood door blocks\nmy way, but I know it hides a tricky lock\nenchanted to reset if I falter.\n\nOne wrong move could undo my progress. I\nsteady my hands and get ready to crack its\nmagic.",
                "The princess's door stands before me, its locks\na masterpiece of craft and enchantment.\n\nEvery safeguard known protects this final\nbarrier. Failure is not an option, but victory\nis within reach.",
                "Princess Liora looks up from her book,\namused but watching me carefully.\n\nBefore me is a lock more guarded than any\nvault, Liora's trust.\n\nI begin our conversation with care, each\nword and action as precise as a lockpick's\ndelicate turn.",
                "A rival locksmith unveils a bizarre, maddeningly\nintricate device—so complex it barely\nqualifies as a lock.\n\nIts obscene design taunts me, but I’ve\nnever backed down from a challenge. I\nstep forward, ready to conquer it as I have\nall others.\n"
            ]

            switch(lvl) {
                case 0:
                    setRoom("practice");
                    break;
                case 1:
                    setRoom("escape");
                    break;
                case 2:
                    setRoom("clothes");
                    break;
                case 3:
                    setRoom("gate");
                    break;
                case 4:
                    setRoom("enchanted");
                    break;
                case 5:
                    setRoom("bedroom");
                    break;
                case 6:
                    setRoom("princess");
                    break;
                case 7:
                    setRoom("challenge");
                    break;
            }
            let levelNames = [
                "Training Lock",
                "Level 1: Escape",
                "Level 2: Dressing Up",
                "Level 3: Palace Gate",
                "Level 4: Enchanted Door",
                "Level 5: Princess Door",
                "Level 6: Her Trust",
                "Level 7: Challenge"];
            if (lvl > 0 && !skipIntro) {
                setTimeout(() => {
                    let imageScale = 1;
                    if (lvl === 3) {
                        imageScale = 0.9;
                    }
                    openFlavorPopup(levelNames[lvl], flavorStory[lvl], 'flavorimage' + lvl + '.png',imageScale)

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
        "Level 4: Enchanted Door",
        "Level 5: Princess Door",
        "Level 6: Her Trust",
        "Level 7: Challenge"];
    let levelNamesAlt = [
        "Training Lock",
        "Level 1: Escape",
        "Level 2",
        "Level 3",
        "Level 4",
        "Level 5",
        "Level 6",
        "Level 7"];
    for (let i = 0; i < levelNames.length; i++) {
        let btnName = "level_"+i;
        if (i < levelNames.length - 1 || gameVars.latestLevel >= levelNames.length - 1) {
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

    }

    addPopupContents(extraContents);
}

function addPopupContents(contents) {
    for (let i in contents) {
        globalObjects.currPopup[i] = contents[i];
    }
}
