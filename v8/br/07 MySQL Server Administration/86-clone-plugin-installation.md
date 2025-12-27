#### 7.6.7.1 Instalação do Plugin de Clone

Esta seção descreve como instalar e configurar o plugin de clone. Para operações de clonagem remota, o plugin de clone deve ser instalado nas instâncias do servidor MySQL do doador e do receptor.

Para obter informações gerais sobre a instalação ou desinstalação de plugins, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”.

Para que o plugin seja utilizável pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, defina o valor de `plugin_dir` no início do servidor para informar ao servidor a localização do diretório do plugin.

O nome base do arquivo da biblioteca do plugin é `mysql_clone.so`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para carregar o plugin no início do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Por exemplo, coloque essas linhas em seu arquivo `my.cnf`, ajustando a extensão do nome do arquivo da biblioteca do plugin para sua plataforma conforme necessário. (A extensão do nome do arquivo da biblioteca do plugin depende da sua plataforma. Sufixos comuns são `.so` para sistemas Unix e Unix-like, `.dll` para Windows.)

```
[mysqld]
plugin-load-add=mysql_clone.so
```

Após modificar `my.cnf`, reinicie o servidor para fazer com que as novas configurações entrem em vigor.

::: info Nota

A opção `--plugin-load-add` não pode ser usada para carregar o plugin de clone ao reiniciar o servidor durante uma atualização de uma versão anterior do MySQL. Nesse caso, tentar reiniciar o servidor com `plugin-load-add=mysql_clone.so` gera o erro [ERROR] [MY-013238] [Server] Erro ao instalar o plugin 'clone': Não é possível instalar durante a atualização. Para evitar que isso aconteça, atualize o servidor antes de tentar iniciar o servidor com `plugin-load-add=mysql_clone.so`.

:::

Alternativamente, para carregar o plugin no tempo de execução, use esta declaração, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN clone SONAME 'mysql_clone.so';
```

O comando `INSTALL PLUGIN` carrega o plugin e também o registra na tabela do esquema de informações `mysql.plugins` para que o plugin seja carregado em cada inicialização normal do servidor sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela do esquema de informações `PLUGINS` ou use a instrução `SHOW PLUGINS` (consulte a Seção 7.6.2, “Obter informações do plugin do servidor”). Por exemplo:

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

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para mensagens de diagnóstico relacionadas ao clone ou ao plugin.

Se o plugin tiver sido registrado anteriormente com `INSTALL PLUGIN` ou estiver carregado com `--plugin-load-add`, você pode usar a opção `--clone` na inicialização do servidor para controlar o estado de ativação do plugin. Por exemplo, para carregar o plugin na inicialização e evitar que seja removido durante a execução, use essas opções:

```
[mysqld]
plugin-load-add=mysql_clone.so
clone=FORCE_PLUS_PERMANENT
```

Se você quiser impedir que o servidor seja executado sem o plugin clone, use `--clone` com o valor `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar o falha da inicialização do servidor se o plugin não se inicializar com sucesso.

Para obter mais informações sobre os estados de ativação do plugin, consulte Controlar o estado de ativação do plugin.