/**
 * Robots-JU FLL 2016 Scoreboard
 * @author Clark Winkelmann <clark.winkelmann@gmail.com>
 * @license MIT
 */

/* global React */
/* global FllScorer */

var ScoreBoardReact = React.createClass({
	mixins: [React.addons.LinkedStateMixin],
	getDefaultProps: function() {
		return {
			/**
			 * This a pseudo-event, allowing a script outside the Scoreboard
			 * to keep an eye on it and read the new values as they change
			 *
			 * Default is a no-op
			 */
			onStateChange: function() {},
			/**
			 * Initial state to load when the Scoreboard is created
			 * Can be used to restore data from the outside at initialization
			 */
			initialState: {}
		};
	},
	componentDidUpdate: function() {
		// Call the pseudo-event function
		this.props.onStateChange(this.state);
	},
	getInitialState: function() {
		// Deep-clone, otherwise this methods edits the defaults, which is problematic for resetMissions()
		var state = JSON.parse(JSON.stringify(FllScorer.initialMissionsState));

		// Merge initial state with default state
		// thanks http://stackoverflow.com/a/171256/3133038
		for(var attrname in this.props.initialState) {
			state[attrname] = this.props.initialState[attrname];
		}

		// Choose the locale according to the browser. Default to English
		if(window.navigator.language.indexOf('fr') !== -1) {
			state.locale = 'fr';
		} else {
			state.locale = 'en';
		}

		// The index of the mission to display in extended format
		// If the viewport is large enough we open the first mission in the wizard
		state.focused_mission = window.innerWidth < 1000 ? -1 : 0;

		return state;
	},
	resetMissions: function() {
		this.setState(FllScorer.initialMissionsState);
	},
	/**
	 * Finds a localised string inside an object from ScoreBoardData
	 */
	lang: function(obj) {
		return obj[this.state.locale];
	},
	focusPrev: function() {
		var index = this.state.focused_mission;
		index--;
		if (index >= -1) {
			this.setState({focused_mission: index});
		}
	},
	focusNext: function() {
		var index = this.state.focused_mission;
		index++;
		if (index >= ScoreBoardData.missions.length) {
			this.focusClose();
		} else {
			this.setState({focused_mission: index});
		}
	},
	focusClose: function() {
		this.setState({focused_mission: -1}); // close overlay
	},
	render: function() {
		var output = FllScorer.computeMissions(this.state);
		var score = output.score;

		return React.createElement('div', {}, [
			React.createElement('header', {key: 0}, [
				React.createElement('div', {
					key: 0,
					className: 'header-block score'
				}, 'Score: ' + score),
				React.createElement('h1', {
					key: 1,
					className: 'header-block'
				}, [
					React.createElement('em', {key: 0}, 'Robots-JU'),
					' FLL 2016 Scoreboard'
				]),
				React.createElement('div', {
					key: 2,
					className: 'overlay-nav' + (this.state.focused_mission !== -1 ? ' active' : '')
				}, [
					React.createElement('button', {key: 0, className: 'header-block nav-prev', onClick: this.focusPrev},   [React.createElement('i', {key: 0, className: 'fa fa-chevron-left'}), ' ', this.lang(ScoreBoardData.strings.prev)]),
					React.createElement('button', {key: 1, className: 'header-block nav-next', onClick: this.focusNext},   [this.lang(ScoreBoardData.strings.next), ' ', React.createElement('i', {key: 0, className: 'fa fa-chevron-right'})]),
					React.createElement('button', {key: 2, className: 'header-block nav-close', onClick: this.focusClose}, [this.lang(ScoreBoardData.strings.close), ' ', React.createElement('i', {key: 0, className: 'fa fa-close'})])
				]),
				React.createElement('button', {
					key: 3,
					className: 'header-block start-overlay' + (this.state.focused_mission === -1 ? ' active' : ''),
					onClick: function() { this.setState({focused_mission: 0}); }.bind(this)
				}, [React.createElement('i', {key: 0, className: 'fa fa-magic'}), ' ', this.lang(ScoreBoardData.strings.launch_wizard)])
			]),
			React.createElement('div', {key: 1, className: 'missions-table' + (this.state.focused_mission !== -1 ? ' overlay-open' : '')}, ScoreBoardData.missions.map(function(mission, mission_key) {
				var mission_score = 0;
				mission.tasks.forEach(function(task) {
					task.options.forEach(function(option) {
						switch (option.type) {
							case 'boolean':
								if (this.state[option.handle]) {
									mission_score += option.points;
								}
								break;
							case 'number':
								mission_score += this.state[option.handle] * option.points;
								break;
							default:
								console.log('TODO: unknown option type');
						}
					}.bind(this));
				}.bind(this));
				return React.createElement('div', {
					key: mission_key,
					onClick: function() { this.setState({focused_mission: mission_key}); }.bind(this),
					className: 'mission',
					style: {
						top: mission.position.top + '%',
						left: mission.position.left + '%'
					}
				}, [
					React.createElement('div', {
						key: 0,
						className: 'pointer' + (mission_score != 0 ? ' scoring' : '') + (mission_score < 0 ? ' negative' : '')
					}, [
						React.createElement('div', {key: 0, className: 'score'}, mission_score != 0 ? mission_score : ''),
						React.createElement('div', {key: 1, className: 'number'}, mission.number === null ? 'PE' : ('M' + mission.number))
					]),
					React.createElement('div', {key: 1, className: 'label'}, this.lang(mission.title))
				]);
			}.bind(this))),
			React.createElement('div', {key: 2, className: 'missions-overlay' + (this.state.focused_mission !== -1 ? ' active' : '')}, [
				ScoreBoardData.missions.map(function(mission, mission_key) {
					return React.createElement('div', {key: mission_key, className: 'mission ' + (function() {
							if (mission_key === this.state.focused_mission) {
								return 'active';
							} else if(mission_key > this.state.focused_mission) {
								return 'out-next';
							} else {
								return 'out-prev';
							}
						}.bind(this))()}, React.createElement('div', {className: 'content'}, [
							React.createElement('h1', {key: 0}, (mission.number === null ? '' : ('M' + mission.number + ' ')) + this.lang(mission.title)),
							React.createElement('p', {key: 1}, this.lang(mission.description)),
							React.createElement('div', {key: 2, className: 'tasks' + (mission.tasks.length > 1 ? ' multiple' : '')}, mission.tasks.map(function(task, task_key) {
								return React.createElement('div', {key: task_key, className: 'options' + (task.options.length > 1 ? ' multiple' : '')}, task.options.map(function(option, option_key) {
									return React.createElement('label', {key: option_key, className: 'option'},
										(function() {
											switch (option.type) {
												case 'boolean':
													return [React.createElement('input', {
															key: 0,
															type: 'checkbox',
															checked: this.state[option.handle],
															onChange: function() {
																var newState = {};
																// We need to edit all the other options of that task,
																// switch the state of this option and disable all the others
																task.options.forEach(function(this_task_option) {
																	var value = false;
																	if(this_task_option.handle == option.handle) {
																		value = !this.state[option.handle];
																	}
																	newState[this_task_option.handle] = value;
																}.bind(this));
																this.setState(newState);
															}.bind(this)
														}),
														React.createElement('div', {
															key: 1,
															className: 'field-box' + (this.state[option.handle] ? ' active' : '')
														}, [
															React.createElement('div', {key: 0, className: 'images'}, option.images.map(function(image, image_key) {
																return React.createElement('div', {key: image_key, className: 'image', style: {backgroundImage: 'url(assets/' + image + ')'}});
															})),
															React.createElement('div', {key: 1, className: 'description'}, [
																React.createElement('span', {key: 0, className: 'fake-checkbox'}, React.createElement('i', {className: 'fa fa-check'})),
																React.createElement('span', {key: 1, className: 'title'}, this.lang(option.title)),
																React.createElement('span', {key: 2, className: 'points'}, '+' + option.points)
															])
														])
													];
												case 'number':
													var number_inputs = [];

													for (var number=0; number <= option.max; number++) {
														(function() {
															var number_for_input = number;
															number_inputs.push(React.createElement('div', {
																key: number_for_input,
																className: 'number' + (this.state[option.handle] == number_for_input ? ' active' : ''),
																onClick: function() {
																	var changes = {};
																	changes[option.handle] = number_for_input;
																	this.setState(changes);
																}.bind(this)
															}, [
																React.createElement('div', {key: 0, className: 'digit'}, number_for_input),
																React.createElement('div', {key: 1, className: 'points'}, (option.points > 0 ? '+' : '') + (option.points * number_for_input))
															]));
														}.bind(this))();
													}

													return React.createElement('div', {className: 'field-box' + (this.state[option.handle] ? ' active' : '')}, [
															React.createElement('div', {key: 0, className: 'images'}, option.images.map(function(image, image_key) {
																return React.createElement('div', {key: image_key, className: 'image', style: {backgroundImage: 'url(assets/' + image + ')'}});
															})),
															React.createElement('div', {key: 1, className: 'description'}, [
																React.createElement('span', {key: 0, className: 'title'}, this.lang(option.title)),
																React.createElement('span', {key: 1, className: 'points'}, (option.points > 0 ? '+' : '') + option.points)
															]),
															React.createElement('div', {
																key: 2,
																className: 'numbers-input'
															}, number_inputs)
														]);
											}
											return 'UNHANDLED';
										}.bind(this))()
									);
								}.bind(this)));
							}.bind(this))),
							React.createElement('ul', {key: 3}, mission.constraints.map(function(constraint, constraint_key) {
								return React.createElement('li', {key: constraint_key}, this.lang(constraint));
							}.bind(this)))
						]));
				}.bind(this))
			]),
			React.createElement('div', {key: 3, className: 'tools'}, [
				React.createElement('ul', {key: 0, className: 'locales'}, Object.keys(ScoreBoardData.locales).map(function(locale) {
					return React.createElement('li', {key: locale, onClick: function() { this.setState({locale: locale}); }.bind(this)}, locale);
				}.bind(this))),
				React.createElement('img', {
					key: 1, 
					src: 'assets/animal-allies-logo.png',
					alt: 'Animal Allies Logo'
				}),
				React.createElement('p', {key: 2}, this.lang(ScoreBoardData.strings.about)),
				React.createElement('p', {key: 3}, [
					React.createElement('a', {
						key: 0,
						className: 'btn twitter big',
						href: (function() {
							var text = this.lang(ScoreBoardData.strings.twitter.text).replace('%score%', score);
							var link = 'https://fll-scoreboard-2016.robots-ju.ch/';

							// Based on the output seen here https://about.twitter.com/fr/resources/buttons#tweet
							return 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(link);
						}.bind(this))(),
						target: '_blank'
					}, [
						React.createElement('i', {key: 0, className: 'fa fa-twitter'}),
						' ' + this.lang(ScoreBoardData.strings.twitter.button)
					])
				]),
				React.createElement('p', {key: 4}, [
					React.createElement('a', {
						key: 1,
						className: 'btn twitter',
						href: 'https://twitter.com/RobotsJU',
						target: '_blank'
					}, [
						React.createElement('i', {key: 0, className: 'fa fa-twitter'}),
						' ' + this.lang(ScoreBoardData.strings.twitter.follow).replace('%user%', '@RobotsJU')
					])
				]),
				React.createElement('button', {
					key: 5,
					className: 'btn',
					onClick: this.resetMissions
				}, this.lang(ScoreBoardData.strings.reset))
			])
		]);
	}
});

var ScoreBoardData = @@include('missions.json');
