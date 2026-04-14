FROM golang:1.25

WORKDIR /app

# Install modules first (cached layer)
COPY go.mod ./
RUN go mod download

# Copy server source
COPY . .

EXPOSE 4000

CMD ["go", "run", "./cmd/api"]