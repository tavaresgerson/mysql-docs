### 4.4.6 mysql_tzinfo_to_sql — Carregar as Tabelas de Time Zone

O programa **mysql_tzinfo_to_sql** carrega as tabelas de time zone no Database `mysql`. Ele é usado em sistemas que possuem um Database zoneinfo (o conjunto de arquivos que descrevem os time zones). Exemplos de tais sistemas são Linux, FreeBSD, Solaris e macOS. Um local provável para esses arquivos é o diretório `/usr/share/zoneinfo` (`/usr/share/lib/zoneinfo` no Solaris). Se o seu sistema não possui um Database zoneinfo, você pode usar o pacote para download descrito na Seção 5.1.13, “MySQL Server Time Zone Support”.

O **mysql_tzinfo_to_sql** pode ser invocado de várias maneiras:

```sql
mysql_tzinfo_to_sql tz_dir
mysql_tzinfo_to_sql tz_file tz_name
mysql_tzinfo_to_sql --leap tz_file
```

Para a primeira sintaxe de invocação, passe o nome do caminho do diretório zoneinfo para o **mysql_tzinfo_to_sql** e envie a saída para o programa **mysql**. Por exemplo:

```sql
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root mysql
```

O **mysql_tzinfo_to_sql** lê os arquivos de time zone do seu sistema e gera instruções SQL a partir deles. O **mysql** processa essas instruções para carregar as tabelas de time zone.

A segunda sintaxe faz com que o **mysql_tzinfo_to_sql** carregue um único arquivo de time zone *`tz_file`* que corresponde a um nome de time zone *`tz_name`*:

```sql
mysql_tzinfo_to_sql tz_file tz_name | mysql -u root mysql
```

Se o seu time zone precisar considerar segundos bissextos (leap seconds), invoque o **mysql_tzinfo_to_sql** usando a terceira sintaxe, que inicializa as informações de leap second. *`tz_file`* é o nome do seu arquivo de time zone:

```sql
mysql_tzinfo_to_sql --leap tz_file | mysql -u root mysql
```

Após executar o **mysql_tzinfo_to_sql**, é recomendável reiniciar o Server para que ele não continue a usar quaisquer dados de time zone previamente armazenados em cache.