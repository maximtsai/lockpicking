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

        for (let i in loadObjects) {
            loadObjects[i].destroy();
        }
    });
}

function getGlobalBlackout() {
    if (globalObjects.blackout) {
        globalObjects.blackout.setAlpha(1);
        if (globalObjects.blackout.currAnim) {
            globalObjects.blackout.currAnim.stop();
        }
        return globalObjects.blackout;
    } else {
        globalObjects.blackout = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(1000).setAlpha(1).setDepth(99);
        return globalObjects.blackout;
    }

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

    setupLevelButton();
    setupMuteButtons();
    setupQuestionButton();
    setupCheatButton();

    globalObjects.uitop = PhaserScene.add.image(gameConsts.halfWidth, 0, 'ui', 'top.png').setDepth(-1).setOrigin(0.5, 0);

    globalObjects.extras = [];
    globalObjects.roomTitle = PhaserScene.add.text(gameConsts.halfWidth, 20, 'TRAINING LOCK', {fontFamily: 'kingthings', fontSize: 24, color: '#FFFFFF', align: 'center'}).setStroke('#000000', 4).setDepth(99).setOrigin(0.5, 0.5);
    globalObjects.picksleftText = PhaserScene.add.text(12, 20, 'PICKS LEFT: 99', {fontFamily: 'kingthings', fontSize: 24, color: '#FFFFFF', align: 'left'}).setStroke('#000000', 4).setDepth(1).setOrigin(0, 0.5);
    gameVars.picksLeft = 99;

    // globalObjects.hoverTextManager = new InternalHoverTextManager(PhaserScene);
    globalObjects.currBackground = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'workbench2.png').setScale(2).setDepth(-10);
    globalObjects.lock = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'lock.png');
    globalObjects.pickshadow = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'pickshadow.png').setAlpha(0.6);
    globalObjects.mechanism = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'mechanism.png');
    globalObjects.pick = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'pick.png');

            // x: gameConsts.halfWidth - 284,
            // y: 309,

    globalObjects.autopick = new Button({
        normal: {
            atlas: 'buttons',
            ref: "menu_btn_normal.png",
            x: gameConsts.halfWidth + 25,
            y: 424,
            scaleX: 0.65,
            scaleY: 0.65,
            alpha: 1
        },
        hover: {
            atlas: 'buttons',
            ref: "menu_btn_hover.png",
        },
        press: {
            atlas: 'buttons',
            ref: "menu_btn_press.png",
        },
        disable: {
            atlas: 'buttons',
            ref: "menu_btn_press.png",
            alpha: 0
        },
        onHover: () => {
            if (canvas) {
                playSound('click').detune = -50;
                canvas.style.cursor = 'pointer';
            }
            globalObjects.autopickText.visible = true;
            let lockpickChance = getLockpickChance();
            globalObjects.autopickText.setText("UNLOCK CHANCE: "+lockpickChance+"%")
        },
        onHoverOut: () => {
            if (canvas) {
                canvas.style.cursor = 'default';
            }
            globalObjects.autopickText.visible = false;
        },
        onMouseUp: () => {
            attemptAutoLockpick();
        }
    });
    globalObjects.autopick.addText("AUTO-ATTEMPT", {fontFamily: 'kingthings', fontSize: 20, color: '#000000', align: 'center'});
    globalObjects.autopick.setTextOffset(0.5, 0.5);
    globalObjects.autopick.setDepth(2);
    globalObjects.autopick.setState(DISABLE);

    globalObjects.autopickText = PhaserScene.add.text(gameConsts.halfWidth + 25, 457, "UNLOCK CHANCE: 1%", {fontFamily: 'kingthings', fontSize: 24, color: '#FFFFFF', align: 'center'}).setStroke('#000000', 4).setDepth(50).setVisible(false).setOrigin(0.5, 0.5);

    globalObjects.pins = [];
    globalObjects.indicators = [];
    gameVars.currentPin = 0;
    globalObjects.infoText = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 60, " ", {fontFamily: 'kingthings', fontSize: 24, color: '#FFFFFF', align: 'center'}).setStroke('#000000', 4).setDepth(50).setAlpha(0).setOrigin(0.5, 0.5);

    let blackPixelTemp = PhaserScene.add.image(gameConsts.halfWidth,gameConsts.halfHeight, 'blackPixel').setScale(500,600).setRotation(0.3).setDepth(999).setAlpha(1);
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

    playSound("whoosh").seek = 0.3;

    for (let i = 0; i < 6; i++) {
        let xOffset = 0;
        if (i >= 1) {
            xOffset = 0.5;
        }
        if (i === 5) {
            xOffset = 999;
        }
        globalObjects.indicators[i] = PhaserScene.add.image(gameConsts.halfWidth - 36 + i * 31 + xOffset, gameConsts.halfHeight - 79 + gameConsts.UIYOffset, 'lock', 'icon_black.png');
    }
    PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'lockshadow.png').setDepth(1);

    globalObjects.title = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight - 36, 'SUCCESS!', {fontFamily: 'kingthings', fontSize: 72, color: '#FFFF00', align: 'center'}).setStroke('#000000', 10).setDepth(50).setOrigin(0.5, 0.5).setAlpha(0);

    setRoom('practice');

}

function setupCheatButton() {
    let cheatButton = new Button({
        normal: {
            atlas: 'buttons',
            ref: "tab.png",
            x: -150,
            y: 150,
            scaleX: 0.9,
            scaleY: 0.9
        },
        hover: {
            atlas: 'buttons',
            ref: "tab_hover.png",
        },
        press: {
            atlas: 'buttons',
            ref: "tab_press.png",
        },
        disable: {
            atlas: 'buttons',
            ref: "tab_press.png",
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
            openCheatPopup();
        }
    });
    cheatButton.setOrigin(0, 0.5);
    cheatButton.setDepth(2);
    globalObjects.cheatButton = cheatButton;
}

