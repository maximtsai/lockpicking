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


    globalObjects.extras = [];
    globalObjects.roomTitle = PhaserScene.add.text(gameConsts.halfWidth, 50, 'TRAINING LOCK', {fontFamily: 'kingthings', fontSize: 40, color: '#FFFFFF', align: 'center'}).setStroke('#000000', 4).setDepth(99).setOrigin(0.5, 0.5);

    // globalObjects.hoverTextManager = new InternalHoverTextManager(PhaserScene);
    globalObjects.currBackground = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight, 'backgrounds', 'door.png');
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

    playMusic('quietshadows', 1, true);
}

function setupLevelButton() {
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
            scaleX: 0.75,
            scaleY: 0.75,
            x: gameConsts.width - 74,
            y: 28,
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
            scaleX: 0.75,
            scaleY: 0.75,
            x: gameConsts.width - 118,
            y: 28,
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
        updateGlobalVolume(0.25);
        globalObjects.mutebtn.setNormalRef("audio_mid.png");
        globalObjects.mutebtn.setHoverRef("audio_mid_hover.png");
        playSound('click', 1.5)
    } else {
        updateGlobalVolume(1)
        globalObjects.mutebtn.setNormalRef("audio_on.png");
        globalObjects.mutebtn.setHoverRef("audio_on_hover.png");
        playSound('click', 1.5)
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
            ref: "general_btn.png",
            x: gameConsts.width - 30,
            y: 28,
            scaleX: 0.75,
            scaleY: 0.75,
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
            openInstructPopup()
        }
    });
    questionButton.addText("?", {fontFamily: 'kingthings', fontSize: 28, color: '#000000', align: 'center'});
    questionButton.setTextOffset(0, 0)
    questionButton.setDepth(1);
}

