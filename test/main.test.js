/* global describe, it, before, expect */
require("mocha");
global.expect = require("chai").expect;
const JSDOM = require("jsdom").JSDOM;
const GAMogule = require("../main");

const template = `
<div id="mocha">
  <button class="click-me">Click event</button>
  <div>
    <input type="text" name="name" value="name" />
    <button class="catch-num">Submit</button>
  </div>
</div>
`;
const dom = new JSDOM(template, {
  url: "http://localhost"
});

let outputEvents;

global.ga = function(label, props) {
  outputEvents = [label, props];
};
global.window = dom.window;
global.document = dom.window.document;

describe("Google Analitics Event Tracking", function() {
  var GoogleAnalyticsEventTracking;

  before(function() {
    GoogleAnalyticsEventTracking =
      new GAMogule({
        trackerName: "zoomlocal",
        events: [
          {
            delegateTo: "#mocha",
            targetSelector: ".click-me",
            events: {
              eventType: "click",
              gaEventData: {
                category: "Event Category",
                action: "Event Action",
                label: "Event Label"
              }
            }
          }
        ]
      }) || window.GoogleAnalyticsEventTracking;
  });

  it("It works", function() {
    expect(GoogleAnalyticsEventTracking.debugMode).to.eql(false);
    GoogleAnalyticsEventTracking.setDebugMode(true);
    expect(GoogleAnalyticsEventTracking.debugMode).to.eql(true);
    GoogleAnalyticsEventTracking.setDebugMode(false);
  });

  it("Should get all events registered", function() {
    expect(GoogleAnalyticsEventTracking.getRegisteredEvents().length).to.eql(1);
    let count = 0;

    GoogleAnalyticsEventTracking.addNewEvent({
      delegateTo: "#mocha",
      targetSelector: ".catch-num",
      events: {
        eventType: "click",
        gaEventData: {
          category: "Event Submit Category",
          action: "Event Submit Action",
          label: target => {
            count += 1;
            target.setAttribute("data-count", count);
            return count;
          }
        }
      }
    });

    expect(GoogleAnalyticsEventTracking.getRegisteredEvents().length).to.eql(2);
  });

  it("Should click button - first event", function() {
    document.querySelector("#mocha .click-me").click();
    expect(outputEvents).to.eql([
      "zoomlocal.send",
      {
        hitType: "event",
        eventCategory: "Event Category",
        eventAction: "Event Action",
        eventLabel: "Event Label"
      }
    ]);
  });
  it("Should click button 1 - Catch num of times clicked in button", function() {
    document.querySelector("#mocha .catch-num").click();
    expect(outputEvents).to.eql([
      "zoomlocal.send",
      {
        hitType: "event",
        eventCategory: "Event Submit Category",
        eventAction: "Event Submit Action",
        eventLabel: 1
      }
    ]);
  });
  it("Should click button 2 - Catch num of times clicked in button", function() {
    document.querySelector("#mocha .catch-num").click();
    expect(outputEvents).to.eql([
      "zoomlocal.send",
      {
        hitType: "event",
        eventCategory: "Event Submit Category",
        eventAction: "Event Submit Action",
        eventLabel: 2
      }
    ]);
  });
});
