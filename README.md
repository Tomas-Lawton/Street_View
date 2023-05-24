# Street_View

[Tomas Lawton](tomaslawton.netlify.app), [Marius Hoggenmüller](https://marius.hoggenmueller.com/)

Add Description

Add Image

# Step by Step Installation

To run the application you will need to run both the client and the server. Note if using wsl, wsl1 is much faster than wsl2 for dev.

## Prerequisites

### Node
Download Node from [https://nodejs.org/](https://nodejs.org/)

### Chrome
Download Google Chrome from [https://www.google.com/chrome/](https://www.google.com/chrome/)

### Maps API Key
Get a Google Maps API key from [https://developers.google.com/maps/documentation/javascript/get-api-key](https://developers.google.com/maps/documentation/javascript/get-api-key)

### Clone the project

```
git clone https://github.com/HoggenMari/Street_View.git
cd Street_View/
```

## Server Setup
Open server directory 
```
cd GSV_Server/
```
Install dependencies 
```
npm i
```
Now run
```
npm start
```
Server is now running, so you can connect the client.


## Client Setup
In a new shell, open client directory 
```
cd GSV_Client/
```
Install dependencies 
```
npm i
```
Now run
```
npm start
```
Client is now running, so app is now running automatically. You can also run rpm run dev

## Usage
With the server and client now running, they will automatically sync. 

Navigate to the /user and /moderator routes in seperate Chrome tabs to open the views. 

You will need to add your API key.

```
http://localhost:8081/moderator
```
```
http://localhost:8081/user
```

The default route will route to the user view. You will manually need to change url to enter moderator mode.

# Deployment

Do Stuff

