#### 13.7.3.3 Instrução INSTALL PLUGIN

```sql
INSTALL PLUGIN plugin_name SONAME 'shared_library_name'
```

Esta instrução instala um *plugin* de *server*. Ela requer o privilégio [`INSERT`](privileges-provided.html#priv_insert) para a tabela de sistema `mysql.plugin` porque adiciona uma linha a essa tabela para registrar o *plugin*.

*`plugin_name`* é o nome do *plugin* conforme definido na estrutura de descritor de *plugin* contida no arquivo de biblioteca (veja [Plugin Data Structures](/doc/extending-mysql/5.7/en/plugin-data-structures.html)). Nomes de *Plugin* não diferenciam maiúsculas de minúsculas (*case-sensitive*). Para compatibilidade máxima, os nomes de *plugin* devem ser limitados a letras ASCII, dígitos e sublinhado, pois são usados em arquivos-fonte C, linhas de comando *shell*, *scripts* *shell* M4 e Bourne, e ambientes SQL.

*`shared_library_name`* é o nome da biblioteca compartilhada (*shared library*) que contém o código do *plugin*. O nome inclui a extensão do nome do arquivo (por exemplo, `libmyplugin.so`, `libmyplugin.dll`, ou `libmyplugin.dylib`).

A biblioteca compartilhada deve estar localizada no diretório de *plugin* (o diretório nomeado pela variável de sistema [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir)). A biblioteca deve estar no próprio diretório de *plugin*, e não em um subdiretório. Por padrão, [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) é o diretório `plugin` sob o diretório nomeado pela variável de configuração `pkglibdir`, mas pode ser alterada definindo o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) na inicialização do *server*. Por exemplo, defina seu valor em um arquivo `my.cnf`:

```sql
[mysqld]
plugin_dir=/path/to/plugin/directory
```

Se o valor de [`plugin_dir`](server-system-variables.html#sysvar_plugin_dir) for um nome de caminho relativo, ele é considerado relativo ao diretório base do MySQL (o valor da variável de sistema [`basedir`](server-system-variables.html#sysvar_basedir)).

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") carrega e inicializa o código do *plugin* para torná-lo disponível para uso. Um *plugin* é inicializado executando sua função de inicialização, que trata de qualquer configuração que o *plugin* deva realizar antes de ser usado. Quando o *server* é desligado (*shuts down*), ele executa a função de desinicialização para cada *plugin* que foi carregado, de modo que o *plugin* tenha a chance de realizar qualquer limpeza final (*cleanup*).

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") também registra o *plugin* adicionando uma linha que indica o nome do *plugin* e o nome do arquivo de biblioteca à tabela de sistema `mysql.plugin`. Durante a sequência normal de inicialização (*startup*), o *server* carrega e inicializa os *plugins* registrados em `mysql.plugin`. Isso significa que um *plugin* é instalado com [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") apenas uma vez, e não toda vez que o *server* é iniciado. Se o *server* for iniciado com a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables), os *plugins* registrados na tabela `mysql.plugin` não são carregados e ficam indisponíveis.

Uma biblioteca de *plugin* pode conter múltiplos *plugins*. Para que cada um deles seja instalado, utilize uma instrução [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") separada. Cada instrução nomeia um *plugin* diferente, mas todas especificam o mesmo nome de biblioteca.

[`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") faz com que o *server* leia arquivos de opções (`my.cnf`) assim como acontece durante a inicialização do *server*. Isso permite que o *plugin* utilize quaisquer opções relevantes desses arquivos. É possível adicionar opções de *plugin* a um arquivo de opções mesmo antes de carregar um *plugin* (se o prefixo `loose` for usado). Também é possível desinstalar um *plugin*, editar o `my.cnf` e instalar o *plugin* novamente. Reiniciar o *plugin* dessa forma permite que ele utilize os novos valores de opção sem a necessidade de um reinício do *server*.

Para opções que controlam o carregamento individual de *plugin* na inicialização do *server*, consulte [Seção 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins"). Se você precisar carregar *plugins* para uma única inicialização de *server* quando a opção [`--skip-grant-tables`](server-options.html#option_mysqld_skip-grant-tables) for fornecida (o que indica ao *server* para não ler tabelas de sistema), use a opção [`--plugin-load`](server-options.html#option_mysqld_plugin-load). Veja [Seção 5.1.6, “Server Command Options”](server-options.html "5.1.6 Server Command Options").

Para remover um *plugin*, utilize a instrução [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement").

Para informações adicionais sobre o carregamento de *plugin*, consulte [Seção 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").

Para ver quais *plugins* estão instalados, utilize a instrução [`SHOW PLUGINS`](show-plugins.html "13.7.5.25 SHOW PLUGINS Statement") ou consulte a tabela [`PLUGINS`](information-schema-plugins-table.html "24.3.17 The INFORMATION_SCHEMA PLUGINS Table") no `INFORMATION_SCHEMA`.

Se você recompilar uma biblioteca de *plugin* e precisar reinstalá-la, você pode usar um dos seguintes métodos:

* Use [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") para desinstalar todos os *plugins* na biblioteca, instale o novo arquivo de biblioteca de *plugin* no diretório de *plugin* e, em seguida, use [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") para instalar todos os *plugins* na biblioteca. Este procedimento tem a vantagem de poder ser usado sem parar o *server*. No entanto, se a biblioteca de *plugin* contiver muitos *plugins*, você deverá emitir muitas instruções [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement") e [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement").

* Pare o *server*, instale o novo arquivo de biblioteca de *plugin* no diretório de *plugin* e reinicie o *server*.