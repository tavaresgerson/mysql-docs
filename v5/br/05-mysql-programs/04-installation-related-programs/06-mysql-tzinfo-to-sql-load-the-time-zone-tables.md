### 4.4.6 mysql\_tzinfo\_to\_sql — Carregar as tabelas de fuso horário

O programa **mysql\_tzinfo\_to\_sql** carrega as tabelas de fuso horário no banco de dados `mysql`. Ele é usado em sistemas que possuem um banco de dados zoneinfo (o conjunto de arquivos que descrevem os fusos horários). Exemplos desses sistemas são Linux, FreeBSD, Solaris e macOS. Um local provável para esses arquivos é o diretório `/usr/share/zoneinfo` (`/usr/share/lib/zoneinfo` em Solaris). Se o seu sistema não tiver um banco de dados zoneinfo, você pode usar o pacote para download descrito na Seção 5.1.13, “Suporte de Fuso Horário do MySQL Server”.

**mysql\_tzinfo\_to\_sql** pode ser invocado de várias maneiras:

```sql
mysql_tzinfo_to_sql tz_dir
mysql_tzinfo_to_sql tz_file tz_name
mysql_tzinfo_to_sql --leap tz_file
```

Para a sintaxe de invocação inicial, passe o nome do caminho do diretório zoneinfo para **mysql\_tzinfo\_to\_sql** e envie a saída para o programa **mysql**. Por exemplo:

```sql
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root mysql
```

O **mysql\_tzinfo\_to\_sql** lê os arquivos de fuso horário do seu sistema e gera declarações SQL a partir deles. O **mysql** processa essas declarações para carregar as tabelas de fuso horário.

A segunda sintaxe faz com que **mysql\_tzinfo\_to\_sql** carregue um único arquivo de fuso horário *`tz_file`* que corresponde a um nome de fuso horário *`tz_name`*:

```sql
mysql_tzinfo_to_sql tz_file tz_name | mysql -u root mysql
```

Se o seu fuso horário precisar considerar os segundos intercalares, invocando **mysql\_tzinfo\_to\_sql** usando a terceira sintaxe, que inicializa as informações dos segundos intercalares. *`tz_file`* é o nome do seu arquivo de fuso horário:

```sql
mysql_tzinfo_to_sql --leap tz_file | mysql -u root mysql
```

Após executar **mysql\_tzinfo\_to\_sql**, é melhor reiniciar o servidor para que ele não continue a usar quaisquer dados de fuso horário armazenados anteriormente na cache.
