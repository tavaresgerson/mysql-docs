#### 13.7.5.14 Mostrar bancos de dados Statement

```sql
SHOW {DATABASES | SCHEMAS}
    [LIKE 'pattern' | WHERE expr]
```

`SHOW DATABASES` lista os bancos de dados no host do servidor MySQL. `SHOW SCHEMAS` é um sinônimo de `SHOW DATABASES`. A cláusula `LIKE` (funções de comparação de strings#operador_like), se presente, indica quais nomes de banco de dados devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido em Seção 24.8, “Extensões para Declarações SHOW”.

Você só verá os bancos de dados para os quais você tenha algum tipo de privilégio, a menos que você tenha o privilégio global `SHOW DATABASES`. Você também pode obter essa lista usando o comando **mysqlshow**.

Se o servidor foi iniciado com a opção `--skip-show-database`, você não pode usar essa declaração, a menos que tenha o privilégio `SHOW DATABASES`.

O MySQL implementa bancos de dados como diretórios no diretório de dados, então essa declaração simplesmente lista diretórios nessa localização. No entanto, o resultado pode incluir nomes de diretórios que não correspondem a bancos de dados reais.

As informações da base de dados também estão disponíveis na tabela `INFORMATION_SCHEMA` `SCHEMATA`. Consulte Seção 24.3.22, “A Tabela INFORMATION_SCHEMA SCHEMATA”.

Cuidado

Como um privilégio global é considerado um privilégio para todas as bases de dados, *qualquer* privilégio global permite que um usuário veja todos os nomes de bases de dados com `SHOW DATABASES` ou examinando a tabela `INFORMATION_SCHEMA` `SCHEMATA`.
