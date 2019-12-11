/**
 * GoogleAnalyticsEventTracking
 * Define in a simple, and easy, way elements and events to be tracked by Google Analytics
 *
 * Author: Diego ZoracKy + André Filipe Goulart | @DiegoZoracKy + @afgoulart
 *
 * GoogleAnalyticsEventTracking({
 *     // 'delegateTo' is optional. Useful for elements created dynamically
 *     delegateTo: '.root-element-to-handle-event',
 *     targetSelector: '.something.created .dynamically',
 *     events: {
 *         eventType: 'click',
 *         gaEventData: {
 *             category: 'Event Category',
 *             action: 'Event Action',
 *             label: 'Event Label'
 *         }
 *     }
 * });
 */

(function(root, factory) {
  if (typeof define === "function" && define.amd) {
    define(factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.GoogleAnalyticsEventTracking = factory();
  }
})(this, function() {
  "use strict";

  class GoogleAnalyticsEventTracking {
    debugMode;
    registeredEvents = [];
    gaEventDataTranslations = {
      category: "eventCategory",
      action: "eventAction",
      label: "eventLabel",
      value: "eventValue"
    };
    ga = undefined;

    constructor({ trackerName, events = [], debugMode = false }) {
      this.ga = ga;
      this.debugMode = debugMode;

      this.trackerName = trackerName ? `${trackerName}.send` : "send";

      if (events.constructor != Array)
        events = Array.prototype.slice.call(arguments);

      events.forEach(gaEvent => {
        this.registeredEvents.push(gaEvent);

        if (gaEvent.events.constructor != Array)
          gaEvent.events = [gaEvent.events];

        gaEvent.events.forEach(trackEvent => {
          if (gaEvent.delegateTo) {
            document.querySelectorAll(gaEvent.delegateTo).forEach(el => {
              el.addEventListener(trackEvent.eventType, e => {
                if (e.target.matches(gaEvent.targetSelector))
                  this.gaSendFunction(trackEvent, gaEvent)(e);
              });
            });
          } else {
            document
              .querySelector(gaEvent.targetSelector)
              .addEventListener(
                trackEvent.eventType,
                this.gaSendFunction(trackEvent, gaEvent)(e)
              );
          }
        });
      });
      return this;
    }

    addNewEvent(gaEvent) {
      this.registeredEvents.push(gaEvent);
      if (gaEvent.events.constructor != Array)
        gaEvent.events = [gaEvent.events];

      gaEvent.events.forEach(trackEvent => {
        if (gaEvent.delegateTo) {
          document.querySelectorAll(gaEvent.delegateTo).forEach(el => {
            el.addEventListener(trackEvent.eventType, e => {
              if (e.target.matches(gaEvent.targetSelector))
                this.gaSendFunction(trackEvent, gaEvent)(e);
            });
          });
        } else {
          document
            .querySelector(gaEvent.targetSelector)
            .addEventListener(
              trackEvent.eventType,
              this.gaSendFunction(trackEvent, gaEvent)
            );
        }
      });
    }

    setDebugMode(mode) {
      this.debugMode = mode;
    }

    getRegisteredEvents() {
      return this.registeredEvents;
    }

    gaSendFunction(trackEvent, gaEvent) {
      return e => {
        if (
          trackEvent.condition &&
          !trackEvent.condition(e.currentTarget, gaEvent.delegateTo)
        )
          return;

        var eventDataToSend = { hitType: "event" };
        for (var key in trackEvent.gaEventData) {
          var eventKey = this.gaEventDataTranslations[key.toLowerCase()] || key;
          eventDataToSend[eventKey] =
            trackEvent.gaEventData[key].constructor == Function
              ? trackEvent.gaEventData[key](e.currentTarget, gaEvent.delegateTo)
              : trackEvent.gaEventData[key];
        }

        if (this.debugMode) console.log(this.trackerName, eventDataToSend);
        else if (ga) ga(this.trackerName, eventDataToSend);
        else console.log('"ga" function is not defined');
      };
    }
  }

  return GoogleAnalyticsEventTracking;
});
