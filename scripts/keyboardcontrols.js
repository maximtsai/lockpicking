class KeyboardControls {
    constructor() {
        this.keyListeners = [];
        this.virtualKeyJustDown = {};
        this.setupKeyPresses();
    }

    setupKeyPresses(scene) {
        let listOfCodes = [
            Phaser.Input.Keyboard.KeyCodes.W,
            Phaser.Input.Keyboard.KeyCodes.A,
            Phaser.Input.Keyboard.KeyCodes.S,
            Phaser.Input.Keyboard.KeyCodes.D,

            Phaser.Input.Keyboard.KeyCodes.Q,
            Phaser.Input.Keyboard.KeyCodes.E,
            Phaser.Input.Keyboard.KeyCodes.Z,
            Phaser.Input.Keyboard.KeyCodes.X,

            Phaser.Input.Keyboard.KeyCodes.ONE,
            Phaser.Input.Keyboard.KeyCodes.TWO,
            Phaser.Input.Keyboard.KeyCodes.THREE,
            Phaser.Input.Keyboard.KeyCodes.FOUR,
            Phaser.Input.Keyboard.KeyCodes.FIVE,
            Phaser.Input.Keyboard.KeyCodes.LEFT,
            Phaser.Input.Keyboard.KeyCodes.RIGHT,
            Phaser.Input.Keyboard.KeyCodes.UP,
            Phaser.Input.Keyboard.KeyCodes.DOWN,
            Phaser.Input.Keyboard.KeyCodes.ENTER,
            Phaser.Input.Keyboard.KeyCodes.SPACE,
        ];
        for (let i in listOfCodes) {
            let code = listOfCodes[i];
            this.keyListeners[code] = PhaserScene.input.keyboard.addKey(code);
        }
    }

    getKeyIsDown(keyCode) {
        return this.keyListeners[keyCode] && this.keyListeners[keyCode].isDown;
    }

    getKeyIsJustDown(keyCode) {
        return this.keyListeners[keyCode] && Phaser.Input.Keyboard.JustDown(this.keyListeners[keyCode]);
    }

    virtuallySetKeyJustDown(key) {
        this.virtualKeyJustDown[key] = true;
        setTimeout(() => {
            this.virtualKeyJustDown[key] = false;
        })
    }

    getLeftJustDown() {
        return this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.LEFT)
            || this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.A)
            || this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.Q)
            || this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.Z)
            || this.virtualKeyJustDown[Phaser.Input.Keyboard.KeyCodes.LEFT]
    }

    getRightJustDown() {
        return this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.RIGHT)
            || this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.E)
            || this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.D)
            || this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.X)
            || this.virtualKeyJustDown[Phaser.Input.Keyboard.KeyCodes.RIGHT]
    }

    getUpJustDown() {
        return this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.UP)
            || this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.W)
            || this.virtualKeyJustDown[Phaser.Input.Keyboard.KeyCodes.UP]
    }

    getLockJustDown() {
        return this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.ENTER)
            || this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.SPACE)
            || this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.S)
            || this.getKeyIsJustDown(Phaser.Input.Keyboard.KeyCodes.DOWN)
            || this.virtualKeyJustDown[Phaser.Input.Keyboard.KeyCodes.ENTER]
    }

    getOneOfKeysIsDown(keyCode) {
        for (let i in keyCode) {
            let code = keyCode[i];
            if (this.keyListeners[code] && this.keyListeners[code].isDown) {
                return true;
            }
        }
        return false;
    }
}
