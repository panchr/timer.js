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

Timer.prototype.once = function(second, callback) {
	/*
	SYNOPSIS
		Add a callback that is called once when a specific elapsed time is reached

	PARAMETERS
		int second - the elapsed time (in seconds) for when the callback
			should be called (a second value less than 0 renders this moot)
		function callback - function to be called at the given time

	CALLBACK PARAMETERS
		int second - the number of seconds that have elapsed since the timer
			was started

	RETURN VALUE
		None

	USAGE
		// Add a callback at t = 10
		timer.once(10, function(second) {
			console.log(second); // will output 10
			})

		// Add a callback that will never be called (no reason to do this)
		timer.once(-5, function(second) {
			console.log("This is impossible.");
			})
	*/
	if (second < 0) return; // irrelevant hook, t < 0
	if (this.hooks.hasOwnProperty(second)) this.hooks[second].push(hook);
	else this.hooks[second] = [hook];
	}

Timer.prototype.isRunning = function() {
	/*
	SYNOPSIS
		Returns whether or not the timer is currently running

	PARAMETERS
		None

	RETURN VALUE
		bool running - whether or not the timer is running at the moment

	USAGE
		// Two different actions based on whether or not the timer is running
		if (timer.isRunning()) {
			console.log("Timer is running");
			}
		else {
			console.log("Timer is not running");
			}
	*/
	return this.interval != null;
	}

Timer.prototype.start = function() {
	/*
	SYNOPSIS
		Start the timer if it is not currently running

	PARAMETERS
		None

	RETURN VALUE
		bool started - whether or not the timer was started
			This is equivalent to calling isRunning() before start()

	USAGE
		// Start the timer
		timer.start();
	*/
	if (! this.isRunning()) {
		var timer = this;
		this.interval = setInterval(function() {
			// should only run if there are hooks for the current second
			if (timer.hooks.hasOwnProperty(timer.elapsed)) {
				// call each hook for each second
				for (var i = 0; i < timer.hooks[timer.elapsed].length; i++) {
					timer.hooks[timer.elapsed][i](timer.elapsed);
					}
				// the time has passed and so this memory can be freed
				delete timer.hooks[timer.elapsed];
				}
			// call the hooks for each second
			for (var key in timer.hooks[-1]) {
				timer.hooks[-1][key](timer.elapsed);
				}
			timer.elapsed++;
			}, 1000);

		return true;
		}
	return false;
	}

Timer.prototype.stop = function() {
	/*
	SYNOPSIS
		Stop the timer if it is currently running

	PARAMETERS
		None

	RETURN VALUE
		bool stopped - whether or not the timer was stopped
			This is equivalent to calling isRunning() before stop()

	USAGE
		// Stop the timer
		timer.stop();
	*/
	if (this.isRunning()) {
		clearInterval(this.interval);
		this.interval = null;
		return true;
		}
	return false;
	}

Timer.prototype.reset = function() {
	/*
	SYNOPSIS
		Reset the timer to the value of 0
		Note: The timer is NOT restarted. It is stopped if running, but must be
		restarted again by the client.

	PARAMETERS
		None

	RETURN VALUE
		None

	USAGE
		// Reset the timer
		timer.reset();
	*/
	this.stop();
	this.elapsed = 0;
	}