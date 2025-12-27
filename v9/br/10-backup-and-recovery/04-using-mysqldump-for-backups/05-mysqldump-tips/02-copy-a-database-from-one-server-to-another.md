#### 9.4.5.2 Copiar um banco de dados de um servidor para outro

No Servidor 1:

```
$> mysqldump --databases db1 > dump.sql
```

Copie o arquivo de dump do Servidor 1 para o Servidor 2.

No Servidor 2:

```
$> mysql < dump.sql
```

O uso da opção `--databases` com o comando de linha de comando **mysqldump** faz com que o arquivo de dump inclua as instruções `CREATE DATABASE` e `USE` que criam o banco de dados se ele não existir e o tornam o banco de dados padrão para os dados recarregados.

Alternativamente, você pode omitir a opção `--databases` do comando **mysqldump**. Nesse caso, você precisa criar o banco de dados no Servidor 2 (se necessário) e especificá-lo como o banco de dados padrão ao recarregar o arquivo de dump.

No Servidor 1:

```
$> mysqldump db1 > dump.sql
```

No Servidor 2:

```
$> mysqladmin create db1
$> mysql db1 < dump.sql
```

Você pode especificar um nome de banco de dados diferente neste caso, portanto, ao omitir a opção `--databases` do comando **mysqldump**, você pode dumper dados de um banco de dados e carregá-los em outro.