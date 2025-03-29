CREATE TABLE Trainer (
    TrainerID VARCHAR(20),
    TrainerName VARCHAR(20) NOT NULL,
    TrainerGender VARCHAR(20) NOT NULL,
    PRIMARY KEY (TrainerID)
);

INSERT INTO Trainer (TrainerID, TrainerName, TrainerGender)
VALUES 
    ('1', 'Raihan', 'F'),
    ('2', 'Clair', 'M'),
    ('3', 'Alain', 'M'),
    ('4', 'Iris', 'M'),
    ('5', 'Diantha', 'F'),
    ('6', 'Cynthia', 'F');


CREATE TABLE BeginningTrainer (
    TrainerID VARCHAR(20),
    PrimarySkill VARCHAR(20),
    PRIMARY KEY (TrainerID)
);

INSERT INTO BeginningTrainer (TrainerID, PrimarySkill)
VALUES 
    ('8', 'Combat'),
    ('10', NULL),
    ('11', 'Survival'),
    ('12', NULL),
    ('13', 'Stealth'),
    ('14', NULL);

CREATE TABLE AdvancedTrainer (
    TrainerID VARCHAR(20),
    AdvancedSkill VARCHAR(20) NOT NULL,
    PRIMARY KEY (TrainerID)
);

INSERT INTO AdvancedTrainer (TrainerID, AdvancedSkill)
VALUES 
    ('1', 'Charm'),
    ('2', 'Focus'),
    ('3', 'Intuition'),
    ('4', 'Perception'),
    ('5', 'Medicine'),
    ('6', 'Command');

InTeam (TeamID:VARCHAR(20), PokemonID:VARCHAR(20)) reference PokemonTeam, PokemonTrains
CREATE TABLE InTeam (
    TeamID VARCHAR(20),
    PokemonID VARCHAR(20),
    PRIMARY KEY (TeamID, PokemonID),
    FOREIGN KEY (TeamID) REFERENCES PokemonTeam(TeamID)
    ON DELETE CASCADE,
    FOREIGN KEY (PokemonID) REFERENCES Pokemon(PokemonID) 
    ON DELETE CASCADE
);

INSERT INTO InTeam (TeamID, PokemonID)
VALUES 
    ('1', '0175'),
    ('2', '0004'),
    ('3', '0005'),
    ('4', '0039'),
    ('5', '0025'),
    ('6', '0007');
BelongsTo (PokemonID:VARCHAR(20), CategoryName:VARCHAR(20)) reference PokemonTrains
CREATE TABLE BelongsTo (
 CategoryName VARCHAR(20),
 PokemonID VARCHAR(20),
 PRIMARY KEY (CategoryName, PokemonID),
 FOREIGN KEY (CategoryName) REFERENCES Category(CategoryName) 
 ON DELETE CASCADE,
  FOREIGN KEY (PokemonID) REFERENCES Pokemon(PokemonID) ON 
DELETE CASCADE
);

INSERT INTO BelongsTo (CategoryName, PokemonID)
VALUES 
    ('Spike Ball', '0175'),
    ('Lizard', '0004'),
    ('Flame', '0005'),
    ('Balloon', '0039'),
    ('Mouse', '0025'),
    ('Tiny Turtle', '0007');

Gym(GymName, Badge, Region) 
CREATE TABLE Gym (
    GymName VARCHAR(20) PRIMARY KEY,
    Badge VARCHAR(20) NOT NULL,
    Region VARCHAR(20) NOT NULL
);

INSERT INTO Gym (GymName, Badge, Region)
VALUES 
    ('Pewter Gym', 'Boulder Badge', 'Kanto'),
    ('Cerulean Gym', 'Cascade Badge', 'Kanto'),
    ('Nacrene Gym', 'Basic Badge', 'Unova'),
    ('Aspertia Gym', 'Basic Badge', 'Unova'),
    ('Hulbury Stadium', 'Water Badge', 'Galar'),
    ('Cascarrafa Gym', 'Water Badge', 'Paldea');

RegionTypeBadge(Region, Type, Badge) 
CREATE TABLE RegionTypeBadge (
    Region VARCHAR(20),
    Type VARCHAR(20),
    Badge VARCHAR(20) NOT NULL,
    PRIMARY KEY (Region, Type)
);

INSERT INTO RegionTypeBadge (Region, Type, Badge)
VALUES 
    ('Kanto', 'Rock', 'Boulder Badge'),
    ('Kanto', 'Water', 'Cascade Badge'),
    ('Hoenn', 'Rock', 'Stone Badge'),
    ('Unova', 'Grass', 'Trio Badge'),
    ('Unova', 'Water', 'Trio Badge'),
    ('Unova', 'Fire', 'Trio Badge'),
    ('Unova', 'Normal', 'Basic Badge');

GymLeader(LeaderName, Type, GymName) GymName reference Gym
CREATE TABLE GymLeader (
    LeaderName VARCHAR(20) PRIMARY KEY,
    Type VARCHAR(20) NOT NULL,
    GymName VARCHAR(20) NOT NULL,
    FOREIGN KEY (GymName) REFERENCES Gym(GymName)
);

