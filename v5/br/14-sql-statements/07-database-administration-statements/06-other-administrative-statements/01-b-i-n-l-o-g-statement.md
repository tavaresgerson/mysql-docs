#### 13.7.6.1 Declaração BINLOG

```sql
BINLOG 'str'
```

`BINLOG` é uma declaração de uso interno. Ela é gerada pelo programa **mysqlbinlog** como a representação imprimível de certos eventos em arquivos de log binário. (Veja Seção 4.6.7, “mysqlbinlog — Ferramenta para Processamento de Arquivos de Log Binário”.) O valor `'str'` é uma string codificada em base 64 que o servidor decodifica para determinar a mudança de dados indicada pelo evento correspondente. Esta declaração requer o privilégio `SUPER`.

Essa declaração pode executar apenas eventos de descrição de formato e eventos de linha.
