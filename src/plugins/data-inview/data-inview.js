/*
 * @title WET-BOEW Data Inview
 * @overview A simplified data-attribute driven plugin that responds to moving in and out of the viewport.
 * @license wet-boew.github.io/wet-boew/License-en.html / wet-boew.github.io/wet-boew/Licence-fr.html
 * @author WET Community
 */
(function( $, window, vapour ) {
"use strict";

/* 
 * Variable and function definitions. 
 * These are global to the plugin - meaning that they will be initialized once per page,
 * not once per instance of plugin on the page. So, this is a good place to define
 * variables that are common to all instances of the plugin on a page.
 */
var selector = ".wb-inview",
	$elms = $( selector ),
	$document = vapour.doc,
	$window = vapour.win,

	/*
	 * Init runs once per plugin element on the page. There may be multiple elements. 
	 * It will run more than once per plugin if you don't remove the selector from the timer.
	 * @method init
	 * @param {jQuery DOM element} $elm The plugin element being initialized
	 */
	init = function( $elm ) {

		// All plugins need to remove their reference from the timer in the init sequence unless they have a requirement to be poked every 0.5 seconds
		window._timer.remove( selector );

		$elm.trigger( "scroll.wb-inview" );
	},

	/*
	 * @method onInview
	 * @param {jQuery DOM element} $elm The plugin element
	 * @param {jQuery Event} event The event that triggered this method call
	 */
	onInview = function( $elm ) {
		var elementWidth = $elm.outerWidth(),
			elementHeight = $elm.outerHeight(),
			scrollTop = $window.scrollTop(),
			scrollBottom = scrollTop + $window.height(),
			scrollRight = $window.scrollLeft() + elementWidth,
			x1 = $elm.offset().left,
			x2 = x1 + elementWidth,
			y1 = $elm.offset().top,
			y2 = y1 + elementHeight,
			inView = ( scrollBottom < y1 || scrollTop > y2 ) || ( scrollRight < x1 || scrollRight > x2 );

		$elm
			.find( ".pg-banner, .pg-panel" )
				.attr({
					"role": "toolbar",
					"aria-hidden": !inView
				})
				.toggleClass( "in", !inView )
				.toggleClass( "out", inView );
	};

// Bind the init event of the plugin
$document.on( "timerpoke.wb scroll.wb-inview", selector, function( event ) {
	var eventTarget = event.target,
		eventType = event.type,
		$elm;

	// Filter out any events triggered by descendants
	if ( event.currentTarget === eventTarget ) {
		$elm = $( eventTarget );

		switch ( eventType ) {
		case "timerpoke":
			init( $elm );
			break;
		case "scroll":
			onInview( $elm );
			break;
		}
	}

	/*
	 * Since we are working with events we want to ensure that we are being passive about our control, 
	 * so returning true allows for events to always continue
	 */
	return true;
});

$window.on( "scroll scrollstop", function() {
	$elms.trigger( "scroll.wb-inview" );
});

$document.on( "text-resize.wb window-resize-width.wb window-resize-height.wb", function() {
	$elms.trigger( "scroll.wb-inview" );
});

// Add the timer poke to initialize the plugin

window._timer.add( selector );

})( jQuery, window, vapour );
