FROM openjdk:17
EXPOSE 8080
ARG JAR_FILE=target/portfolioM-0.0.1-SNAPSHOT.jar
ADD ${JAR_FILE} application.jar
ENTRYPOINT ["java","-jar","/application.jar"]