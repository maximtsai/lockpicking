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
    globalObjects.pins = [];
    globalObjects.indicators = [];
    gameVars.currentPin = 0;
    globalObjects.infoText = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.height - 60, " ", {fontFamily: 'kingthings', fontSize: 24, color: '#FFFFFF', align: 'center'}).setStroke('#000000', 4).setDepth(50).setAlpha(0).setOrigin(0.5, 0.5);


    for (let i = 0; i < 5; i++) {
        let xOffset = 0;
        if (i >= 1) {
            xOffset = 0.5;
        }
        globalObjects.indicators[i] = PhaserScene.add.image(gameConsts.halfWidth - 36 + i * 31 + xOffset, gameConsts.halfHeight - 78 + gameConsts.UIYOffset, 'lock', 'icon_black.png');
    }
    PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'lockshadow.png').setDepth(1);

    globalObjects.title = PhaserScene.add.text(gameConsts.halfWidth, gameConsts.halfHeight - 36, 'SUCCESS!', {fontFamily: 'kingthings', fontSize: 72, color: '#FFFF00', align: 'center'}).setStroke('#000000', 10).setDepth(50).setOrigin(0.5, 0.5).setAlpha(0);

    setRoom('practice');

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
        globalObjects.pins[j] = PhaserScene.add.image(gameConsts.halfWidth - 36 + j * 31 + xOffset, gameConsts.halfHeight + 2 - yOffset + gameConsts.UIYOffset, 'lock', 'pin.png');
        globalObjects.pins[j].startY = gameConsts.halfHeight + 2 + gameConsts.UIYOffset;
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
        }
        currPin.randDur = Math.max(90, 90 + randVal * 25);
    }
    let dropDelay = Math.max(0, Math.floor(currPin.randDur * 1.7 - 130));
    let overrideCantOpen = currPin.randDur < 90;
    if (overrideCantOpen) {
        dropDelay = 0;
    }

    currPin.currDelay = PhaserScene.time.delayedCall(Math.min(currPin.randDur - 1, Math.floor(currPin.randDur * 0.8) + 10), () => {
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
            currPin.currDelay = PhaserScene.time.delayedCall(Math.max(0, Math.ceil((currPin.randDur - 125) * 3) + dropDelay * 1.55), () => {
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
                duration: Math.max(420, currPin.randDur * 6.75 - 210),
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
                    if (randVal == currPin.secondLastRandVal) {
                        // reduce chances of getting second last one, but not impossible.
                        let testRandVal = Math.floor(Math.random() * 5);
                        if (testRandVal != currPin.lastRandVal) {
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
        globalObjects.indicators[gameVars.currentPin].setFrame('icon_black.png');
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
                hasUnlocked = true;
            }
        }

        if (gameVars.currRoom === 'princess') {
            if (gameVars.princessCounter === gameVars.pinsFixed) {
                gameVars.princessCounter++;
                let pinText = [
                    "I kneel, whispering that I'm a friend\nwho got lost, not a scary monster.",
                    "",
                    "I show a shiny coin, saying I'm a treasure\nhunter for pretty things like her toys.",
                    "",
                    "I tell her we are secret friends now,\nand promise a new toy if she doesn't tell anyone about me.",
                    ""
                ];
                if (pinText[gameVars.pinsFixed - 1] !== "") {
                    globalObjects.infoText.setAlpha(0);
                    globalObjects.infoText.setText(pinText[gameVars.pinsFixed - 1]);
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

        }
        if (!hasUnlocked) {
            slideOpenLock();
        }

    } else {
        playSound('pickbreak', 1);
        if (globalObjects.pick.currAnim) {
            globalObjects.pick.currAnim.stop();
        }
        if (gameVars.dropAllOnFail) {
            decrementAllPins();
        } else if (gameVars.dropOnFail) {
            decrementPins();
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
    for (let i = globalObjects.pins.length; i >= 0; i--) {
        let currPin = globalObjects.pins[i];
        if (currPin && currPin.locked) {
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
        "I somehow botch the easiest lock with\na mountain of lockpicks. Great start.",
        "My hasty fingers fumble the crude lock,\nand now I remain stuck behind bars.",
        "The clothier’s sturdy lock catches my tools,\nleaving me in rags unfit for the castle.",
        "My missteps alert the guards, and the gate’s\nlock holds firm, blocking my path.",
        "The enchanted lock resets at my slightest\nmistake, sealing the door tight.",
        "The masterful lock defies my trembling hands,\nkeeping the crown beyond reach.",
        "A clumsy word frightens the young princess,\nand she cries for the guards."
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
        completeDelay: 500,
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

function slideOpenLock() {
    playSound('success', 1.1);
    if (globalObjects.playUponUnlock) {
        for (let i in globalObjects.playUponUnlock) {
            globalObjects.playUponUnlock[i]();
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
                            } else {
                                gotoNextLevel();
                            }
                        }
                    });
                    gameVars.showNextButton = gameVars.currLevel ? gameVars.currLevel + 1 : 1;

                    let buttonText = gameVars.currRoom === 'princess' ? "CONTINUE" : "NEXT LEVEL";
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

function openPopup(contents) {
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
    let text1 = "The princess calms down and waves before returning to her toys.";
    let text2 = "I grab the crown and escape with it hidden under my cloak."
    let text3 = "Though my hands are full of treasure, my mind is occupied by the child's smile.";
    let text4 = "I wonder if I'll come back again for more stories with my new friend.";

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
        completeDelay: 5000,
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
        delay: 3200,
        duration: 1400,
    })
    PhaserScene.tweens.add({
        targets: textPrompt3,
        alpha: 1,
        delay: 5000,
        duration: 1400,
    })
    PhaserScene.tweens.add({
        targets: textPrompt4,
        alpha: 1,
        delay: 6800,
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
    instructContent.goal = PhaserScene.add.text(gameConsts.halfWidth - 158, 200, 'GOAL: Set all\ntumblers in place\nto unlock the lock', {fontFamily: 'kingthings', fontSize: 24, color: '#000000', align: 'left'}).setDepth(102).setOrigin(0, 0.5);
    instructContent.tips = PhaserScene.add.text(gameConsts.halfWidth, 295, "Tumblers can only be set at the top\nof the lock, or else the lockpick breaks.", {fontFamily: 'kingthings', fontSize: 18, color: '#000000', align: 'center'}).setDepth(102).setOrigin(0.5, 0.5);

    instructContent.image = PhaserScene.add.image(gameConsts.halfWidth + 20, gameConsts.halfHeight - 150, 'lock', 'goal.png').setDepth(102).setScale(0.8).setOrigin(0 ,0);

    let xOffset = 214;
    let yOffset = -92;
    instructContent.arrowLeft = PhaserScene.add.image(xOffset+42, yOffset+gameConsts.height - 112, 'ui', 'arrow.png').setRotation(Math.PI*-0.5).setScale(0.8).setDepth(102).setTint(0x000000);
    instructContent.arrowRight = PhaserScene.add.image(xOffset+76, yOffset+gameConsts.height - 112, 'ui', 'arrow.png').setRotation(Math.PI*0.5).setScale(0.8).setDepth(102).setTint(0x000000);
    instructContent.arrowUp = PhaserScene.add.image(xOffset+42, yOffset+gameConsts.height - 78, 'ui', 'arrow.png').setScale(0.8).setDepth(102).setTint(0x000000);
    instructContent.controls = PhaserScene.add.text(xOffset+29, yOffset+gameConsts.height - 157, "CONTROLS:", {fontFamily: 'kingthings', fontSize: 24, color: '#000000', align: 'left'}).setOrigin(0, 0).setDepth(102);
    instructContent.movepick = PhaserScene.add.text(xOffset+97, yOffset+gameConsts.height - 124, "Move pick", {fontFamily: 'kingthings', fontSize: 20, color: '#000000', align: 'left'}).setOrigin(0, 0).setDepth(102);
    instructContent.lifttumbler = PhaserScene.add.text(xOffset+64, yOffset+gameConsts.height - 90, "Lift tumbler", {fontFamily: 'kingthings', fontSize: 20, color: '#000000', align: 'left'}).setOrigin(0, 0).setDepth(102);
    instructContent.spaceenter = PhaserScene.add.text(xOffset+30, yOffset+gameConsts.height - 62, "Space/Enter to set tumbler", {fontFamily: 'kingthings', fontSize: 20, color: '#000000', align: 'left'}).setOrigin(0, 0).setDepth(102);
    // instructContent.tips2 = PhaserScene.add.text(gameConsts.halfWidth, 472, "Tip: Listen and observe carefully\nhow the tumblers move", {fontFamily: 'kingthings', fontSize: 18, color: '#000000', align: 'center'}).setDepth(102).setOrigin(0.5, 0.5);


    openPopup(instructContent)
}

function openFlavorPopup(title = " ", content = " ", image, scale = 0.95) {
    let instructContent = {};
    instructContent.title = PhaserScene.add.text(gameConsts.halfWidth, 123, title, {fontFamily: 'kingthings', fontSize: 32, color: '#000000', align: 'center'}).setDepth(102).setOrigin(0.5, 0.5);

    if (image) {
        instructContent.image = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + 73, 'lock', image).setDepth(102).setScale(scale);
    }
    instructContent.controls = PhaserScene.add.text(gameConsts.halfWidth - 170, gameConsts.halfHeight - 153, content, {fontFamily: 'kingthings', fontSize: 20, color: '#000000', align: 'left'}).setOrigin(0, 0).setScale(1, 0.98).setDepth(102);

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
            closePopup()
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
