### 8.4.5 Limites no Número de Databases e Tables

O MySQL não possui limite para o número de databases. O sistema de arquivos subjacente pode ter um limite no número de diretórios.

O MySQL não possui limite para o número de tables. O sistema de arquivos subjacente pode ter um limite no número de arquivos que representam tables. Storage engines individuais podem impor restrições específicas do engine. O `InnoDB` permite até 4 bilhões de tables.