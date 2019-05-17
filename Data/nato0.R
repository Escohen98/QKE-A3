data <- read.csv("athlete_events.csv", stringsAsFactors=FALSE)
data[is.na(data)]<-0
head(data)
write.table(data, "athlete_events0.csv", row.names=FALSE)