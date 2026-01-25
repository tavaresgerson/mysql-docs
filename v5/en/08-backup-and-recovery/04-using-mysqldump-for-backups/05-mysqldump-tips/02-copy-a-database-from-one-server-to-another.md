#### 7.4.5.2 Copiar um Database de um Server para Outro

No Server 1:

```sql
$> mysqldump --databases db1 > dump.sql
```

Copie o arquivo dump do Server 1 para o Server 2.

No Server 2:

```sql
$> mysql < dump.sql
```

O uso de `--databases` na linha de comando do **mysqldump** faz com que o arquivo dump inclua instruções `CREATE DATABASE` e `USE` que criam o database (se ele não existir) e o definem como o database default para os dados recarregados.

Alternativamente, você pode omitir `--databases` do comando **mysqldump**. Nesse caso, você precisará criar o database no Server 2 (se necessário) e especificá-lo como o database default ao recarregar o arquivo dump.

No Server 1:

```sql
$> mysqldump db1 > dump.sql
```

No Server 2:

```sql
$> mysqladmin create db1
$> mysql db1 < dump.sql
```

Você pode especificar um nome de database diferente neste caso, o que significa que omitir `--databases` do comando **mysqldump** permite que você faça o dump de dados de um database e os carregue em outro.