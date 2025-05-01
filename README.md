# Sistema de Gestión y Pedidos para Heladería

## Equipo de Desarrollo

| Nombre                                     | Rol             |
|-------------------------------------------|------------------|
| Kevin Fernando Portillo Avelar            | Coordinador      |
| Gabriel Alejandro Contreras Cruz          | Subcoordinador   |
| Franklin Alejandro Reyes Melgar           | Tesorero         |
| Adriel Levi Moreno Solano                 | Secretario       |
| Diego Alberto Arriaza Santos              | Vocal            |

---

## Descripción del Proyecto

Actualmente, el negocio toma pedidos en papel, lo que limita el control y la eficiencia. Se busca implementar un sistema digital similar a los kioscos de McDonald’s, permitiendo a los clientes hacer pedidos de forma visual y rápida. 

También desean mostrar sus productos de forma accesible, como lo hace Pedidos Ya, incluyendo helados, waffles, mini pancakes, entre otros.

Reciben pedidos por Messenger e Instagram, pero desean centralizar este proceso. El sistema también debe contemplar la expansión a futuras sucursales, permitir registrar clientes frecuentes con sus preferencias y manejar precios dinámicos según sabores.

A nivel interno, se busca mejorar el control del negocio mediante una plataforma web que incluya:

- Gestión de inventario
- Registro de caja chica
- Roles diferenciados

El Super Admin (dueño) tendrá acceso completo, mientras que los empleados tendrán acceso limitado a la gestión de pedidos e inventario, sin acceso a la información financiera.

El sitio web contará con las siguientes secciones:

- Sobre nosotros
- Delivery
- Toma de órdenes
- Administración

También se integrarán pagos en línea y mostrará la ubicación del local.

---

## Tecnologías Utilizadas

### MongoDB

MongoDB es una de las bases de datos NoSQL más sorprendentes que se conoce y está orientada a documentos. Una base de datos MongoDB se puede utilizar para almacenar los datos de la aplicación, cada registro es un documento que consta de pares clave-valor que son similares a los objetos JSON (JavaScript Object Notation). MongoDB es flexible y permite a sus usuarios crear esquemas, bases de datos, tablas, etc sin los requerimientos de una pesada base de datos SQL.

### Express.js

Express JS es un marco que se ha superpuesto en la parte superior de Node JS y se puede utilizar para crear el backend del sitio web con la ayuda de las estructuras y funciones de Node JS. Sin embargo, como Node JS está destinado a ejecutar JavaScript del lado servidor, pero no para desarrollar sitios web, Express JS está destinado justo a esto, a crear sitios web.

### React.js

React JS es básicamente una biblioteca creada por Facebook que se está utilizando ampliamente para crear componentes de interfaz de usuario en la actualidad. Esto puede ayudarnos a crear interfaces de usuario atractivas para nuestras aplicaciones web de una sola página.

### Node.js

Este es un entorno de ejecución para JavaScript que puede permitirle ejecutar JavaScript del lado servidor y no en un navegador. Un interesante concepto a tener en cuenta en Node.js es el concepto de módulo, recursos que pueden ser más o menos simples o complejos en funcionalidad y que contiene un código JavaScript que podemos reutilizar en toda nuestra aplicación. Estos módulos tienen su propio contexto y no interfieren entre sí. Esto es una notable ventaja pues podemos crear nuestro proyecto a medida sin complicaciones, sorpresas ni comportamientos inesperados.

