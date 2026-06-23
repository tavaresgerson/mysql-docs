# Capítulo 4 Desatualizando o MySQL

A desativação do MySQL 8.0 para o MySQL 5.7 não é suportada.

As despromoções in-place são suportadas a partir do MySQL 8.0 série a partir do MySQL 8.0.35. In-place significa iniciar e executar um novo binário do servidor MySQL em um diretório de dados MySQL existente que foi criado por uma versão diferente do servidor MySQL.

Tentar fazer uma desativação abaixo do MySQL 8.0.35 gera um erro semelhante ao seguinte:

```
[ERROR] [MY-013171] [InnoDB] Cannot boot server version 80034 on data directory built by version 80035. Downgrade is not supported
```

Aqui está uma mensagem de registro bem-sucedida de uma migração de MySQL 8.0.36 para 8.0.35 in-place:

```
[System] [MY-014064] [Server] Server downgrade from '80036' to '80035' started.
[System] [MY-014064] [Server] Server downgrade from '80036' to '80035' completed.
```

Uma alternativa é restaurar um backup feito *antes* de uma atualização.