# Google Analytics Event Tracking

**GoogleAnalyticsEventTracking** is a jQuery plugin meant to provide an easy, and lightweight (**.min ~ 1kb**), way to do exactly what its name says.

## The goal

Define the elements and events to be tracked, along with its respective Google Analytics event data, in an well structured way, easy to maintain, and avoiding repetitive code (DRY!)

## Usage

This is an basic example of how you can setup the plugin:

```javascript
GoogleAnalyticsEventTracking({
  // 'delegateTo' is optional. Useful for elements created dynamically
  delegateTo: ".root-element-to-handle-event",
  targetSelector: ".something.created .dynamically",
  events: {
    eventType: "click",
    gaEventData: {
      category: "Event Category",
      action: "Event Action",
      label: "Event Label"
    }
  }
});
```

And here is an example defining multiple elements and events to be tracked, showing its capability to:

- Define more than one event per element.
- Use a function to define the value of a property. The function will expose the element **targetSelector** and seletor **delegateTo**, in case you need to extract data from the element to be passed on as a value (e.g. element.textContent as a event label).
- Express a conditional statement, per event, to send data for google analytics

```javascript
GoogleAnalyticsEventTracking(
  {
    targetSelector: "#formId",
    events: {
      eventType: "submit",
      gaEventData: {
        category: "form",
        action: "submit",
        label: "Newsletter"
      },
      conditional: function() {
        return $("body").is(".someSpecificLandingPage");
      }
    }
  },
  {
    targetSelector: ".target",
    events: [
      {
        eventType: "click",
        gaEventData: {
          category: "Event category",
          action: "click",
          label: function($target) {
            return $target.textContent;
          }
        }
      },
      {
        eventType: "mouseenter",
        gaEventData: {
          category: "Event category",
          action: "open",
          label: "Event Label",
          nonInteraction: 1
        }
      }
    ]
  }
);
```

Properties of **gaEventData** can be the real Google Analytics event data names ('eventCategory', 'eventAction', 'eventLabel', 'eventValue', 'nonInteraction')

### Debug Mode

To test your application without send data to Google Analytics, execute:
GoogleAnalyticsEventTracking.**setDebugMode**(true);

In this mode, all data that will be send to Google Analytics will be logged on console. To disable the debug mode:
GoogleAnalyticsEventTracking.**setDebugMode**(false);

### Get Registered Events

You can check which events were registered by calling: GoogleAnalyticsEventTracking.**getRegisteredEvents**();

In case you have split the registration through multiple files or states and want to check fast what is happening. Just call it on browser console.

**It depends on only ga defined**
