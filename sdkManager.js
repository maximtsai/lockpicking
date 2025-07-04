let sdkIsLoaded = false;
let bufferGameplayStart = false;
let bufferLoadingStart = false;
let bufferLoadingEnd = false;
let gameplayIsStart = false;
function loadSDK() {
    YaGames.init().then(ysdk => {
            console.log('Yandex SDK initialized');
            window.ysdk = ysdk;
            sdkIsLoaded = true;
            if (bufferLoadingEnd) {
                bufferLoadingEnd = false;
                sdkLoadingStop();
            }
        });

    // await window.CrazyGames.SDK.init().then(() => {
    //     sdkIsLoaded = true;
    //     if (bufferLoadingStart) {
    //         sdkLoadingStart();
    //     }
    //     if (bufferLoadingEnd) {
    //         setTimeout(() => {
    //             sdkLoadingStop();
    //             if (bufferGameplayStart) {
    //                 sdkGameplayStart();
    //             }
    //         }, 100)
    //     }
    //     if (bufferGameplayStart) {
    //         if (!bufferLoadingEnd) {
    //             sdkGameplayStart();
    //         }
    //     }
    //     onLoadCompleteAndSDKComplete();
    // });
}

loadSDK();

function sdkShowRewardAd(onStart, onFinish, onError) {
    if (!sdkIsLoaded) {
        onFinish();
        return;
    }

    ysdk.adv.showRewardedVideo({
        callbacks: {
            onOpen: () => {
                onStart();
            },
            onRewarded: () => {
              console.log('Rewarded!');
            },
            onClose: () => {
                unmuteAll();
                onFinish();
            },
            onError: (e) => {
                unmuteAll();
                onError();
            },
        }
    })

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
        ysdk.features.LoadingAPI.ready()
    } else {
        bufferLoadingEnd = true;
    }
}

function yandexMidgameAd(onFinish) {
    if (!sdkIsLoaded) {
        onFinish();
        return;
    }

    let clickBlocker;
    let hasFinished = false;

    sdkShowMidgameAd(() => {
        // muteAll();
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
            // unmuteAll();
            hasFinished = true;
            hideGlobalClickBlocker();
            onFinish()
        }
    }, () => {
        if (!hasFinished) {
            // unmuteAll();
            hasFinished = true;
            hideGlobalClickBlocker();
            onFinish()
        }
    })
}

function sdkShowMidgameAd(onStart = () => {}, onFinish = () => {}, onError = () => {}) {
    muteAll();

    ysdk.adv.showFullscreenAdv({
        callbacks: {
            onOpen: function() {
                onStart();
            },
            onClose: function(wasShown) {
                unmuteAll();
                onFinish();
            },
            onError: function(error) {
                unmuteAll();
                onError();
            },
        }
    })


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
    // if (sdkIsLoaded) {
    //     ysdk.getStorage().then(safeStorage => {
    //             safeStorage.getItem(key, val);
    //         })
    // } else {
        return localStorage.getItem(key);
    // }

}

function sdkSetItem(key, val) {
    // if (sdkIsLoaded) {
    //     ysdk.getStorage().then(safeStorage => {
    //             safeStorage.setItem(key, val);
    //             console.log(safeStorage.getItem('key'))
    //         })
    // } else {
        localStorage.setItem(key, val);
    // }

}

function sdkHasAdBlock() {

}

function sdkGameplayStart() {
    if (gameplayIsStart) {
        return;
    }
    if (sdkIsLoaded) {
        ysdk.features.GameplayAPI.start();
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
        ysdk.features.GameplayAPI.stop();
        gameplayIsStart = false;
    }
}


function sdkGetAchievement(id) {

}

function askForReview() {
    ysdk.feedback.canReview()
            .then(({ value, reason }) => {
                if (value) {
                    ysdk.feedback.requestReview()
                        .then(({ feedbackSent }) => {
                            console.log(feedbackSent);
                        })
                } else {
                    console.log(reason)
                }
            })
}