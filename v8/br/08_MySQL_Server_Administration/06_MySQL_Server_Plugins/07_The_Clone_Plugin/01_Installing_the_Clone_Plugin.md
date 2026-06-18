#### 7.6.7.1 Instalar o Plugin Clone

Esta seção descreve como instalar e configurar o plugin de clonagem. Para operações de clonagem remota, o plugin de clonagem deve ser instalado nas instâncias do servidor MySQL do doador e do receptor.

Para obter informações gerais sobre a instalação ou desinstalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para que o plugin seja utilizado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, defina o valor de `plugin_dir` no início do servidor para informar ao servidor a localização do diretório do plugin.

O nome de base do arquivo da biblioteca de plugins é `mysql_clone.so`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para carregar o plugin na inicialização do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Por exemplo, coloque essas linhas em seu arquivo `my.cnf`, ajustando a extensão do nome do arquivo da biblioteca do plugin para sua plataforma conforme necessário. (A extensão do nome do arquivo da biblioteca do plugin depende da sua plataforma. Sufixos comuns são `.so` para sistemas Unix e Unix-like, `.dll` para Windows.)

```
[mysqld]
plugin-load-add=mysql_clone.so
```

Após modificar `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Nota

A opção `--plugin-load-add` não pode ser usada para carregar o plugin clone ao reiniciar o servidor durante uma atualização de uma versão anterior do MySQL. Por exemplo, após a atualização de binários ou pacotes do MySQL 5.7 para o MySQL 8.0, tentar reiniciar o servidor com `plugin-load-add=mysql_clone.so` causa esse erro: \[ERROR] \[MY-013238] \[Server] Erro ao instalar o plugin 'clone': Não é possível instalar durante a atualização. A solução é atualizar o servidor antes de tentar iniciar o servidor com `plugin-load-add=mysql_clone.so`.

Como alternativa, para carregar o plugin em tempo de execução, use esta declaração, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN clone SONAME 'mysql_clone.so';
```

`INSTALL PLUGIN` carrega o plugin e também o registra na tabela do sistema `mysql.plugins` para que o plugin seja carregado em cada inicialização normal do servidor subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obtendo Informações do Plugin do Servidor”). Por exemplo:

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

Se o plugin não conseguir se inicializar, verifique o log de erros do servidor para mensagens de diagnóstico relacionadas ao clone ou ao plugin.

Se o plugin tiver sido registrado anteriormente com `INSTALL PLUGIN` ou estiver carregado com `--plugin-load-add`, você pode usar a opção `--clone` no início do servidor para controlar o estado de ativação do plugin. Por exemplo, para carregar o plugin no início e impedir que ele seja removido durante a execução, use essas opções:

```
[mysqld]
plugin-load-add=mysql_clone.so
clone=FORCE_PLUS_PERMANENT
```

Se você quiser impedir que o servidor seja executado sem o plugin clone, use `--clone` com um valor de `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar o falhamento da inicialização do servidor se o plugin não for inicializado com sucesso.

Para obter mais informações sobre os estados de ativação de plugins, consulte o artigo Controle do estado de ativação de plugins.
