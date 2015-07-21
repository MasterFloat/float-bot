/**
 * This is the file where the bot commands are located
 *
 * @license MIT license
 */

var http = require('http');

var CDchecker = {
	roomkick: 0,
	pair: 0,
};

var CDtime = {
	roomkick: 10,
	pair: 2,
};

if (Config.serverid === 'eos') {
	var https = require('https');
	var csv = require('csv-parse');
}

//Functions

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

var requiredAlt = '+'
var requiredPlayers = 0;
var maxPlayers = 9999;
var started = false;
var game = "none";
var checked = false;
var joinusers = [];
var joinusersid = [];
var playerdata = [];	
var currentplayer = 0;
var firetimer;
var starttimer;
var turnspassed = 0;


const CONFIGURABLE_COMMANDS = {
	'randmono': true,
        'joingame': true,
        'startgame': true,
        'endgame': true,
        'stay': true,
        'hit': true,
        'fire': true,
        'signup': true,   
        'randa': true,
        'reel': true,
        'pair': true,
        'join': true,
        'guide': true,
        'say': true,
        'pmuser': true,
        'mymood': true
};


// TRIVIA BASED VARIABLES
var triviaRoom; // This var will check if trivia is going in other room or not..
var triviaON = false; // A switch case to tell if trivia is going on not
var triviaTimer; // Keeps the track of the timer of the trivia
var triviaA; // The answer of the trivia
var triviaQ; // Question of trivia
var triviaPoints = []; // This empty object will keep the track off all the trivia points during a game of trivia
var teamOne = [];
var teamTwo = [];
var teamOnePoints = 0;
var teamTwoPoints = 0;
clearInterval(triviaTimer);
var triviaQuestions = ['Pokemon with highest HP stat', 'blissey', 'What is Mega Venusaur\'s ability', 'thickfat', 'How many PP does hyper beam have normally (number only)', '5','This is the only Dark-Type move Clawitzer learns.','darkpulse','Which Pokemon according to the Unova horoscope represents Libra?','lampent','What Fighting-type move is guaranteed to cause a critical hit?','stormthrow','What ability boosts the power of Fire-type moves when the Pokemon is below 1/3 of its health?','blaze', 'What is the subtitle of the first Pokémon movie?','mewtwostrikesback','Name a move that can have a 100% chance of flinching the target barring Fake Out.','fling','What is the only Poison-Type Pokemon to learn Rock Polish?','garbodor','What cave lies between Mahogany Town and Blackthorn City?','icepath','This Electric-Type move increases the user\'s Special Defense.','charge','What is the only Pokémon available in the Yellow Forest Pokéwalker route?','pikachu','This is the nickname of the Pokemon acting as the light source of Glitter Lighthouse in Olivine City.','amphy','This Pokemon has the longest cry.','jynx','This Pokemon Conquest warlord has the warrior ability of "chesto!" at 2.','yoshihiro',
'What Pokemon is based on the mythological kitsune?','ninetales','What Move does HM02 contain?','fly','What Pokemon was Latias combined with in early concept art?','blaziken','What is Prof. Oak\'s first name?','samuel','Who ran the bank in Pokemon Mystery Dungeon: Explorers of Time, Darkness, and Sky?','duskull','Which Pseudo legendary was originally based off of a tank?','hydreigon','Which Legendary Pokemon was originally found at Victory Road but was moved to the Sevii Islands in later generations?','moltres','What Pokemon requires an empty space in the party during evolution to be obtained?','shedinja','Which Pokemon has the lowest base stat total?','sunkern','In the main series game, this Pokemon can evolve into its final form using either one of 2 methods.','feebas','Which Pokemon Has the Highest \"Attack\" stat that is __Not__ A Legendary or Mega', 'rampardos','Which Pokemon Has the Highest \"Speed\" stat that is __Not__ A Legendary or Mega', 'ninjask','Which Pokemon Has the Highest \"Defense\" stat that is __Not__ A Legendary or Mega', 'shuckle','Which Pokemon Has the Highest \"Special Defense\" stat that is __Not__ A Legendary or Mega', 'shuckle','Which Pokemon Has the Highest \"Special Attack\" stat that is __Not__ A Legendary or Mega', 'chandelure','Which Pokemon Has the Lowest \"HP\" stat', 'shedinja',
'This ability is exclusive to Dragonite and Lugia.', 'multiscale', 'This\, Servine\'s hidden ability\, is also the hidden ability of Spinda', 'contrary', 'Water-type starter pokemon have this ability as their primary ability.', 'torrent', 'Most legendary pokemon have this ability\, which doubles the amount of PP opponents use up when attacking.', 'pressure', 'Pokemon with this ability are immune to moves such as Bug Buzz and Boomburst.', 'soundproof', 'This ability allows the pokemon to change typing and appearance when the weather shifts.', 'forecast', 'A pokemon\'s speed stat is doubled in the rain when it has this ability.', 'swiftswim','This move is the signature move of Chatot.', 'chatter', 'Aside from smeargle\, Lugia is the only pokemon that can learn this flying-type move with an increased critical-hit rate.', 'aeroblast', 'This move deals supereffective damage to water-type pokemon even when used by a pokemon with Normalize.', 'freezedry', 'This move is given as a technical machine after defeating Tate & Liza.', 'calm mind', 'A hidden machine introduced in Diamond and Pearl\, this move deals normal-typed damage and may confuse the opponent.', 
'rockclimb','This pokemon is first encountered inside a TV set in the Old Chateau.', 'rotom', 'This guaranteed-shiny pokemon can be encountered in the Nature Preserve.', 'haxorus', 'This is the only pokemon that can be encountered walking in Rusturf Tunnel.', 'whismur', 'As thanks for stopping Team Magma/Aqua\, the Weather Institute gives you one of these pokemon.', 'castform', 'This pokemon is the only one to have the ability Stance Change.', 'aegislash', 'As you liberate Silph Co. from Team Rocket\, an employee will give you one of these pokemon.', 'lapras', 'This pokemon costs 9999 coins at the Celadon Game Corner.', 'porygon', 'You can receive this pokemon as a gift from Bebe.', 'eevee', 'This ghost-type evolves from female Snorunt.', 'froslass', 'This lake guardian resides in Lake Verity.', 'mesprit',
'This person is the Hoenn Champion in Pokemon Emerald.', 'wallace', 'The pokemon PC system is operated by this lady in the Hoenn Region.', 'lanette', 'The pokemon PC system was expanded to allow trade with Hoenn by this resident of One Island', 'Celio', 'Pokemon Platinum introduced this NPC\, a scientist working with Team Galactic that was arrested in Stark Mountain.', 'charon', 'Viridian\'s gym leader\, he is also the boss of Team Rocket.', 'giovanni', 'This person is the head of Team Galactic.', 'cyrus', 'This member of the Seven Sages resurrected Team Plasma in the events of Black and White 2.', 'ghetsis', 'A member of the Hoenn elite four\, this person\'s team includes Altaria and Flygon.', 'drake', 'This item has a 3/16 chance to move the user to the top of its priority bracket.', 'quickclaw', 'Holders of this item cannot become infatuated\, and they also guarantee their offspring inherit 5 stats from its parents.', 'destinyknot', 'Defeating the Winstrate family and talking to them afterward allows the player to receive this item\, which doubles the EV gains of its holder.', 
'machobrace', 'This item is found deep inside Mt. Ember after the player receives the National Pokedex.', 'ruby', 'Sinnoh\'s underground can be visited once the player has obtained this Key Item.', 'explorerkit', 'This item summons Heatran when brought to Stark Mountain or Reversal Mountain.', 'magmastone',
'What Pokemon is based off of antlion larvae?', 'trapinch', 'What Pokemon trainer gives you a Dusk Stone in ORAS after defeating them?','hexmaniacvalerie','What move increases the Attack and Sp. Attack of grounded Grass-type Pokemon?', 'rototiller', 'Who is the daughter of a gym leader that became a member of the Elite Four?', 'janine', 'What was the most common pokemon type in Gen 1?', 'poison', 'What is the only pure flying type not named arceus?', 'tornadus', 'Who is the worst E4 in Vanguard?', 'myth', 'Who is better at rapping me or mewth?', 'mewth', 'Who was the main character of Pokémon XD Gale of Darkness?', 'michael', 'This pokemon takes the longest to evolve', 'larvesta', 'What is the most OP Pokemon ever?', 'magikarp'   ];
//

