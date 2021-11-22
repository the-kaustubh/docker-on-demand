FROM golang:1.15.13

WORKDIR /app

COPY . .

RUN go mod init app

RUN go mod tidy

RUN go clean

RUN mkdir output -p

CMD [ "go", "build", "-o", "output/main" ]