function setupLevelButton() {
    let levelButton = new Button({
        normal: {
            atlas: 'buttons',
            ref: "menu_btn_normal.png",
            x: 73,
            y: 62,
            scaleX: 0.54,
            scaleY: 0.54
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
    levelButton.addText("LVL SELECT", {fontFamily: 'kingthings', fontSize: 22, color: '#000000', align: 'center'});
    levelButton.setTextOffset(0, 1);
    levelButton.setDepth(2);
}

function setupMuteButtons() {
    let mutebtn;
    let musicbtn;

    let isMuted = globalVolume < 0.2;
    let isQuiet = globalVolume < 0.4;
    gameVars.soundStatus = isMuted ? 0 : (isQuiet ? 1 : 2);

    mutebtn = new Button({
        normal: {
            atlas: 'buttons',
            ref: isMuted ? "audio_off.png" : (isQuiet ? "audio_mid.png" : "audio_on.png"),
            scaleX: 0.8,
            scaleY: 0.8,
            x: gameConsts.width - 58,
            y: 20,
            alpha: 0.92
        },
        hover: {
            atlas: 'buttons',
            alpha: 1,
            ref: isMuted ? "audio_off_hover.png" : (isQuiet ? "audio_mid_hover.png" : "audio_on_hover.png")
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
            toggleMute();
        }
    });
    mutebtn.setOrigin(0.5, 0.5);
    globalObjects.mutebtn = mutebtn;
    mutebtn.setDepth(1);

    let isMusicMuted = globalMusicVol < 0.5;
    gameVars.musicStatus = isMusicMuted ? 0 : 1;
    musicbtn = new Button({
        normal: {
            atlas: 'buttons',
            ref: isMusicMuted ? "music_off.png" : "music_on.png",
            scaleX: 0.8,
            scaleY: 0.8,
            x: gameConsts.width - 100,
            y: 20,
            alpha: 0.92
        },
        hover: {
            atlas: 'buttons',
            alpha: 1,
            ref: isMusicMuted ? "music_off_hover.png" : "music_on_hover.png"
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
            toggleMusic();
        }
    });
    musicbtn.setOrigin(0.5, 0.5);
    globalObjects.musicbtn = musicbtn;
    musicbtn.setDepth(1);
}

function toggleMute() {
    gameVars.soundStatus = (gameVars.soundStatus + 1) % 3;
    if (gameVars.soundStatus === 0) {
        updateGlobalVolume(0);
        globalObjects.mutebtn.setNormalRef("audio_off.png");
        globalObjects.mutebtn.setHoverRef("audio_off_hover.png");
    } else if (gameVars.soundStatus === 1) {
        updateGlobalVolume(0.5);
        globalObjects.mutebtn.setNormalRef("audio_mid.png");
        globalObjects.mutebtn.setHoverRef("audio_mid_hover.png");
        playSound('click', 1.65)
    } else {
        updateGlobalVolume(1)
        globalObjects.mutebtn.setNormalRef("audio_on.png");
        globalObjects.mutebtn.setHoverRef("audio_on_hover.png");
        playSound('click', 1.9)
    }
}

function toggleMusic() {
    gameVars.musicStatus = (gameVars.musicStatus + 1) % 2;
    if (gameVars.musicStatus === 0) {
        updateGlobalMusicVolume(0);
        globalObjects.musicbtn.setNormalRef("music_off.png");
        globalObjects.musicbtn.setHoverRef("music_off_hover.png");
    } else if (gameVars.musicStatus === 1) {
        updateGlobalMusicVolume(0.9);
        globalObjects.musicbtn.setNormalRef("music_on.png");
        globalObjects.musicbtn.setHoverRef("music_on_hover.png");
    }
}

function setupQuestionButton() {
    let questionButton = new Button({
        normal: {
            atlas: 'buttons',
            ref: "question_btn.png",
            x: gameConsts.width - 24,
            y: 20,
            scaleX: 0.8,
            scaleY: 0.8,
            alpha: 0.92
        },
        hover: {
            atlas: 'buttons',
            ref: "question_btn_hover.png",
            alpha: 1
        },
        press: {
            atlas: 'buttons',
            ref: "question_btn_hover.png",
            alpha: 0.75
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
            openInstructPopup()
        }
    });
    questionButton.setDepth(1);
}

function createPins(amt, dropOnFail = false, dropAllOnFail = false) {
    gameVars.dropOnFail = dropOnFail;
    gameVars.dropAllOnFail = dropAllOnFail;
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
        if (j >= 1) {
            xOffset = 0.5;
        }
        let pinName = gameVars.currRoom === 'princess' ? 'pin_heart.png' : 'pin.png';
        globalObjects.pins[j] = PhaserScene.add.image(gameConsts.halfWidth - 36 + j * 31 + xOffset, gameConsts.halfHeight + 2 - yOffset + gameConsts.UIYOffset, 'lock', pinName);
        globalObjects.pins[j].startY = gameConsts.halfHeight + 2 + gameConsts.UIYOffset;
        globalObjects.pins[j].currAnim = PhaserScene.tweens.add({
            targets: globalObjects.pins[j],
            y: globalObjects.pins[j].startY,
            ease: 'Cubic.easeIn',
            duration: 20 + yOffset * 15,
            onComplete: () => {
                if (globalObjects.indicators[j]) {
                    globalObjects.indicators[j].setFrame('icon_yellow.png');
                }
            }
        });
    }
}

function updatePickSpot() {
    let goalX = gameConsts.halfWidth + gameVars.currentPin * 31;
    if (globalObjects.pick.currAnim) {
        globalObjects.pick.currAnim.stop();
    }
    if (Math.abs(goalX - globalObjects.pick.x) > 5) {
        playSound('metalclink', 1.5).detune = 200 - Math.random() * 400;
    }
    globalObjects.pick.currAnim = PhaserScene.tweens.add({
        targets: [globalObjects.pick, globalObjects.pickshadow],
        x: goalX,
        duration: 140,
        ease: 'Quart.easeOut',
    })
    globalObjects.pick.y = gameConsts.halfHeight + gameConsts.UIYOffset;
    globalObjects.pickshadow.y = gameConsts.halfHeight + gameConsts.UIYOffset;
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
    if (gameVars.picksLeft <= 0) {
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
    let goalX = gameConsts.halfWidth + gameVars.currentPin * 31;
    let goalY = gameConsts.halfHeight - 16 + gameConsts.UIYOffset;
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
        rotation: -0.019,
        duration: 120,
        ease: 'Cubic.easeOut',
        onComplete: () => {
            globalObjects.pick.currAnim = PhaserScene.tweens.add({
                delay: 50,
                targets: [globalObjects.pick, globalObjects.pickshadow],
                rotation: 0,
                y: gameConsts.halfHeight + gameConsts.UIYOffset,
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
    if (gameVars.picksLeft <= 0) {
        return;
    }

    if (currPin.currAnim) {
        currPin.currAnim.stop();
    }
    if (!currPin.randDur) {
        let randVal = Math.floor(Math.random() * 5);
        if (!gameVars.firstPin) {
            gameVars.firstPin = true;
            randVal = Math.max(2, randVal);
            if (gameVars.currLevel < 4) {
                let instructions = PhaserScene.add.text(348, gameConsts.halfHeight - 103, "Press SPACE when\npin hits the top  ->", {fontFamily: 'kingthings', fontSize: 22, color: '#FFFFFF', align: 'left'}).setDepth(99).setAlpha(0).setStroke('#000000', 4).setOrigin(1, 0);
                globalObjects.instructions = instructions;
                PhaserScene.tweens.add({
                    targets: instructions,
                    alpha: 1,
                    delay: 200,
                    duration: 400,
                    completeDelay: 5000,
                    onComplete: () => {
                        PhaserScene.tweens.add({
                            targets: instructions,
                            alpha: 0,
                            duration: 500,
                            onComplete: () => {
                                instructions.destroy();
                            }
                        })
                    }
                })
            }

        }
        currPin.randDur = Math.max(75, 75 + randVal * 25);
    }
    let dropDelay = Math.max(0, Math.floor(currPin.randDur * 1.9 - 150));
    let overrideCantOpen = currPin.randDur < 81;
    if (overrideCantOpen) {
        dropDelay = 0;
    }
    if (dropDelay > 100) {
        dropDelay += 20;
    }

    currPin.currDelay = PhaserScene.time.delayedCall(Math.min(currPin.randDur - 1, Math.floor(currPin.randDur * 0.72) + 10), () => {
        if (!overrideCantOpen) {
            gameVars.canLock = true;
            gameVars.canShowGreen = true;
            setTimeout(() => {
                if (gameVars.canShowGreen && !currPin.locked && !globalObjects.indicators[pinNum].stuck) {
                    globalObjects.indicators[pinNum].setFrame('icon_green.png');
                    if (globalObjects.indicators[pinNum].visible) {
                        let flashObj = getTempPoolObject('lock', 'icon_green_flash.png', 'green_flash', 400).setDepth(10);
                        flashObj.x = globalObjects.indicators[pinNum].x;
                        flashObj.y = globalObjects.indicators[pinNum].y;
                        flashObj.alpha = 0.25 + dropDelay * 0.006;
                        PhaserScene.tweens.add({
                            targets: flashObj,
                            alpha: 0,
                            ease: 'Quad.easeOut',
                            duration: 100 + dropDelay * 4.5
                        })
                    }

                }
            }, 10)
            currPin.currDelay = PhaserScene.time.delayedCall(Math.max(0, Math.ceil((currPin.randDur - 125) * 3) + dropDelay * 1.6), () => {
                gameVars.canShowGreen = false;
                setTimeout(() => {
                    gameVars.canLock = false;
                }, 40)
                if (!currPin.locked) {
                    globalObjects.indicators[pinNum].setFrame('icon_yellow.png');
                }
            })
        }

    })
    currPin.inMotion = true;
    if (currPin.fallSoundTimeout) {
        clearTimeout(currPin.fallSoundTimeout);
    }
    if (currPin.currSound) {
        currPin.currSound.stop();
    }
    currPin.currAnim = PhaserScene.tweens.add({
        targets: currPin,
        delay: 10,
        y: gameConsts.halfHeight - 37 + gameConsts.UIYOffset,
        ease: 'Quad.easeOut',
        duration: currPin.randDur,
        onStart: () => {
            playSound('nudge', 1.35).detune = 100 - Math.random() * 80 - currPin.randDur * 1.5;
        },
        onComplete: () => {
            playSound('clicktop', 0.5 + currPin.randDur * 0.002 - Math.random() * 0.35).detune = 100 - Math.random() * 100 - currPin.randDur * 0.4;
            currPin.currAnim = PhaserScene.tweens.add({
                delay: dropDelay,
                targets: currPin,
                y: currPin.startY,
                ease: 'Quad.easeIn',
                duration: Math.max(420, currPin.randDur * 6.85 - 225),
                onStart: () => {
                    currPin.fallSoundTimeout = setTimeout(() => {
                        if (!currPin.locked) {
                            let randIdx = Math.floor(Math.random() * 2.5) + 1;
                            let soundToPlay = 'pinfall' + randIdx;
                            currPin.currSound = playSound(soundToPlay, 2.4);
                            currPin.currSound.detune = 200 - Math.random() * 100 - dropDelay * 1;
                            let seekSpot = (245 - dropDelay * 0.75 + Math.random() * 50) * 0.0032;
                            currPin.currSound.seek = Math.max(0, Math.min(1, seekSpot));
                        }
                    }, 200 + Math.floor(dropDelay * 0.45))
                },
                onComplete: () => {
                    currPin.inMotion = false;
                    let lastRandDur = currPin.randDur;
                    let randVal = Math.floor(Math.random() * 5);
                    while (currPin.lastRandVal === randVal) {
                        randVal = Math.floor(Math.random() * 5);
                    }
                    if (randVal === currPin.secondLastRandVal) {
                        // reduce chances of getting second last one, but not impossible.
                        let testRandVal = Math.floor(Math.random() * 5);
                        if (testRandVal !== currPin.lastRandVal) {
                            // make sure we don't get last rand val either.
                            randVal = testRandVal;
                        }
                    }

                    currPin.secondLastRandVal = currPin.lastRandVal;
                    currPin.lastRandVal = randVal;
                    currPin.randDur = Math.max(65, 60 + randVal * 32);
                }
            })
        }
    })
}

function tryLock() {
    let currPin = globalObjects.pins[gameVars.currentPin];
    if (gameVars.picksLeft <= 0) {
        return;
    }
    if (!currPin) {
        return;
    } else if (!currPin.inMotion || currPin.locked) {
        // not even being moved, nothing happens other than warning message
        PhaserScene.tweens.add({
            targets: [globalObjects.pick, globalObjects.pickshadow],
            rotation: -0.02,
            x: "-=2",
            duration: 10,
            onComplete: () => {
                PhaserScene.tweens.add({
                    targets: [globalObjects.pick, globalObjects.pickshadow],
                    rotation: 0,
                    x: "+=5",
                    duration: 40,
                    onComplete: () => {
                        PhaserScene.tweens.add({
                            targets: [globalObjects.pick, globalObjects.pickshadow],
                            x: "-=3",
                            duration: 40,
                            ease: 'Back.easeOut',
                        })
                    },
                })
            },
        })
    } else if (gameVars.canLock) {
        setPin(false);
    } else {
        if (!gameVars.firstPickBroken) {
            showCheatOption();
            gameVars.firstPickBroken = true;
        }

        breakPick(false);

    }
}

function setPin(isAuto) {

    let currPin = globalObjects.pins[gameVars.currentPin];
    let randSoundIdx = Math.floor(Math.random() * 4) + 1;
    let randSound = "scratch" + randSoundIdx;
    playSound(randSound, 1.3).detune = 100 - Math.random() * 200;
    // playSound(Math.random() < 0.5 ? 'lockin1' : 'lockin2').detune = 100 - Math.random() * 200;
    // Lock
    if (currPin.currAnim) {
        currPin.currAnim.stop();
    }
    if (currPin.currSound) {
        currPin.currSound.stop();
    }
    currPin.locked = true;
    gameVars.pinsFixed = Math.max(gameVars.pinsFixed, getNumPinsLocked());
    let currIndicator = globalObjects.indicators[gameVars.currentPin];
    currIndicator.setFrame('icon_black.png');
    setTimeout(() => {
        currIndicator.setFrame('icon_black.png');
    }, 300)
    PhaserScene.tweens.add({
        targets: currPin,
        y: gameConsts.halfHeight - 37 + gameConsts.UIYOffset,
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
            if (!hasUnlocked && isAuto) {
                // slide to next pin
                gameVars.currentPin = i;
                updatePickSpot();
            }
            hasUnlocked = true;
        }
    }


    if (gameVars.currRoom === 'princess') {
        if (gameVars.princessCounter === gameVars.pinsFixed) {
            gameVars.princessCounter++;
            let pinText = [
                "The first tumbler unlocks, and I shake off\nan unnatural shiver.",
                "",
                "A glimpse of the past flashes and I blink it away.\nOr was that the future?",
                "",
                "The seal unravels, and the scroll is mine now,\nthough I dare not look at it.",
                ""
            ];
            let pinFixIndex = gameVars.pinsFixed - 1;
            let flashImage = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'stairs.png').setScale(1.44).setAlpha(0.38);
            if (pinFixIndex === 0) {
                flashImage.setAlpha(0.55)
                playSound('heartbeatfast', 0.7)
            } else if (pinFixIndex === 2) {
                flashImage.setAlpha(0.59);
                flashImage.setFrame('eye.png');
                playSound('heartbeatfast', 0.7)
            } else if (pinFixIndex === 4) {
                flashImage.setAlpha(0.54)
                flashImage.setFrame('stars.png');
                playSound('heartbeatfast', 0.7)
            }
            PhaserScene.tweens.add({
                targets: flashImage,
                scaleX: 1.46,
                scaleY: 1.46,
                alpha: 0,
                ease: 'Quint.easeOut',
                duration: 2500
            })

            if (pinText[pinFixIndex] !== "") {
                globalObjects.infoText.setAlpha(0);
                globalObjects.infoText.setText(pinText[pinFixIndex]);
                if (globalObjects.infoText.currAnim) {
                    globalObjects.infoText.currAnim.stop();
                }
                globalObjects.infoText.currAnim = PhaserScene.tweens.add({
                    targets: globalObjects.infoText,
                    alpha: 1,
                    duration: 500,
                    ease: 'Cubic.easeOut',
                    completeDelay: 7000,
                    onComplete: () => {
                        globalObjects.infoText.currAnim = PhaserScene.tweens.add({
                            targets: globalObjects.infoText,
                            alpha: 0,
                            duration: 500,
                            ease: 'Cubic.easeOut',
                        })
                    }
                })
            }
        }
    } else if (gameVars.currRoom === 'challenge') {
        if (gameVars.pinsFixed === 5 && !gameVars.curses99) {
            gameVars.curses99 = true;
            globalObjects.infoText.setAlpha(0);
            globalObjects.infoText.setText("Almost there...")
            if (globalObjects.infoText.currAnim) {
                globalObjects.infoText.currAnim.stop();
            }
            globalObjects.infoText.currAnim = PhaserScene.tweens.add({
                targets: globalObjects.infoText,
                alpha: 1,
                duration: 500,
                ease: 'Cubic.easeOut',
                completeDelay: 4500,
                onComplete: () => {
                    globalObjects.infoText.currAnim = PhaserScene.tweens.add({
                        targets: globalObjects.infoText,
                        alpha: 0,
                        duration: 500,
                        ease: 'Cubic.easeOut',
                    })
                }
            })
        }
    }
    if (!hasUnlocked) {
        slideOpenLock();
    }
}

function breakPick(isAuto) {
    playSound('pickbreak', 1);

    if (!gameVars.usingSkull && gameVars.picksLeft <= 1) {
        if (globalObjects.pick.currAnim) {
            globalObjects.pick.currAnim.stop();
        }
    }
    if (!isAuto) {
        if (gameVars.dropAllOnFail) {
            decrementAllPins();
        } else if (gameVars.dropOnFail) {
            decrementPins();
        }
    }
    decrementPicksLeft();
    let redIndicator = globalObjects.indicators[gameVars.currentPin];
    redIndicator.setFrame('icon_red.png');
    redIndicator.stuck = true;
    setTimeout(() => {
        redIndicator.stuck = false;
        redIndicator.setFrame('icon_yellow.png');
    }, 400)
    let pickBrokeVfx = getTempPoolObject('lock', 'pickbroke.png', 'pickbroke', 300).setDepth(5);
    pickBrokeVfx.setPosition(globalObjects.pick.x - 80, globalObjects.pick.y + 50);
    pickBrokeVfx.setScale(0.7).setAlpha(1).setRotation(Math.random() * 3);
    PhaserScene.tweens.add({
        targets: pickBrokeVfx,
        alpha: 0,
        y: "+=20",
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 300,
        ease: 'Quad.easeOut'
    })
    gameVars.pickStuck = true;
    if (gameVars.usingSkull && gameVars.picksLeft >= 1) {
        gameVars.pickStuck = false;
        PhaserScene.tweens.add({
            targets: [globalObjects.pick],
            x: "+=2",
            duration: 40,
            onComplete: () => {
                PhaserScene.tweens.add({
                    targets: [globalObjects.pick],
                    x: "-=2",
                    ease: 'Bounce.easeOut',
                    duration: 250,
                })
            }
        })
    } else {
        PhaserScene.tweens.add({
            targets: [globalObjects.pick, globalObjects.pickshadow],
            rotation: 0.35,
            y: gameConsts.halfHeight + 130 + gameConsts.UIYOffset,
            x: "+=25",
            duration: 290,
            alpha: 0,
            onComplete: () => {
                resetPick(false);
            },
        })
    }

}

function getNumPinsLocked() {
    let pinsLocked = 0;
    for (let i = 0; i < globalObjects.pins.length; i++) {
        let currPin = globalObjects.pins[i];
        if (currPin && currPin.locked) {
            pinsLocked++;
        }
    }
    return pinsLocked;
}

function decrementPins() {
    let pinsLocked = 0;

    for (let i = 0; i < globalObjects.pins.length; i++) {
        let currPin = globalObjects.pins[i];
        if (currPin && currPin.locked) {
            pinsLocked++;
            if (pinsLocked === gameVars.pinsFixed) {
                currPin.alpha = 1;
                currPin.locked = false;
                currPin.currAnim = PhaserScene.tweens.add({
                    targets: currPin,
                    y: currPin.startY,
                    ease: 'Cubic.easeIn',
                    duration: 280,
                    onComplete: () => {
                        playSound('pindrop');
                    }
                });
                break;
            }
        }
    }
}

function decrementAllPins() {
    let pinFallCount = 0;
    for (let i = globalObjects.pins.length; i >= 0; i--) {
        let currPin = globalObjects.pins[i];
        if (currPin && currPin.locked) {
            pinFallCount++;
            currPin.alpha = 1;
            currPin.locked = false;
            currPin.currAnim = PhaserScene.tweens.add({
                targets: currPin,
                y: currPin.startY,
                ease: 'Cubic.easeIn',
                duration: 280,
                onComplete: () => {
                    playSound('pindrop');
                }
            });
            if (pinFallCount > 3) {
                break;
            }
        }
    }
    if (pinFallCount >= 2) {
        globalObjects.infoText.setAlpha(0);
        let showMessage = false;
        if (pinFallCount <= 3) {
            if (!gameVars.curse1) {
                gameVars.curse1 = true;
                globalObjects.infoText.setText("A mistake causes the lock's magic\nto jumble all the pins.");
                showMessage = true;
            } else if (!gameVars.curse3) {
                gameVars.curse3 = true;
                globalObjects.infoText.setText("This is a devious lock indeed.");
                showMessage = true;
            }
        } else {
            if (!gameVars.curse2) {
                gameVars.curse2 = true;
                globalObjects.infoText.setText("Curses, almost had it.");
                showMessage = true;
            }
        }
        if (globalObjects.infoText.currAnim) {
            globalObjects.infoText.currAnim.stop();
        }
        if (showMessage) {
            globalObjects.infoText.currAnim = PhaserScene.tweens.add({
                targets: globalObjects.infoText,
                alpha: 1,
                duration: 500,
                ease: 'Cubic.easeOut',
                completeDelay: 4500,
                onComplete: () => {
                    globalObjects.infoText.currAnim = PhaserScene.tweens.add({
                        targets: globalObjects.infoText,
                        alpha: 0,
                        duration: 500,
                        ease: 'Cubic.easeOut',
                    })
                }
            })
        }

    }
}

function resetPick(setToZero = true) {
    if (setToZero) {
        gameVars.currentPin = 0;
    }
    let goalX = gameConsts.halfWidth + gameVars.currentPin * 31;
    if (globalObjects.pick.currAnim) {
        globalObjects.pick.currAnim.stop();
    }

    if (gameVars.picksLeft <= 0) {
        return;
    }

    globalObjects.pick.alpha = 0.5;
    globalObjects.pickshadow.alpha = 0.5;
    globalObjects.pick.rotation = 0;
    globalObjects.pickshadow.rotation = 0;
    globalObjects.pick.x = goalX - 35;
    globalObjects.pickshadow.x = goalX - 35;
    globalObjects.pick.y = gameConsts.halfHeight + gameConsts.UIYOffset;
    globalObjects.pickshadow.y = gameConsts.halfHeight + gameConsts.UIYOffset;
    gameVars.pickStuck = false;

    globalObjects.pick.currAnim = PhaserScene.tweens.add({
        targets: [globalObjects.pick, globalObjects.pickshadow],
        x: goalX,
        alpha: 1,
        duration: 140,
        ease: 'Quart.easeOut',
    })
}

function showFail() {
    hideAutoPick();
    hideCheatOption();
    if (globalObjects.infoText.currAnim) {
        globalObjects.infoText.currAnim.stop();
        globalObjects.infoText.alpha = 0;
    }
    PhaserScene.tweens.add({
        delay: 450,
        targets: globalObjects.extras,
        ease: 'Quad.easeIn',
        alpha: 0,
        duration: 800
    })
    globalObjects.victory = {};

    globalObjects.victory.dark = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 11, 'lock', 'shadow.png').setScale(3).setDepth(50).setAlpha(0);
    globalObjects.victory.title = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight - 36, 'FAILURE...', {fontFamily: 'kingthings', fontSize: 72, color: '#EE0011', align: 'center'}).setStroke('#000000', 10).setDepth(50).setOrigin(0.5, 0.5).setAlpha(0);
    PhaserScene.tweens.add({
        delay: 450,
        targets: globalObjects.victory.dark,
        alpha: 0.88,
        scaleX: 3.6,
        scaleY: 3.6,
        ease: 'Cubic.easeOut',
        duration: 700,
        onStart: () => {
            setTimeout(() => {
                playSound('fail');
            }, 200)
        }
    });


    let flavorText = [
        "I somehow botch my practice lock with\na mountain of lockpicks. Great start.",
        "My last lockpick breaks as I fumble the\nlockbox, leaving me with nothing.",
        "My pick breaks in the chest's lock, and\nI am forced to withdraw from the tavern.",
        "The robust lock holds, and my broken picks\nsplash in the murky water.",
        "The enchanted lock resets at my slightest\nmistake, sealing the door tight.",
        "The masterful lock defies my trembling hands,\nand the scroll remains beyond reach.",
        "I misjudge the star lock's shifting tumblers,\nand whatever secrets in the scroll are now sealed away.",
        "My rival laughs in my face as his devilish\ncontraption remains tightly locked."
    ]
    globalObjects.victory.extraText = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 60, flavorText[gameVars.currLevel], {fontFamily: 'kingthings', fontSize: 24, color: '#FFFFFF', align: 'center'}).setStroke('#000000', 4).setDepth(50).setAlpha(0).setOrigin(0.5, 0.5);

    globalObjects.victory.title.setScale(1.3).setAlpha(0);
    PhaserScene.tweens.add({
        delay: 400,
        targets: [globalObjects.victory.title, globalObjects.victory.extraText],
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        ease: 'Cubic.easeOut',
        duration: 700,
        completeDelay: 320,
        onComplete: () => {
            globalObjects.victory.retry = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "menu_btn_normal.png",
                    x: gameConsts.halfWidth,
                    y: gameConsts.halfHeight + 30,
                    scaleX: 0.62,
                    scaleY: 0.62
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
                    for (let i in globalObjects.victory) {
                        globalObjects.victory[i].destroy();
                    }
                    gotoLevel(gameVars.currLevel ? gameVars.currLevel : 0, true);
                }
            });
            gameVars.showNextButton = gameVars.currLevel ? gameVars.currLevel : 0;
            globalObjects.victory.retry.addText("RETRY", {fontFamily: 'kingthings', fontSize: 24, color: '#000000', align: 'center'});
            globalObjects.victory.retry.setTextOffset(0, 1);
            globalObjects.victory.retry.setDepth(51);
        }
    })

}

