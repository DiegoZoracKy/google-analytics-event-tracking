/**
 * googleAnalyticsEventTracking
 * Define in a simple, and easy, way elements and events to be tracked by Google Analytics
 *
 * Author: Diego ZoracKy | @DiegoZoracKy
 */
(function() {
    'use strict';

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

            if (gaEvent.events.constructor != Array)
                gaEvent.events = [gaEvent.events];

            gaEvent.events.forEach(function(trackEvent) {
                var gaEventData = {};
                for (var eventLabel in trackEvent.gaEventData) {
                    gaEventData[gaEventDataTranslations[eventLabel.toLowerCase()] || eventLabel] = trackEvent.gaEventData[eventLabel];
                }

                gaEventData.hitType = 'event';
                applyEventHandler(gaEvent.delegateTo, trackEvent.eventType, gaEvent.targetSelector, gaEventData);
            });
        });


        function applyEventHandler(delegateTo, eventType, targetSelector, gaEventData) {
            eventType = eventType + '.gaEvent';
            var gaSendFunction = function() {
                ga('send', gaEventData);
            };

            if (delegateTo)
                $(delegateTo).on(eventType, targetSelector, gaSendFunction);
            else
                $(targetSelector).on(eventType, gaSendFunction);
        }
    };

})(jQuery);