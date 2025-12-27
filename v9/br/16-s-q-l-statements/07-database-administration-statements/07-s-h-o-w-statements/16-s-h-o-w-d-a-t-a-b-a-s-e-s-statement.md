#### 15.7.7.16. Declaração `SHOW DATABASES`

```
SHOW {DATABASES | SCHEMAS}
    [LIKE 'pattern' | WHERE expr]
```

`SHOW DATABASES` lista as bases de dados no host do servidor MySQL. `SHOW SCHEMAS` é um sinônimo de `SHOW DATABASES`. A cláusula `LIKE`, se presente, indica quais nomes de base de dados devem ser correspondidos. A cláusula `WHERE` pode ser usada para selecionar linhas com condições mais gerais, conforme discutido na Seção 28.8, “Extensões para Declarações SHOW”.

Você só verá as bases de dados para as quais você tenha algum tipo de privilégio, a menos que tenha o privilégio global `SHOW DATABASES`. Você também pode obter essa lista usando o comando **mysqlshow**.

Se o servidor foi iniciado com a opção `--skip-show-database`, você não pode usar essa declaração de forma alguma, a menos que tenha o privilégio `SHOW DATABASES`.

O MySQL implementa as bases de dados como diretórios no diretório de dados, então essa declaração simplesmente lista diretórios nessa localização. No entanto, a saída pode incluir nomes de diretórios que não correspondem a bases de dados reais.

As informações das bases de dados também estão disponíveis na tabela `INFORMATION_SCHEMA` `SCHEMATA`. Veja a Seção 28.3.37, “A Tabela INFORMATION\_SCHEMA SCHEMATA”.

Cuidado

Como qualquer privilégio global estático é considerado um privilégio para todas as bases de dados, qualquer privilégio global estático permite que um usuário veja todos os nomes de base de dados com `SHOW DATABASES` ou examinando a tabela `SCHEMATA` de `INFORMATION_SCHEMA`, exceto as bases de dados que foram restringidas no nível da base de dados por revogações parciais.