### 15.8.2 Como Criar Tabelas FEDERATED

15.8.2.1 Criando uma Tabela FEDERATED Usando CONNECTION

15.8.2.2 Criando uma Tabela FEDERATED Usando CREATE SERVER

Para criar uma tabela `FEDERATED`, você deve seguir estes passos:

1. Crie a tabela no servidor remoto. Alternativamente, anote a definição de uma tabela existente, talvez usando a instrução `SHOW CREATE TABLE`.

2. Crie a tabela no servidor local com uma definição de tabela idêntica, mas adicionando as informações de conexão que ligam a tabela local à tabela remota.

Por exemplo, você poderia criar a seguinte tabela no servidor remoto:

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

Para criar a tabela local que será federada à tabela remota, há duas opções disponíveis. Você pode criar a tabela local e especificar a connection string (contendo o nome do servidor, login, password) a ser usada para conectar à tabela remota usando o `CONNECTION`, ou você pode usar uma conexão existente que você criou previamente usando a instrução `CREATE SERVER`.

Importante

Quando você cria a tabela local, ela *deve* ter uma definição de campo idêntica à da tabela remota.

Nota

Você pode melhorar o desempenho de uma tabela `FEDERATED` adicionando Indexes à tabela no host. A otimização ocorre porque a Query enviada ao servidor remoto inclui o conteúdo da `WHERE` clause, sendo enviada ao servidor remoto e subsequentemente executada localmente. Isso reduz o tráfego de rede que, de outra forma, solicitaria a tabela inteira do servidor para processamento local.