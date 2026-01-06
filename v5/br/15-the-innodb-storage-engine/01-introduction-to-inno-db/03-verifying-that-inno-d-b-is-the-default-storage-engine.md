### 14.1.3 Verificar se o InnoDB é o motor de armazenamento padrão

Emita a declaração `SHOW ENGINES` para visualizar os motores de armazenamento MySQL disponíveis. Procure por `DEFAULT` na coluna `SUPPORT`.

```sql
mysql> SHOW ENGINES;
```

Alternativamente, consulte a tabela do esquema de informações `ENGINES`.

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.ENGINES;
```
