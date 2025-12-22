### 6.4.3 mysql\_tzinfo\_to\_sql  Carregar as tabelas de fusos horários

O programa **mysql\_tzinfo\_to\_sql** carrega as tabelas de fuso horário no banco de dados `mysql`. Ele é usado em sistemas que têm um banco de dados zoneinfo (o conjunto de arquivos que descrevem os fusos horários). Exemplos de tais sistemas são Linux, FreeBSD, Solaris e macOS. Um local provável para esses arquivos é o diretório `/usr/share/zoneinfo` (`/usr/share/lib/zoneinfo`) no Solaris. Se seu sistema não tiver um banco de dados zoneinfo, você pode usar o pacote para download descrito na Seção 7.1.15, MySQL Server Time Zone Support.

**mysql\_tzinfo\_to\_sql** pode ser invocado de várias maneiras:

```
mysql_tzinfo_to_sql tz_dir
mysql_tzinfo_to_sql tz_file tz_name
mysql_tzinfo_to_sql --leap tz_file
```

Para a primeira sintaxe de invocação, passe o nome do caminho do diretório zoneinfo para **mysql\_tzinfo\_to\_sql** e envie a saída para o programa `mysql`. Por exemplo:

```
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root mysql
```

**mysql\_tzinfo\_to\_sql** lê os arquivos de fuso horário do seu sistema e gera instruções SQL a partir deles. `mysql` processa essas instruções para carregar as tabelas de fuso horário.

A segunda sintaxe faz com que **mysql\_tzinfo\_to\_sql** carregue um único arquivo de fuso horário `tz_file` que corresponde a um nome de fuso horário `tz_name`:

```
mysql_tzinfo_to_sql tz_file tz_name | mysql -u root mysql
```

Se o seu fuso horário precisar de contabilizar segundos intercalares, invoque **mysql\_tzinfo\_to\_sql** usando a terceira sintaxe, que inicializa as informações do segundo intercalar. `tz_file` é o nome do seu arquivo de fuso horário:

```
mysql_tzinfo_to_sql --leap tz_file | mysql -u root mysql
```

Depois de executar **mysql\_tzinfo\_to\_sql**, é melhor reiniciar o servidor para que ele não continue a usar quaisquer dados de fuso horário armazenados em cache.
