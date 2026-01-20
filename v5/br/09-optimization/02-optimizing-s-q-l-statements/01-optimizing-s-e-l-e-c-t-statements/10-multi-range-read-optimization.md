#### 8.2.1.10 Otimização de leitura de múltiplos intervalos

A leitura de linhas usando uma varredura de intervalo em um índice secundário pode resultar em muitos acessos aleatórios ao disco à tabela base quando a tabela é grande e não está armazenada no cache do mecanismo de armazenamento. Com a otimização de Leitura Multi-Intervalo de Varredura de Disco (MRR), o MySQL tenta reduzir o número de acessos aleatórios ao disco para varreduras de intervalo, primeiro escaneando o índice apenas e coletando as chaves para as linhas relevantes. Em seguida, as chaves são ordenadas e, finalmente, as linhas são recuperadas da tabela base usando a ordem da chave primária. A motivação para o MRR de varredura de disco é reduzir o número de acessos aleatórios ao disco e, em vez disso, alcançar uma varredura mais sequencial dos dados da tabela base.

A otimização da leitura de Multi-Range oferece esses benefícios:

- O MRR permite que as linhas de dados sejam acessadas sequencialmente, em vez de em ordem aleatória, com base em tuplas de índice. O servidor obtém um conjunto de tuplas de índice que satisfazem as condições da consulta, as ordena de acordo com a ordem do ID da linha de dados e usa as tuplas ordenadas para recuperar as linhas de dados em ordem. Isso torna o acesso aos dados mais eficiente e menos caro.

- O MRR permite o processamento em lote de solicitações de acesso a chaves para operações que exigem acesso a linhas de dados por meio de tuplas de índice, como varreduras de índice de intervalo e junções equi que utilizam um índice para o atributo de junção. O MRR itera sobre uma sequência de intervalos de índice para obter tuplas de índice qualificadoras. À medida que esses resultados se acumulam, eles são usados para acessar as linhas de dados correspondentes. Não é necessário adquirir todas as tuplas de índice antes de começar a ler as linhas de dados.

A otimização do MRR não é suportada com índices secundários criados em colunas geradas virtualmente. O `InnoDB` suporta índices secundários em colunas geradas virtualmente.

Os seguintes cenários ilustram quando a otimização do MRR pode ser vantajosa:

Cenário A: O MRR pode ser usado para tabelas `InnoDB` e `MyISAM` para varreduras de intervalo de índice e operações de junção equi.

1. Uma parte dos tuplos do índice é acumulada em um buffer.
2. Os tuplos no buffer são ordenados por seu ID de linha de dados.
3. As linhas de dados são acessadas de acordo com a sequência de tuplas de índice classificado.

Cenário B: O MRR pode ser usado para tabelas `NDB` em varreduras de índice de múltiplos intervalos ou quando se realiza uma junção equi por um atributo.

1. Uma parte das faixas, possivelmente faixas de uma única chave, é acumulada em um buffer no nó central onde a consulta é enviada.

2. As faixas são enviadas aos nós de execução que acessam as linhas de dados.

3. As linhas acessadas são embaladas em pacotes e enviadas de volta ao nó central.

4. Os pacotes recebidos com linhas de dados são colocados em um buffer.

5. As linhas de dados são lidas do buffer.

Quando o MRR é usado, a coluna `Extra` na saída `EXPLAIN` mostra `Usando MRR`.

`InnoDB` e `MyISAM` não usam MRR se as linhas inteiras da tabela não precisam ser acessadas para produzir o resultado da consulta. Esse é o caso se os resultados puderem ser produzidos inteiramente com base nas informações dos tuplos do índice (por meio de um índice coletor); o MRR não oferece nenhum benefício.

Duas flags da variável de sistema `optimizer_switch` fornecem uma interface para o uso da otimização MRR. A flag `mrr` controla se o MRR está habilitado. Se `mrr` estiver habilitado (`on`), a flag `mrr_cost_based` controla se o otimizador tenta fazer uma escolha baseada no custo entre usar e não usar o MRR (`on`) ou usa o MRR sempre que possível (`off`). Por padrão, `mrr` está em `on` e `mrr_cost_based` está em `on`. Veja a Seção 8.9.2, “Otimizações Desconectables”.

Para o MRR, um motor de armazenamento usa o valor da variável de sistema `read_rnd_buffer_size` como uma orientação sobre quanto memória ele pode alocar para seu buffer. O motor usa até `read_rnd_buffer_size` bytes e determina o número de faixas a serem processadas em uma única passagem.
