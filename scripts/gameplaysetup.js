let canFinishLoading = false;
let canvas;

function setupLoadingBar(scene) {
    // PhaserScene.cameras.main.setZoom(0.98);
    // fadeInBackground('backgroundPreload', 5000, 3.28);

    // Basic loading bar visual
    loadObjects.version = scene.add.text(4, gameConsts.height - 4, gameVersion).setOrigin(0, 1).setAlpha(0.7);
    loadObjects.version.scrollFactorX = 0; loadObjects.version.scrollFactorY = 0;

    loadObjects.loadingText = scene.add.text(gameConsts.halfWidth, gameConsts.height - (isMobile ? 342 : 328), 'Loading...', {fontFamily: 'kingthings', fontSize: 36, color: '#FFFFFF', align: 'center'}).setDepth(1001);
    loadObjects.loadingText.setScale(0.6).setAlpha(0.93);
    loadObjects.loadingText.setAlign('center');
    loadObjects.loadingText.setOrigin(0.5, 0);
    loadObjects.loadingText.scrollFactorX = 0.3; loadObjects.loadingText.scrollFactorY = 0.3;
    loadObjects.loadingBarBack = scene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + 100, 'whitePixel').setAlpha(0.5);
    loadObjects.loadingBarMain = scene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + 100, 'whitePixel');

    loadObjects.loadingBarBack.setScale(200, 3);
    loadObjects.loadingBarMain.setScale(1, 3);

    // Setup loading bar logic
    scene.load.on('progress', function (value) {
        loadObjects.loadingBarMain.scaleX = 200 * value;
    });
    scene.load.on('complete', () => {
        loadObjects.loadingText.setVisible(false);
        onLoadComplete(scene);
        // loadObjects.fadeBG = scene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(1000).setAlpha(0.5).setDepth(-5);

        for (let i in loadObjects) {
            loadObjects[i].destroy();
        }
    });
}


function clickIntro() {
    gameVars.runningIntro = true;

    PhaserScene.tweens.add({
        targets: PhaserScene.cameras.main,
        scrollX: 0,
        scrollY: 0,
        duration: 750,
        ease: 'Cubic.easeOut'
    });

    PhaserScene.tweens.add({
        targets: [loadObjects.loadingText2, loadObjects.loadingText3],
        alpha: 0,
        duration: 800,
        ease: 'Quad.easeOut'
    });


    if (gameOptions.skipIntroFull) {
        loadObjects.glowBG.alpha = 0;
        PhaserScene.tweens.add({
            targets: loadObjects.glowBG,
            alpha: 1,
            duration: 900,
            ease: 'Quart.easeIn',
            onComplete: () => {
                this.skipIntro();
            }
        });
        loadObjects.glowBG.setScale(14);

    } else {
        PhaserScene.tweens.add({
            delay: 1500,
            targets: loadObjects.glowBG,
            alpha: 1.25,
            scaleX: 14,
            scaleY: 14,
            duration: 500,
            ease: 'Quart.easeIn',
            onComplete: () => {
                cleanupIntro(PhaserScene);
            }
        });
    }

    loadObjects.skipIntroText = PhaserScene.add.text(gameConsts.width - 5, gameConsts.height - 5, getLangText('click_to_skip'), {fontFamily: 'verdana', fontSize: 18, color: '#FFFFFF', align: 'right'}).setDepth(1005).setAlpha(0).setOrigin(1, 1);
    // loadObjects.loadingText.setText(" ").setAlpha(0).setScale(0.75).y -= 18;
    loadObjects.whiteOverall = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel').setDepth(2000).setAlpha(0).setScale(1000);
    PhaserScene.tweens.add({
        targets: loadObjects.whiteOverall,
        alpha: 0.75,
        ease: 'Quad.easeIn',
        duration: 2100
    });
}

function cleanupIntro() {
    if (gameVars.introFinished) {
        return;
    }
    gameVars.introFinished = true;
    tempBG = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'whitePixel').setScale(1000).setAlpha(0.85).setDepth(1002);
    PhaserScene.tweens.add({
        targets: tempBG,
        alpha: 0,
        duration: 750,
        onComplete: () => {
            tempBG.destroy();
        }
    });

    hideGlobalClickBlocker();
}

