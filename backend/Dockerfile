FROM golang:1.25.4-alpine

RUN apk add --no-cache git

WORKDIR /app

RUN go install github.com/air-verse/air@latest

CMD ["air"]