/**
 * googleAnalyticsEventTracking
 * Define in a simple, and easy, way elements and events to be tracked by Google Analytics
 *
 * Author: Diego ZoracKy | @DiegoZoracKy
 */
(function() {
    'use strict';

    var debugMode = false;
    var registeredEvents = [];
    var gaEventDataTranslations = {
        'category': 'eventCategory',
        'action': 'eventAction',
        'label': 'eventLabel',
        'value': 'eventValue',
        'nonInteraction': 'nonInteraction'
    };

    $.googleAnalyticsEventTracking = function(gaEvents) {
        if (gaEvents.constructor != Array)
            gaEvents = Array.prototype.slice.call(arguments);

        gaEvents.forEach(function(gaEvent) {
            registeredEvents.push(gaEvent);

            if (gaEvent.events.constructor != Array)
                gaEvent.events = [gaEvent.events];

            gaEvent.events.forEach(function(trackEvent) {
                if (gaEvent.delegateTo)
                    $(gaEvent.delegateTo).on(trackEvent.eventType, gaEvent.targetSelector, gaSendFunction(trackEvent, gaEvent));
                else
                    $(gaEvent.targetSelector).on(trackEvent.eventType, gaSendFunction(trackEvent, gaEvent));
            });
        });
    };

    $.googleAnalyticsEventTracking.setDebugMode = function setDebugMode(mode){
        debugMode = mode;
    };

    $.googleAnalyticsEventTracking.getRegisteredEvents = function getRegisteredEvents(){
        return registeredEvents;
    };

    function gaSendFunction(trackEvent, gaEvent) {
        return function(e){
            if(trackEvent.condition && !trackEvent.condition($(e.currentTarget), $(gaEvent.delegateTo)))
                return;

            var eventDataToSend = {hitType: 'event'};
            for (var key in trackEvent.gaEventData){
                var eventKey = gaEventDataTranslations[key.toLowerCase()] || key;
                eventDataToSend[eventKey] = trackEvent.gaEventData[key];
                if(trackEvent.gaEventData[key].constructor == Function)
                    eventDataToSend[eventKey] = trackEvent.gaEventData[key]($(e.currentTarget), $(gaEvent.delegateTo));
            }

            if(debugMode)
                console.log('send', eventDataToSend);
            else
                ga('send', eventDataToSend);
        };
    }

})(jQuery);