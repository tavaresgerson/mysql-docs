## 3.7 Usando o MySQL com o Apache

Existem programas que permitem autenticar seus usuários a partir de um banco de dados MySQL e também permitem que você escreva seus arquivos de log em uma tabela MySQL.

Você pode alterar o formato de registro do Apache para ser facilmente legível pelo MySQL, colocando o seguinte no arquivo de configuração do Apache:

```sql
LogFormat \
        "\"%h\",%{%Y%m%d%H%M%S}t,%>s,\"%b\",\"%{Content-Type}o\",  \
        \"%U\",\"%{Referer}i\",\"%{User-Agent}i\""
```

Para carregar um arquivo de registro nesse formato no MySQL, você pode usar uma instrução como esta:

```sql
LOAD DATA INFILE '/local/access_log' INTO TABLE tbl_name
FIELDS TERMINATED BY ',' OPTIONALLY ENCLOSED BY '"' ESCAPED BY '\\'
```

A tabela nomeada deve ser criada para ter colunas que correspondam às que a linha `LogFormat` escreve no arquivo de log.
