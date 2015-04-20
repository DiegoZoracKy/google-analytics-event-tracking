# Google Analytics Event Tracking

**$.googleAnalyticsEventTracking** is a jQuery plugin meant to provide an easy, and lightweight (**.min < 1kb**), way to do exactly what its name says.

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

And here is an example defining multiple elements and events to be tracked, showing its capability to:
- Define more than one event per element.
- Use a function to define the value of a property. The function will expose the jQuery elements **$targetSelector** and **$delegateTo**, in case you need to extract data from the element to be passed on as a value (e.g. $element.text() as a event label).

```javascript
$.googleAnalyticsEventTracking({
    targetSelector: '#formId',
    events: {
        eventType: 'submit',
        gaEventData: {
            category: 'form',
            action: 'submit',
            label: 'Newsletter'
        }
    }
},{
    targetSelector: '.target',
    events: [{
        eventType: 'click',
        gaEventData: {
            category: 'Event category',
            action: 'click',
            label: function($target) {
                return $target.text();
            }
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

### Get Registered Events

You can check which events were registered by calling: $.googleAnalyticsEventTracking.getRegisteredEvents();

In case you have split the registration through multiple files or states and want to check fast what is happening. Just call it on browser console.

**It depends on jQuery**
