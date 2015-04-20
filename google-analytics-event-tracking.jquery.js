/**
 * googleAnalyticsEventTracking
 * Define in a simple, and easy, way elements and events to be tracked by Google Analytics
 *
 * Author: Diego ZoracKy | @DiegoZoracKy
 */
(function() {
    'use strict';

    var registeredEvents = [];

    $.googleAnalyticsEventTracking = function(gaEvents) {
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
                var gaEventData = {hitType: 'event'};

                for (var eventLabel in trackEvent.gaEventData) {
                    var gaEventKey = gaEventDataTranslations[eventLabel.toLowerCase()] || eventLabel;

                    if(trackEvent.gaEventData[eventLabel].constructor == Function )
                        gaEventData[gaEventKey] = trackEvent.gaEventData[eventLabel]($(gaEvent.targetSelector), $(gaEvent.delegateTo));
                    else
                        gaEventData[gaEventKey] = trackEvent.gaEventData[eventLabel];
                }

                applyEventHandler(gaEvent.delegateTo, trackEvent.eventType, gaEvent.targetSelector, gaEventData);
            });
        });

        function applyEventHandler(delegateTo, eventType, targetSelector, gaEventData) {
            eventType = eventType + '.gaEvent';

            if (delegateTo)
                $(delegateTo).on(eventType, targetSelector, gaSendFunction(gaEventData));
            else
                $(targetSelector).on(eventType, gaSendFunction(gaEventData));
        }

        function gaSendFunction(gaEventData) {
            return function(){
                ga('send', gaEventData);
            };
        }
    };

    $.googleAnalyticsEventTracking.getRegisteredEvents = getRegisteredEvents;

    function getRegisteredEvents(){
        return registeredEvents;
    }

})(jQuery);