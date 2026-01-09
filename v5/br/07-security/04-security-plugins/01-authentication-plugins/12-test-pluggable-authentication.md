#### 6.4.1.12 Teste de Autenticação Conectada

O MySQL inclui um plugin de teste que verifica as credenciais da conta e registra o sucesso ou o fracasso no log de erros do servidor. Este é um plugin carregável (não integrado) e deve ser instalado antes de ser usado.

O código-fonte do plugin de teste é separado do código-fonte do servidor, ao contrário do plugin nativo integrado, então ele pode ser examinado como um exemplo relativamente simples que demonstra como escrever um plugin de autenticação carregável.

::: info Nota
Este plugin é destinado a fins de teste e desenvolvimento e não deve ser usado em ambientes de produção ou em servidores expostos a redes públicas.
:::

A tabela a seguir mostra os nomes dos arquivos de plugin e biblioteca. O sufixo do nome do arquivo pode variar no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 6.19 Nomes de plugins e bibliotecas para autenticação de teste**

<table summary="Nomes para os plugins e o arquivo de biblioteca usados para autenticação de senha de teste."><thead><tr> <th>Plugin ou arquivo</th> <th>Nome do Plugin ou do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin no lado do servidor</td> <td>[[<code>test_plugin_server</code>]]</td> </tr><tr> <td>Plugin no lado do cliente</td> <td>[[<code>auth_test_plugin</code>]]</td> </tr><tr> <td>Arquivo da biblioteca</td> <td>[[<code>auth_test_plugin.so</code>]]</td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação plugável de teste:

- Instalando Autenticação Pluggable de Teste
- Desinstalação da Autenticação Conectada por Testes
- Usar Autenticação Desmontável em Testes

Para obter informações gerais sobre autenticação plugável no MySQL, consulte Seção 6.2.13, “Autenticação Plugável”.

##### Instalando Autenticação Testável Plugável

Esta seção descreve como instalar o plugin de autenticação de teste do lado do servidor. Para informações gerais sobre como instalar plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Para que o plugin possa ser usado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

Para carregar o plugin no início do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=auth_test_plugin.so
```

Depois de modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Como alternativa, para carregar o plugin em tempo de execução, use esta declaração, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
INSTALL PLUGIN test_plugin_server SONAME 'auth_test_plugin.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela `mysql.plugins` do sistema para que o servidor o carregue em cada inicialização normal subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%test_plugin%';
+--------------------+---------------+
| PLUGIN_NAME        | PLUGIN_STATUS |
+--------------------+---------------+
| test_plugin_server | ACTIVE        |
+--------------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para obter mensagens de diagnóstico.

Para associar contas do MySQL ao plugin de teste, consulte Usando autenticação plugável de teste.

##### Desinstalação da Autenticação Conectada por Testes

O método usado para desinstalar o plugin de autenticação de teste depende de como você o instalou:

- Se você instalou o plugin na inicialização do servidor usando a opção `--plugin-load-add`, reinicie o servidor sem essa opção.

- Se você instalou o plugin durante a execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado após reinicializações do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```sql
  UNINSTALL PLUGIN test_plugin_server;
  ```

##### Usando Test Pluggable Authentication

Para usar o plugin de autenticação de teste, crie uma conta e nomeie esse plugin na cláusula `IDENTIFIED WITH`:

```sql
CREATE USER 'testuser'@'localhost'
IDENTIFIED WITH test_plugin_server
BY 'testpassword';
```

Em seguida, forneça as opções `--user` e `--password` para essa conta ao se conectar ao servidor. Por exemplo:

```sh
$> mysql --user=testuser --password
Enter password: testpassword
```

O plugin obtém a senha conforme recebida do cliente e a compara com o valor armazenado na coluna `authentication_string` da linha da conta na tabela `mysql.user` do sistema. Se os dois valores corresponderem, o plugin retorna o valor da `authentication_string` como o novo ID de usuário efetivo.

Você pode procurar no log de erro do servidor uma mensagem que indique se a autenticação foi bem-sucedida (observe que a senha é relatada como o “usuário”):

```
[Note] Plugin test_plugin_server reported:
'successfully authenticated user testpassword'
```