function setRoom(room) {
    for (let i in globalObjects.extras) {
        globalObjects.extras[i].destroy();
    }
    globalObjects.extras = [];
    if (room == "practice") {
        createPins(3);
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
    if (Math.abs(goalX - globalObjects.pick.x) > 5) {
        playSound('metalclink').detune = 200 - Math.random() * 400;
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
    let goalY = gameConsts.halfHeight - 16;
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

    currPin.currDelay = PhaserScene.time.delayedCall(Math.max(currPin.randDur - 1, Math.floor(currPin.randDur * 0.55) + 6), () => {
        if (!overrideCantOpen) {
            gameVars.canLock = true;
            gameVars.canShowGreen = true;
            setTimeout(() => {
                if (gameVars.canShowGreen && !currPin.locked && !globalObjects.indicators[pinNum].stuck) {
                    globalObjects.indicators[pinNum].setFrame('icon_green.png');
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
            }, 10)
            currPin.currDelay = PhaserScene.time.delayedCall(Math.max(0, Math.ceil((currPin.randDur - 125) * 3.3) + dropDelay * 1.75), () => {
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
        y: gameConsts.halfHeight - 47,
        ease: 'Quad.easeOut',
        duration: currPin.randDur,
        onStart: () => {
            playSound('nudge').detune = 100 - Math.random() * 80 - currPin.randDur * 1.5;

        },
        onComplete: () => {
            playSound('clicktop', 0.4 + currPin.randDur * 0.002 - Math.random() * 0.35).detune = 100 - Math.random() * 100 - currPin.randDur * 0.4;
            currPin.currAnim = PhaserScene.tweens.add({
                delay: dropDelay,
                targets: currPin,
                y: currPin.startY,
                ease: 'Quad.easeIn',
                duration: Math.max(420, currPin.randDur * 6.85 - 210),
                onStart: () => {
                    currPin.fallSoundTimeout = setTimeout(() => {
                        if (!currPin.locked) {
                            let randIdx = Math.floor(Math.random() * 2.5) + 1;
                            let soundToPlay = 'pinfall' + randIdx;
                            currPin.currSound = playSound(soundToPlay, 2);
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
        playSound(randSound).detune = 100 - Math.random() * 200;
        // playSound(Math.random() < 0.5 ? 'lockin1' : 'lockin2').detune = 100 - Math.random() * 200;
        // Lock
        if (currPin.currAnim) {
            currPin.currAnim.stop();
        }
        if (currPin.currSound) {
            currPin.currSound.stop();
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
        playSound('pickbreak');
        if (globalObjects.pick.currAnim) {
            globalObjects.pick.currAnim.stop();
        }
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
            y: gameConsts.halfHeight + 130,
            x: "+=25",
            duration: 290,
            alpha: 0,
            onComplete: () => {
                resetPick(false);

            },
        })

    }
}

function resetPick(setToZero = true) {
    if (setToZero) {
        gameVars.currentPin = 0;
    }
    let goalX = gameConsts.halfWidth + gameVars.currentPin * 30.3;
    if (globalObjects.pick.currAnim) {
        globalObjects.pick.currAnim.stop();
    }


    globalObjects.pick.alpha = 0.5;
    globalObjects.pickshadow.alpha = 0.5;
    globalObjects.pick.rotation = 0;
    globalObjects.pickshadow.rotation = 0;
    globalObjects.pick.x = goalX - 35;
    globalObjects.pickshadow.x = goalX - 35;
    globalObjects.pick.y = gameConsts.halfHeight;
    globalObjects.pickshadow.y = gameConsts.halfHeight;
    gameVars.pickStuck = false;

    globalObjects.pick.currAnim = PhaserScene.tweens.add({
        targets: [globalObjects.pick, globalObjects.pickshadow],
        x: goalX,
        alpha: 1,
        duration: 140,
        ease: 'Quart.easeOut',
    })
}


function slideOpenLock() {
    playSound('success');
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
    playSound("paperflip", 0.6);
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

function openLevelPopup() {
    let lvlContents = {};
    lvlContents.title = PhaserScene.add.text(gameConsts.halfWidth, 123, 'LEVEL SELECT', {fontFamily: 'kingthings', fontSize: 32, color: '#000000', align: 'center'}).setDepth(102).setOrigin(0.5, 0.5);
    openPopup(lvlContents)
    let extraContents = {};

    let levelNames = [
        "Training Lock",
        "Level 1: Chains",
        "Level 2: Escape",
        "Level 3: Dressing Up",
        "Level 4: Palace Gate",
        "Level 5: Tricky Door",
        "Level 6: Bedroom",
        "Level 7: Her Heart"];
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
    let flavorStory = [
        "I'm bound in chains for slipping into forbidden places and claiming forbidden treasures. The chains are strong, but the lock is crude, barely a challenge for my skills.",
        "The shackles are off, but iron bars still cage me in this prison. The lock is flimsy, begging for a quick twist of my tools. A little finesse, and I’ll be out in no time.",
        "I have escaped, but to reach the castle’s treasure, I need finer clothes to be presentable. The clothier’s lock is sturdy, a step above the prison’s, but I’m confident I can slip in and claim the attire I need.",
        "The castle looms, its treasures calling, but sturdy outer gates bar my path. Their locks are well-crafted, yet familiar. I find a blind spot in the security patrols and begin.",
        "An unassuming door blocks my way, its plain facade hiding a tricky lock enchanted to reset if I falter. One wrong move could undo my progress. I steady my hands and listen closely to crack its magic.",
        "The princess's door stands before me, its locks a masterpiece of craft and enchantment. Every safeguard known protects this final barrier. Failure is not an option, but victory is within reach.",
        "I’ve reached the true treasure: Princess Liora's guarded heart, protected by the most intricate lock of all. Each move must be deliberate, each word precise, to unlock her trust and love. I tread with utmost care, knowing this is my greatest challenge yet.",
        "The final tumbler clicks, and Liora's heart opens, her warm smile inviting me to talk by the fire for hours, undisturbed by guards. As dawn approaches, I slip out the tower window, heart full, certain I’ll return to her another night."
    ]
}

function failLevel() {
    let flavorText = [
        "My hasty fingers fumble the crude lock, leaving me chained and stalled.",
        "The flimsy lock jams under my rushed picks, keeping me caged behind bars.",
        "The clothier’s sturdy lock catches my tools, leaving me in rags unfit for the castle.",
        "A misstep alerts the guards, and the gate’s lock holds firm, blocking my path.",
        "The enchanted lock resets at my slightest mistake, sealing the door tight.",
        "The masterful lock defies my trembling hands, keeping the princess beyond reach.",
        "A clumsy word locks Liora's heart tighter, her trust slipping away. I retreat, vowing to tread more carefully next time."
    ]
}
