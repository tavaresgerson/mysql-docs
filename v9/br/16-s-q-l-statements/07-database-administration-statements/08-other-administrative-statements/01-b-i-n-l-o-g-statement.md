#### 15.7.8.1 Declaração `BINLOG`

```
BINLOG 'str'
```

`BINLOG` é uma declaração de uso interno. Ela é gerada pelo programa **mysqlbinlog** como a representação imprimível de certos eventos em arquivos de log binário. (Veja a Seção 6.6.9, “mysqlbinlog — Ferramenta para Processamento de Arquivos de Log Binário”.) O valor `'str'` é uma string codificada em base 64 que o servidor decodifica para determinar a mudança de dados indicada pelo evento correspondente.

Para executar declarações `BINLOG` ao aplicar a saída do **mysqlbinlog**, uma conta de usuário requer o privilégio `BINLOG_ADMIN` (ou o privilégio desatualizado `SUPER`) ou o privilégio `REPLICATION_APPLIER` mais os privilégios apropriados para executar cada evento de log.

Esta declaração pode executar apenas eventos de descrição de formato e eventos de linha.