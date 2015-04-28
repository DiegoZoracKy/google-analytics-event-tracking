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
                    $(gaEvent.delegateTo).on(trackEvent.eventType, gaEvent.targetSelector, gaSendFunction(trackEvent, gaEvent));
                else
                    $(gaEvent.targetSelector).on(trackEvent.eventType, gaSendFunction(trackEvent, gaEvent));
            });
        });

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

        $.googleAnalyticsEventTracking.setDebugMode = function setDebugMode(mode){
            debugMode = mode;
        };

        $.googleAnalyticsEventTracking.getRegisteredEvents = function getRegisteredEvents(){
            return registeredEvents;
        };
    };

})(jQuery);



$.googleAnalyticsEventTracking(
    {
        // Does the contact Form was submitted? With subject was selected?
        targetSelector: '#formulario',
        events: {
            eventType: 'submit',
            gaEventData: {
                category: 'Contato',
                action: 'Formulário',
                label: function($target) {
                    return $target.find('#assunto').val();
                }
            }
        }
    },{
        // Which Outbound Links were clicked
        targetSelector: 'a:not([href*=bgmrodotec]):not([href^="/"]):not([href="#"]):not([href="javascript:void(0)"])',
        events: {
            eventType: 'click',
            gaEventData: {
                category: 'Outbound Link',
                action: function($target) {
                    return $target.text();
                },
                label: function($target) {
                    return $target.attr('href');
                }
            }
        }
    },{
        // Is the "modules" slides used?
        targetSelector: '.modulos .controles a',
        events: {
            eventType: 'click',
            gaEventData: {
                category: 'Módulos',
                action: 'Controle',
                label: function($target) {
                    return $target.attr('Title');
                },
                nonInteraction: 1
            }
        }
    },{
        // Solutions Menu was opened?
        targetSelector: '#spots a[title="Ver mais"]',
        events: {
            eventType: 'click',
            gaEventData: {
                category: 'Soluções Spot',
                action: 'Abrir Menu',
                label: function($target) {
                    return $target.parents('article').attr('class');
                },
                nonInteraction: 1
            },
            condition: function($target, $delegateTo){
                return $target.is('.zk');
            }
        }
    },{
        // Which menu is most used? Header or Footer?
        targetSelector: '.nav-menu a',
        events: {
            eventType: 'click',
            gaEventData: {
                category: 'Main Nav',
                action: function($target) {
                    return $target.parents('header, footer').prop("tagName");
                },
                label: function($target) {
                    return $target.attr('href');
                },
                nonInteraction: 1
            }
        }
    },{
        // Does the main banner CTA was clicked?
        targetSelector: '#webdoor a[href!=#]',
        events: {
            eventType: 'click',
            gaEventData: {
                category: 'Main Banner',
                action: 'Slide CTA',
                label: function($target) {
                    return $target.parents('ul').find('[class=ativo]').data('posicao');
                },
                nonInteraction: 1
            }
        }
    },{
        // Which iCal link is most clicked
        targetSelector: '.tribe-events-cal-links a',
        events: {
            eventType: 'click',
            gaEventData: {
                category: 'Treinamento',
                action: 'iCal Button',
                label: function($target) {
                    return $target.text();
                }
            }
        }
    });

$.googleAnalyticsEventTracking.setDebugMode(true);