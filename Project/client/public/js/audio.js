//Musik

document.getElementById("music_controll_range").addEventListener("mouseup", function () {
    music_controll_volume_controll();
});
document.getElementById("music_controll_range").addEventListener("keyup", function () {
    music_controll_volume_controll();
});
document.getElementById('audiofile_music').volume = 0.3;

/**
 * Musik: Lautstärkeregler
 */
function music_controll_volume_controll() {
    var value = document.getElementById("music_controll_range").value;
    var ind = document.getElementById("ind-music_controll_range");
    ind.innerHTML = value * 10;
    music_controll_volume(value);
}

/**
 * Musik: Wiedergabe
 */
function music_controll_play() {
    console.log("Play");
    document.getElementById('audiofile_music').play();
}

/**
 * Musik: Pause
 */
function music_controll_pause() {
    console.log("Pause");
    document.getElementById('audiofile_music').pause();
}

/**
 * Musik: Lautstärke
 * @param {any} value übergebene Lautstärke
 */
function music_controll_volume(value) {
    console.log("Volume: " + value);
    document.getElementById('audiofile_music').volume = value;
}

var pause = false;

/**
 * Musik: Wiedergabe- und Pauseknopf
 */
function music_controll_playButton() {
    var elem = document.getElementById("music_controll_mute_button");
    if (pause) {
        elem.firstChild.data = "Pause";
        music_controll_play();
        pause = false;
    } else {
        elem.firstChild.data = "Play";
        music_controll_pause();
        pause = true;
    }
}

//Sound

document.getElementById("sound_controll_range").addEventListener("mouseup", function () {
    sound_controll_volume_controll();
});
document.getElementById("sound_controll_range").addEventListener("keyup", function () {
    sound_controll_volume_controll();
});

var sound_hit_water = document.getElementById('audiofile_sound_hit_water');
var sound_hit_ship = document.getElementById('audiofile_sound_hit_ship');
var sound_ship_down = document.getElementById('audiofile_sound_ship_down');
var sound_your_turn = document.getElementById('audiofile_sound_your_turn');
// Voreingestellte Lautstärke für die Soundeffekte
sound_hit_water.volume = 0.3;
sound_hit_ship.volume = 0.3;
sound_ship_down.volume = 0.3;
sound_your_turn.volume = 0.3;

var mute = false;

/**
 * Sound: Stummknopf
 */
function sound_controll_muteButton() {
    var elem = document.getElementById("sound_controll_mute_button");
    if (mute) {
        elem.firstChild.data = "Mute";
        sound_controll_play();
        mute = false;
    } else {
        elem.firstChild.data = "Unmute";
        sound_controll_pause();
        mute = true;
    }
}

/**
 * Sound: Lautstärkeregler
 */
function sound_controll_volume_controll() {
    var value = document.getElementById("sound_controll_range").value;
    var ind = document.getElementById("ind-sound_controll_range");
    ind.innerHTML = value * 10;
    sound_controll_volume(value);
}

/**
 * Sound: Wiedergabe
 */
function sound_controll_play() {
    console.log("Unmute");
    sound_hit_water.mute = false;
    sound_hit_ship.mute = false;
    sound_ship_down.mute = false;
    sound_your_turn.mute = false;
}

/**
 * Sound: Stumm
 */
function sound_controll_pause() {
    console.log("Mute");
    sound_hit_water.mute = true;
    sound_hit_ship.mute = true;
    sound_ship_down.mute = true;
    sound_your_turn.mute = true;
}

/**
 * Sound: Lautstärke
 * @param {any} value übergebene Lautstärke
 */
function sound_controll_volume(value) {
    console.log("Volume: " + value);
    sound_hit_water.volume = value;
    sound_hit_ship.volume = value;
    sound_ship_down.volume = value;
    sound_your_turn.volume = value;
}

/**
 * Soundeffekt: Schuss ins Wasser
 */
function trigger_sound_hit_water() {
    sound_hit_water.play();
}

/**
 * Soundeffekt: Schiffstreffer
 */
function trigger_sound_hit_ship() {
    sound_hit_ship.play();
}

/**
 * Soundeffekt: Schiff versenkt
 */
function trigger_sound_ship_down() {
    sound_ship_down.play();
}

/**
 * Soundeffekt: Signal, dass man dran ist
 */
function trigger_sound_your_turn() {
    sound_your_turn.play();
}