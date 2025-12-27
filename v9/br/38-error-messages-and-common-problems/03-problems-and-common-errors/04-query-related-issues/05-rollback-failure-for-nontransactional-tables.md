#### B.3.4.5 Falha no Rollback para Tabelas Não Transacionais

Se você receber a seguinte mensagem ao tentar executar um `ROLLBACK`, isso significa que uma ou mais das tabelas que você usou na transação não suportam transações:

```
Warning: Some non-transactional changed tables couldn't be rolled back
```

Essas tabelas não transacionais não são afetadas pelo comando `ROLLBACK`.

Se você não estiver deliberadamente misturando tabelas transacionais e não transacionais dentro da transação, a causa mais provável dessa mensagem é que uma tabela que você pensava ser transacional na verdade não é. Isso pode acontecer se você tentar criar uma tabela usando um motor de armazenamento transacional que não é suportado pelo seu servidor **mysqld** (ou que foi desativado com uma opção de inicialização). Se o **mysqld** não suportar um motor de armazenamento, ele cria a tabela como uma tabela `MyISAM`, que é não transacional.

Você pode verificar o motor de armazenamento de uma tabela usando uma das seguintes instruções:

```
SHOW TABLE STATUS LIKE 'tbl_name';
SHOW CREATE TABLE tbl_name;
```

Veja a Seção 15.7.7.39, “Instrução SHOW TABLE STATUS”, e a Seção 15.7.7.12, “Instrução SHOW CREATE TABLE”.

Para verificar quais motores de armazenamento o seu servidor **mysqld** suporta, use esta instrução:

```
SHOW ENGINES;
```

Veja a Seção 15.7.7.18, “Instrução SHOW ENGINES” para obter detalhes completos.