#### 7.6.7.1 Instalação do Plugin Clone

Esta seção descreve como instalar e configurar o plugin de clonagem. Para operações de clonagem remota, o plugin de clonagem deve ser instalado nas instâncias do servidor MySQL doador e receptor.

Para informações gerais sobre a instalação ou desinstalação de plug-ins, consulte a secção 7.6.1, "Instalar e desinstalar plug-ins".

Para ser utilizável pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, defina o valor de `plugin_dir` na inicialização do servidor para informar ao servidor a localização do diretório do plugin.

O nome do arquivo base da biblioteca de plugins é `mysql_clone.so`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para carregar o plugin na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com este método de carregamento do plugin, a opção deve ser dada a cada vez que o servidor é iniciado. Por exemplo, coloque essas linhas no seu arquivo `my.cnf`, ajustando a extensão do nome do arquivo da biblioteca do plugin para a sua plataforma conforme necessário. (A extensão do nome do arquivo da biblioteca do plugin depende da sua plataforma. Os sufixos comuns são `.so` para Unix e sistemas semelhantes a Unix, `.dll` para Windows.)

```
[mysqld]
plugin-load-add=mysql_clone.so
```

Depois de modificar o `my.cnf`, reinicie o servidor para fazer com que as novas configurações tomem efeito.

::: info Note

A opção `--plugin-load-add` não pode ser usada para carregar o plugin clone ao reiniciar o servidor durante uma atualização de uma versão anterior do MySQL. Nesses casos, tentar reiniciar o servidor com `plugin-load-add=mysql_clone.so` levanta o erro \[ERROR] \[MY-013238] \[Server] Erro de instalação do plugin 'clone': Não pode ser instalado durante a atualização. Para evitar que isso aconteça, atualize o servidor antes de tentar iniciar o servidor com `plugin-load-add=mysql_clone.so`.

:::

Alternativamente, para carregar o plugin no tempo de execução, use esta instrução, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN clone SONAME 'mysql_clone.so';
```

`INSTALL PLUGIN` carrega o plugin e também o registra na tabela de sistema `mysql.plugins` para fazer com que o plugin seja carregado para cada inicialização normal subsequente do servidor sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela de esquema de informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (ver Seção 7.6.2, Obtenção de Informações do Plugin do Servidor).

```
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME = 'clone';
+------------------------+---------------+
| PLUGIN_NAME            | PLUGIN_STATUS |
+------------------------+---------------+
| clone                  | ACTIVE        |
+------------------------+---------------+
```

Se o plugin não conseguir inicializar, verifique o log de erro do servidor para mensagens de diagnóstico relacionadas a clones ou plugins.

Se o plugin foi previamente registrado com `INSTALL PLUGIN` ou está carregado com `--plugin-load-add`, você pode usar a `--clone` opção no início do servidor para controlar o estado de ativação do plugin. Por exemplo, para carregar o plugin no início e evitar que ele seja removido no tempo de execução, use estas opções:

```
[mysqld]
plugin-load-add=mysql_clone.so
clone=FORCE_PLUS_PERMANENT
```

Se você quiser evitar que o servidor funcione sem o plugin clone, use `--clone` com um valor de `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar a inicialização do servidor a falhar se o plugin não se inicializar com sucesso.

Para mais informações sobre os estados de ativação do plugin, consulte Controle do estado de ativação do plugin.
