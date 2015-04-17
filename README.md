# Google Analytics Event Tracking

**$.googleAnalyticsEventTracking** is meant to provide an easy, and lightweight (**.min < 1kb**), way to do exactly what its name says.

## The goal

Define the elements and events to be tracked, along with its respective Google Analytics event data, in an well structured way, easy to maintain, and avoiding repetitive code (DRY!)

## Usage

This is an basic example of how you can setup the plugin:

```javascript
$.googleAnalyticsEventTracking({
    // 'delegateTo' is optional. Useful for elements created dynamically
    delegateTo: '.root-element-to-handle-event',
    targetSelector: '.something.created .dynamically',
    events: {
        eventType: 'click',
        gaEventData: {
            category: 'Event Category',
            action: 'Event Action',
            label: 'Event Label'
        }
    }
});
```

And here is an example defining multiple elements and events to be tracked, showing its capability to define more than one event for the same element.

```javascript
$.googleAnalyticsEventTracking({
    targetSelector: '#formId',
    events: [{
        eventType: 'submit',
        gaEventData: {
            category: 'form',
            action: 'submit',
            label: 'Newsletter'
        }
    }]
},{
    targetSelector: '.target',
    events: [{
        eventType: 'click',
        gaEventData: {
            category: 'Event category',
            action: 'click',
            label: 'Event Label'
        }
    }, {
        eventType: 'mouseenter',
        gaEventData: {
            category: 'Event category',
            action: 'open',
            label: 'Event Label',
            nonInteraction: 1
        }
    }]
});
```
Properties of **gaEventData** can be the real Google Analytics event data names ('eventCategory', 'eventAction', 'eventLabel', 'eventValue', 'nonInteraction')

**It depends on jQuery**