function setupGame() {
    canvas = game.canvas;
    if (gameVars.started) {
        return;
    }

    gameVars.started = true;
    // PhaserScene.sound.pauseOnBlur = false;

    createAnimations(PhaserScene);

    globalObjects.timeManager = new TimeManager();
    globalObjects.keyboardControls = new KeyboardControls();

    let levelButton = new Button({
        normal: {
            atlas: 'buttons',
            ref: "menu_btn_normal.png",
            x: 65,
            y: 24,
            scaleX: 0.47,
            scaleY: 0.47
        },
        hover: {
            atlas: 'buttons',
            ref: "menu_btn_hover.png",
        },
        press: {
            atlas: 'buttons',
            ref: "menu_btn_press.png",
        },
        onHover: () => {
            if (canvas) {
                playSound('click').detune = -50;
                canvas.style.cursor = 'pointer';
            }
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
        },
        onMouseUp: () => {
            openLevelPopup();
        }
    });
    levelButton.addText("LVL SELECT", {fontFamily: 'kingthings', fontSize: 20, color: '#000000', align: 'center'});
    levelButton.setTextOffset(0, 1)
    levelButton.setDepth(2)


    globalObjects.extras = [];
    globalObjects.roomTitle = PhaserScene.add.text(gameConsts.halfWidth, 50, 'TRAINING LOCK', {fontFamily: 'kingthings', fontSize: 40, color: '#FFFFFF', align: 'center'}).setStroke('#000000', 4).setDepth(99).setOrigin(0.5, 0.5);

    // globalObjects.hoverTextManager = new InternalHoverTextManager(PhaserScene);
    PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'lock', 'background.png');
    PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'lock', 'lock.png');
    globalObjects.pickshadow = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'lock', 'pickshadow.png').setAlpha(0.6);
    globalObjects.mechanism = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'lock', 'mechanism.png');
    globalObjects.pick = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'lock', 'pick.png');
    globalObjects.pins = [];
    globalObjects.indicators = [];
    gameVars.currentPin = 0;
    for (let i = 0; i < 5; i++) {
        let xOffset = 0;
        if (i == 1) {
            xOffset = 1;
        }
        globalObjects.indicators[i] = PhaserScene.add.image(gameConsts.halfWidth - 35 + i * 30.6 + xOffset, gameConsts.halfHeight - 88, 'lock', 'icon_black.png');
    }
    PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'lock', 'lockshadow.png').setDepth(1);

    setRoom('practice');
}

function setRoom(room) {
    for (let i in globalObjects.extras) {
        globalObjects.extras[i].destroy();
    }
    globalObjects.extras = [];
    if (room == "practice") {
        createPins(3);
        globalObjects.roomTitle.setText('TRAINING LOCK')
        let instructions = PhaserScene.add.text(35, gameConsts.height - 150, "CONTROLS:\n- Left/Right to move pick\n- Up to push up tumbler\n- Space/Enter to set tumbler when\n   it reaches the top of the lock", {fontFamily: 'kingthings', fontSize: 20, color: '#FFFFFF', align: 'left'}).setDepth(99).setStroke('#000000', 4).setOrigin(0, 0);
        globalObjects.extras.push(instructions);
        let goalText = PhaserScene.add.text(570, gameConsts.height - 135, 'GOAL:\nSet all the\ntumblers\nin place ->', {fontFamily: 'kingthings', fontSize: 20, color: '#FFFFFF', align: 'left'}).setDepth(99).setOrigin(0, 0);
        goalText.setStroke('#000000', 4)
        globalObjects.extras.push(goalText);
        let goalPic = PhaserScene.add.image(720, gameConsts.height - 72, 'lock', 'goal.png').setScale(0.8);
        globalObjects.extras.push(goalPic);

    }
}

function createPins(amt) {
    gameVars.maxPins = amt;
    for (let i in globalObjects.pins) {
        globalObjects.pins[i].destroy();
    }
    globalObjects.mechanism.x = gameConsts.halfWidth;
    globalObjects.pins = [];
    for (let i in globalObjects.indicators) {
        globalObjects.indicators[i].setFrame('icon_black.png');
    }

    for (let j = 0; j < amt; j++) {
        let yOffset = 1 + Math.floor(Math.random() * 15);
        let xOffset = 0;
        if (j == 1) {
            xOffset = 1;
        }
        globalObjects.pins[j] = PhaserScene.add.image(gameConsts.halfWidth - 36 + j * 30.6 + xOffset, gameConsts.halfHeight - 8 - yOffset, 'lock', 'pin.png');
        globalObjects.pins[j].startY = gameConsts.halfHeight - 8;
        globalObjects.pins[j].currAnim = PhaserScene.tweens.add({
            targets: globalObjects.pins[j],
            y: globalObjects.pins[j].startY,
            ease: 'Cubic.easeIn',
            duration: 20 + yOffset * 15,
            onComplete: () => {
                globalObjects.indicators[j].setFrame('icon_yellow.png');
            }
        });
    }
}

function updatePickSpot() {
    let goalX = gameConsts.halfWidth + gameVars.currentPin * 30.3;
    if (globalObjects.pick.currAnim) {
        globalObjects.pick.currAnim.stop();
    }
    globalObjects.pick.currAnim = PhaserScene.tweens.add({
        targets: [globalObjects.pick, globalObjects.pickshadow],
        x: goalX,
        duration: 140,
        ease: 'Quart.easeOut',
    })
    globalObjects.pick.y = gameConsts.halfHeight;
    globalObjects.pickshadow.y = gameConsts.halfHeight;
}

