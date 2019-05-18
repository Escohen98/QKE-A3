//Data source: https://www.kaggle.com/heesoo37/120-years-of-olympic-history-athletes-and-results
d3.csv('https://zbtuw.org/QKE-A3/Data/athlete_events.csv', function(error, data) {
    process_bar(error, data);
    process_scatter(error, data);
    $("#prog").hide();
});
