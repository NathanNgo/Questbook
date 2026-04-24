FROM golang:1.25.4-alpine

RUN apk add --no-cache git

WORKDIR /app

ENV GOPROXY=https://proxy.golang.org,direct

COPY go.mod go.sum ./
RUN go mod download

COPY . .

CMD ["go", "tool", "air", "-c", ".air.toml"]