function hideAutoPick() {
    if (globalObjects.autopick) {
        globalObjects.autopick.setState(DISABLE);

        if (canvas) {
            canvas.style.cursor = 'default';
        }
    }
    if (globalObjects.autopickText) {
        globalObjects.autopickText.setVisible(false);
    }
}

function slideOpenLock() {
    hideAutoPick();
    hideCheatOption();
    playSound('success', 1.1);
    if (globalObjects.playUponUnlock) {
        for (let i in globalObjects.playUponUnlock) {
            globalObjects.playUponUnlock[i]();
        }
    }
    if (gameVars.currLevel >= gameVars.latestLevel) {
        gameVars.latestLevel = gameVars.currLevel + 1;
        localStorage.setItem("latestLevel", gameVars.latestLevel.toString())
    }
    if (gameVars.currRoom === 'princess') {
        // Victory Stars;
        for (let i = 0; i < 5; i++) {
            let newStar = PhaserScene.add.image(gameConsts.halfWidth + 30, gameConsts.halfHeight, 'lock', 'heartsmall.png').setDepth(-1).setScale(0.8 + Math.random() * 0.4).setRotation(Math.random() * 6);
            let durAmt = 1100 + Math.floor(newStar.scaleX * 350);
            let rotAmt = 2.8 + Math.random() * 0.9;
            if (Math.random() < 0.5) {
                rotAmt = -rotAmt;
            }
            PhaserScene.tweens.add({
                targets: newStar,
                scaleX: 0,
                scaleY: 0,
                rotation: rotAmt,
                duration: durAmt,
            })

            let angle = Math.PI * 0.4 * (i + 0.5);
            let amplitude = 120 + newStar.scaleX * 100;
            let velX = Math.sin(angle) * amplitude;
            let velY = -Math.cos(angle) * amplitude;
            newStar.x += velX * 0.2; newStar.y += velY * 0.2;
            PhaserScene.tweens.add({
                targets: newStar,
                x: "+=" + velX,
                duration: durAmt,
                ease: 'Quint.easeOut'
            })
            PhaserScene.tweens.add({
                targets: newStar,
                y: "+=" + velY,
                duration: durAmt,
                ease: 'Quint.easeOut',
                onComplete: () => {
                    newStar.destroy();
                }
            })
        }
    }
    PhaserScene.tweens.add({
        targets: globalObjects.mechanism,
        x: gameConsts.halfWidth - 55,
        easeParams: [1.5],
        ease: 'Back.easeOut',
        duration: 800,
        onComplete: () => {
            PhaserScene.tweens.add({
                targets: globalObjects.extras,
                alpha: 0,
                duration: 550
            })
            globalObjects.victory = {};

            globalObjects.victory.victoryDark = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight - 11, 'lock', 'shadow.png').setScale(4.5).setDepth(50).setAlpha(0);
            globalObjects.victory.title = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight - 36, 'SUCCESS!', {fontFamily: 'kingthings', fontSize: 72, color: '#FFFF00', align: 'center'}).setStroke('#000000', 10).setDepth(50).setOrigin(0.5, 0.5).setAlpha(0);
            PhaserScene.tweens.add({
                targets: globalObjects.victory.victoryDark,
                alpha: 0.88,
                scaleX: 3.6,
                scaleY: 3.6,
                ease: 'Back.easeOut',
                duration: 500
            });


            globalObjects.victory.title.setScale(1.3).setAlpha(0);
            if (globalObjects.instructions) {
                PhaserScene.tweens.add({
                    targets: globalObjects.instructions,
                    alpha: 0,
                    duration: 600
                })
            }
            PhaserScene.tweens.add({
                targets: globalObjects.victory.title,
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
                ease: 'Cubic.easeIn',
                duration: 500,
                completeDelay: 500,
                onStart: () => {
                  playSound('bardplay');
                },
                onComplete: () => {
                    globalObjects.victory.nextLvl = new Button({
                        normal: {
                            atlas: 'buttons',
                            ref: "menu_btn_normal.png",
                            x: gameConsts.halfWidth,
                            y: gameConsts.halfHeight + 30,
                            scaleX: 0.62,
                            scaleY: 0.62
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
                            if (globalObjects.victory) {
                                for (let i in globalObjects.victory) {
                                    globalObjects.victory[i].destroy();
                                }
                            }
                            if (gameVars.currRoom === 'princess') {
                                openEpiloguePopup();
                            } else if (gameVars.currRoom === 'challenge') {
                                gotoLevel(0);
                            }  else {
                                gotoNextLevel();
                            }
                        }
                    });
                    gameVars.showNextButton = gameVars.currLevel ? gameVars.currLevel + 1 : 1;

                    let buttonText = gameVars.currRoom === 'princess' ? "CONTINUE" : "NEXT LEVEL";
                    if (gameVars.currRoom === 'challenge') {
                        buttonText = "RETURN";
                    }
                    globalObjects.victory.nextLvl.addText(buttonText, {fontFamily: 'kingthings', fontSize: 24, color: '#000000', align: 'center'});
                    globalObjects.victory.nextLvl.setTextOffset(0, 1);
                    globalObjects.victory.nextLvl.setDepth(51);
                }
            })

        }
    })
}

