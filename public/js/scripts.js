const myCalendar = new TavoCalendar('#my-calendar',
    {date: "2021-10-1"})

const loadEvents = function(){
    
    fetch( '/loadEvents', {
        method:'POST',
        headers: {
            'Content-Type': 'application/json'
        }
      })
      .then(function(response){
        return response.json()
    })
      .then(function(json){
        
        let table = document.getElementById("eventsTable")
        let rowCount = table.rows.length;

        for (let count = 1; count < rowCount; count++) {
            table.deleteRow(1);
        }

        for(let count = 0; count < json.length; count++){
            let tr = document.createElement("tr")
            let td = document.createElement("td")
            let td2 = document.createElement("td")
            let item = document.createTextNode(json[count].eventName)
            td.appendChild(item)
            tr.appendChild(td)
            
            item = document.createElement("a")
            let button = document.createElement("button")
            button.innerHTML = "Click for ics"
            
            item.appendChild(button)

            //initializer(json[count])            
            let file = createFile(json[count])
            item.setAttribute("href", file)
            
            item.setAttribute("download", "event.ics")

            td2.appendChild(item)
            tr.appendChild(td2)
            
            table.append(tr)
        }
      })
}

const initializer = function(event) {
    let startDate = event.availableDates[0] = new Date();
    let endDate = event.availableDates[event.availableDates.length - 1] = new Date();
    endDate = event.availableDates[event.availableDates.length - 1].min = new Date()
      .toISOString()
      .substr(0, 10);
    //startDate.addEventListener("change", function() {
      //let val = this.value;
      //endDate.min = new Date(val)
        //.toISOString()
        //.substr(0, 10);
    //});
  };

  const createFile = function(event) {
    let eventDate = {
        start: event.availableDates[0],
        end: event.availableDates[event.availableDates.length - 1]
      },
      summary = event.eventName,
      description = event.description
     return makeIcsFile(eventDate, summary, description);
    //downloadButton.classList.remove("hide");
  }
  function convertDate(date) {
    var event = new Date(date).toISOString();
    event = event.split("T")[0];
    event = event.split("-");
    event = event.join("");
    return event;
  }
  function makeIcsFile(date, summary, description) {
    let icsFile = null;
    let test =
      "BEGIN:VCALENDAR\n" +
      "CALSCALE:GREGORIAN\n" +
      "METHOD:PUBLISH\n" +
      "PRODID:-//Test Cal//EN\n" +
      "VERSION:2.0\n" +
      "BEGIN:VEVENT\n" +
      "UID:test-1\n" +
      "DTSTART;VALUE=DATE:" +
      convertDate(date.start) +
      "\n" +
      "DTEND;VALUE=DATE:" +
      convertDate(date.end) +
      "\n" +
      "SUMMARY:" +
      summary +
      "\n" +
      "DESCRIPTION:" +
      description +
      "\n" +
      "END:VEVENT\n" +
      "END:VCALENDAR";
  
    let data = new File([test], { type: "text/plain" });
  
    // If we are replacing a previously generated file we need to
    // manually revoke the object URL to avoid memory leaks.
    if (icsFile !== null) {
      window.URL.revokeObjectURL(icsFile);
    }
  
    icsFile = window.URL.createObjectURL(data);
  
    return icsFile;
  }

  
  

window.onload = function(){
    loadEvents()
    
}