
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE BelongsTo CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE Shows CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE Category CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE Trainer CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE Stats CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE PokemonTrains CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN
   EXECUTE IMMEDIATE 'DROP TABLE PokemonType CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN 
    EXECUTE IMMEDIATE 'DROP TABLE PokemonTeam CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/
BEGIN  
    EXECUTE IMMEDIATE 'DROP TABLE InTeam CASCADE CONSTRAINTS';
EXCEPTION WHEN OTHERS THEN NULL; END;
/


CREATE TABLE PokemonType (
    TypeName VARCHAR(20) PRIMARY KEY,
    Weakness VARCHAR(20),
    Resistance VARCHAR(20),
    Strength VARCHAR(20)
);


INSERT ALL
    INTO PokemonType (TypeName, Weakness, Resistance, Strength) VALUES ('Grass', 'Fire', 'Water', 'Rock')
    INTO PokemonType (TypeName, Weakness, Resistance, Strength) VALUES ('Fire', 'Water', 'Steel', 'Bug')
    INTO PokemonType (TypeName, Weakness, Resistance, Strength) VALUES ('Water', 'Electric', 'Ice', 'Fire')
    INTO PokemonType (TypeName, Weakness, Resistance, Strength) VALUES ('Electric', 'Ground', 'Flying', 'Water')
    INTO PokemonType (TypeName, Weakness, Resistance, Strength) VALUES ('Fairy', 'Poison', 'Fighting', 'Dragon')
SELECT * FROM dual;


CREATE TABLE PokemonTrains (
    PokemonID VARCHAR(20) PRIMARY KEY,
    PokemonName VARCHAR(20) NOT NULL UNIQUE,
    TypeName VARCHAR(20) NOT NULL,
    PokemonGender VARCHAR(20),
    Ability VARCHAR(20),
    TrainerID VARCHAR(20) NOT NULL,
    FOREIGN KEY (TypeName) REFERENCES PokemonType(TypeName) ON DELETE CASCADE
);


INSERT ALL
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0001', 'Bulbasaur', 'Grass', 'F/M', 'Overgrow', '1')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0002', 'Ivysaur', 'Grass', 'F/M', 'Overgrow', '2')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0003', 'Venusaur', 'Grass', 'F/M', 'Overgrow', '3')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0004', 'Charmander', 'Fire', 'F/M', 'Blaze', '2')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0005', 'Charmeleon', 'Fire', 'F/M', 'Blaze', '3')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0006', 'Charizard', 'Fire', 'F/M', 'Blaze', '5')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0007', 'Squirtle', 'Water', 'F/M', 'Torrent', '3')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0009', 'Blastoise', 'Water', 'F/M', 'Torrent', '3')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0025', 'Pikachu', 'Electric', 'F/M', 'Static', '3')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0039', 'Jigglypuff', 'Fairy', 'F/M', 'Cute Charm', '4')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0175', 'Togepi', 'Fairy', 'F/M', 'Hustle', '1')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0666', 'A', 'Grass', 'F/M', 'Hustle', '10')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0777', 'B', 'Fire', 'F/M', 'Hustle', '10')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0888', 'C', 'Water', 'F/M', 'Hustle', '10')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('0999', 'D', 'Electric', 'F/M', 'Hustle', '10')
    INTO PokemonTrains (PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID) VALUES ('1000', 'E', 'Fairy', 'F/M', 'Hustle', '10')
SELECT * FROM dual;


CREATE TABLE Stats (
    StatsID VARCHAR(20) PRIMARY KEY,
    HP INTEGER,
    Attack INTEGER,
    Defense INTEGER,
    SpecialAttack INTEGER,
    SpecialDefense INTEGER,
    Speed INTEGER
);

INSERT ALL
    INTO Stats (StatsID, HP, Attack, Defense, SpecialAttack, SpecialDefense, Speed) VALUES ('0001', 30, 36, 31, 45, 4, 30)
    INTO Stats (StatsID, HP, Attack, Defense, SpecialAttack, SpecialDefense, Speed) VALUES ('0002', 45, 42, 45, 56, 55, 10)
    INTO Stats (StatsID, HP, Attack, Defense, SpecialAttack, SpecialDefense, Speed) VALUES ('0003', 53, 57, 50, 67, 6, 5)
    INTO Stats (StatsID, HP, Attack, Defense, SpecialAttack, SpecialDefense, Speed) VALUES ('0004', 36, 42, 30, 4, 33, 10)
    INTO Stats (StatsID, HP, Attack, Defense, SpecialAttack, SpecialDefense, Speed) VALUES ('0005', 47, 24, 20, 53, 4, 30)
    INTO Stats (StatsID, HP, Attack, Defense, SpecialAttack, SpecialDefense, Speed) VALUES ('0006', 53, 55, 10, 54, 5, 54) 
SELECT * FROM dual;


CREATE TABLE Trainer (
    TrainerID VARCHAR(20),
    TrainerName VARCHAR(20) NOT NULL,
    TrainerGender VARCHAR(20) NOT NULL,
    PRIMARY KEY (TrainerID)
);


