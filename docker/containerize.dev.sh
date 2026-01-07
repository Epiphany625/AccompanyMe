#!/bin/bash
set -euo pipefail

# clean up
cd docker
docker-compose -f docker-compose.dev.yaml down --remove-orphans

images=(xinyangxu/appointmentservice xinyangxu/authservice xinyangxu/availabilityservice xinyangxu/userservice xinyangxu/gateway)
existing_images=()
for image in "${images[@]}"; do
  if docker image inspect "$image" >/dev/null 2>&1; then
    existing_images+=("$image")
  fi
done
if [ "${#existing_images[@]}" -gt 0 ]; then
  docker rmi "${existing_images[@]}"
fi


docker-compose -f docker-compose.yaml up -d
sleep 5


# build and push
cd ../packages/gateway
./mvnw -Dspring-boot.build-image.imageName=xinyangxu/gateway spring-boot:build-image
docker push xinyangxu/gateway

cd ../services/AppointmentService
./mvnw -Dspring-boot.build-image.imageName=xinyangxu/appointmentservice spring-boot:build-image
docker push xinyangxu/appointmentservice

cd ../AuthService
./mvnw -Dspring-boot.build-image.imageName=xinyangxu/authservice spring-boot:build-image
docker push xinyangxu/authservice

cd ../AvailabilityService
./mvnw -Dspring-boot.build-image.imageName=xinyangxu/availabilityservice spring-boot:build-image
docker push xinyangxu/availabilityservice

cd ../UserService
./mvnw -Dspring-boot.build-image.imageName=xinyangxu/userservice spring-boot:build-image
docker push xinyangxu/userservice


# re-run the image. 
cd ../../docker
docker-compose -f docker-compose.dev.yaml up