function setupPlayer() {
    globalObjects.options = new Options(PhaserScene, gameConsts.width - 27, 27);
}

function openPopup(contents, useSmall) {
    gameVars.hasPopup = true;
    playSound("paperflip", 0.7);
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
    globalObjects.currPopup.bg = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'ui', useSmall ? 'popupsmall.png' : 'popup.png').setDepth(100).setScale(0.865);
    PhaserScene.tweens.add({
        targets: globalObjects.currPopup.bg,
        scaleX: 0.88,
        scaleY: 0.88,
        duration: 180,
        ease: 'Back.easeOut'
    })

    let xOffset = useSmall ? gameConsts.halfWidth + 144 : gameConsts.halfWidth + 158;
    let yOffset = useSmall ? gameConsts.halfHeight - 110 : gameConsts.halfHeight - 177;

    let closeButton = new Button({
        normal: {
            atlas: 'buttons',
            ref: "general_btn.png",
            x: xOffset,
            y: yOffset,
            scaleX: 0.8,
            scaleY: 0.8,
            alpha: 0.92
        },
        hover: {
            atlas: 'buttons',
            ref: "general_btn_hover.png",
            alpha: 1
        },
        press: {
            atlas: 'buttons',
            ref: "general_btn_press.png",
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
            closePopup();
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

function closePopup() {
    gameVars.hasPopup = false;
    for (let i in globalObjects.currPopup) {
        if (i !== 'active') {
            globalObjects.currPopup[i].destroy();
        }
    }
    globalObjects.currPopup = {};

}

function openEpiloguePopup() {
    gameVars.bonusUnlocked = true;
    localStorage.setItem("latestLevel", "7");
    gameVars.latestLevel = 7;
    gameVars.showNextButton = false;
    let text1 = "I grab the scroll and slip out the library, its eerie tingle starting to fade.";
    let text2 = "Whispers of unknown truths brush my mind, but I shake them off."
    let text3 = "The scroll's value in coin is all that matters to me.";
    let text4 = "I escape, already scheming my next heist, blissfully unaware of the scroll's\ntrue power as I eagerly trade it for a quick fortune.";

    createGlobalClickBlocker(false);
    let blackout = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'blackPixel').setScale(1000).setAlpha(0).setDepth(998);
    PhaserScene.tweens.add({
        targets: blackout,
        alpha: 1,
        duration: 2000,
    });
    let epilogue = {};

    let textPrompt1 = PhaserScene.add.text(25, 100, text1, {fontFamily: 'kingthings', fontSize: 24, color: '#FFFFFF', align: 'left'}).setOrigin(0, 0).setDepth(999).setAlpha(0);
    let textPrompt2 = PhaserScene.add.text(25, 140, text2, {fontFamily: 'kingthings', fontSize: 24, color: '#FFFFFF', align: 'left'}).setOrigin(0, 0).setDepth(999).setAlpha(0);
    let textPrompt3 = PhaserScene.add.text(25, 180, text3, {fontFamily: 'kingthings', fontSize: 24, color: '#FFFFFF', align: 'left'}).setOrigin(0, 0).setDepth(999).setAlpha(0);
    let textPrompt4 = PhaserScene.add.text(25, 220, text4, {fontFamily: 'kingthings', fontSize: 24, color: '#FFFFFF', align: 'left'}).setOrigin(0, 0).setDepth(999).setAlpha(0);
    PhaserScene.tweens.add({
        targets: textPrompt1,
        alpha: 1,
        delay: 1200,
        duration: 1400,
        completeDelay: 6500,
        onComplete: () => {
            let fintext = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 130, "Thank you for playing!", {fontFamily: 'kingthings', fontSize: 24, color: '#FFFFFF'}).setOrigin(0.5, 0).setDepth(999);
            let fintext2 = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 100, "(Challenge level unlocked)", {fontFamily: 'kingthings', fontSize: 18, color: '#FFFFFF'}).setOrigin(0.5, 0).setDepth(999).setAlpha(0.75);
            epilogue.fintext = fintext;
            epilogue.fintext2 = fintext2;

            let continueButton;
            continueButton = new Button({
                normal: {
                    atlas: 'buttons',
                    ref: "menu_btn_normal.png",
                    x: gameConsts.halfWidth,
                    y: gameConsts.height - 58,
                    scaleX: 0.57,
                    scaleY: 0.57
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
                    continueButton.destroy();
                    PhaserScene.tweens.add({
                        targets: blackout,
                        alpha: 0,
                        duration: 800,
                        ease: 'Quad.easeOut',
                        onComplete: () => {
                            blackout.destroy();
                        }
                    })
                    for (let i in epilogue) {
                        epilogue[i].destroy();
                    }
                    setRoom("practice");
                    hideGlobalClickBlocker();
                }
            });
            continueButton.addText("RETURN", {fontFamily: 'kingthings', fontSize: 24, color: '#000000', align: 'center'});
            continueButton.setTextOffset(0, -1);
            continueButton.setDepth(999);
        }
    })
    PhaserScene.tweens.add({
        targets: textPrompt2,
        alpha: 1,
        delay: 3500,
        duration: 1400,
    })
    PhaserScene.tweens.add({
        targets: textPrompt3,
        alpha: 1,
        delay: 6000,
        duration: 1400,
    })
    PhaserScene.tweens.add({
        targets: textPrompt4,
        alpha: 1,
        delay: 8200,
        duration: 1400,
    })
    epilogue.textPrompt = textPrompt1;
    epilogue.textPrompt2 = textPrompt2;
    epilogue.textPrompt3 = textPrompt3;
    epilogue.textPrompt4 = textPrompt4;
}

