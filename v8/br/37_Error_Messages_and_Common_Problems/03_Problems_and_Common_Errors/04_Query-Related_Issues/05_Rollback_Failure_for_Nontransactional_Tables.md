#### B.3.4.5 Falha no rollback para tabelas não transacionais

Se você receber a seguinte mensagem ao tentar realizar um `ROLLBACK`, isso significa que uma ou mais das tabelas que você usou na transação não suportam transações:

```
Warning: Some non-transactional changed tables couldn't be rolled back
```

Essas tabelas não transacionais não são afetadas pela declaração `ROLLBACK`.

Se você não estivesse deliberadamente misturando tabelas transacionais e não transacionais dentro da transação, a causa mais provável dessa mensagem é que uma tabela que você pensava ser transacional na verdade não é. Isso pode acontecer se você tentar criar uma tabela usando um motor de armazenamento transacional que não é suportado pelo seu servidor **mysqld** (ou que foi desativado com uma opção de inicialização). Se o **mysqld** não suportar um motor de armazenamento, ele cria a tabela como uma tabela `MyISAM`, que é não transacional.

Você pode verificar o mecanismo de armazenamento de uma tabela usando uma das seguintes declarações:

```
SHOW TABLE STATUS LIKE 'tbl_name';
SHOW CREATE TABLE tbl_name;
```

Consulte a Seção 15.7.7.38, “Instrução SHOW TABLE STATUS”, e a Seção 15.7.7.10, “Instrução SHOW CREATE TABLE”.

Para verificar quais motores de armazenamento o seu servidor **mysqld** suporta, use esta declaração:

```
SHOW ENGINES;
```

Consulte a Seção 15.7.7.16, “Declaração de MOTORES DE EXIBIÇÃO”, para obter detalhes completos.
