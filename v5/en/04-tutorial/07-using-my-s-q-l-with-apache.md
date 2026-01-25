## 3.7 Usando MySQL com Apache

Existem programas que permitem autenticar seus usuários a partir de um Database MySQL e também permitem que você escreva seus `log files` em uma tabela MySQL.

Você pode alterar o formato de `logging` do Apache para que seja facilmente legível pelo MySQL inserindo o seguinte no arquivo de configuração do Apache:

```sql
LogFormat \
        "\"%h\",%{%Y%m%d%H%M%S}t,%>s,\"%b\",\"%{Content-Type}o\",  \
        \"%U\",\"%{Referer}i\",\"%{User-Agent}i\""
```

Para carregar um `log file` nesse formato no MySQL, você pode usar uma `statement` semelhante a esta:

```sql
LOAD DATA INFILE '/local/access_log' INTO TABLE tbl_name
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' ESCAPED BY '\\'
```

A tabela nomeada deve ser criada para ter `columns` que correspondam àquelas que a linha `LogFormat` escreve no `log file`.