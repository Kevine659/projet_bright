import swaggerJSDoc from "swagger-jsdoc";

export const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bright Consulting API",
      version: "1.0.0",
    },
    servers: [
      { url: "http://localhost:3000" }
    ],
    components: {
      securitySchemes: {
        cookieAuth: {
          type: "apiKey",
          in: "cookie",
          name: "sessionId",
        },
      },
    },
    security: [{ cookieAuth: [] }],
  },
  apis: ["./src/app/api/admin/**/*.ts"],
});
