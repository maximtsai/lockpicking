
function setRoom(room) {
    globalObjects.pick.setFrame('pick.png');
    globalObjects.pickshadow.setVisible(true);

    if (globalObjects.infoText.currAnim) {
        globalObjects.infoText.currAnim.stop();
    }
    globalObjects.infoText.alpha = 0;
    for (let i in globalObjects.extras) {
        globalObjects.extras[i].destroy();
    }
    if (globalObjects.extrasCleanup) {
        globalObjects.extrasCleanup();
        globalObjects.extrasCleanup = null;
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
    } else if (room === "crown") {
        loadCrownRoom();
    } else if (room === "princess") {
        loadPrincessRoom();

    } else if (room === "challenge") {
        loadChallengeRoom();

    }
    resetPick()
}

function loadPracticeRoom() {
    if (gameVars.bonusUnlocked) {
        let newitem = PhaserScene.add.text(60, 120, "+CHALLENGE\nADDED", {fontFamily: 'kingthings', fontSize: 20, color: '#FFFFFF', align: 'center'}).setScale(0.8).setAlpha(0.5).setDepth(99).setStroke('#000000', 4).setOrigin(0.5, 0.5);
        globalObjects.extras.push(newitem);
        PhaserScene.tweens.add({
            targets: newitem,
            alpha: 1,
            duration: 800,
            ease: 'Quad.easeOut'
        })
        PhaserScene.tweens.add({
            targets: newitem,
            duration: 900,
            y: 100,
            ease: 'Cubic.easeIn',
            onComplete: () => {
                PhaserScene.tweens.add({
                    targets: newitem,
                    duration: 800,
                    scaleX: 1,
                    scaleY: 1,
                    y: 115,
                    ease: 'Cubic.easeOut',
                    onComplete: () => {
                        PhaserScene.tweens.add({
                            targets: newitem,
                            duration: 650,
                            y: 106,
                            ease: 'Cubic.easeIn',
                            onComplete: () => {
                                newitem.setScale(1.03);
                                PhaserScene.tweens.add({
                                    targets: newitem,
                                    duration: 500,
                                    scaleX: 1,
                                    scaleY: 1,
                                    ease: 'Back.easeOut',
                                    completeDelay: 3000,
                                    onComplete: () => {
                                        PhaserScene.tweens.add({
                                            targets: newitem,
                                            duration: 500,
                                            alpha: 0,
                                            onComplete: () => {
                                                newitem.destroy();
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
    swapMusic('quietshadows');
    createPins(3);
    setPicksLeft(99);
    for (let i in globalObjects.indicators) {
        globalObjects.indicators[i].visible = true;
    }
    globalObjects.currBackground.setFrame('skull.png').setScale(1.37);
    globalObjects.mechanism.setFrame('mechanism.png');
    globalObjects.lock.setFrame('lock.png');
    let arrowLeft = PhaserScene.add.image(42, gameConsts.height - 116, 'ui', 'arrow.png').setRotation(Math.PI*-0.5).setScale(0.8);
    let arrowRight = PhaserScene.add.image(77, gameConsts.height - 116, 'ui', 'arrow.png').setRotation(Math.PI*0.5).setScale(0.8);
    let arrowUp = PhaserScene.add.image(42, gameConsts.height - 82, 'ui', 'arrow.png').setScale(0.8);
    let space = PhaserScene.add.image(58, gameConsts.height - 48, 'ui', 'space.png').setScale(0.8);
    globalObjects.extras.push(arrowLeft);
    globalObjects.extras.push(arrowRight);
    globalObjects.extras.push(arrowUp);
    globalObjects.extras.push(space);

    globalObjects.roomTitle.setText('TRAINING')
    let instructions = PhaserScene.add.text(25, gameConsts.height - 157, "CONTROLS:", {fontFamily: 'kingthings', fontSize: 20, color: '#FFFFFF', align: 'left'}).setDepth(99).setStroke('#000000', 4).setOrigin(0, 0);
    globalObjects.extras.push(instructions);
    let instructions2 = PhaserScene.add.text(97, gameConsts.height - 130, "Move pick", {fontFamily: 'kingthings', fontSize: 20, color: '#FFFFFF', align: 'left'}).setDepth(99).setStroke('#000000', 4).setOrigin(0, 0);
    globalObjects.extras.push(instructions2);
    let instructions3 = PhaserScene.add.text(64, gameConsts.height - 96, "Lift pin", {fontFamily: 'kingthings', fontSize: 20, color: '#FFFFFF', align: 'left'}).setDepth(99).setStroke('#000000', 4).setOrigin(0, 0);
    globalObjects.extras.push(instructions3);

    let instructions4 = PhaserScene.add.text(28, gameConsts.height - 62, "                 / Enter to set pin\nwhen at top of lock", {fontFamily: 'kingthings', fontSize: 20, color: '#FFFFFF', align: 'left'}).setDepth(99).setStroke('#000000', 4).setOrigin(0, 0);
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
    swapMusic('quietshadows');
    globalObjects.currBackground.setFrame('loot.png').setScale(1.36);
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
    createPins(1);
    setPicksLeft(3);
    globalObjects.roomTitle.setText('LOCKBOX');
}

function loadClothesRoom() {
    swapMusic('lili');
    globalObjects.currBackground.setFrame('shop.png').setScale(1.37);
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
    globalObjects.roomTitle.setText('TAVERN')
}

function loadGateRoom() {
    swapMusic('lili');
    globalObjects.currBackground.setFrame('sewer.png').setScale(1.37);
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
    createPins(3);
    setPicksLeft(3);
    globalObjects.roomTitle.setText('SEWER')
}

function loadEnchantedRoom() {
    swapMusic('indeep');
    globalObjects.currBackground.setFrame('gates.png').setScale(1.37);
    globalObjects.mechanism.setFrame('mechanismgold.png');
    globalObjects.lock.setFrame('goldenlock.png');

    let bar1 = PhaserScene.add.image(gameConsts.halfWidth + 27, gameConsts.halfHeight + gameConsts.UIYOffset - 4, 'lock', 'lockbar.png').setDepth(-1).setOrigin(0.5, 1.06).setRotation(0.64);
    let bar2 = PhaserScene.add.image(gameConsts.halfWidth + 27, gameConsts.halfHeight + gameConsts.UIYOffset - 4, 'lock', 'lockbar.png').setDepth(-1).setOrigin(0.5, 1.06).setRotation(1.05);
    let bar3 = PhaserScene.add.image(gameConsts.halfWidth + 27, gameConsts.halfHeight + gameConsts.UIYOffset - 4, 'lock', 'lockbar.png').setDepth(-1).setOrigin(0.5, 1.06).setRotation(-0.64);
    let bar4 = PhaserScene.add.image(gameConsts.halfWidth + 27, gameConsts.halfHeight + gameConsts.UIYOffset - 4, 'lock', 'lockbar.png').setDepth(-1).setOrigin(0.5, 1.06).setRotation(-1.05);
    // let bars = [bar1, bar2, bar3, bar4];

    globalObjects.extras.push(bar1);
    globalObjects.extras.push(bar2);
    globalObjects.extras.push(bar3);
    globalObjects.extras.push(bar4);
    globalObjects.playUponUnlock = [() => {
        PhaserScene.tweens.add({
            delay: 90, targets: bar1, scaleY: 1.45, ease: 'Quart.easeOut', duration: 400
        })
        PhaserScene.tweens.add({
            delay: 0, targets: bar2, scaleY: 1.45, ease: 'Quart.easeOut', duration: 400
        })
        PhaserScene.tweens.add({
            delay: 90, targets: bar3, scaleY: 1.45, ease: 'Quart.easeOut', duration: 400
        })
        PhaserScene.tweens.add({
            delay: 0, targets: bar4, scaleY: 1.45, ease: 'Quart.easeOut', duration: 400
        })
    }]

    createPins(3, true);
    setPicksLeft(3);
    globalObjects.roomTitle.setText('ENCHANTED GATE')
}

function loadCrownRoom() {
    swapMusic('indeep');
    globalObjects.currBackground.setFrame('magic.png').setScale(1.37);
    globalObjects.mechanism.setFrame('mechanismgold.png');
    globalObjects.lock.setFrame('goldenlock.png');


    let bar1 = PhaserScene.add.image(gameConsts.halfWidth + 27, gameConsts.halfHeight + gameConsts.UIYOffset - 4, 'lock', 'lockbar.png').setDepth(-1).setOrigin(0.5, 1.06).setRotation(0.64);
    let bar2 = PhaserScene.add.image(gameConsts.halfWidth + 27, gameConsts.halfHeight + gameConsts.UIYOffset - 4, 'lock', 'lockbar.png').setDepth(-1).setOrigin(0.5, 1.06).setRotation(1.05);
    let bar3 = PhaserScene.add.image(gameConsts.halfWidth + 27, gameConsts.halfHeight + gameConsts.UIYOffset - 4, 'lock', 'lockbar.png').setDepth(-1).setOrigin(0.5, 1.06).setRotation(-0.64);
    let bar4 = PhaserScene.add.image(gameConsts.halfWidth + 27, gameConsts.halfHeight + gameConsts.UIYOffset - 4, 'lock', 'lockbar.png').setDepth(-1).setOrigin(0.5, 1.06).setRotation(-1.05);
    // let bars = [bar1, bar2, bar3, bar4];

    globalObjects.extras.push(bar1);
    globalObjects.extras.push(bar2);
    globalObjects.extras.push(bar3);
    globalObjects.extras.push(bar4);
    globalObjects.playUponUnlock = [() => {
        PhaserScene.tweens.add({
            delay: 90, targets: bar1, scaleY: 1.45, ease: 'Quart.easeOut', duration: 400
        })
        PhaserScene.tweens.add({
            delay: 0, targets: bar2, scaleY: 1.45, ease: 'Quart.easeOut', duration: 400
        })
        PhaserScene.tweens.add({
            delay: 90, targets: bar3, scaleY: 1.45, ease: 'Quart.easeOut', duration: 400
        })
        PhaserScene.tweens.add({
            delay: 0, targets: bar4, scaleY: 1.45, ease: 'Quart.easeOut', duration: 400
        })
    }]
    createPins(4, true);
    setPicksLeft(3);
    globalObjects.roomTitle.setText("PALACE DOOR")

}

function loadPrincessRoom() {
    swapMusic('princess');
    gameVars.princessCounter = 1;
    globalObjects.currBackground.setFrame('stairs.png').setScale(1.37);
    globalObjects.mechanism.setFrame('blank.png');
    globalObjects.lock.setFrame('heartlock.png');

    let heartPulse = PhaserScene.add.image(gameConsts.halfWidth + 28, gameConsts.halfHeight + gameConsts.UIYOffset - 2, 'lock', 'heart.png').setDepth(-9).setScale(0.92).setAlpha(1.15);
    heartPulse.anim1 = PhaserScene.tweens.add({
        targets: heartPulse,
        delay: 1500,
        alpha: 0,
        ease: 'Quad.easeOut',
        duration: 3500,
        repeat: -1
    })
    heartPulse.anim2 = PhaserScene.tweens.add({
        targets: heartPulse,
        delay: 1500,
        scaleX: 1.55,
        scaleY: 1.55,
        ease: 'Quad.easeOut',
        duration: 3500,
        repeat: -1
    })
    globalObjects.extras.push(heartPulse);


    let shadow = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'heartlockshadow.png').setDepth(-9).setScale(1.37);
    globalObjects.extras.push(shadow);
    globalObjects.playUponUnlock = [() => {
        heartPulse.anim1.stop();
        PhaserScene.tweens.add({
            targets: heartPulse,
            alpha: 0,
            duration: 500,
        })
    }]
    createPins(5, true);
    setPicksLeft(4);
    globalObjects.roomTitle.setText('SEALED SCROLL')
}

function loadChallengeRoom() {
    globalObjects.currBackground.setFrame('workbench2.png').setScale(1.37);
    globalObjects.mechanism.setFrame('mechanism_bar_many.png');
    globalObjects.lock.setFrame('masterlock.png');

    let lockback = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'masterlockback.png').setDepth(-1).setScale(2);
    globalObjects.extras.push(lockback);
    let lockShadowExtra = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'lockshadowextra.png').setDepth(5);
    globalObjects.extras.push(lockShadowExtra);

    let lockrunes = PhaserScene.add.image(gameConsts.halfWidth, gameConsts.halfHeight + gameConsts.UIYOffset, 'lock', 'masterlockrunes.png').setDepth(-1);
    globalObjects.extras.push(lockrunes);
    lockrunes.anim = PhaserScene.tweens.add({
        targets: lockrunes,
        alpha: 0.25,
        ease: 'Cubic.easeInOut',
        duration: 3000,
        yoyo: true,
        repeat: -1,
    })
    globalObjects.playUponUnlock = [() => {
        lockrunes.anim.stop();
        PhaserScene.tweens.add({
            targets: lockrunes,
            alpha: 0,
            scaleX: 1.2,
            scaleY: 1.2,
            ease: 'Cubic.Out',
            duration: 500,
        })
        globalObjects.infoText.setAlpha(0);
        globalObjects.infoText.setText("The lock practically falls apart once I crack it open.\nMy rival weeps while I stand victorious.")
        if (globalObjects.infoText.currAnim) {
            globalObjects.infoText.currAnim.stop();
        }
        globalObjects.infoText.currAnim = PhaserScene.tweens.add({
            targets: globalObjects.infoText,
            alpha: 1,
            duration: 500,
            ease: 'Cubic.easeOut',
            completeDelay: 10000,
            onComplete: () => {
                globalObjects.infoText.currAnim = PhaserScene.tweens.add({
                    targets: globalObjects.infoText,
                    alpha: 0,
                    duration: 500,
                    ease: 'Cubic.easeOut',
                })
            }
        })
    }]
    createPins(6, true, true);
    setPicksLeft(6);
    globalObjects.roomTitle.setText('CHALLENGE')
}



function gotoNextLevel() {
    let levelToGo = (gameVars.currLevel !== undefined) ? gameVars.currLevel + 1 : 0;
    gotoLevel(levelToGo);
}

function gotoLevel(lvl, skipIntro = false) {
    if (gameVars.usingSkull) {
        hideCheatOption();
        gameVars.usingSkull = false;

    }

    gameVars.firstPickBroken = false;
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
            globalObjects.pick.setFrame('pick.png');
            globalObjects.pickshadow.setVisible(true);
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
                "I prowl the Imperial City's underground,\nneeding coin to fund my heist for a\nvaluable scroll with a very generous\npayout.\n\nMy eyes notice an abandoned lockbox\nthat tempts me with easy pickings.",
                "With some spare coin and a seat at the\ntavern, I get information on the scroll's\nwhereabouts, but I need maps to help\nnavigate the way.\n\nThe tavern's backrooms contain\nsmuggler goods, only loosely guarded\nto anyone with the finesse to take\nits contents.",
                "The scroll lies within the Imperial\nPalace, reachable through the sewers,\nbut a rusted grate bars the way.\n\nThe lock on it is sturdy but familiar, and\nshould yield as long as I'm careful.",
                "I've reached the end of the sewers,\nbut a strange gate adorned with the\nroyal crest blocks my path.\n\nThe lock on this gate looks simple but\nI notice the glow of a tricky enchantment.\nI'll have to be careful with this one.",
                "The vault-like door to the inner Palace\nstands before me, its locks a masterpiece\nof craftsmanship and enchantment.\n\nEvery known safeguard protects this\nbarrier, testing my skill to its limit.",
                "I've finally reached the royal library,\na chamber of ancient tomes guarded\nby blind monks.\n\nI spot the scroll right away but a\nstar-shaped seal secures its contents.\n\nI sense this scroll hides secrets greater\nthan any treasure, but I've come too\nfar to stop now.",
                "After much drinking and bragging about\nmy latest heist, a rival locksmith presents\nto me a contraption so complex it could\nbarely be called a lock anymore.\n\nThere's something devious about this\ndevice but my prior boasting prevents\nme from withdrawing from this\nchallenge.\n\nI'll bring extra picks just in case."
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
                    setRoom("crown");
                    break;
                case 6:
                    setRoom("princess");
                    // globalObjects.pickshadow.setVisible(false);
                    // globalObjects.pick.setFrame('pick_heart.png');
                    break;
                case 7:
                    setRoom("challenge");
                    break;
            }
            let levelNames = [
                "Training",
                "Level 1: Lockbox",
                "Level 2: Tavern",
                "Level 3: Sewer",
                "Level 4: Enchanted Gate",
                "Level 5: Palace Door",
                "Level 6: Sealed Scroll",
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
        "Training",
        "Level 1: Lockbox",
        "Level 2: Tavern",
        "Level 3: Sewer",
        "Level 4: Enchanted Gate",
        "Level 5: Palace Door",
        "Level 6: Sealed Scroll",
        "Level 7: Challenge!"];
    let levelNamesAlt = [
        "Training",
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


function openCheatPopup() {
    let lvlContents = {};
    lvlContents.title = PhaserScene.add.text(gameConsts.halfWidth, 190, 'USE SKULL KEY?', {fontFamily: 'kingthings', fontSize: 32, color: '#000000', align: 'center'}).setDepth(102).setOrigin(0.5, 0.5);
    lvlContents.body = PhaserScene.add.text(gameConsts.halfWidth, 325, "Less known cousin of the legendary unbreakable\nSkeleton Key. This special lockpick isn't quite as\npowerful, but it's still got a good few uses left.\n\nAllows you to \"auto-attempt\" the lock.", {fontFamily: 'kingthings', fontSize: 17, color: '#000000', align: 'left'}).setDepth(102).setOrigin(0.5, 0.5);
    lvlContents.image = PhaserScene.add.image(gameConsts.halfWidth, 239, 'lock', 'imagekey.png').setDepth(102).setScale(0.86);
    openPopup(lvlContents, true);

    let extraContents = {};
    let cheatButton = new Button({
        normal: {
            atlas: 'buttons',
            ref: "menu_btn_normal.png",
            x: gameConsts.halfWidth,
            y: gameConsts.halfHeight + 104,
            scaleX: 0.65,
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
            globalObjects.pickshadow.setVisible(false);
            globalObjects.pick.setFrame('pick_heart.png');
            gameVars.usingSkull = true;
            globalObjects.pick.alpha = 0;
            playSound('scratch3');
            setPicksLeft(Math.max(gameVars.picksLeft, 30));

            PhaserScene.tweens.add({
                targets: globalObjects.pick,
                alpha: 1,
                duration: 900,
                ease: 'Cubic.easeOut'
            })
            hideCheatOption()
            closePopup();
        }
    });
    cheatButton.addText("USE KEY", {fontFamily: 'kingthings', fontSize: 20, color: '#000000', align: 'center'});
    cheatButton.setDepth(103);

    extraContents["cheatbtn"] = cheatButton;

    addPopupContents(extraContents);
}

function addPopupContents(contents) {
    for (let i in contents) {
        globalObjects.currPopup[i] = contents[i];
    }
}