INSERT INTO GymLeader (LeaderName, Type, GymName)
VALUES 
    ('Cilan', 'Grass', 'Striaton Gym'),
    ('Chili', 'Fire', 'Striaton Gym'),
    ('Cress', 'Water', 'Striaton Gym'),
    ('Nessa', 'Water', 'Hulbury Stadium'),
    ('Koga', 'Poison', 'Fuchsia Gym'),
    ('Janine', 'Poison', 'Fuchsia Gym');


PokemonTrains(PokemonID, PokemonName, TypeName, PokemonGender, Ability, TrainerID)  TrainerID reference Trainer, TypeName reference Type 
CREATE TABLE PokemonTrains (
    PokemonID VARCHAR(20) PRIMARY KEY,
    PokemonName VARCHAR(20) NOT NULL UNIQUE,
    TypeName VARCHAR(20) NOT NULL,
    PokemonGender VARCHAR(20),
    Ability VARCHAR(20),
    TrainerID VARCHAR(20) NOT NULL,
    FOREIGN KEY (TypeName) REFERENCES Type(TypeName) ON 
DELETE CASCADE
);

INSERT INTO PokemonTrains (PokemonID, PokemonName, TypeName, 
PokemonGender, 
Ability, TrainerID)
VALUES 
    ('0175', 'Togepi', 'Fairy', 'F/M', 'Hustle', '1'),
    ('0004', 'Charmander', 'Fire', 'F/M', 'Blaze', '2'),
    ('0007', 'Squirtle', 'Water', 'F/M', 'Torrent', '3'),
    ('0025', 'Pikachu', 'Electric', 'F/M', 'Static', '3'),
    ('0035', 'Clefairy', 'Fairy', 'F/M', 'Cute Charm', '4'),
    ('0039', 'Jigglypuff', 'Fairy', 'F/M', 'Cute Charm', '4');




Type (TypeName, Weakness, Resistance, Strength)
CREATE TABLE Type (
    TypeName VARCHAR(20) PRIMARY KEY,
    Weakness VARCHAR(20),
    Resistance VARCHAR(20),
    Strength VARCHAR(20)
);

INSERT INTO Type (TypeName, Weakness, Resistance, Strength)
VALUES 
    ('Grass', 'Fire', 'Water', 'Rock'),
    ('Fire', 'Water', 'Steel', 'Bug'),
    ('Water', 'Electric', 'Ice', 'Fire'),
    ('Normal', 'Fighting', 'Ghost', NULL),
    ('Fighting', 'Flying', 'Bug', 'Normal'),
    ('Ghost', 'Dark', 'Poison', 'Psychic');


PokemonTeam (TeamID:VARCHAR(20), TeamName:VARCHAR(20))
CREATE TABLE PokemonTeam (
    TeamID VARCHAR(20) PRIMARY KEY,
    TeamName VARCHAR(20) NOT NULL
);

INSERT INTO PokemonTeam (TeamID, TeamName)
VALUES 
    ('0001', 'Alpha'),
    ('0002', 'Beta'),
    ('0003', 'Gamma'),
    ('0004', 'Delta'),
    ('0011', 'Doota'),
    ('0005', 'Epsilon');






EvolutionCan (EvolutionName:VARCHAR(20), Stage:INTEGER, PokemonID:VARCHAR(20)) reference PokemonTrains, InTeam
CREATE TABLE EvolutionCan (
    EvolutionName VARCHAR(20),
    Stage INTEGER,
    PokemonID VARCHAR(20),
    PRIMARY KEY (EvolutionName, PokemonID),
    FOREIGN KEY (PokemonID) REFERENCES Pokemon(PokemonID) ON 
DELETE CASCADE
);

INSERT INTO EvolutionCan (EvolutionName, Stage, PokemonID)
VALUES 
    ('Mega Venusaur', 1, '0003'),
    ('Gigantamax Venusaur', 2, '0003'),
    ('Mega Charizard X', 1, '0006'),
     ('Mega Charizard Y', 2, '0006'),
    ('Mega Charizard Z', 2, '0011'),
    ('Gigantamax Charizard', 3, '0006');


Location(LocationID:VARCHAR(20), LocationName:VARCHAR(20), Region:VARCHAR(20))
CREATE TABLE Location (
    LocationID VARCHAR(20) PRIMARY KEY,
    LocationName VARCHAR(20) NOT NULL,
    Region VARCHAR(20) NOT NULL UNIQUE
);

INSERT INTO Location (LocationID, LocationName, Region)
VALUES 
    ('0001', 'Route 1', 'Kanto'),
    ('0002', 'Route 2', 'Kanto'),
    ('0090', 'Water Path', 'Kanto'),
    ('0091', 'Route 29', 'Johto'),
   ('0021', 'Route 30', ‘Kyoto),
    ('0351', 'Route 1', 'Unova');






