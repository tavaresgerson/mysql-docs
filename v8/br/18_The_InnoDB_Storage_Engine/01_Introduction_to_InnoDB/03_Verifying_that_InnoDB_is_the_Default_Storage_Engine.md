### 17.1.3 Verificar se o InnoDB é o motor de armazenamento padrão

Emita a declaração `SHOW ENGINES` para visualizar os motores de armazenamento MySQL disponíveis. Procure `DEFAULT` na coluna `SUPPORT`.

```
mysql> SHOW ENGINES;
```

Alternativamente, consulte a tabela Schema de Informações `ENGINES`.

```
mysql> SELECT * FROM INFORMATION_SCHEMA.ENGINES;
```
