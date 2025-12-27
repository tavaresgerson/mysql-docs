### 10.4.5 Limites de número de bancos de dados e tabelas

O MySQL não tem limite no número de bancos de dados. O sistema de arquivos subjacente pode ter um limite no número de diretórios.

O MySQL não tem limite no número de tabelas. O sistema de arquivos subjacente pode ter um limite no número de arquivos que representam tabelas. Os motores de armazenamento individuais podem impor restrições específicas do motor. O `InnoDB` permite até 4 bilhões de tabelas.