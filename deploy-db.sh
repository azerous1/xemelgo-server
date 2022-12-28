docker rm -f mongoDB

docker run -d \
    -p 21017:21017 \
    --name mongoDB \
    --network xemelgo-proj
    mongo