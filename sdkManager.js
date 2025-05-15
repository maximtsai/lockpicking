let sdkIsLoaded = false;
let bufferGameplayStart = false;
let bufferLoadingStart = false;
let bufferLoadingEnd = false;
let gameplayIsStart = false;
async function loadSDK() {
    await window.CrazyGames.SDK.init().then(() => {
        sdkIsLoaded = true;
        if (bufferLoadingStart) {
            sdkLoadingStart();
        }
        if (bufferLoadingEnd) {
            setTimeout(() => {
                sdkLoadingStop();
                if (bufferGameplayStart) {
                    sdkGameplayStart();
                }
            }, 100)
        }
        if (bufferGameplayStart) {
            if (!bufferLoadingEnd) {
                sdkGameplayStart();
            }
        }
        onLoadCompleteAndSDKComplete();
    });
}

loadSDK();

function sdkShowRewardAd(onStart, onFinish, onError) {
    if (!sdkIsLoaded) {
        onFinish();
        return;
    }
    muteAll();
    const callbacks = {
        adStarted: () => {
            onStart();
        },
        adFinished: () => {
            unmuteAll();
            onFinish();
        },
        adError: () => {
            unmuteAll();
            onError();
        },
    };
    window.CrazyGames.SDK.ad.requestAd("rewarded", callbacks);
}

function sdkLoadingStart() {
    if (sdkIsLoaded) {
        window.CrazyGames.SDK.game.loadingStart();
    } else {
        bufferLoadingStart = true;
    }
}

function sdkLoadingStop() {
    if (sdkIsLoaded) {
        window.CrazyGames.SDK.game.loadingStop();
    } else {
        bufferLoadingEnd = true;
    }
}

function crazyGamesMidgameAd(onFinish) {
    if (!sdkIsLoaded) {
        onFinish();
        return;
    }

    let clickBlocker;
    let hasFinished = false;

    sdkShowMidgameAd(() => {
        muteAll();
        clickBlocker = createGlobalClickBlocker(false);
        setTimeout(() => {
            if (!hasFinished) {
                // hasFinished = true;
                hideGlobalClickBlocker();
                // onFinish()
            }
        }, 20000)
    }, () => {
        if (!hasFinished) {
            unmuteAll();
            hasFinished = true;
            hideGlobalClickBlocker();
            onFinish()
        }
    }, () => {
        if (!hasFinished) {
            unmuteAll();
            hasFinished = true;
            hideGlobalClickBlocker();
            onFinish()
        }
    })
}

function sdkShowMidgameAd(onStart = () => {}, onFinish = () => {}, onError = () => {}) {
    muteAll();
    const callbacks = {
        adStarted: () => {
            onStart();
        },
        adFinished: () => {
            unmuteAll();
            onFinish();
        },
        adError: () => {
            unmuteAll();
            onError();
        },
    };
    window.CrazyGames.SDK.ad.requestAd("midgame", callbacks);
    // onFinish();
}

function sdkShowHappyTime() {
    window.CrazyGames.SDK.game.happytime();
}

let canCallBanner = true;
function displayBanner() {
    if (canCallBanner) {
        // // // Prevent banner from being called multiple times in high frequency
        // canCallBanner = false;
        // setTimeout(() => {
        //     canCallBanner = true;
        // }, 65000);
        // const elem = document.getElementById("banner-container");
        // elem.style.bottom = "1px";
        //
        // setTimeout(() => {
        //     sdkShowBannerAd()
        // }, 0)
    }
}

async function sdkShowBannerAd() {
    if (justClosedBanner) {
        return;
    }
    try {
        // await is not mandatory when requesting banners, but it will allow you to catch errors
        await window.CrazyGames.SDK.banner.requestBanner({
            id: "banner-container",
            width: 468,
            height: 60,
        });
    } catch (e) {
        console.log("Banner request error", e);
    }
}

let justClosedBanner = false;

function sdkClearBanner() {
    justClosedBanner = true;
    setTimeout(() => {
        justClosedBanner = false;
    }, 200)
    const elem = document.getElementById("banner-container");
    elem.style.bottom = "-1500px";
    window.CrazyGames.SDK.banner.clearAllBanners();
}

function sdkGetItem(key) {
    if (sdkIsLoaded) {
        return window.CrazyGames.SDK.data.getItem(key);
    } else {
        return localStorage.getItem(key);
    }

}

function sdkSetItem(key, val) {
    if (sdkIsLoaded) {
        window.CrazyGames.SDK.data.setItem(key, val);
    } else {
        localStorage.setItem(key, val);
    }

}

function sdkHasAdBlock() {

}

function sdkGameplayStart() {
    if (gameplayIsStart) {
        return;
    }
    if (sdkIsLoaded) {
        window.CrazyGames.SDK.game.gameplayStart();
        gameplayIsStart = true;
    } else {
        bufferGameplayStart = true;
    }
}

function sdkGameplayStop() {
    if (!gameplayIsStart) {
        return;
    }
    if (sdkIsLoaded) {
        window.CrazyGames.SDK.game.gameplayStop();
        gameplayIsStart = false;
    }
}


function sdkGetAchievement(id) {

}
