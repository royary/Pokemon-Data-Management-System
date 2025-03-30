SELECT p.TypeName, AVG(s.Attack) AS AvgAttack
FROM PokemonTrains p
JOIN Shows sh ON p.PokemonID = sh.PokemonID
JOIN Stats s ON sh.StatsID = s.StatsID
GROUP BY p.TypeName;