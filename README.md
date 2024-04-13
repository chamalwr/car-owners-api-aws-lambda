<p>
  <h1 align="center">Car Owner Service - AWS Lambda</h1>
</p>

<p align="center">REST API Built for Demonstration purposes of Very Simple AWS Lambda</p>

## Required Techstack
1. Nodejs 20.xx.xx<br/>
2. Serverless framework version 3<br/>
3. MongoDB Atlas (preferred) or Locally<br/>

# Endpoints
<b> GET </b>     -  <endpoint_url>/owners <br/>
```
/owners?page=1&limit=20 (pagination enabled)

or 

/owners
```
<b>GET</b>     -  <endpoint_url>/{id} <br/>
<b>DELETE</b>  -  <endpoint_url>/owner/{id} <br/>
<b>POST</b>    -  <endpoint_url>/owner<br/>
```
Sample payload structure for POST
       
{
    "name": "Travis Simonis",
    "phone": "(630) 936-4434",
    "title": "Mrs.",
    "car": "Bugatti El Camino"
}
```

# Configure Environment

`.env` file created in the root and should contain properties as below 
```
APPLICATION_PORT=3000

CERT_FILE_PATH=./cert/X509-cert-name.pem
DB_URI=mongodb+srv://<atlas-url>/?authSource=%24external&authMechanism=MONGODB-X509&retryWrites=true&w=majority&appName=<db_cluser_name>
DB=<db_name>
COLLECTION=<db_collection>

```

Create a folder named `cert` in the root directory and place the Certificate in there (Can use a different name also if change the `CERT_FILE_PATH` variable accordingly)

# Run on Locally

```
npm install

serverless offline 

or 

npm run local
```

# Deploy on AWS

Need to configure AWS CLI and Programatically access through the CLI to deploy into AWS

```
serverless deploy
```

<p> Sample dataset is on ./data