#### B.3.4.5 Falha no rollback para tabelas não transacionais

Se você receber a seguinte mensagem ao tentar realizar um [`ROLLBACK`](commit.html), isso significa que uma ou mais das tabelas que você usou na transação não suportam transações:

```sql
Warning: Some non-transactional changed tables couldn't be rolled back
```

Essas tabelas não transacionais não são afetadas pela instrução [`ROLLBACK`](commit.html).

Se você não estivesse deliberadamente misturando tabelas transacionais e não transacionais dentro da transação, a causa mais provável dessa mensagem é que uma tabela que você pensava ser transacional na verdade não é. Isso pode acontecer se você tentar criar uma tabela usando um motor de armazenamento transacional que não é suportado pelo seu servidor [**mysqld**](mysqld.html) (ou que foi desativado com uma opção de inicialização). Se o [**mysqld**](mysqld.html) não suportar um motor de armazenamento, ele cria a tabela como uma tabela `MyISAM`, que é não transacional.

Você pode verificar o mecanismo de armazenamento de uma tabela usando uma das seguintes declarações:

```sql
SHOW TABLE STATUS LIKE 'tbl_name';
SHOW CREATE TABLE tbl_name;
```

Veja [Seção 13.7.5.36, “Instrução SHOW TABLE STATUS”](show-table-status.html) e [Seção 13.7.5.10, “Instrução SHOW CREATE TABLE”](show-create-table.html).

Para verificar quais motores de armazenamento seu servidor [**mysqld**](mysqld.html) suporta, use esta declaração:

```sql
SHOW ENGINES;
```

Consulte [Seção 13.7.5.16, “Declaração de MOTORES DE EXIBIÇÃO”](show-engines.html) para obter detalhes completos.
