### 7.6.4 O Plugin Rewrite Query Rewriter

O MySQL suporta plugins de reescrita de consulta que podem examinar e possivelmente modificar instruções SQL recebidas pelo servidor antes que o servidor as execute.

As distribuições do MySQL incluem um plugin de reescrita de consulta pós-parser chamado `Rewriter` e scripts para instalar o plugin e seus elementos associados.

- Um plugin do lado do servidor chamado `Rewriter` examina instruções e pode reescrevê-las, com base em seu cache de regras de reescrita na memória.
- Estas instruções estão sujeitas a reescrita: `SELECT`, `INSERT`, `REPLACE`, `UPDATE`, e `DELETE`.

  As instruções independentes e as instruções preparadas estão sujeitas a reescrita. As instruções que ocorrem dentro das definições de visualização ou programas armazenados não estão sujeitas a reescrita.
- O plugin `Rewriter` usa um banco de dados chamado `query_rewrite` contendo uma tabela chamada `rewrite_rules`. A tabela fornece armazenamento persistente para as regras que o plugin usa para decidir se deve reescrever instruções. Os usuários se comunicam com o plugin modificando o conjunto de regras armazenadas nesta tabela. O plugin se comunica com os usuários definindo a coluna `message` das linhas da tabela.
- O banco de dados `query_rewrite` contém um procedimento armazenado chamado `flush_rewrite_rules()` que carrega o conteúdo da tabela de regras no plugin.
- Uma função carregável chamada `load_rewrite_rules()` é usada pelo procedimento armazenado `flush_rewrite_rules()`.
- O plugin `Rewriter` expõe variáveis do sistema que permitem a configuração do plugin e variáveis de status que fornecem informações operacionais de tempo de execução.

As seções a seguir descrevem como instalar e usar o plug-in `Rewriter` e fornecem informações de referência para seus elementos associados.
