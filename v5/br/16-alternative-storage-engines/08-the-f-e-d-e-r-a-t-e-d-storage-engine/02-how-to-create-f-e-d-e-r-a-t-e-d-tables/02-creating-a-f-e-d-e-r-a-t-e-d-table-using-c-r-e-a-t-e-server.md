#### 15.8.2.2 Criando uma Tabela FEDERATED Usando CREATE SERVER

Se você estiver criando várias tabelas `FEDERATED` no mesmo servidor ou se deseja simplificar o processo de criação de tabelas `FEDERATED`, você pode usar a instrução `CREATE SERVER` para definir os parâmetros de conexão do servidor, da mesma forma que faria com a string `CONNECTION`.

O formato da instrução `CREATE SERVER` é:

```sql
CREATE SERVER
server_name
FOREIGN DATA WRAPPER wrapper_name
OPTIONS (option [, option] ...)
```

O `server_name` é usado na cadeia de conexão ao criar uma nova tabela `FEDERATED`.

Por exemplo, para criar uma conexão de servidor idêntica à string `CONNECTION`:

```sql
CONNECTION='mysql://fed_user@remote_host:9306/federated/test_table';
```

Você usaria a seguinte declaração:

```sql
CREATE SERVER fedlink
FOREIGN DATA WRAPPER mysql
OPTIONS (USER 'fed_user', HOST 'remote_host', PORT 9306, DATABASE 'federated');
```

Para criar uma tabela `FEDERATED` que utilize essa conexão, você ainda usa a palavra-chave `CONNECTION`, mas especifique o nome que você usou na instrução `CREATE SERVER`.

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

O nome da conexão neste exemplo contém o nome da conexão (`fedlink`) e o nome da tabela (`test_table`) a ser vinculada, separados por uma barra. Se você especificar apenas o nome da conexão sem um nome de tabela, o nome da tabela da tabela local será usado.

Para obter mais informações sobre `CREATE SERVER`, consulte a Seção 13.1.17, “Instrução CREATE SERVER”.

A instrução `CREATE SERVER` aceita os mesmos argumentos que a string `CONNECTION`. A instrução `CREATE SERVER` atualiza as linhas na tabela `mysql.servers`. Consulte a tabela a seguir para obter informações sobre a correspondência entre os parâmetros em uma string de conexão, as opções na instrução `CREATE SERVER` e as colunas na tabela `mysql.servers`. Para referência, o formato da string `CONNECTION` é o seguinte:

```sql
scheme://user_name[:password]@host_name[:port_num]/db_name/tbl_name
```

<table summary="A correspondência entre os parâmetros em uma cadeia de conexão, as opções na instrução CREATE SERVER e as colunas na tabela mysql.servers."><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><col style="width: 25%"/><thead><tr> <th>Descrição</th> <th>[[PH_HTML_CODE_<code>PASSWORD</code>] string</th> <th>[[PH_HTML_CODE_<code>PASSWORD</code>]opção</th> <th>coluna [[PH_HTML_CODE_<code>host_name</code>]</th> </tr></thead><tbody><tr> <th>Esquema de conexão</th> <td><em class="replaceable">[[PH_HTML_CODE_<code>HOST</code>]</em></td> <td>[[PH_HTML_CODE_<code>Host</code>]</td> <td>[[PH_HTML_CODE_<code>port_num</code>]</td> </tr><tr> <th>Usuário remoto</th> <td><em class="replaceable">[[PH_HTML_CODE_<code>PORT</code>]</em></td> <td>[[PH_HTML_CODE_<code>Port</code>]</td> <td>[[PH_HTML_CODE_<code>db_name</code>]</td> </tr><tr> <th>Senha remota</th> <td><em class="replaceable">[[PH_HTML_CODE_<code>DATABASE</code>]</em></td> <td>[[<code>PASSWORD</code>]]</td> <td>[[<code>CREATE SERVER</code><code>PASSWORD</code>]</td> </tr><tr> <th>Anfitrião remoto</th> <td><em class="replaceable">[[<code>host_name</code>]]</em></td> <td>[[<code>HOST</code>]]</td> <td>[[<code>Host</code>]]</td> </tr><tr> <th>Porto remoto</th> <td><em class="replaceable">[[<code>port_num</code>]]</em></td> <td>[[<code>PORT</code>]]</td> <td>[[<code>Port</code>]]</td> </tr><tr> <th>Banco de dados remoto</th> <td><em class="replaceable">[[<code>db_name</code>]]</em></td> <td>[[<code>DATABASE</code>]]</td> <td>[[<code>mysql.servers</code><code>PASSWORD</code>]</td> </tr></tbody></table>