function pickMoveUp(canBuffer = true) {
    if (gameVars.pickDelayed) {
        if (gameVars.pickCanBuffer) {
            gameVars.pickCanBuffer = false;
            setTimeout(() => {
                pickMoveUp(false);
            }, 80)
        }
        return;
    }

    gameVars.pickDelayed = true;
    if (canBuffer) {
        setTimeout(() => {
            gameVars.pickCanBuffer = true;
        }, 440)
    }

    setTimeout(() => {
        gameVars.pickDelayed = false;
        gameVars.pickCanBuffer = false;
    }, 540)
    pinMoveUp(gameVars.currentPin);
    gameVars.pickStuck = true;
    let goalX = gameConsts.halfWidth + gameVars.currentPin * 30.3;
    let goalY = gameConsts.halfHeight - 20;
    if (globalObjects.pick.currAnim) {
        globalObjects.pick.currAnim.stop();
    }
    globalObjects.pick.x = goalX;
    globalObjects.pickshadow.x = goalX;
    globalObjects.pick.y = goalY + 17;
    globalObjects.pickshadow.y = goalY + 17;
    globalObjects.pick.currAnim = PhaserScene.tweens.add({
        targets: [globalObjects.pick, globalObjects.pickshadow],
        y: goalY,
        rotation: -0.02,
        duration: 120,
        ease: 'Cubic.easeOut',
        onComplete: () => {
            globalObjects.pick.currAnim = PhaserScene.tweens.add({
                delay: 50,
                targets: [globalObjects.pick, globalObjects.pickshadow],
                rotation: 0,
                y: gameConsts.halfHeight,
                duration: 240,
                ease: 'Back.easeOut',
                onStart: () => {
                    gameVars.pickStuck = false;
                },
            })
        }
    })
}

function pinMoveUp(pinNum) {
    let currPin = globalObjects.pins[pinNum];

    if (!currPin) {
        return;
    }
    if (currPin.locked) {
        return;
    }

    if (currPin.currAnim) {
        currPin.currAnim.stop();
    }
    if (!currPin.randDur) {
        let randVal = Math.floor(Math.random() * 5.5) - 0.5;
        if (!gameVars.firstPin) {
            gameVars.firstPin = true;
            randVal = Math.max(2, randVal);
        }
        currPin.randDur = Math.max(80, 80 + randVal * 30);
    }
    let dropDelay = Math.max(0, Math.floor(currPin.randDur * 1 - 50));
    let overrideCantOpen = currPin.randDur < 130;
    if (overrideCantOpen) {
        dropDelay = 0;
    }

    currPin.currDelay = PhaserScene.time.delayedCall(Math.max(currPin.randDur - 1, Math.floor(currPin.randDur * 0.50) + 6), () => {
        if (!overrideCantOpen) {
            gameVars.canLock = true;
            gameVars.canShowGreen = true;
            setTimeout(() => {
                if (gameVars.canShowGreen && !currPin.locked) {
                    globalObjects.indicators[pinNum].setFrame('icon_green.png');
                    let flashObj = getTempPoolObject('lock', 'icon_green_flash.png', 'green_flash', 400).setDepth(10);
                    flashObj.x = globalObjects.indicators[pinNum].x;
                    flashObj.y = globalObjects.indicators[pinNum].y;
                    flashObj.alpha = 0.3 + dropDelay * 0.02;
                    PhaserScene.tweens.add({
                        targets: flashObj,
                        alpha: 0,
                        ease: 'Quad.easeOut',
                        duration: 130 + dropDelay * 4
                    })
                }
            }, 5)
            currPin.currDelay = PhaserScene.time.delayedCall(Math.max(0, Math.ceil((currPin.randDur - 125) * 4) + dropDelay * 1.1), () => {
                gameVars.canShowGreen = false;
                setTimeout(() => {
                    gameVars.canLock = false;
                }, 5)
                if (!currPin.locked) {
                    globalObjects.indicators[pinNum].setFrame('icon_yellow.png');
                }
            })
        }

    })
    currPin.inMotion = true;

    currPin.currAnim = PhaserScene.tweens.add({
        targets: currPin,
        y: gameConsts.halfHeight - 47,
        ease: 'Quad.easeOut',
        duration: currPin.randDur,
        onComplete: () => {
            currPin.currAnim = PhaserScene.tweens.add({
                delay: dropDelay,
                targets: currPin,
                y: currPin.startY,
                ease: 'Quad.easeIn',
                duration: Math.max(420, currPin.randDur * 6.5 - 190),
                onComplete: () => {
                    currPin.inMotion = false;
                    let lastRandDur = currPin.randDur;
                    let randVal = Math.floor(Math.random() * 5.5) - 0.5;
                    let canExtraCheck = true;
                    while (lastRandDur < 80 + randVal * 40 + 1 && lastRandDur > 70 + randVal * 32 - 1 ) {
                        randVal = Math.floor(Math.random() * 5.5) - 0.5;
                    }
                    currPin.randDur = Math.max(80, 70 + randVal * 32);
                }
            })
        }
    })
}

