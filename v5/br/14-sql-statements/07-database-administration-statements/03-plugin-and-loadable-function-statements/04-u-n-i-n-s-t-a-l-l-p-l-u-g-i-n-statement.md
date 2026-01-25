#### 13.7.3.4 Instrução UNINSTALL PLUGIN

```sql
UNINSTALL PLUGIN plugin_name
```

Esta instrução remove um Plugin de Server instalado. [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") é o complemento de [`INSTALL PLUGIN`](install-plugin.html "13.7.3.3 INSTALL PLUGIN Statement"). Ela requer o privilégio [`DELETE`](privileges-provided.html#priv_delete) para a system table `mysql.plugin` porque remove a linha dessa table que registra o Plugin.

*`plugin_name`* deve ser o nome de algum Plugin que esteja listado na table `mysql.plugin`. O Server executa a função de desinicialização do Plugin e remove a linha referente ao Plugin da system table `mysql.plugin`, de modo que Server restarts subsequentes não carreguem e inicializem o Plugin. [`UNINSTALL PLUGIN`](uninstall-plugin.html "13.7.3.4 UNINSTALL PLUGIN Statement") não remove o arquivo de shared library (biblioteca compartilhada) do Plugin.

Você não pode desinstalar um Plugin se alguma Table que o utiliza estiver aberta.

A remoção de um Plugin tem implicações para o uso das Tables associadas. Por exemplo, se um Plugin de full-text parser estiver associado a um `FULLTEXT` Index na Table, a desinstalação do Plugin torna a Table inutilizável. Qualquer tentativa de acessar a Table resulta em um Error. A Table não pode sequer ser aberta, então você não pode fazer o Drop de um Index para o qual o Plugin é utilizado. Isso significa que desinstalar um Plugin é algo a ser feito com cautela, a menos que você não se preocupe com o conteúdo da Table. Se você estiver desinstalando um Plugin sem intenção de reinstalá-lo mais tarde e se preocupa com o conteúdo da Table, você deve fazer o Dump da Table com [**mysqldump**](mysqldump.html "4.5.4 mysqldump — A Database Backup Program") e remover a Clause `WITH PARSER` da instrução [`CREATE TABLE`](create-table.html "13.1.18 CREATE TABLE Statement") do Dump para que você possa recarregar a Table mais tarde. Se você não se preocupa com a Table, [`DROP TABLE`](drop-table.html "13.1.29 DROP TABLE Statement") pode ser utilizada mesmo que quaisquer Plugins associados à Table estejam ausentes.

Para informações adicionais sobre o carregamento de Plugins, consulte [Section 5.5.1, “Installing and Uninstalling Plugins”](plugin-loading.html "5.5.1 Installing and Uninstalling Plugins").