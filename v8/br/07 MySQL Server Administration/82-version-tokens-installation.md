#### 7.6.6.2 Instalação ou Desinstalação de Tokens de Versão

::: info Note

Se instalado, o Version Tokens envolve alguma sobrecarga. Para evitar essa sobrecarga, não o instale a menos que você planeje usá-lo.

:::

Esta seção descreve como instalar ou desinstalar Version Tokens, que é implementado em um arquivo de biblioteca de plugins contendo um plugin e funções carregáveis.

Para ser utilizável pelo servidor, o arquivo da biblioteca de plugins deve estar localizado no diretório de plugins do MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório de plugins definindo o valor de `plugin_dir` na inicialização do servidor.

O nome do arquivo base da biblioteca de plugins é `version_tokens`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar o plug-in e as funções de Tokens de Versão, use as instruções `INSTALL PLUGIN` e `CREATE FUNCTION`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

```
INSTALL PLUGIN version_tokens SONAME 'version_token.so';
CREATE FUNCTION version_tokens_set RETURNS STRING
  SONAME 'version_token.so';
CREATE FUNCTION version_tokens_show RETURNS STRING
  SONAME 'version_token.so';
CREATE FUNCTION version_tokens_edit RETURNS STRING
  SONAME 'version_token.so';
CREATE FUNCTION version_tokens_delete RETURNS STRING
  SONAME 'version_token.so';
CREATE FUNCTION version_tokens_lock_shared RETURNS INT
  SONAME 'version_token.so';
CREATE FUNCTION version_tokens_lock_exclusive RETURNS INT
  SONAME 'version_token.so';
CREATE FUNCTION version_tokens_unlock RETURNS INT
  SONAME 'version_token.so';
```

Você deve instalar as funções para gerenciar a lista de tokens de versão do servidor, mas você também deve instalar o plugin porque as funções não funcionam corretamente sem ele.

Se o plugin e as funções forem usadas em um servidor de origem de replicação, instale-as em todos os servidores de réplica também para evitar problemas de replicação.

Uma vez instalado, o plugin e as funções permanecem instalados até serem desinstalados. Para removê-los, use as instruções `UNINSTALL PLUGIN` e `DROP FUNCTION`:

```
UNINSTALL PLUGIN version_tokens;
DROP FUNCTION version_tokens_set;
DROP FUNCTION version_tokens_show;
DROP FUNCTION version_tokens_edit;
DROP FUNCTION version_tokens_delete;
DROP FUNCTION version_tokens_lock_shared;
DROP FUNCTION version_tokens_lock_exclusive;
DROP FUNCTION version_tokens_unlock;
```
