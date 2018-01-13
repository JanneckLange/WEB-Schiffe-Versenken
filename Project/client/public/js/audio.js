//Musik

document.getElementById("music_control_range").addEventListener("mouseup", function () {
	music_control_volume_control();
});
document.getElementById("music_control_range").addEventListener("keyup", function () {
	music_control_volume_control();
});
document.getElementById("audiofile_music").volume = 0.3;

/**
 * Musik: Lautstärkeregler
 */
function music_control_volume_control() {
	var value = document.getElementById("music_control_range").value;
	var ind = document.getElementById("ind-music_control_range");
	ind.innerHTML = value * 10;
	music_control_volume(value);
}

/**
 * Musik: Wiedergabe
 */
function music_control_play() {
	document.getElementById("audiofile_music").play();
}

/**
 * Musik: Pause
 */
function music_control_pause() {
	document.getElementById("audiofile_music").pause();
}

/**
 * Musik: Lautstärke
 * @param {any} value übergebene Lautstärke
 */
function music_control_volume(value) {
	document.getElementById("audiofile_music").volume = value;
}

var pause = false;

/**
 * Musik: Wiedergabe- und Pauseknopf
 */
function music_control_playButton() {
	var elem = document.getElementById("music_control_mute_button");
	if (pause) {
		elem.firstChild.data = "Pause";
		music_control_play();
		pause = false;
	} else {
		elem.firstChild.data = "Play";
		music_control_pause();
		pause = true;
	}
}

//Sound

document.getElementById("sound_control_range").addEventListener("mouseup", function () {
	sound_control_volume_control();
});
document.getElementById("sound_control_range").addEventListener("keyup", function () {
	sound_control_volume_control();
});

var sound_hit_water = document.getElementById("audiofile_sound_hit_water");
var sound_hit_ship = document.getElementById("audiofile_sound_hit_ship");
var sound_ship_down = document.getElementById("audiofile_sound_ship_down");
var sound_your_turn = document.getElementById("audiofile_sound_your_turn");
// Voreingestellte Lautstärke für die Soundeffekte
sound_hit_water.volume = 0.3;
sound_hit_ship.volume = 0.3;
sound_ship_down.volume = 0.3;
sound_your_turn.volume = 0.3;

var mute = false;

/**
 * Sound: Stummknopf
 */
function sound_control_muteButton() {
	var elem = document.getElementById("sound_control_mute_button");
	if (mute) {
		elem.firstChild.data = "Mute";
		sound_control_play();
		mute = false;
	} else {
		elem.firstChild.data = "Unmute";
		sound_control_pause();
		mute = true;
	}
}

/**
 * Sound: Lautstärkeregler
 */
function sound_control_volume_control() {
	var value = document.getElementById("sound_control_range").value;
	var ind = document.getElementById("ind-sound_control_range");
	ind.innerHTML = value * 10;
	sound_control_volume(value);
}

/**
 * Sound: Wiedergabe
 */
function sound_control_play() {
	sound_hit_water.mute = false;
	sound_hit_ship.mute = false;
	sound_ship_down.mute = false;
	sound_your_turn.mute = false;
}

/**
 * Sound: Stumm
 */
function sound_control_pause() {
	sound_hit_water.mute = true;
	sound_hit_ship.mute = true;
	sound_ship_down.mute = true;
	sound_your_turn.mute = true;
}

/**
 * Sound: Lautstärke
 * @param {any} value übergebene Lautstärke
 */
function sound_control_volume(value) {
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