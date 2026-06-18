#### 7.4.5.2 Copiar uma base de dados de um servidor para outro

No servidor 1:

```sh
$> mysqldump --databases db1 > dump.sql
```

Copie o arquivo de dump do Servidor 1 para o Servidor 2.

No servidor 2:

```sh
$> mysql < dump.sql
```

O uso de `--databases` com o comando de linha de comando **mysqldump** faz com que o arquivo de dump inclua as instruções `CREATE DATABASE` e `USE` que criam o banco de dados, se ele existir, e o tornam o banco de dados padrão para os dados recarregados.

Alternativamente, você pode omitir `--databases` do comando **mysqldump**. Nesse caso, você precisará criar o banco de dados no Servidor 2 (se necessário) e especificá-lo como o banco de dados padrão ao recarregar o arquivo de dump.

No servidor 1:

```sh
$> mysqldump db1 > dump.sql
```

No servidor 2:

```sh
$> mysqladmin create db1
$> mysql db1 < dump.sql
```

Você pode especificar um nome de banco de dados diferente neste caso, então omitindo `--databases` do comando **mysqldump**, você pode fazer o dump de dados de um banco de dados e carregá-los em outro.
