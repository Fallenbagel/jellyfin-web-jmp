import { appHost } from '../../apphost';

/**
 * Creates an audio element that plays a silent sound.
 * @returns {HTMLMediaElement} The audio element.
 */
function createTestMediaElement () {
    const elem = document.createElement('audio');
    elem.classList.add('testMediaPlayerAudio');
    elem.classList.add('hide');

    document.body.appendChild(elem);

    elem.volume = 1; // Volume should not be zero to trigger proper permissions
    elem.src = 'assets/audio/silence.mp3'; // Silent sound

    return elem;
}

/**
 * Destroys a media element.
 * @param {HTMLMediaElement} elem The element to destroy.
 */
function destroyTestMediaElement (elem) {
    elem.pause();
    elem.remove();
}

/**
 * Class that manages the playback permission.
 */
class PlaybackPermissionManager {
    /**
     * Tests playback permission. Grabs the permission when called inside a click event (or any other valid user interaction).
     * @returns {Promise} Promise that resolves succesfully if playback permission is allowed.
     */
    async check () {
        if (appHost.supports("htmlaudioautoplay")) {
            return true;
        }

        return await new Promise((resolve, reject) => {
            const media = createTestMediaElement();
            media.play().then(() => {
                resolve();
            }).catch((error) => {
                reject(error);
            }).finally(() => {
                destroyTestMediaElement(media);
            });
        });
    }
}

/** PlaybackPermissionManager singleton. */
export default new PlaybackPermissionManager();
