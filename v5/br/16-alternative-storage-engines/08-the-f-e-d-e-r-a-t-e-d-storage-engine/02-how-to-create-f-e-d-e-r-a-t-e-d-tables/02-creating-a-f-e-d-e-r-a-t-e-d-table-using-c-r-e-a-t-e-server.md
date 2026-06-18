#### 15.8.2.2 Criando uma Tabela FEDERATED Usando CREATE SERVER

Se você estiver criando várias tabelas `FEDERATED` no mesmo server, ou se quiser simplificar o processo de criação de tabelas `FEDERATED`, você pode usar a instrução `CREATE SERVER` para definir os parâmetros de conexão do server, exatamente como faria com a string `CONNECTION`.

O formato da instrução `CREATE SERVER` é:

```sql
CREATE SERVER
server_name
FOREIGN DATA WRAPPER wrapper_name
OPTIONS (option [, option] ...)
```

O *`server_name`* é usado na string de conexão ao criar uma nova tabela `FEDERATED`.

Por exemplo, para criar uma conexão de server idêntica à string `CONNECTION`:

```sql
CONNECTION='mysql://fed_user@remote_host:9306/federated/test_table';
```

Você usaria a seguinte instrução:

```sql
CREATE SERVER fedlink
FOREIGN DATA WRAPPER mysql
OPTIONS (USER 'fed_user', HOST 'remote_host', PORT 9306, DATABASE 'federated');
```

Para criar uma tabela `FEDERATED` que use essa conexão, você ainda usa a palavra-chave `CONNECTION`, mas especifica o nome que você usou na instrução `CREATE SERVER`.

```sql
CREATE TABLE test_table (
    id     INT(20) NOT NULL AUTO_INCREMENT,
    name   VARCHAR(32) NOT NULL DEFAULT '',
    other  INT(20) NOT NULL DEFAULT '0',
    PRIMARY KEY  (id),
    INDEX name (name),
    INDEX other_key (other)
)
ENGINE=FEDERATED
DEFAULT CHARSET=latin1
CONNECTION='fedlink/test_table';
```

O nome da conexão neste exemplo contém o nome da conexão (`fedlink`) e o nome da tabela (`test_table`) a ser vinculada, separados por uma barra. Se você especificar apenas o nome da conexão sem um nome de tabela, o nome da tabela local será usado.

Para mais informações sobre `CREATE SERVER`, veja Seção 13.1.17, “CREATE SERVER Statement”.

A instrução `CREATE SERVER` aceita os mesmos argumentos que a string `CONNECTION`. A instrução `CREATE SERVER` atualiza as linhas na tabela `mysql.servers`. Veja a tabela a seguir para obter informações sobre a correspondência entre parâmetros em uma string de conexão, opções na instrução `CREATE SERVER` e as colunas na tabela `mysql.servers`. Para referência, o formato da string `CONNECTION` é o seguinte:

```sql
scheme://user_name[:password]@host_name[:port_num]/db_name/tbl_name
```

<table summary="A correspondência entre parâmetros em uma string de conexão, opções na instrução CREATE SERVER e as colunas na tabela mysql.servers."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Descrição</th> <th>string <code>CONNECTION</code></th> <th>Opção <code>CREATE SERVER</code></th> <th>Coluna <code>mysql.servers</code></th> </tr></thead><tbody><tr> <th>Esquema de conexão</th> <td><em><code>scheme</code></em></td> <td><code>wrapper_name</code></td> <td><code>Wrapper</code></td> </tr><tr> <th>Usuário remoto</th> <td><em><code>user_name</code></em></td> <td><code>USER</code></td> <td><code>Username</code></td> </tr><tr> <th>Senha remota</th> <td><em><code>password</code></em></td> <td><code>PASSWORD</code></td> <td><code>Password</code></td> </tr><tr> <th>Host remoto</th> <td><em><code>host_name</code></em></td> <td><code>HOST</code></td> <td><code>Host</code></td> </tr><tr> <th>Porta remota</th> <td><em><code>port_num</code></em></td> <td><code>PORT</code></td> <td><code>Port</code></td> </tr><tr> <th>Database remoto</th> <td><em><code>db_name</code></em></td> <td><code>DATABASE</code></td> <td><code>Db</code></td> </tr></tbody></table>