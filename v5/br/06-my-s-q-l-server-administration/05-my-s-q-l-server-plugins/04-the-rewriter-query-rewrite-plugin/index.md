### 5.5.4 O Plugin de Reescrita de Consultas Rewriter

5.5.4.1 Instalação ou Desinstalação do Plugin de Reescrita de Consultas do Rewriter

5.5.4.2 Uso do Plugin de Reescrita de Consultas do Rewriter

5.5.4.3 Referência do Plugin de Reescrita de Consultas de Reescritor

O MySQL suporta plugins de reescrita de consultas que podem examinar e, possivelmente, modificar as instruções SQL recebidas pelo servidor antes que o servidor as execute. Veja Plugins de Reescrita de Consultas.

As distribuições do MySQL incluem um plugin de reescrita de consultas postparse chamado `Rewriter` e scripts para instalar o plugin e seus elementos associados. Esses elementos trabalham juntos para fornecer a capacidade de reescrita de `SELECT` (select.html):

- Um plugin do lado do servidor chamado `Rewriter` examina as instruções `SELECT` (select.html) e pode reescrevê-las, com base em seu cache de regras de reescrita na memória. As instruções `SELECT` (select.html) autônomas e as instruções `SELECT` (select.html) em instruções preparadas estão sujeitas à reescrita. As instruções `SELECT` (select.html) que ocorrem dentro de definições de visualizações ou programas armazenados não estão sujeitas à reescrita.

- O plugin `Rewriter` usa um banco de dados chamado `query_rewrite` que contém uma tabela chamada `rewrite_rules`. A tabela fornece armazenamento persistente para as regras que o plugin usa para decidir se deve reescrever declarações. Os usuários se comunicam com o plugin modificando o conjunto de regras armazenadas nesta tabela. O plugin se comunica com os usuários definindo a coluna `message` das linhas da tabela.

- O banco de dados `query_rewrite` contém um procedimento armazenado chamado `flush_rewrite_rules()`, que carrega o conteúdo da tabela de regras no plugin.

- Uma função carregável chamada `load_rewrite_rules()` é usada pelo procedimento armazenado `flush_rewrite_rules()`.

- O plugin `Rewriter` exibe variáveis de sistema que permitem a configuração do plugin e variáveis de status que fornecem informações operacionais em tempo de execução.

As seções a seguir descrevem como instalar e usar o plugin `Rewriter` e fornecem informações de referência para seus elementos associados.
