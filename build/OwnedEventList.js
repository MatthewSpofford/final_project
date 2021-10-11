import React from "./_snowpack/pkg/react.js";
import ConflictSchedule from "./ConflictSchedule.js";
class OwnedEventList extends React.Component {
  async load() {
    const response = await fetch("/ownedEvents", {
      headers: {
        "Cache-Control": "no-cache"
      }
    });
    const jsonResponse = await response.json();
    const updatedEvents = jsonResponse.events;
    const eventInput = {};
    for (const event of jsonResponse.events) {
      let pendingAttendees = [];
      for (const attendee of event.attendees) {
        let notAccepted = true;
        for (const acceptedAttendee of event.attendeesAvailability) {
          if (acceptedAttendee.name === attendee) {
            notAccepted = false;
            break;
          }
        }
        if (notAccepted) {
          pendingAttendees.push(attendee);
        }
      }
      event.pendingAttendees = pendingAttendees;
      eventInput[event._id] = {
        description: event.description,
        attendees: event.attendees.join(","),
        location: event.location,
        chosenEventDate: event.chosenEventDate,
        chosenStartTime: event.chosenStartTime
      };
    }
    this.setState({
      events: updatedEvents,
      username: jsonResponse.username,
      eventInputs: eventInput
    });
  }
  constructor(props) {
    super(props);
    this.state = {
      events: [],
      username: "",
      eventInputs: {}
    };
    this.load();
    this.editEvent = this.editEvent.bind(this);
    this.onChange = this.onChange.bind(this);
    this.selectDate = this.selectDate.bind(this);
  }
  onChange(target, eventID) {
    const eventInputs = this.state.eventInputs;
    eventInputs[eventID][target.name] = target.value;
    this.setState({
      eventsInputs: eventInputs,
      username: this.state.username,
      events: this.state.events
    });
  }
  selectDate(eventID, chosenEventDate, chosenStartTime) {
    let eventInputs = this.state.eventInputs;
    let chosenDate = new Date(chosenEventDate);
    let chosenTime = Number(chosenStartTime);
    chosenDate.setHours(Math.floor(chosenTime));
    chosenDate.setMinutes(chosenTime * 10 % 10 == 5 ? 30 : 0);
    eventInputs[eventID]["chosenEventDate"] = chosenDate;
    eventInputs[eventID]["chosenStartTime"] = chosenTime;
  }
  async editEvent(eventID) {
    let attendeesList = this.state.eventInputs[eventID]["attendees"].replace(/\s/g, "").split(",");
    let eventDate = this.state.eventInputs[eventID]["chosenEventDate"];
    let startTime = -1;
    if (eventDate === "null") {
      eventDate = null;
      startTime = null;
    } else {
      startTime = this.state.eventInputs[eventID]["chosenStartTime"];
    }
    const json = {
      eventID,
      chosenEventDate: eventDate,
      chosenStartTime: startTime,
      description: this.state.eventInputs[eventID]["description"],
      location: this.state.eventInputs[eventID]["location"],
      attendees: attendeesList
    }, body = JSON.stringify(json);
    await fetch("/editEvent", {
      method: "POST",
      body,
      headers: {
        "Content-Type": "application/json"
      }
    });
    window.location.reload();
  }
  render() {
    return /* @__PURE__ */ React.createElement(React.Fragment, null, this.state.events.map((event) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("form", {
      id: event._id
    }, /* @__PURE__ */ React.createElement("h3", null, event.eventName), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("label", {
      for: "description" + event._id
    }, "Description:"), /* @__PURE__ */ React.createElement("textarea", {
      id: "description" + event._id,
      form: event._id,
      name: "description",
      onChange: (e) => this.onChange(e.target, event._id)
    }, event.description), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("label", {
      for: "location" + event._id
    }, "Location:"), /* @__PURE__ */ React.createElement("input", {
      id: "location" + event._id,
      form: event._id,
      name: "location",
      onChange: (e) => this.onChange(e.target, event._id)
    }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("label", {
      for: "attendees" + event._id
    }, "Attendees:"), /* @__PURE__ */ React.createElement("textarea", {
      id: "attendees" + event._id,
      form: event._id,
      name: "attendees",
      onChange: (e) => this.onChange(e.target, event._id)
    }, event.attendees.join(", ")), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement("p", null, "Accepted Invites:"), /* @__PURE__ */ React.createElement("ul", null, event.attendeesAvailability.map((availability) => /* @__PURE__ */ React.createElement("li", null, availability.name))), /* @__PURE__ */ React.createElement("p", null, "Pending Invites:"), /* @__PURE__ */ React.createElement("ul", null, event.pendingAttendees.length <= 0 ? /* @__PURE__ */ React.createElement("li", null, "No pending Invitations") : /* @__PURE__ */ React.createElement(React.Fragment, null, event.pendingAttendees.map((attendee) => /* @__PURE__ */ React.createElement("li", null, attendee))))), /* @__PURE__ */ React.createElement(ConflictSchedule, {
      event,
      owner: this.state.username,
      selectDate: this.selectDate
    }), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("br", null), /* @__PURE__ */ React.createElement("button", {
      type: "button",
      onClick: (e) => this.editEvent(event._id.toString())
    }, "Edit Event"), /* @__PURE__ */ React.createElement("hr", null)))));
  }
}
export default OwnedEventList;
