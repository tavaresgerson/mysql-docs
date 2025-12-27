#### 8.4.1.10 Autenticação de Credenciais de Peer de Soquete

O plugin de autenticação `auth_socket` do lado do servidor autentica clientes que se conectam a partir do host local por meio do arquivo de socket Unix. O plugin usa a opção de socket `SO_PEERCRED` para obter informações sobre o usuário que executa o programa cliente. Assim, o plugin pode ser usado apenas em sistemas que suportam a opção `SO_PEERCRED`, como o Linux.

O código-fonte deste plugin pode ser examinado como um exemplo relativamente simples que demonstra como escrever um plugin de autenticação carregável.

A tabela a seguir mostra os nomes dos arquivos do plugin e da biblioteca. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 8.25 Nomes do Plugin e da Biblioteca para Autenticação de Credenciais de Peer de Soquete**

<table><thead><tr> <th>Plugin ou Arquivo</th> <th>Nome do Plugin ou Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do servidor</td> <td><code>auth_socket</code></td> </tr><tr> <td>Plugin do lado do cliente</td> <td>Nenhum, veja a discussão</td> </tr><tr> <td>Arquivo da biblioteca</td> <td><code>auth_socket.so</code></td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação de credenciais de peer de soquete:

*  Instalando Autenticação de Credenciais de Peer de Soquete
*  Desinstalando Autenticação de Credenciais de Peer de Soquete
*  Usando Autenticação de Credenciais de Peer de Soquete

Para informações gerais sobre autenticação carregável no MySQL, consulte  Seção 8.2.17, “Autenticação Carregável”.

##### Instalando Autenticação de Credenciais de Peer de Soquete

Esta seção descreve como instalar o plugin de autenticação de soquete. Para informações gerais sobre como instalar plugins, consulte  Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para ser utilizável pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` na inicialização do servidor.

Para carregar o plugin no início do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor:

```
[mysqld]
plugin-load-add=auth_socket.so
```

Após modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Alternativamente, para carregar o plugin em tempo de execução, use a seguinte declaração:

```
INSTALL PLUGIN auth_socket SONAME 'auth_socket.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela `mysql.plugins` do sistema para fazer com que o servidor o carregue para cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela do Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%socket%';
+-------------+---------------+
| PLUGIN_NAME | PLUGIN_STATUS |
+-------------+---------------+
| auth_socket | ACTIVE        |
+-------------+---------------+
```

Se o plugin não conseguir inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Para associar contas MySQL ao plugin de soquete, consulte Usar Autenticação de Pluggable de Soquete.

##### Desinstalação da Autenticação de Pluggable de Soquete

O método usado para desinstalar o plugin de autenticação de soquete depende de como ele foi instalado:

* Se você instalou o plugin no início do servidor usando uma opção `--plugin-load-add`, reinicie o servidor sem a opção.
* Se você instalou o plugin em tempo de execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado em todas as reinicializações do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN auth_socket;
  ```

##### Usar Autenticação de Pluggable de Soquete

O plugin de soquete verifica se o nome de usuário do soquete (o nome do usuário do sistema operacional) corresponde ao nome de usuário do MySQL especificado pelo programa cliente para o servidor. Se os nomes não corresponderem, o plugin verifica se o nome de usuário do soquete corresponde ao nome especificado na coluna `authentication_string` da linha da tabela `mysql.user` do sistema. Se uma correspondência for encontrada, o plugin permite a conexão. O valor da `authentication_string` pode ser especificado usando uma cláusula `IDENTIFIED ...AS` com `CREATE USER` ou `ALTER USER`.

Suponha que uma conta MySQL seja criada para um usuário do sistema operacional chamado `valerie` que será autenticado pelo plugin `auth_socket` para conexões do host local através do arquivo de soquete:

```
CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket;
```

Se um usuário no host local com um nome de login de `stefanie` invocar `mysql` com a opção `--user=valerie` para se conectar através do arquivo de soquete, o servidor usa `auth_socket` para autenticar o cliente. O plugin determina que o valor da opção `--user` (`valerie`) difere do nome do usuário do cliente (`stephanie`) e recusa a conexão. Se um usuário chamado `valerie` tentar a mesma coisa, o plugin descobre que o nome do usuário e o nome do usuário do MySQL são ambos `valerie` e permite a conexão. No entanto, o plugin recusa a conexão mesmo para `valerie` se a conexão for feita usando um protocolo diferente, como TCP/IP.

Para permitir que tanto os usuários do sistema operacional `valerie` quanto `stephanie` acessem o MySQL através de conexões por arquivo de soquete que usem a conta, isso pode ser feito de duas maneiras:

* Nomeie ambos os usuários no momento da criação da conta, um seguindo `CREATE USER`, e o outro na string de autenticação:

  ```
  CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket AS 'stephanie';
  ```
* Se você já usou `CREATE USER` para criar a conta para um único usuário, use `ALTER USER` para adicionar o segundo usuário:

  ```
  CREATE USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket;
  ALTER USER 'valerie'@'localhost' IDENTIFIED WITH auth_socket AS 'stephanie';
  ```

Para acessar a conta, tanto `valerie` quanto `stephanie` especificam `--user=valerie` no momento da conexão.