### 18.7.1 Vantagens e Desvantagens das Tabelas `MERGE`

As tabelas `MERGE` podem ajudá-lo a resolver os seguintes problemas:

* Gerenciar facilmente um conjunto de tabelas de log. Por exemplo, você pode colocar dados de diferentes meses em tabelas separadas, comprimir algumas delas com **myisampack** e, em seguida, criar uma tabela `MERGE` para usá-las como uma única tabela.

* Obter mais velocidade. Você pode dividir uma grande tabela de leitura somente para leitura com base em alguns critérios e, em seguida, colocar tabelas individuais em discos diferentes. Uma tabela `MERGE` estruturada dessa maneira pode ser muito mais rápida do que usar uma única tabela grande.

* Realizar pesquisas mais eficientes. Se você sabe exatamente o que está procurando, pode pesquisar em apenas uma das tabelas subjacentes para algumas consultas e usar uma tabela `MERGE` para outras. Você pode até ter muitas tabelas `MERGE` diferentes que usam conjuntos sobrepostos de tabelas.

* Realizar reparos mais eficientes. É mais fácil reparar tabelas individuais menores que estão mapeadas a uma tabela `MERGE` do que reparar uma única tabela grande.

* Mapear instantaneamente muitas tabelas como uma única. Uma tabela `MERGE` não precisa manter um índice próprio porque usa os índices das tabelas individuais. Como resultado, as coleções de tabelas `MERGE` são *muito* rápidas de criar ou remappear. (Você ainda deve especificar as definições de índice ao criar uma tabela `MERGE`, mesmo que nenhum índice seja criado.)

* Se você tiver um conjunto de tabelas a partir do qual cria uma grande tabela sob demanda, você pode, em vez disso, criar uma tabela `MERGE` a partir delas sob demanda. Isso é muito mais rápido e economiza muito espaço em disco.

* Exceder o limite de tamanho do arquivo para o sistema operacional. Cada tabela `MyISAM` é limitada por esse limite, mas uma coleção de tabelas `MyISAM` não é.

* Você pode criar um alias ou sinônimo para uma tabela `MyISAM` definindo uma tabela `MERGE` que mapeia para essa única tabela. Não deve haver um impacto significativo no desempenho ao fazer isso (apenas alguns chamados indiretos e chamados de `memcpy()` para cada leitura).

As desvantagens das tabelas `MERGE` são:

* Você pode usar apenas tabelas `MyISAM` idênticas para uma tabela `MERGE`.

* Algumas funcionalidades da `MyISAM` não estão disponíveis em tabelas `MERGE`. Por exemplo, você não pode criar índices `FULLTEXT` em tabelas `MERGE`. (Você pode criar índices `FULLTEXT` nas tabelas `MyISAM` subjacentes, mas não pode pesquisar a tabela `MERGE` com uma pesquisa de texto completo.)

* Se a tabela `MERGE` não for temporária, todas as tabelas `MyISAM` subjacentes devem ser não temporárias. Se a tabela `MERGE` for temporária, as tabelas `MyISAM` podem ser uma mistura de temporárias e não temporárias.

* As tabelas `MERGE` usam mais descritores de arquivo do que as tabelas `MyISAM`. Se 10 clientes estiverem usando uma tabela `MERGE` que mapeia para 10 tabelas, o servidor usa (10 × 10) + 10 descritores de arquivo. (10 descritores de arquivo de dados para cada um dos 10 clientes e 10 descritores de arquivo de índice compartilhados entre os clientes.)

* As leituras de índice são mais lentas. Quando você lê um índice, o motor de armazenamento `MERGE` precisa emitir uma leitura em todas as tabelas subjacentes para verificar qual delas mais se aproxima de um valor de índice dado. Para ler o próximo valor de índice, o motor de armazenamento `MERGE` precisa pesquisar os buffers de leitura para encontrar o próximo valor. Somente quando um buffer de índice é usado, o motor de armazenamento precisa ler o próximo bloco de índice. Isso torna os índices `MERGE` muito mais lentos em pesquisas `eq_ref`, mas não muito mais lentos em pesquisas `ref`. Para mais informações sobre `eq_ref` e `ref`, consulte a Seção 15.8.2, “Instrução EXPLAIN”.