data <- read.csv("athlete_events.csv", stringsAsFactors=FALSE)
#data$Medal[is.na(data$Medal)]<-"None"
#data[is.na(data)]<-0
print(length(unique(data$Sport)))
write.table(data, "athlete_events0.csv", row.names=FALSE)
weight <- data$Weight[!is.na(data$Weight)]
height <- data$Height[!is.na(data$Height)]
#max(height)
#min(height)
#max(width)
#min(width)
#