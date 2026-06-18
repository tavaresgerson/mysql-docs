#### B.3.4.5 Falha de ROLLBACK para Tabelas Não Transacionais

Se você receber a seguinte mensagem ao tentar executar um `ROLLBACK`, isso significa que uma ou mais das tabelas usadas na *transaction* não suportam *transactions*:

```sql
Warning: Some non-transactional changed tables couldn't be rolled back
```

Estas tabelas *nontransactional* não são afetadas pelo comando `ROLLBACK`.

Se você não estava deliberadamente misturando tabelas *transactional* e *nontransactional* dentro da *transaction*, a causa mais provável para esta mensagem é que uma tabela que você pensava ser *transactional* na verdade não é. Isso pode acontecer se você tentar criar uma tabela usando um *storage engine transactional* que não é suportado pelo seu servidor **mysqld** (ou que foi desabilitado com uma opção de inicialização). Se o **mysqld** não suporta um *storage engine*, ele cria a tabela como uma tabela `MyISAM`, que é *nontransactional*.

Você pode verificar o *storage engine* de uma tabela usando qualquer um destes comandos:

```sql
SHOW TABLE STATUS LIKE 'tbl_name';
SHOW CREATE TABLE tbl_name;
```

Consulte Seção 13.7.5.36, “SHOW TABLE STATUS Statement”, e Seção 13.7.5.10, “SHOW CREATE TABLE Statement”.

Para verificar quais *storage engines* seu servidor **mysqld** suporta, use este comando:

```sql
SHOW ENGINES;
```

Consulte Seção 13.7.5.16, “SHOW ENGINES Statement” para detalhes completos.