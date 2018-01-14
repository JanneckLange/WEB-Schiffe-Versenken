//Musik

document.getElementById("music_control_range").addEventListener("mouseup", function() {
  music_control_volume_control();
});
document.getElementById("music_control_range").addEventListener("keyup", function() {
  music_control_volume_control();
});

var music_song1 = document.getElementById("audiofile_music_song1");
var music_before_fight = document.getElementById("audiofile_music_before_fight");
var music_lost = document.getElementById("audiofile_music_lost");
var music_win = document.getElementById("audiofile_music_win");
var music_one_ship_left = document.getElementById("audiofile_music_one_ship_left");

var played_music = music_before_fight;

// Voreingestellte Lautst�rke f�r die Musik
music_song1.volume = 0.5;
music_before_fight.volume = 0.3;
music_lost.volume = 0.3;
music_win.volume = 0.3;
music_one_ship_left.volume = 0.3;

/**
 * Musik: Lautst�rkeregler
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
  played_music.play();
}

/**
 * Musik: Pause
 */
function music_control_pause() {
  played_music.pause();
}

/**
 * Musik: Lautst�rke
 * @param {any} value �bergebene Lautst�rke
 */
function music_control_volume(value) {
  played_music.volume = value;
}

var pause = false;

/**
 * Musik: Wiedergabe- und Pauseknopf
 */
function music_control_playButton() {
  var elem = played_music;
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

/**
 * Trigger: Musik: Spiel l�uft
 */
function trigger_music_song1() {
  play_music(music_song1);
}

/**
 * Trigger: Musik: Spiel l�uft noch nicht
 */
function trigger_music_before_fight() {
  play_music(music_win);
}

/**
 * Trigger: Musik: Nur noch ein Schiff vorhanden
 */
function trigger_music_one_ship_left() {
  play_music(music_one_ship_left);
}

/**
 * Trigger: Musik: Spiel verloren
 */
function trigger_music_lost() {
  play_music(music_lost);
}

/**
 * Trigger: Musik: Spiel gewonnen
 */
function trigger_music_win() {
  play_music(music_win);
  trigger_sound_win();
}

/**
 * Spielt die �bergebene Musik und stoppt die anderen Titel
 * @param {any} song
 */
function play_music(song) {
  if (song != music_before_fight) {
    stop_music(music_before_fight);
  }
  if (song != music_lost) {
    stop_music(music_lost);
  }
  if (song != music_song1) {
    stop_music(music_song1);
  }
  if (song != music_win) {
    stop_music(music_win);
  }
  song.play();
  played_music = song;
}

/**
 * Stoppt die Musik und setzt sie zur�ck
 * @param {any} song
 */
function stop_music(song) {
  song.pause();
  song.currentTime = 0;
}

//Sound

document.getElementById("sound_control_range").addEventListener("mouseup", function() {
  sound_control_volume_control();
});
document.getElementById("sound_control_range").addEventListener("keyup", function() {
  sound_control_volume_control();
});

var sound_hit_water = document.getElementById("audiofile_sound_hit_water");
var sound_hit_ship = document.getElementById("audiofile_sound_hit_ship");
var sound_ship_down = document.getElementById("audiofile_sound_ship_down");
var sound_your_turn = document.getElementById("audiofile_sound_your_turn");
var sound_win = document.getElementById("audiofile_sound_win");
// Voreingestellte Lautst�rke f�r die Soundeffekte
sound_hit_water.volume = 0.3;
sound_hit_ship.volume = 0.3;
sound_ship_down.volume = 0.3;
sound_your_turn.volume = 0.3;
sound_win.volume = 0.3;

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
 * Sound: Lautst�rkeregler
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
  sound_win.mute = false;
}

/**
 * Sound: Stumm
 */
function sound_control_pause() {
  sound_hit_water.mute = true;
  sound_hit_ship.mute = true;
  sound_ship_down.mute = true;
  sound_your_turn.mute = true;
  sound_win.mute = true;
}

/**
 * Sound: Lautst�rke
 * @param {any} value �bergebene Lautst�rke
 */
function sound_control_volume(value) {
  sound_hit_water.volume = value;
  sound_hit_ship.volume = value;
  sound_ship_down.volume = value;
  sound_your_turn.volume = value;
  sound_win.volume = value;
}

/**
 * Soundeffekt: Schuss ins Wasser
 */
function trigger_sound_hit_water() {
  sound_hit_water.pause();
  sound_hit_water.currentTime = 0;
  sound_hit_water.play();
}

/**
 * Soundeffekt: Schiffstreffer
 */
function trigger_sound_hit_ship() {
  sound_hit_ship.pause();
  sound_hit_ship.currentTime = 0;
  sound_hit_ship.play();
}

/**
 * Soundeffekt: Schiff versenkt
 */
function trigger_sound_ship_down() {
  sound_ship_down.pause();
  sound_ship_down.currentTime = 0;
  sound_ship_down.play();
}

/**
 * Soundeffekt: Signal, dass man dran ist
 */
function trigger_sound_your_turn() {
  sound_your_turn.pause();
  sound_your_turn.currentTime = 0;
  sound_your_turn.play();
}

/**
 * Soundeffekt: Applause
 */
function trigger_sound_win() {
  sound_win.play();
}