function openInstructPopup() {
    let instructContent = {};
    instructContent.title = PhaserScene.add.text(gameConsts.halfWidth, 123, 'INSTRUCTIONS', {fontFamily: 'kingthings', fontSize: 32, color: '#000000', align: 'center'}).setDepth(102).setOrigin(0.5, 0.5);
    instructContent.goal = PhaserScene.add.text(gameConsts.halfWidth - 158, 200, 'GOAL: Set all\npins in place\nto unlock the lock', {fontFamily: 'kingthings', fontSize: 24, color: '#000000', align: 'left'}).setDepth(102).setOrigin(0, 0.5);
    instructContent.tips = PhaserScene.add.text(gameConsts.halfWidth, 293, "Pins can only be set at the top\nof the lock, or else the lockpick breaks.", {fontFamily: 'kingthings', fontSize: 18, color: '#000000', align: 'center'}).setDepth(102).setOrigin(0.5, 0.5);

    instructContent.image = PhaserScene.add.image(gameConsts.halfWidth + 20, gameConsts.halfHeight - 150, 'lock', 'goal.png').setDepth(102).setScale(0.8).setOrigin(0 ,0);

    let xOffset = 214;
    let yOffset = -115;
    instructContent.arrowLeft = PhaserScene.add.image(xOffset+42, yOffset+gameConsts.height - 112, 'ui', 'arrow.png').setRotation(Math.PI*-0.5).setScale(0.8).setDepth(102).setTint(0x000000);
    instructContent.arrowRight = PhaserScene.add.image(xOffset+76, yOffset+gameConsts.height - 112, 'ui', 'arrow.png').setRotation(Math.PI*0.5).setScale(0.8).setDepth(102).setTint(0x000000);
    instructContent.arrowUp = PhaserScene.add.image(xOffset+42, yOffset+gameConsts.height - 78, 'ui', 'arrow.png').setScale(0.8).setDepth(102).setTint(0x000000);
    instructContent.controls = PhaserScene.add.text(xOffset+29, yOffset+gameConsts.height - 157, "CONTROLS:", {fontFamily: 'kingthings', fontSize: 24, color: '#000000', align: 'left'}).setOrigin(0, 0).setDepth(102);
    instructContent.movepick = PhaserScene.add.text(xOffset+97, yOffset+gameConsts.height - 124, "Move pick", {fontFamily: 'kingthings', fontSize: 20, color: '#000000', align: 'left'}).setOrigin(0, 0).setDepth(102);
    instructContent.lifttumbler = PhaserScene.add.text(xOffset+64, yOffset+gameConsts.height - 90, "Lift pin", {fontFamily: 'kingthings', fontSize: 20, color: '#000000', align: 'left'}).setOrigin(0, 0).setDepth(102);
    instructContent.spaceenter = PhaserScene.add.text(xOffset+30, yOffset+gameConsts.height - 62, "Space/Enter to set pin", {fontFamily: 'kingthings', fontSize: 20, color: '#000000', align: 'left'}).setOrigin(0, 0).setDepth(102);
    // instructContent.tips2 = PhaserScene.add.text(gameConsts.halfWidth, 472, "Tip: Listen and observe carefully\nhow the tumblers move", {fontFamily: 'kingthings', fontSize: 18, color: '#000000', align: 'center'}).setDepth(102).setOrigin(0.5, 0.5);

    openPopup(instructContent)
    let creditsButton = new Button({
        normal: {
            atlas: 'buttons',
            ref: "menu_btn_normal.png",
            x: gameConsts.halfWidth,
            y: gameConsts.halfHeight + 175,
            scaleX: 0.52,
            scaleY: 0.54,
            alpha: 0.92
        },
        hover: {
            atlas: 'buttons',
            ref: "menu_btn_hover.png",
            alpha: 1
        },
        press: {
            atlas: 'buttons',
            ref: "menu_btn_press.png",
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
            closePopup();
            openCreditsPopup();
        }
    });
    creditsButton.addText("CREDITS", {fontFamily: 'kingthings', fontSize: 22, color: '#000000', align: 'center'});
    creditsButton.setTextOffset(1, 0)
    creditsButton.setDepth(101);
    let extraContents = {creditsButton: creditsButton};
    addPopupContents(extraContents);

}


