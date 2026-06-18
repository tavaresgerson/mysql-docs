#### 1.6.3.3 Restrições impostas a dados inválidos

Por padrão, o MySQL 8.0 rejeita valores de dados inválidos ou inadequados e interrompe a instrução na qual eles ocorrem. É possível alterar esse comportamento para ser mais tolerante a valores inválidos, de modo que o servidor os converta em valores válidos para a entrada de dados, desabilitando o modo SQL rigoroso (consulte a Seção 7.1.11, “Modos SQL do Servidor”), mas isso não é recomendado.

Versões mais antigas do MySQL empregavam o comportamento indulgente por padrão; para uma descrição desse comportamento, consulte Restrições de dados inválidos.
