mv .env .env.temp
mv .env.production .env
docker build -t spencerkasper/spencer-katie-wedding-website .
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin 771384749710.dkr.ecr.us-east-1.amazonaws.com
docker tag spencerkasper/spencer-katie-wedding-website:latest 771384749710.dkr.ecr.us-east-1.amazonaws.com/spencer-katie-wedding/spencer-katie-wedding-website:latest
docker push 771384749710.dkr.ecr.us-east-1.amazonaws.com/spencer-katie-wedding/spencer-katie-wedding-website:latest
mv .env .env.production
mv .env.temp .env
