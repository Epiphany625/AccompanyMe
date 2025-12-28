frontend folder: Uses React + Redux + TypeScript, 
- Important Notes for frontend: 
- interface.ts / constants.ts: If you need to create or if you predict interfaces / types / constants that are shared with multiple components, initialize them here. If the type / constant is only used locally within one component, please intialize within that component. 
- Reuse the var and styles in design-systems if applicable. Avoid creating jams of CSS code, especially for coloring, font style, and gaps. 
gateway folder: SpringBoot API Gateway. If new service is added, be sure to edit the application.properties in this folder to ensure correct routing. 
registry folder: SpringBoot server registry that uses Eureka. 
Service: Microservices folder that include authentication (AuthService), user profile service (UserService). 