import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http'; // <-- IMPORTANTE
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // Si tienes provideBrowserGlobalErrorListeners(), mantenlo
    provideRouter(routes),
    provideHttpClient() // <-- NECESARIO PARA CONECTAR CON JAVA
  ]
};
