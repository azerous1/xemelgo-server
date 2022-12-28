docker pull yichiz5/xemelgo-server

# remove exisitng instance
docker rm -f server_

docker network rm xemelgo-proj

# create a network
docker network create xemelgo-proj

docker run -d \
    -p 443:443 \
    -v /etc/letsencrypt:/etc/letsencrypt:ro \
    --name server_ \
    --network xemelgo-proj \
    yichiz5/xemelgo-server


#optionally re-deploy database and delete all data
docker rm -f xemelgo-db

docker run -d \
    -p 27017:27017 \
    --name xemelgo-db \
    --network xemelgo-proj \
    mongo