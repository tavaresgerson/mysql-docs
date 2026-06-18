#### 13.7.6.1 Instrução BINLOG

```sql
BINLOG 'str'
```

A instrução `BINLOG` é uma instrução de uso interno. Ela é gerada pelo programa **mysqlbinlog** como a representação imprimível de certos eventos nos arquivos de log binário. (Veja Seção 4.6.7, “mysqlbinlog — Utility for Processing Binary Log Files”.) O valor `'str'` é uma string codificada em base 64 que o server decodifica para determinar a alteração de dados indicada pelo evento correspondente. Esta instrução requer o privilégio `SUPER`.

Esta instrução pode executar apenas eventos de descrição de formato e row events.