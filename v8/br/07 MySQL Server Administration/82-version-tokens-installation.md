#### 7.6.6.2 Instalando ou Desinstalando Tokens de Versão

::: info Nota

Se instalado, o Token de Versão envolve algum overhead. Para evitar esse overhead, não o instale a menos que planeje usá-lo.

:::

Esta seção descreve como instalar ou desinstalar o Token de Versão, que é implementado em um arquivo de biblioteca de plugins contendo um plugin e funções carregáveis. Para informações gerais sobre como instalar ou desinstalar plugins e funções carregáveis, consulte a Seção 7.6.1, “Instalando e Desinstalando Plugins”, e a Seção 7.7.1, “Instalando e Desinstalando Funções Carregáveis”.

Para ser usado pelo servidor, o arquivo de biblioteca de plugins deve estar localizado no diretório do plugin MySQL (o diretório nomeado pela variável de sistema `plugin_dir`). Se necessário, configure a localização do diretório do plugin configurando o valor de `plugin_dir` na inicialização do servidor.

O nome base do arquivo de biblioteca de plugins é `version_tokens`. O sufixo do nome do arquivo difere de acordo com a plataforma (por exemplo, `.so` para sistemas Unix e Unix-like, `.dll` para Windows).

Para instalar o plugin e as funções do Token de Versão, use as instruções `INSTALL PLUGIN` e `CREATE FUNCTION`, ajustando o sufixo `.so` conforme necessário para sua plataforma:

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

Você deve instalar as funções para gerenciar a lista de tokens de versão do servidor, mas também deve instalar o plugin, pois as funções não funcionam corretamente sem ele.

Se o plugin e as funções forem usados em um servidor de fonte de replicação, instale-os em todos os servidores replicados também para evitar problemas de replicação.

Uma vez instalado como descrito acima, o plugin e as funções permanecem instalados até serem desinstalados. Para removê-los, use as instruções `UNINSTALL PLUGIN` e `DROP FUNCTION`:

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