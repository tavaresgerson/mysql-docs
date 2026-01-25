### 6.5.2 Instalação ou Desinstalação do MySQL Enterprise Data Masking and De-Identification

Esta seção descreve como instalar ou desinstalar o MySQL Enterprise Data Masking and De-Identification, que é implementado como um arquivo de biblioteca de plugin contendo um plugin e várias loadable functions. Para informações gerais sobre como instalar ou desinstalar plugins e loadable functions, consulte [Seção 5.5.1, “Instalação e Desinstalação de Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins"), e [Seção 5.6.1, “Instalação e Desinstalação de Loadable Functions”](function-loading.html "5.6.1 Installing and Uninstalling Loadable Functions").

Para ser utilizável pelo server, o arquivo da biblioteca de plugin deve estar localizado no diretório de plugin do MySQL (o diretório nomeado pela system variable [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). Se necessário, configure a localização do diretório de plugin definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do server.

O nome base do arquivo da biblioteca de plugin é `data_masking`. O sufixo do nome do arquivo difere por plataforma (por exemplo, `.so` para sistemas Unix e similares a Unix, `.dll` para Windows).

Para instalar o plugin e as functions do MySQL Enterprise Data Masking and De-Identification, use as instruções [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") e [`CREATE FUNCTION`](create-function.html "13.1.13 CREATE FUNCTION Statement"), ajustando o sufixo `.so` para sua plataforma conforme necessário:

```sql
INSTALL PLUGIN data_masking SONAME 'data_masking.so';
CREATE FUNCTION gen_blacklist RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_dictionary RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_dictionary_drop RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_dictionary_load RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_range RETURNS INTEGER
  SONAME 'data_masking.so';
CREATE FUNCTION gen_rnd_email RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_rnd_pan RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_rnd_ssn RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION gen_rnd_us_phone RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_inner RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_outer RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_pan RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_pan_relaxed RETURNS STRING
  SONAME 'data_masking.so';
CREATE FUNCTION mask_ssn RETURNS STRING
  SONAME 'data_masking.so';
```

Se o plugin e as functions forem utilizados em um replication source server, instale-os em todos os replica servers também para evitar problemas de replication.

Uma vez instalados conforme descrito, o plugin e as functions permanecem instalados até que sejam desinstalados. Para removê-los, use as instruções [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") e [`DROP FUNCTION`](drop-function.html "13.1.24 DROP FUNCTION Statement"):

```sql
UNINSTALL PLUGIN data_masking;
DROP FUNCTION gen_blacklist;
DROP FUNCTION gen_dictionary;
DROP FUNCTION gen_dictionary_drop;
DROP FUNCTION gen_dictionary_load;
DROP FUNCTION gen_range;
DROP FUNCTION gen_rnd_email;
DROP FUNCTION gen_rnd_pan;
DROP FUNCTION gen_rnd_ssn;
DROP FUNCTION gen_rnd_us_phone;
DROP FUNCTION mask_inner;
DROP FUNCTION mask_outer;
DROP FUNCTION mask_pan;
DROP FUNCTION mask_pan_relaxed;
DROP FUNCTION mask_ssn;
```