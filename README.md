# Pokémon Data Management System

A web-based application that provides data-driven insights for Pokémon management, built with Node.js, Express, and Oracle Database.

## Features

- **Pokémon Filter System**: Selection
- **Customizable Data Display**: Projection
- **Trainer Lookup**: Join
- **Browse Pokémon Records**: View all Pokémon data here.
- **Browse Pokémon Stats**: View all Pokémon stats here.
- **Update Pokémon Records**: Update
- **Add Pokémon Database**: Insert (If TypeName not exist in Type table, will be rejected. Affect two table: PokemonType, PokemonTrains)
- **Delete Pokémon By PokemonID**: Delete
- **Reset Pokémon Records**: Reset, run initial.sql
- **Average Attack by Type**: Aggregation with GROUP BY
- **High Defense Types**: Aggregation with HAVING
- **Trainers with Strong Pokémon**: Nested Aggregation
- **Trainers with Pokémon in Every Category** Division


## Environment 

Create a `.env` file in the root directory with the following configuration:
ORACLE_USER=your_username
ORACLE_PASS=your_password
ORACLE_HOST=dbhost.students.cs.ubc.ca
ORACLE_PORT=1522
ORACLE_DBNAME=your_dbname
PORT=your_port_number


## Running the Application

### On UBC Server
```bash
sh remote-start.sh
```

The application will be available at `http://localhost:<PORT>`.

## Project Structure

- `/public` - Static files (HTML, CSS, client-side JavaScript)
- `/utils` - Utility functions
- `appService.js` - Database service layer
- `appController.js` - Application controllers
- `server.js` - Express server configuration

## Database Operations

The application supports various database operations including:
- Selection (filtering)
- Projection (attribute selection)
- Join operations (trainer-pokemon relationships)

## Technologies Used

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: Oracle DB
- Development Tools: Git