function tryLock() {
    let currPin = globalObjects.pins[gameVars.currentPin];
    if (!currPin) {
        return;
    } else if (!currPin.inMotion) {
        // not even being moved, nothing happens other than warning message
    } else if (gameVars.canLock) {
        // Lock
        if (currPin.currAnim) {
            currPin.currAnim.stop();
        }
        currPin.locked = true;
        globalObjects.indicators[gameVars.currentPin].setFrame('icon_black.png');
        PhaserScene.tweens.add({
            targets: currPin,
            y: gameConsts.halfHeight - 47,
            ease: 'Quad.easeOut',
            duration: 200,
        });
        PhaserScene.tweens.add({
            targets: currPin,
            alpha: 0.6,
            duration: 600,
        });
        let hasUnlocked = false;
        for (let i in globalObjects.pins) {
            if (!globalObjects.pins[i].locked) {
                hasUnlocked = true;
            }
        }
        if (!hasUnlocked) {
            slideOpenLock();
        }

    } else {
        // Break lockpick
    }
}

function slideOpenLock() {
    PhaserScene.tweens.add({
        targets: globalObjects.mechanism,
        x: gameConsts.halfWidth - 55,
        easeParams: [1.5],
        ease: 'Back.easeOut',
        duration: 800,
        onComplete: () => {
            console.log("victory!");
        }
    })
}

function setupPlayer() {
    globalObjects.options = new Options(PhaserScene, gameConsts.width - 27, 27);
}

function openPopup(contents) {
    if (!globalObjects.currPopup) {
        globalObjects.currPopup = {
            active: true
        };
    }
    globalObjects.currPopup.dark = new Button({
        normal: {
            ref: "blackPixel",
            alpha: 0.55,
            scaleX: 1000,
            scaleY: 1000,
            x: gameConsts.halfWidth,
            y: gameConsts.halfHeight,
        },
    });
    globalObjects.currPopup.dark.setDepth(100);
    globalObjects.currPopup.bg = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'ui', 'popup.png').setDepth(100).setScale(0.865);
    PhaserScene.tweens.add({
        targets: globalObjects.currPopup.bg,
        scaleX: 0.88,
        scaleY: 0.88,
        duration: 180,
        ease: 'Back.easeOut'
    })

    let closeButton = new Button({
        normal: {
            atlas: 'buttons',
            ref: "general_btn.png",
            x: gameConsts.halfWidth + 158,
            y: gameConsts.halfHeight - 177,
            scaleX: 0.8,
            scaleY: 0.8,
            alpha: 0.92
        },
        hover: {
            atlas: 'buttons',
            ref: "general_btn.png",
            alpha: 1
        },
        press: {
            atlas: 'buttons',
            ref: "general_btn.png",
            alpha: 0.8
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
            for (let i in globalObjects.currPopup) {
                if (i !== 'active') {
                    globalObjects.currPopup[i].destroy();
                }
            }
            globalObjects.currPopup.active = false;
        }
    });
    closeButton.addText("X", {fontFamily: 'kingthings', fontSize: 28, color: '#000000', align: 'center'});
    closeButton.setTextOffset(1, 0)
    closeButton.setDepth(101);
    globalObjects.currPopup.closeButton = closeButton;
    for (let i in contents) {
        globalObjects.currPopup[i] = contents[i];
    }
}

function openLevelPopup() {
    let lvlContents = {};
    lvlContents.title = PhaserScene.add.text(gameConsts.halfWidth, 123, 'LEVEL SELECT', {fontFamily: 'kingthings', fontSize: 32, color: '#000000', align: 'center'}).setDepth(102).setOrigin(0.5, 0.5);
    openPopup(lvlContents)
    let extraContents = {};

    let levelNames = [
        "Training Lock",
        "Level 1: Unshackled",
        "Level 2: Escape",
        "Level 3: Dressing Up",
        "Level 4: Palace Gate",
        "Level 5: Tricky Door",
        "Level 6: Bedroom",
        "Level 7: Her Heart"];
    let levelNamesAlt = [
        "Training Lock",
        "Level 1: Unshackled",
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
                for (let i in globalObjects.currPopup) {
                    if (i !== 'active') {
                        globalObjects.currPopup[i].destroy();
                    }
                }
                globalObjects.currPopup.active = false;
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

function gotoLevel(lvl) {
    console.log("going to level ", lvl);
}