INSERT ALL
    INTO Trainer (TrainerID, TrainerName, TrainerGender) VALUES ('1', 'Raihan', 'F')
    INTO Trainer (TrainerID, TrainerName, TrainerGender) VALUES ('2', 'Clair', 'M')
    INTO Trainer (TrainerID, TrainerName, TrainerGender) VALUES ('3', 'Alain', 'M')
    INTO Trainer (TrainerID, TrainerName, TrainerGender) VALUES ('4', 'Iris', 'M')
    INTO Trainer (TrainerID, TrainerName, TrainerGender) VALUES ('10', 'Alex', 'F')
SELECT * FROM dual;



CREATE TABLE Category (
    CategoryName VARCHAR(20) PRIMARY KEY,
    TrainingFocus VARCHAR(20)
);


INSERT ALL
    INTO Category (CategoryName, TrainingFocus) VALUES ('Seed Pokemon', 'Grass-based Tactics')
    INTO Category (CategoryName, TrainingFocus) VALUES ('Bird Pokemon', 'Aerial Maneuvers')
    INTO Category (CategoryName, TrainingFocus) VALUES ('Mouse Pokemon', 'Speed and Agility')
    INTO Category (CategoryName, TrainingFocus) VALUES ('Fox Pokemon', 'Illusion Mastery')
    INTO Category (CategoryName, TrainingFocus) VALUES ('Bat Pokemon', 'Echolocation Tactics')
SELECT * FROM dual;


CREATE TABLE Shows (
    PokemonID VARCHAR(20),
    StatsID VARCHAR(20),
    PRIMARY KEY (PokemonID, StatsID),
    FOREIGN KEY (PokemonID) REFERENCES PokemonTrains (PokemonID) ON DELETE CASCADE,
    FOREIGN KEY (StatsID) REFERENCES Stats (StatsID) ON DELETE CASCADE
);


INSERT ALL
    INTO Shows (PokemonID, StatsID) VALUES ('0001', '0001')
    INTO Shows (PokemonID, StatsID) VALUES ('0002', '0002')
    INTO Shows (PokemonID, StatsID) VALUES ('0003', '0003')
    INTO Shows (PokemonID, StatsID) VALUES ('0004', '0004')
    INTO Shows (PokemonID, StatsID) VALUES ('0005', '0005')
    INTO Shows (PokemonID, StatsID) VALUES ('0175', '0006')
SELECT * FROM dual;


CREATE TABLE BelongsTo (
    CategoryName VARCHAR(20),
    PokemonID VARCHAR(20),
    PRIMARY KEY (CategoryName, PokemonID),
    FOREIGN KEY (CategoryName) REFERENCES Category(CategoryName) ON DELETE CASCADE,
    FOREIGN KEY (PokemonID) REFERENCES PokemonTrains(PokemonID) ON DELETE CASCADE
);


INSERT ALL
    INTO BelongsTo (CategoryName, PokemonID) VALUES ('Seed Pokemon', '0175')
    INTO BelongsTo (CategoryName, PokemonID) VALUES ('Bird Pokemon', '0004')
    INTO BelongsTo (CategoryName, PokemonID) VALUES ('Mouse Pokemon', '0005')
    INTO BelongsTo (CategoryName, PokemonID) VALUES ('Fox Pokemon', '0039')
    INTO BelongsTo (CategoryName, PokemonID) VALUES ('Bat Pokemon', '0003')
    INTO BelongsTo (CategoryName, PokemonID) VALUES ('Seed Pokemon', '0666')
    INTO BelongsTo (CategoryName, PokemonID) VALUES ('Bird Pokemon', '0777')
    INTO BelongsTo (CategoryName, PokemonID) VALUES ('Mouse Pokemon', '0888')
    INTO BelongsTo (CategoryName, PokemonID) VALUES ('Fox Pokemon', '0999')
    INTO BelongsTo (CategoryName, PokemonID) VALUES ('Bat Pokemon', '1000')
SELECT * FROM dual;

CREATE TABLE PokemonTeam (
    TeamID VARCHAR(20) PRIMARY KEY,
    TeamName VARCHAR(20) NOT NULL
);

INSERT ALL
    INTO PokemonTeam (TeamID, TeamName) VALUES ('0001', 'Alpha')
    INTO PokemonTeam (TeamID, TeamName) VALUES ('0002', 'Beta')
    INTO PokemonTeam (TeamID, TeamName) VALUES ('0003', 'Gamma')
    INTO PokemonTeam (TeamID, TeamName) VALUES ('0004', 'Delta')
    INTO PokemonTeam (TeamID, TeamName) VALUES ('0005', 'Epsilon')
    INTO PokemonTeam (TeamID, TeamName) VALUES ('0006', 'Doota')
SELECT * FROM dual;

CREATE TABLE InTeam (
    TeamID VARCHAR(20),
    PokemonID VARCHAR(20),
    PRIMARY KEY (TeamID, PokemonID),
    FOREIGN KEY (TeamID) REFERENCES PokemonTeam(TeamID)
        ON DELETE CASCADE,
    FOREIGN KEY (PokemonID) REFERENCES PokemonTrains(PokemonID)
        ON DELETE CASCADE
);

INSERT ALL 
    INTO InTeam (TeamID, PokemonID) VALUES ('0001', '0175')
    INTO InTeam (TeamID, PokemonID) VALUES ('0002', '0004')
    INTO InTeam (TeamID, PokemonID) VALUES ('0003', '0005')
    INTO InTeam (TeamID, PokemonID) VALUES ('0004', '0039')
    INTO InTeam (TeamID, PokemonID) VALUES ('0005', '0025')
SELECT * FROM dual;