function openCreditsPopup() {
    let instructContent = {};
    instructContent.title = PhaserScene.add.text(gameConsts.halfWidth, 123, 'Credits', {fontFamily: 'kingthings', fontSize: 32, color: '#000000', align: 'center'}).setDepth(102).setOrigin(0.5, 0.5);
    instructContent.goal = PhaserScene.add.text(gameConsts.halfWidth - 158, 228, 'Game by Maxim Tsai\nSFX from Soundimage.org and Freesound.org\nMusic from Suno\nFan game inspired by Elder Scrolls IV: Oblivion', {fontFamily: 'kingthings', fontSize: 18, color: '#000000', align: 'left'}).setDepth(102).setOrigin(0, 0.5);
    instructContent.other = PhaserScene.add.text(gameConsts.halfWidth, 334, 'Check out my other games!', {fontFamily: 'kingthings', fontSize: 20, color: '#000000', align: 'left'}).setDepth(102).setOrigin(0.5, 0.5).setScale(0.9);

    openPopup(instructContent);

    let exhibitButton = new Button({
        normal: {
            atlas: 'ui',
            ref: "exhibit.png",
            x: gameConsts.halfWidth - 80,
            scaleX: 0.65,
            scaleY: 0.65,
            y: gameConsts.halfHeight + 109,
            alpha: 0.9
        },
        hover: {
            atlas: 'ui',
            ref: "exhibit.png",
            alpha: 1
        },
        press: {
            atlas: 'ui',
            ref: "exhibit.png",
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
            window.open("https://www.crazygames.com/game/exhibit-of-sorrows")
        }
    });
    exhibitButton.addText("Exhibit of Sorrows\n(Horror, Clowns)", {fontFamily: 'Times New Roman', fontSize: 14, color: '#000000', align: 'center'})
    exhibitButton.setTextOffset(0, 72);
    exhibitButton.setDepth(101);

    let dinerButton = new Button({
        normal: {
            atlas: 'ui',
            ref: "diner.png",
            x: gameConsts.halfWidth + 80,
            scaleX: 0.64,
            scaleY: 0.64,
            y: gameConsts.halfHeight + 109,
            alpha: 0.9
        },
        hover: {
            atlas: 'ui',
            ref: "diner.png",
            alpha: 1
        },
        press: {
            atlas: 'ui',
            ref: "diner.png",
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
            window.open("https://www.crazygames.com/game/diner-in-the-storm")

        }
    });
    dinerButton.addText("Diner in the Storm\n(Mystery, Escape)", {fontFamily: 'Times New Roman', fontSize: 14, color: '#000000', align: 'center'})
    dinerButton.setTextOffset(0, 71);
    dinerButton.setDepth(101);

    let extraContents = {exhibitButton: exhibitButton, dinerButton: dinerButton};
    addPopupContents(extraContents);

}
function openFlavorPopup(title = " ", content = " ", image, scale = 0.95) {
    let instructContent = {};
    instructContent.title = PhaserScene.add.text(gameConsts.halfWidth, 123, title, {fontFamily: 'kingthings', fontSize: 32, color: '#140000', align: 'center'}).setDepth(102).setOrigin(0.5, 0.5);

    if (image) {
        instructContent.image = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + 73, 'lock', image).setDepth(102).setScale(scale).setVisible(false);
    }
    instructContent.controls = PhaserScene.add.text(gameConsts.halfWidth - 170, gameConsts.halfHeight - 143, content, {fontFamily: 'kingthings', fontSize: 23, color: '#140000', align: 'left'}).setOrigin(0, 0).setScale(1, 0.98).setDepth(102);

    let extraContents = {};

    openPopup(instructContent);
    extraContents.continueButton = new Button({
        normal: {
            atlas: 'buttons',
            ref: "menu_btn_normal.png",
            x: gameConsts.halfWidth,
            y: gameConsts.height - 120,
            scaleX: 0.57,
            scaleY: 0.57
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
            closePopup();
            showCheatAfterDelay();
        }
    });
    extraContents.continueButton.addText("CONTINUE", {fontFamily: 'kingthings', fontSize: 24, color: '#000000', align: 'center'});
    extraContents.continueButton.setTextOffset(0, -1);
    extraContents.continueButton.setDepth(101);
    addPopupContents(extraContents);

}


