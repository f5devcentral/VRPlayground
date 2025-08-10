FROM gradle:7.2.0-jdk17 as build

WORKDIR /home/gradle/src
COPY --chown=gradle:gradle . .

RUN gradle build --no-daemon

FROM openjdk:17-slim-bullseye

WORKDIR /usr/src/app
COPY --from=build /home/gradle/src/build/libs/*-SNAPSHOT.jar spring-boot-application.jar

CMD ["java", "-jar","/usr/src/app/spring-boot-application.jar"]