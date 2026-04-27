# CashstackFrontend

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 21.2.7.

## Desarrollo local

Para iniciar el servidor de desarrollo:

```bash
npm install
ng serve
```

Accede a `http://localhost:4200/`.

## Docker (Producción)

### Build de la imagen

```bash
docker build -t cashstack-frontend .
```

### Ejecutar el contenedor

```bash
docker run -p 4200:80 cashstack-frontend
```

Accede a `http://localhost:4200`.

### Con Docker Compose

```bash
docker-compose up
```

## Tests

Ejecutar tests unitarios:

```bash
ng test
```
