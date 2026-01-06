### 15.8.2 Como criar tabelas FEDERATED

15.8.2.1 Criando uma Tabela FEDERATED Usando a CONEXÃO

15.8.2.2 Criando uma Tabela FEDERATED Usando CREATE SERVER

Para criar uma tabela `FEDERATED`, você deve seguir estes passos:

1. Crie a tabela no servidor remoto. Alternativamente, anote a definição da tabela de uma tabela existente, talvez usando a instrução `SHOW CREATE TABLE`.

2. Crie a tabela no servidor local com uma definição de tabela idêntica, mas adicione as informações de conexão que ligam a tabela local à tabela remota.

Por exemplo, você pode criar a seguinte tabela no servidor remoto:

```sql
CREATE TABLE test_table (
    id     INT(20) NOT NULL AUTO_INCREMENT,
    name   VARCHAR(32) NOT NULL DEFAULT '',
    other  INT(20) NOT NULL DEFAULT '0',
    PRIMARY KEY  (id),
    INDEX name (name),
    INDEX other_key (other)
)
ENGINE=MyISAM
DEFAULT CHARSET=latin1;
```

Para criar a tabela local a ser federada à tabela remota, existem duas opções disponíveis. Você pode criar a tabela local e especificar a string de conexão (contendo o nome do servidor, login e senha) a ser usada para se conectar à tabela remota usando a cláusula `CONNECTION`, ou você pode usar uma conexão existente que você criou anteriormente usando a instrução `CREATE SERVER`.

Importante

Quando você cria a tabela local, ela *deve* ter uma definição de campo idêntica à da tabela remota.

Nota

Você pode melhorar o desempenho de uma tabela `FEDERATED` adicionando índices à tabela no host. A otimização ocorre porque a consulta enviada ao servidor remoto inclui o conteúdo da cláusula `WHERE` e é enviada ao servidor remoto e, posteriormente, executada localmente. Isso reduz o tráfego de rede que, de outra forma, solicitaria toda a tabela ao servidor para processamento local.
