#### 18.8.2.2 Criando uma Tabela FEDERATED Usando CREATE SERVER

Se você estiver criando várias tabelas `FEDERATED` no mesmo servidor ou se quiser simplificar o processo de criação de tabelas `FEDERATED`, você pode usar a instrução `CREATE SERVER` para definir os parâmetros de conexão do servidor, assim como faria com a string `CONNECTION`.

O formato da instrução `CREATE SERVER` é:

```
CREATE SERVER
server_name
FOREIGN DATA WRAPPER wrapper_name
OPTIONS (option [, option] ...)
```

O *`server_name`* é usado na string de conexão ao criar uma nova tabela `FEDERATED`.

Por exemplo, para criar uma conexão de servidor idêntica à string `CONNECTION`:

```
CONNECTION='mysql://fed_user@remote_host:9306/federated/test_table';
```

Você usaria a seguinte instrução:

```
CREATE SERVER fedlink
FOREIGN DATA WRAPPER mysql
OPTIONS (USER 'fed_user', HOST 'remote_host', PORT 9306, DATABASE 'federated');
```

Para criar uma tabela `FEDERATED` que use essa conexão, você ainda usa a palavra-chave `CONNECTION`, mas especifica o nome que você usou na instrução `CREATE SERVER`.

```
CREATE TABLE test_table (
    id     INT(20) NOT NULL AUTO_INCREMENT,
    name   VARCHAR(32) NOT NULL DEFAULT '',
    other  INT(20) NOT NULL DEFAULT '0',
    PRIMARY KEY  (id),
    INDEX name (name),
    INDEX other_key (other)
)
ENGINE=FEDERATED
DEFAULT CHARSET=utf8mb4
CONNECTION='fedlink/test_table';
```

O nome da conexão neste exemplo contém o nome da conexão (`fedlink`) e o nome da tabela (`test_table`) a ser vinculada, separados por uma barra. Se você especificar apenas o nome da conexão sem um nome de tabela, o nome da tabela da tabela local é usado.

Para mais informações sobre `CREATE SERVER`, consulte a Seção 15.1.22, “Instrução CREATE SERVER”.

A instrução `CREATE SERVER` aceita os mesmos argumentos que a string `CONNECTION`. A instrução `CREATE SERVER` atualiza as linhas na tabela `mysql.servers`. Veja a tabela a seguir para informações sobre a correspondência entre os parâmetros em uma string de conexão, opções na instrução `CREATE SERVER` e as colunas na tabela `mysql.servers`. Para referência, o formato da string `CONNECTION` é o seguinte:

```8wZobKyKSE

<table summary="A correspondência entre os parâmetros em uma string de conexão, as opções na declaração CREATE SERVER e as colunas na tabela mysql.servers."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Descrição</th> <th><code>STRING</code> de CONEXÃO</th> <th><code>CREATE SERVER</code> opção</th> <th><code>mysql.servers</code> coluna</th> </tr></thead><tbody><tr> <th>Esquema de conexão</th> <td><em class="replaceable"><code>scheme</code></em></td> <td><code>wrapper_name</code></td> <td><code>Wrapper</code></td> </tr><tr> <th>Usuário remoto</th> <td><em class="replaceable"><code>user_name</code></em></td> <td><code>USER</code></td> <td><code>Username</code></td> </tr><tr> <th>Senha remota</th> <td><em class="replaceable"><code>password</code></em></td> <td><code>PASSWORD</code></td> <td><code>Password</code></td> </tr><tr> <th>Servidor remoto</th> <td><em class="replaceable"><code>host_name</code></em></td> <td><code>HOST</code></td> <td><code>Host</code></td> </tr><tr> <th>Porta remota</th> <td><em class="replaceable"><code>port_num</code></em></td> <td><code>PORT</code></td> <td><code>Port</code></td> </tr><tr> <th>Banco de dados remoto</th> <td><em class="replaceable"><code>db_name</code></em></td> <td><code>DATABASE</code></td> <td><code>Db</code></td> </tr></tbody></table>