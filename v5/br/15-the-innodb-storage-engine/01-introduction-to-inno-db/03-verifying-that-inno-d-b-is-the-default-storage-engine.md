### 14.1.3 Verificando se InnoDB é o Storage Engine Padrão

Use a instrução `SHOW ENGINES` para visualizar os storage engines MySQL disponíveis. Procure por `DEFAULT` na coluna `SUPPORT`.

```sql
mysql> SHOW ENGINES;
```

Como alternativa, faça uma Query na tabela `ENGINES` do Information Schema.

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.ENGINES;
```