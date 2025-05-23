/**
 * Controls passage of game time, lets you pause and unpause stuff
 **/
 class TimeManager {
    constructor() {
        messageBus.subscribe("tempPause", this.setTempPause.bind(this));
        messageBus.subscribe("pauseGame", this.setPermPause.bind(this));
        messageBus.subscribe("setGameSlow", this.setGameSlow.bind(this));
        messageBus.subscribe("clearGameSlow", this.clearGameSlow.bind(this));
        messageBus.subscribe("unpauseGame", this.setUnpause.bind(this));
    }

    setTempPause(dur, magnitude) {
        gameVars.timeScale = magnitude || 0.5;
        PhaserScene.tweens.timeScale = magnitude || 0.6;
        PhaserScene.time.timeScale = magnitude || 0.5;
        PhaserScene.anims.globalTimeScale = magnitude || 0.6;
        if (this.currTimeoutAmt) {
            if (gameVars.timeScale > this.currTimeoutAmt) {
                return;
            }
        }

        this.currTimeoutAmt = gameVars.timeScale;
        if (this.currTimeoutPause) {
            clearTimeout(this.currTimeoutPause);
        }
        this.currTimeoutPause = setTimeout(() => {
            gameVars.timeScale = gameVars.gameManualSlowSpeed || 1;
            PhaserScene.tweens.timeScale = gameVars.gameManualSlowSpeed || 1;
            PhaserScene.time.timeScale = gameVars.gameManualSlowSpeed || 1;
            PhaserScene.anims.globalTimeScale = gameVars.gameManualSlowSpeed || 1;
            this.currTimeoutAmt = null;
        }, dur)
    }

    setPermPause(amt = 0.002) {
        gameVars.permTimeScale = amt;
        gameVars.timeScale = amt;
        PhaserScene.tweens.timeScale = amt;
        PhaserScene.time.timeScale = amt;
        PhaserScene.anims.globalTimeScale = amt;
    }

    setUnpause() {
        gameVars.timeScale = gameVars.gameManualSlowSpeed || 1;
        gameVars.permTimeScale = gameVars.timeScale;

        PhaserScene.tweens.timeScale = gameVars.gameManualSlowSpeed || 1;
        PhaserScene.time.timeScale = gameVars.gameManualSlowSpeed || 1;
        PhaserScene.anims.globalTimeScale = gameVars.gameManualSlowSpeed || 1;
    }

    setGameSlow(amt) {
        gameVars.gameManualSlowSpeed = amt;
        gameVars.gameManualSlowSpeedInverse = 1 / gameVars.gameManualSlowSpeed;
        gameVars.timeScale = gameVars.gameManualSlowSpeed;
        PhaserScene.tweens.timeScale = gameVars.gameManualSlowSpeed;
        PhaserScene.time.timeScale = gameVars.gameManualSlowSpeed;
        PhaserScene.anims.globalTimeScale = gameVars.gameManualSlowSpeed;
    }

    clearGameSlow() {
        gameVars.gameManualSlowSpeed = 1;
        gameVars.gameManualSlowSpeedInverse = 1;
        gameVars.timeScale = gameVars.gameManualSlowSpeed;
        PhaserScene.tweens.timeScale = gameVars.gameManualSlowSpeed;
        PhaserScene.time.timeScale = gameVars.gameManualSlowSpeed;
        PhaserScene.anims.globalTimeScale = gameVars.gameManualSlowSpeed;
    }

}
