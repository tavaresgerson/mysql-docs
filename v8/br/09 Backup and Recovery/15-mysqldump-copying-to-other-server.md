#### 9.4.5.2 Copiar uma Base de Dados de um Servidor para Outro

No Servidor 1:

```
$> mysqldump --databases db1 > dump.sql
```

Copie o arquivo de dump do Servidor 1 para o Servidor 2.

No Servidor 2:

```
$> mysql < dump.sql
```

O uso da opção `--databases` com o comando `mysqldump` faz com que o arquivo de dump inclua as instruções `CREATE DATABASE` e `USE` que criam a base de dados se ela não existir e a tornam a base de dados padrão para os dados recarregados.

Alternativamente, você pode omitir `--databases` do comando `mysqldump`. Nesse caso, você precisa criar a base de dados no Servidor 2 (se necessário) e especificá-la como a base de dados padrão ao recarregar o arquivo de dump.

No Servidor 1:

```
$> mysqldump db1 > dump.sql
```

No Servidor 2:

```
$> mysqladmin create db1
$> mysql db1 < dump.sql
```

Você pode especificar um nome de base de dados diferente neste caso, então, ao omitir `--databases` do comando `mysqldump`, você pode dumper dados de uma base de dados e carregá-los em outra.