exports.commands = {

	/****************
	* Tool Commands *
	****************/

	reload: function (arg, user, room) {
		if (!user.isExcepted) return false;
		try {
			this.uncacheTree('./commands.js');
			Commands = require('./commands.js').commands;
			this.say(room, '__Commands reloaded.__');
		} catch (e) {
			error('failed to reload: ' + e.stack);
		}
	},

	uptime: function (arg, user, room) {
		var text = ((room === user || user.isExcepted) ? '' : '/pm ' + user.id + ', ') + '**Uptime:** ';
		var divisors = [52, 7, 24, 60, 60];
		var units = ['week', 'day', 'hour', 'minute', 'second'];
		var buffer = [];
		var uptime = ~~(process.uptime());
		do {
			let divisor = divisors.pop();
			let unit = uptime % divisor;
			buffer.push(unit > 1 ? unit + ' ' + units.pop() + 's' : unit + ' ' + units.pop());
			uptime = ~~(uptime / divisor);
		} while (uptime);

		switch (buffer.length) {
		case 5:
			text += buffer[4] + ', ';
			/* falls through */
		case 4:
			text += buffer[3] + ', ';
			/* falls through */
		case 3:
			text += buffer[2] + ', ' + buffer[1] + ', and ' + buffer[0];
			break;
		case 2:
			text += buffer[1] + ' and ' + buffer[0];
			break;
		case 1:
			text += buffer[0];
			break;
		}

		this.say(room, text);
	}, 

	seen: function (arg, user, room) { // this command is still a bit buggy
		var text = (room === user ? '' : '/pm ' + user.id + ', ');
		arg = toId(arg);
		if (!arg || arg.length > 18) return this.say(room, text + 'Invalid username.');
		if (arg === user.id) {
			text += 'Have you looked in the mirror lately?';
		} else if (arg === Users.self.id) {
			text += 'You might be either blind or illiterate. Might want to get that checked out.';
		} else if (!this.chatData[arg] || !this.chatData[arg].seenAt) {
			text += 'The user ' + arg + ' has never been seen.';
		} else {
			text += arg + ' was last seen ' + this.getTimeAgo(this.chatData[arg].seenAt) + ' ago' + (
				this.chatData[arg].lastSeen ? ', ' + this.chatData[arg].lastSeen : '.');
		}
		this.say(room, text);
	},

	w: 'wall',
	announce: 'wall',
	wall: function(arg, user, room) {
		if (!user.isExcepted) return false;
		arg = arg.toLowerCase();
		var matched = false;
		if (arg === 'retro1') {
			matched = true;
			this.say(room, '/wall Everyone must enter with ONE POKEMON ONLY.');
		}
		if (arg === 'retro2') {
			matched = true;
			this.say(room, '/wall NO UBERS OR MEGA UBERS.');
		}  
		if (arg === 'retro3') {
			matched = true;
			this.say(room, '/wall NO SCOUTING. YOU WILL BE DQ\'d. (Moveset counters.)');
		}  
		if (arg === 'retro4') {
			matched = true;
			this.say(room, '/wall Focus Sash and OHKO moves are BANNED. Sturdy is an ability, therefore it\'s fine.');
		} 
		if (arg === 'retro5') {
			matched = true;
			this.say(room, '/wall Don\'t change pokemon during this tournament.');
		} 
		if (arg === 'monogen1') {
			matched = true;
			this.say(room, '/wall This is a MONOGEN tournament, please use a team of pokemon sharing the same GEN. Gen 1 team would be: Chansey, Dragonite, Gengar, Zapdos, Articuno, Mega Venusaur.');
		} 
		if (arg === 'monogen2') {
			matched = true;
			this.say(room, '/wall Megas can be used in their respective gen and ON gen 6 teams.');
		} 
		if (arg === 'monogen3') {
			matched = true;
			this.say(room, '/wall Mega Blastoise can be used on GEN 1 AND GEN 6 TEAMS.');
		} 
		if (arg === 'botg1') {
			matched = true;
			this.say(room, '/wall his is a battle of gens tournament, please use a BoG team or get disqualified. Rules: Each team must have a Pokemon from each gen! TL;DR: 1 Pokemon from each gen.');
		} 
		if (arg === 'botg2') {
			matched = true;
			this.say(room, '/wall Example: Chansey, Feraligatr, Metagross Mega, Infernape, Meloetta, Talonflame. MEGAS only count for their generation, example: Mega Sharpedo is a GEN 3 POKEMON and not a gen 6.');
		} 
		if (arg === 'botg3') {
			matched = true;
			this.say(room, '/wall USE THIS TO HELP: http://bulbapedia.bulbagarden.net/wiki/List_of_Pok%C3%A9mon_by_National_Pok%C3%A9dex_number');
		} 
		if (arg === 'botg4') {
			matched = true;
			this.say(room, '/wall PM Dream Eater Gengar your teams to see if they are viable.');
		} else if (!matched) {
			this.say(room, "__The wall '" + arg + "' does not exist.__");
		}
	},

    d: 'declare',
	declare: function (arg, user, room) {
		if (!user.isExcepted) return false;
		arg = arg.toLowerCase();
		var matched = false;
		if (arg === 'gt1') {
			matched = true;
			this.say(room, '/declare <u>Voting for the tiers</u>: <b>ChallengeCup1v1</b> or <b>ChallengeCup</b> is useless.<br />Any votes for those tiers will be ignored.');
		}
		if (arg === 'gt2') {
			matched = true;
			this.say(room, '/declare Vote for a tier you\'ll probably win in, to increase your chances of winning the prize!');
		}
		if (arg === 'gt3') {
			matched = true;
			this.say(room, '/declare Switching teams and scouting is against the rules (unless the tier is random).');
		} else if (!matched) {
			this.say(room, "__The declare '" + arg + "' does not exist.__");
		}
	},

	music: function(arg, user, room) {
		if (!user.isExcepted) return false;
		var parts = arg.split(',');
		if (!/(.mp3)/i.test(parts[1])) return this.say(room, 'The soundtrack needs to end by .mp3');
		if (!parts[1]) return this.say(room, '__Usage: -music [music title/description], [music.mp3]__');
		this.say(room, '/declare ' + parts[0] + '<br /><audio src="' + parts[1] + '" controls="" style="width: 100%;"></audio>');
	},

	j: 'join',
	join: function(arg, user, room) {
		if (!arg) return this.say(room, '__Usage: -join [room]__');
		arg = arg.toLowerCase();
		if (arg === 'lobby') return this.say(room, '__The room \'' + arg + '\' cannot be joined.__');
		if (arg === 'staff') return this.say(room, '__The room \'' + arg + '\' cannot be joined.__');
		this.say(room, '/join ' + arg);
	},

	l: 'leave',
	leave: function(arg, user, room) {
		if (room === user || !user.canUse('autoban', room)) return false;
		this.say(room, '__I\'m off__');
		this.say(room, '/leave');
	},

	runtour: function(arg, user, room) {
		if(!user.hasRank(room, '+')) return false;
		this.say(room, '/tour start');
		this.say(room, '/tour remind');
		this.say(room, '/tour autodq 2');
		this.say(room, '/tour runautodq');
		this.say(room, '/wall Good luck and Have fun!');
	},

	guide: function(arg, user, room) {
		this.say(room, '!showimage http://i.imgur.com/YbUZdHW.png, 770, 170');
	},

	/*********************
	* Tool Commands ~end *
	*********************/

	/***************
	* FUN COMMANDS *
	***************/

	helix: function (arg, user, room) {
		var text = (room === user || user.canUse('8ball', room)) ? '' : '/pm ' + user.id + ', ';
		var rand = ~~(20 * Math.random());

		switch (rand) {
	 		case 0:
				text += "Signs point to yes.";
				break;
	  		case 1:
				text += "Yes.";
				break;
			case 2:
				text += "Reply hazy, try again.";
				break;
			case 3:
				text += "Without a doubt.";
				break;
			case 4:
				text += "My sources say no.";
				break;
			case 5:
				text += "As I see it, yes.";
				break;
			case 6:
				text += "You may rely on it.";
				break;
			case 7:
				text += "Concentrate and ask again.";
				break;
			case 8:
				text += "Outlook not so good.";
				break;
			case 9:
				text += "It is decidedly so.";
				break;
			case 10:
				text += "Better not tell you now.";
				break;
			case 11:
				text += "Very doubtful.";
				break;
			case 12:
				text += "Yes - definitely.";
				break;
			case 13:
				text += "It is certain.";
				break;
			case 14:
				text += "Cannot predict now.";
				break;
			case 15:
				text += "Most likely.";
				break;
			case 16:
				text += "Ask again later.";
				break;
			case 17:
				text += "My reply is no.";
				break;
			case 18:
				text += "Outlook good.";
				break;
			case 19:
				text += "Don't count on it.";
				break;
		}

		this.say(room, '__' + text + '__');
	},

	mymood: function(arg, user, room) {
		var differentMoods = [
			"happy",
			"sad",
			"angry",
			"tired",
			"lazy",
			"confused",
			"bored",
			"crazy",
			"curious",
			"drunk",
			"energetic"
		]
		var mood = differentMoods[Math.floor(Math.random() * 11)];
		this.say(room, user.name + "'s current mood is: " + mood);
	},

    pm: 'pmuser',
	pmuser: function(arg, user, room) {
		var parts = arg.split(',');
		if (!this.chatData[parts[0]] || !this.chatData[parts[0]].seenAt) {
			this.say(room, 'The user \'' + parts[0] + '\' does not exist.');
		}
		if (/(http\/\/|.com|.net)/i.test(parts[1])) return this.say(room, "__Please do not use the bot to link to websites.__");
		if (!parts[1]) return this.say(room, '__Usage: -pmuser [name], [message]__');
		this.say(room, '/pm ' + parts[0] + ', ' + parts[1] + ' (This was sent by ' + user.name + '.)');
		this.say(room, '__Message sent!__');
	},

	say: function(arg, user, room) {
		if (/(penis|vagina|xxx|porn|anal)/i.test(arg)) return this.say(room, '/warn ' + user.name + ', inap');
		this.say(room, stripCommands(arg));
	},

    marry: 'pair',
    pair: function(arg, user, room) {
        if (!user.canUse('pair', room)) return false;
        var pairing = toId(arg);

        function toBase(num, base) {
            var symbols = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
            var num = num.split("");
            var conversion = "";
            var val;
            var total = 0;

            if (base > symbols.length || base <= 1) return false;

            for (var i = 0; i < num.length; i++) {
                val = symbols.indexOf(num[i]);
                total += ((val % base) * Math.pow(10, i)) + (Math.floor(val / base) * Math.pow(10, i + 1));
            }
            return parseInt(total);
        }

        user.pair = toBase(user.id, 10);
        pairing = toBase(pairing, 10);
        var match = (user.pair + pairing) % 101;
        if (match <= 20) return this.say(room, user.name + ' and ' + arg + ' are ' + match + '% compatible! The hate is real.');
        if (match >= 80) return this.say(room, user.name + ' and ' + arg + ' are ' + match + '% compatible! Such love!~');

        this.say(room, user.name + ' and ' + arg + ' are ' + match + '% compatible!');
    },

	/********************
	* FUN COMMANDS ~END *
	********************/

	/********************************************************************************************
	 * Room Owner commands                                                                      *
	 *
	 * These commands allow room owners to personalise settings for moderation and command use. *
	 *******************************************************************************************/

	settings: 'set',
	set: function (arg, user, room) {
		if (room === user || !user.hasRank(room, '#')) return false;

		var settable = {
			autoban: 1,
			banword: 1,
			say: 1,
			joke: 1,
			usagestats: 1,
			'8ball': 1,
			guia: 1,
			studio: 1,
			wifi: 1,
			monotype: 1,
			survivor: 1,
			happy: 1,
			buzz: 1

		};
		var modOpts = {
			flooding: 1,
			caps: 1,
			stretching: 1,
			bannedwords: 1
		};

		var opts = arg.split(',');
		var cmd = toId(opts[0]);
		var setting;
		if (cmd === 'm' || cmd === 'mod' || cmd === 'modding') {
			let modOpt = toId(opts[1]);
			if (!modOpts[modOpt]) return this.say(room, 'Incorrect command: correct syntax is ' + Config.commandcharacter + 'set mod, [' +
				Object.keys(modOpts).join('/') + '](, [on/off])');

			setting = toId(opts[2]);
			if (!setting) return this.say(room, 'Moderation for ' + modOpt + ' in this room is currently ' +
				(this.settings.modding[room] && modOpt in this.settings.modding[room] ? 'OFF' : 'ON') + '.');

			let roomid = room.id;
			if (!this.settings.modding) this.settings.modding = {};
			if (!this.settings.modding[roomid]) this.settings.modding[roomid] = {};
			if (setting === 'on') {
				delete this.settings.modding[roomid][modOpt];
				if (Object.isEmpty(this.settings.modding[roomid])) delete this.settings.modding[roomid];
				if (Object.isEmpty(this.settings.modding)) delete this.settings.modding;
			} else if (setting === 'off') {
				this.settings.modding[roomid][modOpt] = 0;
			} else {
				return this.say(room, 'Incorrect command: correct syntax is ' + Config.commandcharacter + 'set mod, [' +
					Object.keys(modOpts).join('/') + '](, [on/off])');
			}

			this.writeSettings();
			return this.say(room, 'Moderation for ' + modOpt + ' in this room is now ' + setting.toUpperCase() + '.');
		}

		if (!(cmd in Commands)) return this.say(room, Config.commandcharacter + '' + opts[0] + ' is not a valid command.');

		var failsafe = 0;
		while (true) {
			if (typeof Commands[cmd] === 'string') {
				cmd = Commands[cmd];
			} else if (typeof Commands[cmd] === 'function') {
				if (cmd in settable) break;
				return this.say(room, 'The settings for ' + Config.commandcharacter + '' + opts[0] + ' cannot be changed.');
			} else {
				return this.say(room, 'Something went wrong. PM Morfent or TalkTakesTime here or on Smogon with the command you tried.');
			}

			if (++failsafe > 5) return this.say(room, 'The command "' + Config.commandcharacter + '' + opts[0] + '" could not be found.');
		}

		var settingsLevels = {
			off: false,
			disable: false,
			'false': false,
			'+': '+',
			'%': '%',
			'@': '@',
			'#': '#',
			'&': '&',
			'~': '~',
			on: true,
			enable: true,
			'true': true
		};

		var roomid = room.id;
		setting = opts[1].trim().toLowerCase();
		if (!setting) {
			let msg = '' + Config.commandcharacter + '' + cmd + ' is ';
			if (!this.settings[cmd] || (!(roomid in this.settings[cmd]))) {
				msg += 'available for users of rank ' + ((cmd === 'autoban' || cmd === 'banword') ? '#' : Config.defaultrank) + ' and above.';
			} else if (this.settings[cmd][roomid] in settingsLevels) {
				msg += 'available for users of rank ' + this.settings[cmd][roomid] + ' and above.';
			} else {
				msg += this.settings[cmd][roomid] ? 'available for all users in this room.' : 'not available for use in this room.';
			}

			return this.say(room, msg);
		}

		if (!(setting in settingsLevels)) return this.say(room, 'Unknown option: "' + setting + '". Valid settings are: off/disable/false, +, %, @, #, &, ~, on/enable/true.');
		if (!this.settings[cmd]) this.settings[cmd] = {};
		this.settings[cmd][roomid] = settingsLevels[setting];

		this.writeSettings();
		this.say(room, 'The command ' + Config.commandcharacter + '' + cmd + ' is now ' +
			(settingsLevels[setting] === setting ? ' available for users of rank ' + setting + ' and above.' :
			(this.settings[cmd][roomid] ? 'available for all users in this room.' : 'unavailable for use in this room.')));
	},
	blacklist: 'autoban',
	ban: 'autoban',
	ab: 'autoban',
	autoban: function (arg, user, room) {
		if (room === user || !user.canUse('autoban', room)) return false;
		if (!Users.self.hasRank(room, '@')) return this.say(room, Users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!toId(arg)) return this.say(room, 'You must specify at least one user to blacklist.');

		arg = arg.split(',');
		var added = [];
		var illegalNick = [];
		var alreadyAdded = [];
		var roomid = room.id;
		for (let i = 0; i < arg.length; i++) {
			let tarUser = toId(arg[i]);
			if (!tarUser || tarUser.length > 18) {
				illegalNick.push(tarUser);
			} else if (!this.blacklistUser(tarUser, roomid)) {
				alreadyAdded.push(tarUser);
			} else {
				added.push(tarUser);
				this.say(room, '/roomban ' + tarUser + ', Blacklisted user');
			}
		}

		var text = '';
		if (added.length) {
			text += 'User' + (added.length > 1 ? 's "' + added.join('", "') + '" were' : ' "' + added[0] + '" was') + ' added to the blacklist.';
			this.say(room, '/modnote ' + text + ' by ' + user.name + '.');
			this.writeSettings();
		}
		if (alreadyAdded.length) {
			text += ' User' + (alreadyAdded.length > 1 ? 's "' + alreadyAdded.join('", "') + '" are' : ' "' + alreadyAdded[0] + '" is') + ' already present in the blacklist.';
		}
		if (illegalNick.length) text += (text ? ' All other' : 'All') + ' users had illegal nicks and were not blacklisted.';
		this.say(room, text);
	},
	unblacklist: 'unautoban',
	unban: 'unautoban',
	unab: 'unautoban',
	unautoban: function (arg, user, room) {
		if (room === user || !user.canUse('autoban', room)) return false;
		if (!Users.self.hasRank(room, '@')) return this.say(room, Users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!toId(arg)) return this.say(room, 'You must specify at least one user to unblacklist.');

		arg = arg.split(',');
		var removed = [];
		var notRemoved = [];
		var roomid = room.id;
		for (let i = 0; i < arg.length; i++) {
			let tarUser = toId(arg[i]);
			if (!tarUser || tarUser.length > 18) {
				notRemoved.push(tarUser);
			} else if (!this.unblacklistUser(tarUser, roomid)) {
				notRemoved.push(tarUser);
			} else {
				removed.push(tarUser);
				this.say(room, '/roomunban ' + tarUser);
			}
		}

		var text = '';
		if (removed.length) {
			text += ' User' + (removed.length > 1 ? 's "' + removed.join('", "') + '" were' : ' "' + removed[0] + '" was') + ' removed from the blacklist';
			this.say(room, '/modnote ' + text + ' by user ' + user.name + '.');
			this.writeSettings();
		}
		if (notRemoved.length) text += (text.length ? ' No other' : 'No') + ' specified users were present in the blacklist.';
		this.say(room, text);
	},
	rab: 'regexautoban',
	regexautoban: function (arg, user, room) {
		if (room === user || !user.isRegexWhitelisted || !user.canUse('autoban', room)) return false;
		if (!Users.self.hasRank(room, '@')) return this.say(room, Users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!arg) return this.say(room, 'You must specify a regular expression to (un)blacklist.');

		try {
			new RegExp(arg, 'i');
		} catch (e) {
			return this.say(room, e.message);
		}

		// checks if the user is attempting to autoban everyone
		// this isn't foolproof, but good enough to catch mistakes.
		// if a user bypasses this to autoban everyone, then they shouldn't be on the regex autoban whitelist
		if (/^(?:(?:\.+|[a-z0-9]|\\[a-z0-9SbB])(?![a-z0-9\.\\])(?:[*+]|\{\d+\,(?:\d+)?\})?)+$/i.test(arg)) {
			return this.say(room, 'Regular expression /' + arg + '/i cannot be added to the blacklist. Proofread!');
		}

		arg = '/' + arg + '/i';
		if (!this.blacklistUser(arg, room.id)) return this.say(room, '/' + arg + ' is already present in the blacklist.');

		this.writeSettings();
		this.say(room, '/modnote Regular expression ' + arg + ' was added to the blacklist by user ' + user.name + '.');
		this.say(room, 'Regular expression ' + arg + ' was added to the blacklist.');
	},
	unrab: 'unregexautoban',
	unregexautoban: function (arg, user, room) {
		if (room === user || !user.isRegexWhitelisted || !user.canUse('autoban', room)) return false;
		if (!Users.self.hasRank(room, '@')) return this.say(room, Users.self.name + ' requires rank of @ or higher to (un)blacklist.');
		if (!arg) return this.say(room, 'You must specify a regular expression to (un)blacklist.');

		arg = '/' + arg.replace(/\\\\/g, '\\') + '/i';
		if (!this.unblacklistUser(arg, room.id)) return this.say(room, '/' + arg + ' is not present in the blacklist.');

		this.writeSettings();
		this.say(room, '/modnote Regular expression ' + arg + ' was removed from the blacklist user by ' + user.name + '.');
		this.say(room, 'Regular expression ' + arg + ' was removed from the blacklist.');
	},
	viewbans: 'viewblacklist',
	vab: 'viewblacklist',
	viewautobans: 'viewblacklist',
	viewblacklist: function (arg, user, room) {
		if (room === user || !user.canUse('autoban', room)) return false;

		var text = '/pm ' + user.id + ', ';
		if (!this.settings.blacklist) return this.say(room, text + 'No users are blacklisted in this room.');

		var roomid = room.id;
		var blacklist = this.settings.blacklist[roomid];
		if (!blacklist) return this.say(room, text + 'No users are blacklisted in this room.');

		if (!arg.length) {
			let userlist = Object.keys(blacklist);
			if (!userlist.length) return this.say(room, text + 'No users are blacklisted in this room.');
			return this.uploadToHastebin('The following users are banned from ' + roomid + ':\n\n' + userlist.join('\n'), function (link) {
				if (link.startsWith('Error')) return this.say(room, text + link);
				this.say(room, text + 'Blacklist for room ' + roomid + ': ' + link);
			}.bind(this));
		}

		var nick = toId(arg);
		if (!nick || nick.length > 18) {
			text += 'Invalid username: "' + nick + '".';
		} else {
			text += 'User "' + nick + '" is currently ' + (blacklist[nick] || 'not ') + 'blacklisted in ' + roomid + '.';
		}
		this.say(room, text);
	},
	banphrase: 'banword',
	banword: function (arg, user, room) {
		arg = arg.trim().toLowerCase();
		if (!arg) return false;

		var tarRoom = room.id;
		if (room === user) {
			if (!user.isExcepted) return false;
			tarRoom = 'global';
		} else if (user.canUse('banword', room)) {
			tarRoom = room.id;
		} else {
			return false;
		}

		var bannedPhrases = this.settings.bannedphrases ? this.settings.bannedphrases[tarRoom] : null;
		if (!bannedPhrases) {
			if (bannedPhrases === null) this.settings.bannedphrases = {};
			bannedPhrases = (this.settings.bannedphrases[tarRoom] = {});
		} else if (bannedPhrases[arg]) {
			return this.say(room, 'Phrase "' + arg + '" is already banned.');
		}
		bannedPhrases[arg] = 1;

		this.writeSettings();
		this.say(room, 'Phrase "' + arg + '" is now banned.');
	},
	unbanphrase: 'unbanword',
	unbanword: function (arg, user, room) {
		var tarRoom;
		if (room === user) {
			if (!user.isExcepted) return false;
			tarRoom = 'global';
		} else if (user.canUse('banword', room)) {
			tarRoom = room.id;
		} else {
			return false;
		}

		arg = arg.trim().toLowerCase();
		if (!arg) return false;
		if (!this.settings.bannedphrases) return this.say(room, 'Phrase "' + arg + '" is not currently banned.');

		var bannedPhrases = this.settings.bannedphrases[tarRoom];
		if (!bannedPhrases || !bannedPhrases[arg]) return this.say(room, 'Phrase "' + arg + '" is not currently banned.');

		delete bannedPhrases[arg];
		if (Object.isEmpty(bannedPhrases)) {
			delete this.settings.bannedphrases[tarRoom];
			if (Object.isEmpty(this.settings.bannedphrases)) delete this.settings.bannedphrases;
		}

		this.writeSettings();
		this.say(room, 'Phrase \"' + arg + '\" is no longer banned.');
	},
	viewbannedphrases: 'viewbannedwords',
	vbw: 'viewbannedwords',
	viewbannedwords: function (arg, user, room) {
		var tarRoom = room.id;
		var text = '';
		var bannedFrom = '';
		if (room === user) {
			if (!user.isExcepted) return false;
			tarRoom = 'global';
			bannedFrom += 'globally';
		} else if (user.canUse('banword', room)) {
			text += '/pm ' + user.id + ', ';
			bannedFrom += 'in ' + room.id;
		} else {
			return false;
		}

		if (!this.settings.bannedphrases) return this.say(room, text + 'No phrases are banned in this room.');
		var bannedPhrases = this.settings.bannedphrases[tarRoom];
		if (!bannedPhrases) return this.say(room, text + 'No phrases are banned in this room.');

		if (arg.length) {
			text += 'The phrase "' + arg + '" is currently ' + (bannedPhrases[arg] || 'not ') + 'banned ' + bannedFrom + '.';
			return this.say(room, text);
		}

		var banList = Object.keys(bannedPhrases);
		if (!banList.length) return this.say(room, text + 'No phrases are banned in this room.');

		this.uploadToHastebin('The following phrases are banned ' + bannedFrom + ':\n\n' + banList.join('\n'), function (link) {
			if (link.startsWith('Error')) return this.say(room, link);
			this.say(room, text + 'Banned phrases ' + bannedFrom + ': ' + link);
		}.bind(this));
	}

	/**************************
	* Roomowner commands ~end *
	**************************/

};
