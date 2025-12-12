FROM golang:1.25

WORKDIR /app

# Install modules first (cached)
COPY /go.mod ./
RUN go mod download

# Copy the server code
COPY . .

EXPOSE 4000

# Dev command - rebuilds on changes when restarted; for hot reload
CMD ["go", "run", "./cmd/api"]
