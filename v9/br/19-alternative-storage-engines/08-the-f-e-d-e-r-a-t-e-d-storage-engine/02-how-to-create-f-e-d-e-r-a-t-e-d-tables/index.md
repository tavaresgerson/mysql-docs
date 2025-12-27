### 18.8.2 Como criar tabelas FEDERADAS

18.8.2.1 Criando uma tabela FEDERADA usando a CONEXÃO

18.8.2.2 Criando uma tabela FEDERADA usando o CREATE SERVER

Para criar uma tabela `FEDERADA`, siga estas etapas:

1. Crie a tabela no servidor remoto. Alternativamente, anote a definição da tabela de uma tabela existente, talvez usando a instrução `SHOW CREATE TABLE`.

2. Crie a tabela no servidor local com uma definição de tabela idêntica, mas adicionando as informações de conexão que ligam a tabela local à tabela remota.

Por exemplo, você pode criar a seguinte tabela no servidor remoto:

```
CREATE TABLE test_table (
    id     INT(20) NOT NULL AUTO_INCREMENT,
    name   VARCHAR(32) NOT NULL DEFAULT '',
    other  INT(20) NOT NULL DEFAULT '0',
    PRIMARY KEY  (id),
    INDEX name (name),
    INDEX other_key (other)
)
ENGINE=MyISAM
DEFAULT CHARSET=utf8mb4;
```

Para criar a tabela local que está federada à tabela remota, há duas opções disponíveis. Você pode criar a tabela local e especificar a string de conexão (contendo o nome do servidor, login, senha) a ser usada para se conectar à tabela remota usando a `CONEXÃO`, ou você pode usar uma conexão existente que você criou anteriormente usando a instrução `CREATE SERVER`.

Importante

Ao criar a tabela local, ela *deve* ter uma definição de campo idêntica à da tabela remota.

Nota

Você pode melhorar o desempenho de uma tabela `FEDERADA` adicionando índices à tabela no host. A otimização ocorre porque a consulta enviada ao servidor remoto inclui o conteúdo da cláusula `WHERE` e é enviada ao servidor remoto e posteriormente executada localmente. Isso reduz o tráfego de rede que, de outra forma, solicitaria toda a tabela do servidor para processamento local.