### 7.6.4 O Plugin de Reescrita de Consultas Rewriter

7.6.4.1 Instalando ou Desinstalando o Plugin de Reescrita de Consultas Rewriter

7.6.4.2 Usando o Plugin de Reescrita de Consultas Rewriter

7.6.4.3 Referência do Plugin de Reescrita de Consultas Rewriter

O MySQL suporta plugins de reescrita de consultas que podem examinar e possivelmente modificar instruções SQL recebidas pelo servidor antes de serem executadas por ele. Consulte Plugins de Reescrita de Consultas.

As distribuições do MySQL incluem um plugin de reescrita de consultas pós-análise chamado `Rewriter` e scripts para instalar o plugin e seus elementos associados. Esses elementos trabalham juntos para fornecer a capacidade de reescrita de instruções:

* Um plugin do lado do servidor chamado `Rewriter` examina as instruções e pode reescrevê-las, com base em seu cache de regras de reescrita na memória.

* Essas instruções estão sujeitas à reescrita: `SELECT`, `INSERT`, `REPLACE`, `UPDATE` e `DELETE`.

  Instruções independentes e instruções preparadas estão sujeitas à reescrita. Instruções que ocorrem dentro de definições de visualizações ou programas armazenados não estão sujeitas à reescrita.

* O plugin `Rewriter` usa um banco de dados chamado `query_rewrite` contendo uma tabela chamada `rewrite_rules`. A tabela fornece armazenamento persistente para as regras que o plugin usa para decidir se reescreve as instruções. Os usuários se comunicam com o plugin modificando o conjunto de regras armazenadas nesta tabela. O plugin se comunica com os usuários definindo a coluna `message` das linhas da tabela.

* O banco de dados `query_rewrite` contém um procedimento armazenado chamado `flush_rewrite_rules()` que carrega o conteúdo da tabela de regras para o plugin.

* Uma função carregável chamada `load_rewrite_rules()` é usada pelo procedimento armazenado `flush_rewrite_rules()`.

* O plugin `Rewriter` exibe variáveis de sistema que permitem a configuração do plugin e variáveis de status que fornecem informações operacionais em tempo de execução. Este plugin também suporta um privilégio (`SKIP_QUERY_REWRITE`) que protege as consultas de um usuário específico de serem reescritas.

As seções a seguir descrevem como instalar e usar o plugin `Rewriter` e fornecem informações de referência para seus elementos associados.