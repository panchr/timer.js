// Rushy Panchal
// timer.js

function Timer() {
	/* 
	SYNOPSIS
		Create a timer counting seconds passed

	PARAMETERS
		None

	RETURN VALUE
		None

	USAGE
		timer = new Timer();
	*/
	this.elapsed = 0;
	this.interval = null;
	this.hooks = {};
	this.hooks[-1] = {}; // -1 is for .each callbacks
	}

Timer.prototype.each = function(callback, id) {
	/*
	SYNOPSIS
		Subscribe a callback to each second passing

	PARAMETERS
		function callback - the callback to register
		hashable id (optional) - a ID for the callback (randomly generated
			if not provided)

	CALLBACK PARAMETERS
		int second - the number of seconds that have elapsed since the timer
			was started

	RETURN VALUE
		hashable id - the ID corresponding to the given callback

	USAGE
		// Register callback to output every second
		var id = timer.each(function(second) {
			console.log(second)
			});

		// Create a callback with a custom identifier
		timer.each(my_custom_callback, "custom_callback_id");
	*/
	var id = (id == undefined) ? Math.random(): id;
	this.hooks[-1][id] = callback;

	return id;
	}

Timer.prototype.removeCallback = function(id) {
	/*
	SYNOPSIS
		Remove a callback by its id

	PARAMETERS
		hashable id - ID of the callback to delete

	RETURN VALUE
		None

	USAGE
		// Remove a callback by its id
		timer.removeCallback(id);
	*/
	delete this.hooks[-1][id];
	}

Timer.prototype.secondHook = function(second, hook) {
	// Add a callback for when a specific second passes
	if (second < 0) return; // irrelevant hook
	if (this.hooks.hasOwnProperty(second)) this.hooks[second].push(hook);
	else this.hooks[second] = [hook];
	}

Timer.prototype.isRunning = function() {
	// Check if the timer is running
	return this.interval != null;
	}

Timer.prototype.start = function() {
	// Start the timer
	if (! this.isRunning()) {
		var timer = this;
		this.interval = setInterval(function() {
			if (timer.hooks.hasOwnProperty(timer.elapsed)) {
				// call each hook for each second
				for (var i = 0; i < timer.hooks[timer.elapsed].length; i++) {
					timer.hooks[timer.elapsed][i](timer.elapsed);
					}
				delete timer.hooks[timer.elapsed]; // no way to use these hooks again
				}
			for (var key in timer.hooks[-1]) {
				timer.hooks[-1][key](timer.elapsed);
				}
			timer.elapsed++;
			}, 1000);
		}
	}

Timer.prototype.stop = function() {
	// Stop the timer
	if (this.isRunning()) {
		clearInterval(this.interval);
		this.interval = null;
		}
	}

Timer.prototype.reset = function() {
	// Reset the timer
	this.stop();
	this.elapsed = 0;
	}