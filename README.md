# Game of Cybersecurity [EPITECH PROJET] [DOCUMENTATION]
# Installation and Run
> There are 2 options to run

## Docker Installation
* **Install Docker**
```sh
$ winget install Docker.DockerDesktop
```

* **Build the project**
```sh
$ docker-compose build
```

* **Run the project**
```sh
$ docker-compose up
```
> **Navigate in http://localhost:3000/ for client && http://localhost:5000/ for server**

## ReactJS and Flask Installation

**Download Packages**

```sh
cd web_client && npm install
```
**Run**

```sh
cd web_client && npm run dev
```
>Runs the app in the development mode.
Open http://localhost:3000 to view it in the browser.
The page will reload if you make edits.
You will also see any lint errors in the console.

# Installation / Execution Flask

**Download Packages**

```sh
cd server && pip install -r requirements.txt
```

**Run Server**

```sh
cd server && flask run
```

> **Navigate in http://localhost:5000/**