function setPicksLeft(amt) {
    gameVars.picksLeft = amt;
    let text = gameVars.currRoom === "princess" ? "TRIES LEFT: " : "PICKS LEFT: "
    globalObjects.picksleftText.setText(text + gameVars.picksLeft);
}

function decrementPicksLeft() {
    gameVars.picksLeft--;
    let text = gameVars.currRoom === "princess" ? "TRIES LEFT: " : "PICKS LEFT: "
    globalObjects.picksleftText.setText(text + gameVars.picksLeft);
    if (gameVars.picksLeft >= 0) {
        globalObjects.picksleftText.setScale(1.18);
        PhaserScene.tweens.add({
            targets: globalObjects.picksleftText,
            scaleX: 0.95,
            scaleY: 0.95,
            ease: 'Quart.easeOut',
            duration: 280,
            onComplete: () => {
                PhaserScene.tweens.add({
                    targets: globalObjects.picksleftText,
                    scaleX: 1,
                    scaleY: 1,
                    ease: 'Back.easeOut',
                    duration: 280,
                })
            }
        })
    }

    if (gameVars.picksLeft <= 0) {

        showFail();
    }
}


function getLockpickChance() {
    let lockpickChance = 1; // out of 100
    switch(gameVars.currLevel) {
        case 0:
            lockpickChance = 20;
            break;
        case 1:
            lockpickChance = 15;
            break;
        case 2:
            lockpickChance = 15;
            break;
        case 3:
            lockpickChance = 12.5;
            break;
        case 4:
            lockpickChance = 12.5;
            break;
        case 5:
            lockpickChance = 11;
            break;
        case 6:
            lockpickChance = 10;
            break;
        case 7:
            lockpickChance = 9;
            break;
        default:
            lockpickChance = 10;
            break;
    }
    return lockpickChance;
}

