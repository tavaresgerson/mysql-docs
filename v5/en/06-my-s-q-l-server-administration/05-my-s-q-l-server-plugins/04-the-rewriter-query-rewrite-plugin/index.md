### 5.5.4 O Plugin de Reescrita de Query Rewriter

[5.5.4.1 Instalando ou Desinstalando o Plugin de Reescrita de Query Rewriter](rewriter-query-rewrite-plugin-installation.html)

[5.5.4.2 Usando o Plugin de Reescrita de Query Rewriter](rewriter-query-rewrite-plugin-usage.html)

[5.5.4.3 Referência do Plugin de Reescrita de Query Rewriter](rewriter-query-rewrite-plugin-reference.html)

O MySQL suporta *query rewrite plugins* (plugins de reescrita de Query) que podem examinar e possivelmente modificar instruções SQL recebidas pelo *server* antes que o *server* as execute. Consulte [Query Rewrite Plugins](/doc/extending-mysql/5.7/en/plugin-types.html#query-rewrite-plugin-type).

As distribuições MySQL incluem um *postparse query rewrite plugin* (plugin de reescrita de Query pós-parse) chamado `Rewriter` e scripts para instalar o *plugin* e seus elementos associados. Esses elementos trabalham em conjunto para fornecer a capacidade de reescrita de [`SELECT`](select.html "13.2.9 SELECT Statement"):

*   Um *plugin server-side* chamado `Rewriter` examina instruções [`SELECT`](select.html "13.2.9 SELECT Statement") e pode reescrevê-las, com base no seu *cache in-memory* de regras de reescrita. Instruções [`SELECT`](select.html "13.2.9 SELECT Statement") autônomas e instruções [`SELECT`](select.html "13.2.9 SELECT Statement") em *prepared statements* estão sujeitas à reescrita. Instruções [`SELECT`](select.html "13.2.9 SELECT Statement") que ocorrem dentro de definições de *view* ou *stored programs* não estão sujeitas à reescrita.

*   O *plugin* `Rewriter` usa um *Database* chamado `query_rewrite` que contém uma *table* chamada `rewrite_rules`. A *table* fornece armazenamento persistente para as regras que o *plugin* utiliza para decidir se deve reescrever as instruções. Os usuários se comunicam com o *plugin* modificando o conjunto de regras armazenadas nesta *table*. O *plugin* se comunica com os usuários definindo a coluna `message` das linhas da *table*.

*   O *Database* `query_rewrite` contém uma *Stored Procedure* chamada `flush_rewrite_rules()` que carrega o conteúdo da *table* de regras no *plugin*.

*   Uma função carregável chamada [`load_rewrite_rules()`](rewriter-query-rewrite-plugin-reference.html#function_load-rewrite-rules) é usada pela *Stored Procedure* `flush_rewrite_rules()`.

*   O *plugin* `Rewriter` expõe *System Variables* que permitem a configuração do *plugin* e *Status Variables* que fornecem informações operacionais em tempo de execução (*runtime*).

As seções a seguir descrevem como instalar e usar o *plugin* `Rewriter` e fornecem informações de referência para seus elementos associados.