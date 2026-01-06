#### 6.4.3.1 Instalação do Plugin de Validação de Senha

Esta seção descreve como instalar o plugin de validação de senha `validate_password`. Para informações gerais sobre como instalar plugins, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins”.

Nota

Se você instalou o MySQL 5.7 usando o [repositório MySQL Yum](https://dev.mysql.com/downloads/repo/yum/), [repositório SLES MySQL](https://dev.mysql.com/downloads/repo/suse/) ou pacotes RPM fornecidos pela Oracle, o `validate_password` é ativado por padrão após você iniciar o seu servidor MySQL pela primeira vez.

Para que o plugin possa ser usado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

O nome de base do arquivo da biblioteca de plugins é `validate_password`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e sistemas semelhantes ao Unix, `.dll` para Windows).

Para carregar o plugin no início do servidor, use a opção `--plugin-load-add` para nomear o arquivo da biblioteca que o contém. Com esse método de carregamento de plugins, a opção deve ser fornecida toda vez que o servidor for iniciado. Por exemplo, coloque essas linhas no arquivo `my.cnf` do servidor, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
[mysqld]
plugin-load-add=validate_password.so
```

Depois de modificar o `my.cnf`, reinicie o servidor para que as novas configurações entrem em vigor.

Como alternativa, para carregar o plugin em tempo de execução, use esta declaração, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
INSTALL PLUGIN validate_password SONAME 'validate_password.so';
```

`INSTALE O PLUGIN` carrega o plugin e também o registra na tabela `mysql.plugins` do sistema para que o plugin seja carregado em cada inicialização normal do servidor subsequente, sem a necessidade de `--plugin-load-add`.

Para verificar a instalação do plugin, examine a tabela Schema de Informações `PLUGINS` ou use a declaração `SHOW PLUGINS` (consulte Seção 5.5.2, “Obtendo Informações de Plugins do Servidor”). Por exemplo:

```sql
mysql> SELECT PLUGIN_NAME, PLUGIN_STATUS
       FROM INFORMATION_SCHEMA.PLUGINS
       WHERE PLUGIN_NAME LIKE 'validate%';
+-------------------+---------------+
| PLUGIN_NAME       | PLUGIN_STATUS |
+-------------------+---------------+
| validate_password | ACTIVE        |
+-------------------+---------------+
```

Se o plugin não conseguir se inicializar, verifique o log de erro do servidor para obter mensagens de diagnóstico.

Se o plugin tiver sido registrado anteriormente com `INSTALL PLUGIN` ou estiver carregado com `--plugin-load-add`, você pode usar a opção `--validate-password` na inicialização do servidor para controlar a ativação do plugin. Por exemplo, para carregar o plugin na inicialização e impedir que ele seja removido durante a execução, use essas opções:

```sql
[mysqld]
plugin-load-add=validate_password.so
validate-password=FORCE_PLUS_PERMANENT
```

Se quiser impedir que o servidor seja executado sem o plugin de validação de senha, use `--validate-password` com o valor `FORCE` ou `FORCE_PLUS_PERMANENT` para forçar o falhamento da inicialização do servidor se o plugin não se inicializar com sucesso.
