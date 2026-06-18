#### 15.7.7.14 Mostrar bancos de dados Statement

```
SHOW {DATABASES | SCHEMAS}
    [LIKE 'pattern' | WHERE expr]
```

`SHOW DATABASES` lista os bancos de dados no host do servidor MySQL. `SHOW SCHEMAS` é sinônimo de `SHOW DATABASES`. A cláusula `LIKE`, se presente, indica quais nomes de banco de dados devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”.

Você só verá os bancos de dados para os quais você tenha algum tipo de privilégio, a menos que você tenha o privilégio global `SHOW DATABASES`. Você também pode obter essa lista usando o comando **mysqlshow**.

Se o servidor foi iniciado com a opção `--skip-show-database`, você não pode usar essa declaração, a menos que tenha o privilégio `SHOW DATABASES`.

O MySQL implementa bancos de dados como diretórios no diretório de dados, então essa declaração simplesmente lista diretórios nessa localização. No entanto, o resultado pode incluir nomes de diretórios que não correspondem a bancos de dados reais.

As informações da base de dados também estão disponíveis na tabela `INFORMATION_SCHEMA` `SCHEMATA`. Consulte a Seção 28.3.31, “A Tabela INFORMATION\_SCHEMA SCHEMATA”.

Cuidado

Como qualquer privilégio global estático é considerado um privilégio para todas as bases de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de base de dados com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` de `INFORMATION_SCHEMA`, exceto as bases de dados que foram restringidas ao nível da base de dados por revogações parciais.
