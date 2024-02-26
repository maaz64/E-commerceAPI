
# EcommerceAPI(MySQL)

## Project Description

The E-Commerce API is a Node.js and Express.js-based application designed to serve as the backend for an online store. It seamlessly integrates with a MySQL database to manage and retrieve product information, handle user authentication.

## Key Features

- **Product Management**: Easily add, update, and delete products through a robust product management system.

- **User Authentication**: Secure user authentication and authorization to protect sensitive information and ensure a personalized shopping experience.

- **Order Processing**: Streamlined order processing and management for efficient handling of customer purchases.

- **RESTful API**: Built on the principles of RESTful architecture for easy integration with various frontend frameworks and applications.

- **MySQL Database Integration**: Utilizes MySQL to store and retrieve product, user, and order information, ensuring data consistency and reliability.

- **Scalable and Maintainable**: Designed with scalability and maintainability in mind to accommodate the growth of your E-Commerce platform.


## How to Install and Run the Project

- Clone the repository to your local machine by running `git clone https://github.com/maaz64/E-commerceAPI.git`
- Run `cd ./E-commerceAPI` in terminal to open your project directory
- Run `npm install` to install all the packages.
- create a .env file and define a environment variable 'SECRETKEY' for generating JWT token.
- Go to config/db-config.js file and  change the MySQL database configuration to your MySQL database configuration.
- npm start


## API Documentation
https://documenter.getpostman.com/view/24002220/2sA2rDwLm2

## Challange Faced

In the development of a cart API, the challenge arose when needing to store multiple product data in a cart within a MySQL database, which lacks native support for arrays of objects. To address this, a solution involved creating a separate table named CartProduct. This table has foreign keys CartId and orderId, establishing a one-to-many relationship between a cart and CartProduct table. The presence of a null orderId signifies products in the cart, while a non-null value indicates an ordered product. This design allows for scalability, flexibility, and efficient retrieval of cart-specific product data.