FoundIn(PokemonID:VARCHAR(20), LocationID:VARCHAR(20))  reference PokemonTrains, Location
CREATE TABLE FoundIn (
    PokemonID VARCHAR(20),
    LocationID VARCHAR(20) DEFAULT 'UnknownLoc',
    PRIMARY KEY (PokemonID, LocationID),
    FOREIGN KEY (PokemonID) REFERENCES PokemonTrains(PokemonID) ON DELETE CASCADE,
    FOREIGN KEY (LocationID) REFERENCES Location(LocationID) ON DELETE SET DEFAULT
);

INSERT INTO FoundIn (PokemonID, LocationID)
VALUES 
    ('0016', '0001'),
    ('0019', '0001'),
    ('0016', '0002'),
    ('0311', '0091'),
    ('0321', '0071'),
    ('0016', '0091');



PokemonSkill(SkillID:VARCHAR(20), Level:INTEGER)

CREATE TABLE PokemonSkill (
    SkillID VARCHAR(20) PRIMARY KEY,
    SkillLevel INTEGER
);

INSERT INTO PokemonSkill (SkillID, SkillLevel)
VALUES 
    ('0002', 1),
   ('0006', 21),
    ('0003', 1),
    ('0004', 20),
    ('0005', 32),
    ('0007', 28);


Learns(SkillID:VARCHAR(20), PokemonID:VARCHAR(20))

CREATE TABLE Learn (
    SkillID VARCHAR(20),
    PokemonID VARCHAR(20),
    PRIMARY KEY (SkillID, PokemonID),
    FOREIGN KEY (PokemonID) REFERENCES PokemonTrains(PokemonID) ON DELETE CASCADE,
    FOREIGN KEY (SkillID) REFERENCES PokemonSkill(SkillID) ON DELETE CASCADE
);

INSERT INTO Learn (SkillID, PokemonID)
VALUES 
    ('0002', '0043'),
    ('0002', '0044'),
    ('0002', '0045'),
    ('0003', '0745'),
    ('0830', '0745'),
    ('0880', '0795');



Category(TrainingFocus: VARCHAR(20),  CategoryName:VARCHAR(20))

CREATE TABLE Category (
    CategoryName VARCHAR(20) PRIMARY KEY,
    TrainingFocus VARCHAR(20)
);

INSERT INTO Category (CategoryName, TrainingFocus)
VALUES 
    ('Seed Pokemon', 'Grass-based Tactics'),
    ('Bird Pokemon', 'Aerial Maneuvers'),
    ('Mouse Pokemon', 'Speed and Agility'),
    ('Fox Pokemon', 'Illusion Mastery'),
    ('Bat Pokemon', 'Echolocation Tactics');


Shows(PokemonID:VARCHAR(20), StatsID:VARCHAR(20)) reference PokemonTrains, Stats

CREATE TABLE Shows (
    PokemonID VARCHAR(20),
    StatsID VARCHAR(20),
    PRIMARY KEY (PokemonID, StatsID),
    FOREIGN KEY (PokemonID) REFERENCES PokemonTrains (PokemonID) ON DELETE CASCADE,
    FOREIGN KEY (StatsID) REFERENCES Stat(StatsID) ON DELETE CASCADE
);

INSERT INTO Shows (PokemonID, StatsID)
VALUES 
    ('0001', '0001'),
    ('0002', '0002'),
    ('0003', '0003'),
    ('0008', '0004'),
    ('0088', '0005'),
    ('0095', '0006');


Stats(StatsID:VARCHAR(20), HP: INTEGER, Attack:INTEGER, Defense:INTEGER, SpecialAttack:INTEGER, SpecialDefense:INTEGER, Speed:INTEGER)

CREATE TABLE Stats (
    StatsID VARCHAR(20) PRIMARY KEY,
    HP INTEGER,
    Attack INTEGER,
    Defense INTEGER,
    SpecialAttack INTEGER,
    SpecialDefense INTEGER,
    Speed INTEGER
);

INSERT INTO Stats (StatsID, HP, Attack, Defense, SpecialAttack, SpecialDefense, Speed)
VALUES 
    ('0001', 3, 3, 3, 4, 4, 3),
    ('0002', 4, 4, 4, 5, 5, 4),
    ('0003', 5, 5, 5, 6, 6, 5),
    ('0004', 3, 4, 3, 4, 3, 4),
    ('0009', 9, 4, 3, 4, 3, 4),
    ('0005', 4, 4, 4, 5, 4, 5);


Challenge(Result: BOOLEAN, LeaderName: VARCHAR(20), TeamID:VARCHAR(20)) reference GymLeader, PokemonTeam

CREATE TABLE Challenge (
    Result NUMBER(1), -- Replaced BOOLEAN with NUMBER(1)
    LeaderName VARCHAR(20),
    TeamID VARCHAR(20),
    PRIMARY KEY (LeaderName, TeamID),
    FOREIGN KEY (LeaderName) REFERENCES    
    GymLeader(LeaderName),
    FOREIGN KEY (TeamID) REFERENCES PokemonTeam(TeamID)
);

INSERT INTO Challenge (Result, LeaderName, TeamID)
VALUES 
    (1, 'Brock', '0001'),
    (1, 'Brock', '0002'),
    (0, 'Brock', '0003'),
    (1, 'Molly', '0009'),
    (1, 'Misty', '0003'),
    (1, 'Misty', '0001');