function attemptAutoLockpick() {

    if (gameVars.picksLeft <= 0) {
        return;
    }

    let lockpickChance = getLockpickChance();
    globalObjects.autopickText.setText("UNLOCK CHANCE: "+lockpickChance+"%");

    let currPin = globalObjects.pins[gameVars.currentPin]
    if (currPin.inMotion || currPin.locked) {
        // not even being moved, nothing happens other than warning message
        PhaserScene.tweens.add({
            targets: [globalObjects.pick, globalObjects.pickshadow],
            rotation: -0.02,
            x: "-=2",
            duration: 10,
            onComplete: () => {
                PhaserScene.tweens.add({
                    targets: [globalObjects.pick, globalObjects.pickshadow],
                    rotation: 0,
                    x: "+=5",
                    duration: 40,
                    onComplete: () => {
                        PhaserScene.tweens.add({
                            targets: [globalObjects.pick, globalObjects.pickshadow],
                            x: "-=3",
                            duration: 40,
                            ease: 'Back.easeOut',
                        })
                    },
                })
            },
        })
    } else {
        let chanceAdd = gameVars.pinsFixed === 0 ? 20 : 0;
        let randGen = Math.random() * 100;
        console.log(((lockpickChance - 10) * 0.7 + gameVars.autoFailureIncrementChance) + chanceAdd);
        if (randGen < ((lockpickChance - 10) * 0.7 + gameVars.autoFailureIncrementChance) + chanceAdd) {
            // unlock success
            setPin(true);
            gameVars.autoFailureIncrementChance = 0;
        } else {
            gameVars.autoFailureIncrementChance = gameVars.autoFailureIncrementChance * 1.3 + lockpickChance * 0.17 + 0.05 * chanceAdd;
            breakPick(true);

        }
    }


}

function showCheatAfterDelay() {

}

function showCheatOption() {
    if (!gameVars.usingSkull && gameVars.picksLeft > 1) {
        setTimeout(() => {
            if (gameVars.picksLeft > 0) {
                globalObjects.cheatButton.setState(NORMAL);
                globalObjects.cheatButton.tweenToPos(-70, 150, 625, 'Back.easeOut');
            }
        }, 250)
    }

}

function hideCheatOption() {
    globalObjects.cheatButton.setState(DISABLE)
    globalObjects.cheatButton.tweenToPos(-150, 150, 300, 'Cubic.easeOut')
}