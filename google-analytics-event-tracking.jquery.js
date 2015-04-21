/**
 * googleAnalyticsEventTracking
 * Define in a simple, and easy, way elements and events to be tracked by Google Analytics
 *
 * Author: Diego ZoracKy | @DiegoZoracKy
 */
(function() {
    'use strict';

    $.googleAnalyticsEventTracking = function(gaEvents) {
        var debugMode = false;
        var registeredEvents = [];
        var gaEventDataTranslations = {
            'category': 'eventCategory',
            'action': 'eventAction',
            'label': 'eventLabel',
            'value': 'eventValue',
            'nonInteraction': 'nonInteraction'
        };

        if (gaEvents.constructor != Array)
            gaEvents = Array.prototype.slice.call(arguments);

        gaEvents.forEach(function(gaEvent) {
            registeredEvents.push(gaEvent);

            if (gaEvent.events.constructor != Array)
                gaEvent.events = [gaEvent.events];

            gaEvent.events.forEach(function(trackEvent) {
                if (gaEvent.delegateTo)
                    $(gaEvent.delegateTo).on(trackEvent.eventType, gaEvent.targetSelector, gaSendFunction(trackEvent.gaEventData, gaEvent.delegateTo));
                else
                    $(gaEvent.targetSelector).on(trackEvent.eventType, gaSendFunction(trackEvent.gaEventData, gaEvent.delegateTo));
            });
        });

        function gaSendFunction(gaEventData, delegateTo) {
            return function(e){
                var eventDataToSend = {hitType: 'event'};
                for (var key in gaEventData){
                    var eventKey = gaEventDataTranslations[key.toLowerCase()] || key;
                    eventDataToSend[eventKey] = gaEventData[key];
                    if(gaEventData[key].constructor == Function)
                        eventDataToSend[eventKey] = gaEventData[key]($(e.currentTarget), $(delegateTo));
                }

                if(debugMode)
                    console.log('send', eventDataToSend);
                else
                    ga('send', eventDataToSend);
            };
        }

        $.googleAnalyticsEventTracking.setDebugMode = function setDebugMode(mode){
            debugMode = mode;
        };

        $.googleAnalyticsEventTracking.getRegisteredEvents = function getRegisteredEvents(){
            return registeredEvents;
        };
    };

})(jQuery);