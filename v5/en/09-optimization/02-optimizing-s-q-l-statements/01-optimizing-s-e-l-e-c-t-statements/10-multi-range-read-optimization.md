#### 8.2.1.10 Otimização Multi-Range Read

A leitura de linhas usando um *range scan* em um *secondary index* pode resultar em muitos *disk accesses* aleatórios à *base table* quando a tabela é grande e não está armazenada no *cache* do *storage engine*. Com a otimização *Disk-Sweep Multi-Range Read* (MRR), o MySQL tenta reduzir o número de *disk accesses* aleatórios para *range scans*, primeiro escaneando apenas o *index* e coletando as *keys* para as linhas relevantes. Em seguida, as *keys* são ordenadas e, finalmente, as linhas são recuperadas da *base table* usando a ordem da *primary key*. A motivação para o *Disk-sweep* MRR é reduzir o número de *disk accesses* aleatórios e, em vez disso, alcançar um *scan* mais sequencial dos dados da *base table*.

A otimização *Multi-Range Read* oferece os seguintes benefícios:

*   O MRR permite que as linhas de dados sejam acessadas sequencialmente, em vez de em ordem aleatória, com base em *index tuples*. O servidor obtém um conjunto de *index tuples* que satisfazem as condições da *Query*, classifica-os de acordo com a ordem do ID da linha de dados e usa os *tuples* classificados para recuperar as linhas de dados em ordem. Isso torna o acesso aos dados mais eficiente e menos custoso.

*   O MRR permite o processamento em lote de solicitações para acesso por *key* em operações que exigem acesso a linhas de dados por meio de *index tuples*, como *range index scans* e *equi-joins* que usam um *index* para o atributo de *join*. O MRR itera sobre uma sequência de *index ranges* para obter *index tuples* qualificados. À medida que esses resultados se acumulam, eles são usados para acessar as linhas de dados correspondentes. Não é necessário adquirir todos os *index tuples* antes de começar a ler as linhas de dados.

A otimização MRR não é suportada com *secondary indexes* criados em colunas geradas virtuais. O `InnoDB` suporta *secondary indexes* em colunas geradas virtuais.

Os seguintes cenários ilustram quando a otimização MRR pode ser vantajosa:

Cenário A: O MRR pode ser usado para tabelas `InnoDB` e `MyISAM` para *index range scans* e operações *equi-join*.

1. Uma parte dos *index tuples* é acumulada em um *buffer*.
2. Os *tuples* no *buffer* são classificados pelo ID da linha de dados.
3. As linhas de dados são acessadas de acordo com a sequência de *index tuples* classificados.

Cenário B: O MRR pode ser usado para tabelas `NDB` para *multiple-range index scans* ou ao executar um *equi-join* por um atributo.

1. Uma parte dos *ranges*, possivelmente *single-key ranges*, é acumulada em um *buffer* no nó central onde a *Query* é submetida.

2. Os *ranges* são enviados aos nós de execução que acessam as linhas de dados.

3. As linhas acessadas são empacotadas em pacotes e enviadas de volta ao nó central.

4. Os pacotes recebidos com linhas de dados são colocados em um *buffer*.

5. As linhas de dados são lidas do *buffer*.

Quando o MRR é usado, a coluna `Extra` na saída do `EXPLAIN` mostra `Using MRR`.

O `InnoDB` e o `MyISAM` não usam o MRR se as linhas completas da tabela não precisarem ser acessadas para produzir o resultado da *Query*. Este é o caso se os resultados puderem ser produzidos inteiramente com base nas informações nos *index tuples* (por meio de um *covering index*); o MRR não oferece benefício.

Duas *flags* da *system variable* `optimizer_switch` fornecem uma interface para o uso da otimização MRR. A *flag* `mrr` controla se o MRR está habilitado. Se `mrr` estiver habilitada (`on`), a *flag* `mrr_cost_based` controla se o *optimizer* tenta fazer uma escolha baseada em custo entre usar ou não o MRR (`on`) ou usa o MRR sempre que possível (`off`). Por padrão, `mrr` é `on` e `mrr_cost_based` é `on`. Consulte a Seção 8.9.2, “Otimizações Alternáveis”.

Para o MRR, um *storage engine* usa o valor da *system variable* `read_rnd_buffer_size` como uma diretriz para a quantidade de memória que pode alocar para seu *buffer*. O *engine* usa até `read_rnd_buffer_size` bytes e determina o número de *ranges* a serem processados em uma única passagem.