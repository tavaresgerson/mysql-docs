### 4.4.6 mysql_tzinfo_to_sql — Carregar as tabelas de fuso horário

O programa **mysql_tzinfo_to_sql** carrega as tabelas de fuso horário no banco de dados `mysql`. Ele é usado em sistemas que possuem um banco de dados zoneinfo (o conjunto de arquivos que descrevem os fusos horários). Exemplos desses sistemas são Linux, FreeBSD, Solaris e macOS. Um local provável para esses arquivos é o diretório `/usr/share/zoneinfo` (`/usr/share/lib/zoneinfo` em Solaris). Se o seu sistema não tiver um banco de dados zoneinfo, você pode usar o pacote para download descrito na Seção 5.1.13, “Suporte de Fuso Horário do MySQL Server”.

**mysql_tzinfo_to_sql** pode ser invocado de várias maneiras:

```sh
mysql_tzinfo_to_sql tz_dir
mysql_tzinfo_to_sql tz_file tz_name
mysql_tzinfo_to_sql --leap tz_file
```

Para a sintaxe de invocação inicial, passe o nome do caminho do diretório zoneinfo para **mysql_tzinfo_to_sql** e envie a saída para o programa **mysql**. Por exemplo:

```sh
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root mysql
```

O **mysql_tzinfo_to_sql** lê os arquivos de fuso horário do seu sistema e gera declarações SQL a partir deles. O **mysql** processa essas declarações para carregar as tabelas de fuso horário.

A segunda sintaxe faz com que **mysql_tzinfo_to_sql** carregue um único arquivo de fuso horário *`tz_file`* que corresponde a um nome de fuso horário *`tz_name`*:

```sh
mysql_tzinfo_to_sql tz_file tz_name | mysql -u root mysql
```

Se o seu fuso horário precisar considerar os segundos intercalares, invocando **mysql_tzinfo_to_sql** usando a terceira sintaxe, que inicializa as informações dos segundos intercalares. *`tz_file`* é o nome do seu arquivo de fuso horário:

```sh
mysql_tzinfo_to_sql --leap tz_file | mysql -u root mysql
```

Após executar **mysql_tzinfo_to_sql**, é melhor reiniciar o servidor para que ele não continue a usar quaisquer dados de fuso horário armazenados anteriormente na cache.
