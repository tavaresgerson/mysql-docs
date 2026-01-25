#### 5.5.5.2 Instalação ou Desinstalação de Version Tokens

Nota

Se instalados, os Version Tokens envolvem algum overhead. Para evitar esse overhead, não os instale a menos que planeje usá-los.

Esta seção descreve como instalar ou desinstalar Version Tokens, que são implementados em um arquivo de biblioteca de plugin contendo um plugin e funções carregáveis (loadable functions). Para obter informações gerais sobre como instalar ou desinstalar plugins e loadable functions, consulte [Seção 5.5.1, “Instalação e Desinstalação de Plugins”](plugin-loading.html "5.5.1 Instalação e Desinstalação de Plugins"), e [Seção 5.6.1, “Instalação e Desinstalação de Loadable Functions”](function-loading.html "5.6.1 Instalação e Desinstalação de Loadable Functions").

Para ser utilizável pelo server, o arquivo de biblioteca do plugin deve estar localizado no diretório de plugin do MySQL (o diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure a localização do diretório de plugin definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do server.

O nome base do arquivo de biblioteca do plugin é `version_tokens`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e similares a Unix, `.dll` para Windows).

Para instalar o plugin e as functions do Version Tokens, use as statements [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 Declaração INSTALL PLUGIN") e [`CREATE FUNCTION`](create-function.html "13.1.13 Declaração CREATE FUNCTION"), ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
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

Você deve instalar as functions para gerenciar a lista de version token do server, mas também deve instalar o plugin porque as functions não funcionam corretamente sem ele.

Se o plugin e as functions forem usados em um replication source server, instale-os em todos os replica servers também para evitar problemas de replication.

Uma vez instalados conforme descrito, o plugin e as functions permanecem instalados até serem desinstalados. Para removê-los, use as statements [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 Declaração UNINSTALL PLUGIN") e [`DROP FUNCTION`](drop-function.html "13.1.24 Declaração DROP FUNCTION"):

```sql
UNINSTALL PLUGIN version_tokens;
DROP FUNCTION version_tokens_set;
DROP FUNCTION version_tokens_show;
DROP FUNCTION version_tokens_edit;
DROP FUNCTION version_tokens_delete;
DROP FUNCTION version_tokens_lock_shared;
DROP FUNCTION version_tokens_lock_exclusive;
DROP FUNCTION version_tokens_unlock;
```