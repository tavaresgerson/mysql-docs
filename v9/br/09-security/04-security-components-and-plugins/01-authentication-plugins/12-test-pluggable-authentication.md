#### 8.4.1.12 Testar a Autenticação Conectada

O MySQL inclui um plugin de teste que verifica as credenciais da conta e registra o sucesso ou o fracasso no log de erro do servidor. Este é um plugin carregável (não integrado) e deve ser instalado antes de ser usado.

O código-fonte do plugin de teste é separado do código-fonte do servidor, ao contrário do plugin nativo integrado, portanto, pode ser examinado como um exemplo relativamente simples que demonstra como escrever um plugin de autenticação carregável.

Nota

Este plugin é destinado a fins de teste e desenvolvimento e não deve ser usado em ambientes de produção ou em servidores expostos a redes públicas.

A tabela a seguir mostra os nomes dos arquivos do plugin e da biblioteca. O sufixo do nome do arquivo pode diferir no seu sistema. O arquivo deve estar localizado no diretório nomeado pela variável de sistema `plugin_dir`.

**Tabela 8.27 Nomes do Plugin e da Biblioteca para Autenticação de Teste**

<table summary="Nomes dos plugins e arquivos de biblioteca usados para autenticação de senha de teste."><col style="width: 30%"/><col style="width: 70%"/><thead><tr> <th>Plugin ou Arquivo</th> <th>Plugin ou Nome do Arquivo</th> </tr></thead><tbody><tr> <td>Plugin do lado do servidor</td> <td><code class="literal">test_plugin_server</code></td> </tr><tr> <td>Plugin do lado do cliente</td> <td><code class="literal">auth_test_plugin</code></td> </tr><tr> <td>Arquivo de biblioteca</td> <td><code class="filename">auth_test_plugin.so</code></td> </tr></tbody></table>

As seções a seguir fornecem informações de instalação e uso específicas para a autenticação conectada testável:

* Instalando a Autenticação Conectada Testável
* Desinstalando a Autenticação Conectada Testável
* Usando a Autenticação Conectada Testável

Para informações gerais sobre autenticação conectada no MySQL, consulte a Seção 8.2.17, “Autenticação Conectada”.

##### Instalando o Plugin de Autenticação Testável

Esta seção descreve como instalar o plugin de autenticação de teste no lado do servidor. Para informações gerais sobre como instalar plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para que o plugin seja utilizado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` na inicialização do servidor.

Para carregar o plugin na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
[mysqld]
plugin-load-add=auth_test_plugin.so
```

Após modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Alternativamente, para carregar o plugin em tempo de execução, use esta declaração, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN test_plugin_server SONAME 'auth_test_plugin.so';
```

`INSTALL PLUGIN` carrega o plugin imediatamente e também o registra na tabela do sistema `mysql.plugins` para fazer com que o servidor o carregue para cada inicialização normal subsequente sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela do Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE '%test_plugin%';
+--------------------+---------------+
| PLUGIN_NAME        | PLUGIN_STATUS |
+--------------------+---------------+
| test_plugin_server | ACTIVE        |
+--------------------+---------------+
```

Se o plugin não conseguir inicializar, verifique o log de erro do servidor em busca de mensagens de diagnóstico.

Para associar contas do MySQL ao plugin de teste, consulte Usar Autenticação Testável Testável.

##### Desinstalando a Autenticação Testável Testável

O método usado para desinstalar o plugin de autenticação de teste depende de como você o instalou:

* Se você instalou o plugin na inicialização do servidor usando a opção `--plugin-load-add`, reinicie o servidor sem a opção.

* Se você instalou o plugin em tempo de execução usando uma declaração `INSTALL PLUGIN`, ele permanece instalado em todos os reinicializações do servidor. Para desinstalá-lo, use `UNINSTALL PLUGIN`:

  ```
  UNINSTALL PLUGIN test_plugin_server;
  ```

##### Usando o Plugin de Autenticação de Teste

Para usar o plugin de autenticação de teste, crie uma conta e nomeie esse plugin na cláusula `IDENTIFIED WITH`:

```
CREATE USER 'testuser'@'localhost'
IDENTIFIED WITH test_plugin_server
BY 'testpassword';
```

O plugin de autenticação de teste também requer a criação de um usuário proxy da seguinte forma:

```
CREATE USER testpassword@localhost;
GRANT PROXY ON testpassword@localhost TO testuser@localhost;
```

Em seguida, forneça as opções `--user` e `--password` para essa conta ao se conectar ao servidor. Por exemplo:

```
$> mysql --user=testuser --password
Enter password: testpassword
```

O plugin obtém a senha conforme recebida do cliente e a compara com o valor armazenado na coluna `authentication_string` da linha da conta na tabela de sistema `mysql.user`. Se os dois valores corresponderem, o plugin retorna o valor `authentication_string` como o novo ID de usuário efetivo.

Você pode verificar o log de erro do servidor em busca de uma mensagem indicando se a autenticação foi bem-sucedida (observe que a senha é relatada como o “usuário”):

```
[Note] Plugin test_plugin_server reported:
'successfully authenticated user testpassword'
```