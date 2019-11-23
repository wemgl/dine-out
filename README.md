# Dine Out
A restaurant discovery application for users to discover and rate
restaurants that they've eaten at, or plan to visit.

![Dine Out Screenshot](https://imgur.com/yU9cPHg)

## Setup
Download and install:
1. Node.js
2. Docker

Afterwards, export the following environment variables from
either your `.bash_profile`, `.bashrc`, `.zshrc`, or other
terminal configuration file:
```
export GOOGLE_MAPS_API_KEY=""
export MONGO_INITDB_ROOT_USERNAME=""
export MONGO_INITDB_ROOT_PASSWORD=""
export ME_CONFIG_MONGODB_ADMINUSERNAME=""
export ME_CONFIG_MONGODB_ADMINPASSWORD=""
``` 
NOTE: Provide values for each variable before running the
application.

Next, in order for restaurant rating history to be preserved after
application restarts, create a directory somewhere in your filesystem
that allows Docker to read and write a volume. On macOS I did the following:
```
$ sudo mkdir -p /usr/local/mongo/data/db
$ sudo chown -R wembleyleach:admin /usr/local/mongo
$ sudo chmod -R 775 /usr/local/mongo
```
Alternatively, remove the `volumes` configuration from the `mongo` service in the
`docker-compose.yml` file if you don't really care about this feature.

Finally, run `docker-compose up --build -d` from the root
of the project directory to start the application. This command downloads
the dependencies for both the frontend and backend applications and
starts listing for requests on port 8080. 

Visit http://localhost:8080/ to get started dining out.

### View logs
```
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Stop the application
```
docker-compose down
```
