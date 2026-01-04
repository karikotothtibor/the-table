import swaggerJSDoc from "swagger-jsdoc";

const options = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "The Table API",
            version: "1.0.0",
            description: "Backend API dokumentáció",
        },
        servers: [
      {
        url: "http://localhost:3300",
      },
    ],
    },
    apis: ["./index.js", "./controller/*.js"]
}

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;