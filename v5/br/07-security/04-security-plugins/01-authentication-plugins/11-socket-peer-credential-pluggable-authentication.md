#### 6.4.1.11 Autenticação de Pluggable Authentication com Credenciais de Peer de Soquete

O plugin de autenticação `auth_socket` do lado do servidor autentica clientes que se conectam a partir do host local por meio do arquivo de socket Unix. O plugin usa a opção de socket `SO_PEERCRED` para obter informações sobre o usuário que executa o programa cliente. Assim, o plugin só pode ser usado em sistemas que suportam a opção `SO_PEERCRED`, como o Linux.

O código-fonte deste plugin pode ser examinado como um exemplo relativamente simples que demonstra como escrever um plugin de autenticação carregável.

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 6.18 Nomes de plugins e bibliotecas para autenticação de credenciais de pares de socket**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha de credencial de peer de socket."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td><code>auth_socket</code></td> </tr><tr> <td>Plugin no lado do cliente</td> <td>Nenhum, veja a discussão</td> </tr><tr> <td>Arquivo da biblioteca</td> <td><code>auth_socket.so</code></td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação de plugue de soquete:

- Instalando Autenticação de Conexão de Soquete
- Desinstalação da Autenticação Conectada por Soquete
- Usando autenticação plugável em soquete

Para obter informações gerais sobre autenticação plugável no MySQL, consulte Seção 6.2.13, “Autenticação Plugável”.

##### Instalando Autenticação de Conexão Conectada por Soquete

Esta seção descreve como instalar o plugin de autenticação de soquete. Para informações gerais sobre como instalar plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Para que o plugin possa ser usado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

Para carregar o plugin na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor:

```
[mysqld]
plugin-load-add=auth_socket.so
```

Depois de modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Alternativamente, para carregar o plugin em tempo de execução, use esta declaração:

```sql
INSTALL PLUGIN auth_socket SONAME 'auth_socket.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela `mysql.plugins` do sistema para que o servidor o carregue em cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%socket%';
+-------------+---------------+
| PLUGIN_NAME | PLUGIN_STATUS |
+-------------+---------------+
| auth_socket | ACTIVE        |
+-------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para obter mensagens de diagnóstico.

Para associar contas do MySQL ao plugin de soquete, consulte Usando autenticação de soquete plugável.

##### Desinstalação da Autenticação de Conexão Conectada por Soquete

O método usado para desinstalar o plugin de autenticação de soquete depende de como você o instalou:

- Se você instalou o plugin na inicialização do servidor usando a opção `--plugin-load-add`, reinicie o servidor sem essa opção.

- Se você instalou o plugin durante a execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado após reinicializações do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```sql
  UNINSTALL PLUGIN auth_socket;
  ```

##### Usando a Autenticação de Conexão Conectada por Soquete

O plugin de soquete verifica se o nome do usuário do soquete (o nome do usuário do sistema operacional) corresponde ao nome do usuário do MySQL especificado pelo programa cliente para o servidor. Se os nomes não corresponderem, o plugin verifica se o nome do usuário do soquete corresponde ao nome especificado na coluna `authentication_string` da linha da tabela de sistema `mysql.user`. Se uma correspondência for encontrada, o plugin permite a conexão. O valor da `authentication_string` pode ser especificado usando uma cláusula `IDENTIFIED ...AS` com `CREATE USER` ou `ALTER USER`.

Suponha que uma conta MySQL seja criada para um usuário do sistema operacional chamado `valerie`, que será autenticado pelo plugin `auth_socket` para conexões do host local através do arquivo de soquete:

```sql
CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket;
```

Se um usuário no host local com o nome de login `stefanie` invocar **mysql** com a opção `--user=valerie` para se conectar através do arquivo de soquete, o servidor usa `auth_socket` para autenticar o cliente. O plugin determina que o valor da opção `--user` (`valerie`) difere do nome do usuário do cliente (`stephanie`) e recusa a conexão. Se um usuário chamado `valerie` tentar a mesma coisa, o plugin descobre que o nome do usuário e o nome do usuário MySQL são ambos `valerie` e permite a conexão. No entanto, o plugin recusa a conexão mesmo para `valerie` se a conexão for feita usando um protocolo diferente, como TCP/IP.

Para permitir que tanto os usuários do sistema operacional `valerie` quanto `stephanie` acessem o MySQL por meio de conexões de arquivo de soquete que utilizem a conta, isso pode ser feito de duas maneiras:

- Nomeie ambos os usuários no momento da criação da conta, um seguindo `CREATE USER` e o outro na string de autenticação:

  ```sql
  CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket AS 'stephanie';
  ```

- Se você já usou `CREATE USER` para criar a conta de um único usuário, use `ALTER USER` para adicionar o segundo usuário:

  ```sql
  CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket;
  ALTER USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket AS 'stephanie';
  ```

Para acessar a conta, tanto `valerie` quanto `stephanie` especificam `--user=valerie` no momento da conexão.
