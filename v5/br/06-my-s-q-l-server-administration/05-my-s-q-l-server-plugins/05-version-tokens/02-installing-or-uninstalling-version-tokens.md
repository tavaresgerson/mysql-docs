#### 5.5.5.2 Instalar ou desinstalar tokens de versão

Nota

Se instalado, o Token de Versão gera algum overhead. Para evitar esse overhead, não o instale a menos que você planeje usá-lo.

Esta seção descreve como instalar ou desinstalar Tokens de Versão, que é implementado em um arquivo de biblioteca de plugins que contém um plugin e funções carregáveis. Para informações gerais sobre como instalar ou desinstalar plugins e funções carregáveis, consulte Seção 5.5.1, “Instalando e Desinstalando Plugins” e Seção 5.6.1, “Instalando e Desinstalando Funções Carregáveis”.

Para que o plugin possa ser usado pelo servidor, o arquivo da biblioteca do plugin deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin definindo o valor de `plugin_dir` durante o início do servidor.

O nome de base do arquivo da biblioteca de plugins é `version_tokens`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e sistemas semelhantes ao Unix, `.dll` para Windows).

Para instalar o plugin e as funções de Tokens de Versão, use as instruções `INSTALL PLUGIN` e `CREATE FUNCTION`, ajustando o sufixo `.so` para sua plataforma conforme necessário:

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

Você deve instalar as funções para gerenciar a lista de tokens da versão do servidor, mas também deve instalar o plugin, pois as funções não funcionam corretamente sem ele.

Se o plugin e as funções forem usados em um servidor de origem de replicação, instale-os em todos os servidores replicados para evitar problemas de replicação.

Uma vez instalado conforme descrito, o plugin e as funções permanecem instalados até serem desinstalados. Para removê-los, use as instruções `UNINSTALL PLUGIN` e `DROP FUNCTION`:

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
