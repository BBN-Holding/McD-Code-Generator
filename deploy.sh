docker build -t mcdonalds .
docker stop mcdonalds
docker rm mcdonalds
docker run -d --name mcdonalds mcdonalds
