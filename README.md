# Text-to-Video Generator Website

A basic text-to-video generator website that uses fal.ai's API key, built with React, Express.js and Node.js. Currently configured to use the [LTX Video](https://fal.ai/models/fal-ai/ltx-video), but can be modified to work with other fal.ai models.

## Setup

### 1. Clone the Repository
```bash
git clone https://github.com/enesyylmaz/text-to-video-generator.git
cd text-to-video-generator
```

### 2. Install Dependencies

Install dependencies in both client and server folders:

```bash
cd client
npm install
```

```bash
cd ../server
npm install
```

### 3. Environment Setup
Create a `.env` file in the server folder and add your fal.ai API key:
```
FAL_KEY=your_api_key_here
```

## Development Mode
In the root folder:
```bash
npm install
npm start
```

This will start:
- Client on http://localhost:3000
- Server on http://localhost:5000

## Deployment

### Build the Client
```bash
cd client
npm run build
```

### Start Production Server
```bash
cd ../server
npm start
```

Now the website will be running on http://localhost:5000 with the client build served by the Express.js server.
