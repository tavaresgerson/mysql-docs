### 15.7.1 Vantagens e desvantagens da tabela MERGE

As tabelas `MERGE` podem ajudá-lo a resolver os seguintes problemas:

- Gerencie facilmente um conjunto de tabelas de log. Por exemplo, você pode colocar dados de diferentes meses em tabelas separadas, comprimir algumas delas com **myisampack** e, em seguida, criar uma tabela `MERGE` para usá-las como uma única.

- Obtenha mais velocidade. Você pode dividir uma grande tabela somente de leitura com base em alguns critérios e, em seguida, colocar tabelas individuais em discos diferentes. Uma tabela `MERGE` estruturada dessa maneira pode ser muito mais rápida do que usar uma única tabela grande.

- Realize pesquisas mais eficientes. Se você souber exatamente o que está procurando, pode pesquisar em apenas uma das tabelas subjacentes para algumas consultas e usar uma tabela `MERGE` para outras. Você pode até ter várias tabelas `MERGE` diferentes que utilizam conjuntos sobrepostos de tabelas.

- Realize reparos mais eficientes. É mais fácil reparar tabelas menores individuais que estão mapeadas para uma tabela `MERGE` do que reparar uma única tabela grande.

- Mapea rapidamente muitas tabelas como uma única. Uma tabela `MERGE` não precisa manter um índice próprio, pois utiliza os índices das tabelas individuais. Como resultado, as coleções de tabelas `MERGE` são *muito* rápidas de criar ou remapeamento. (Você ainda deve especificar as definições de índice ao criar uma tabela `MERGE`, mesmo que nenhum índice seja criado.)

- Se você tiver um conjunto de tabelas a partir do qual cria uma tabela grande sob demanda, você pode, em vez disso, criar uma tabela `MERGE` a partir delas sob demanda. Isso é muito mais rápido e economiza muito espaço em disco.

- Exceder o limite de tamanho do arquivo para o sistema operacional. Cada tabela `MyISAM` está vinculada a esse limite, mas uma coleção de tabelas `MyISAM` não está.

- Você pode criar um alias ou sinônimo para uma tabela `MyISAM` definindo uma tabela `MERGE` que mapeia para essa única tabela. Não deve haver um impacto significativo no desempenho ao fazer isso (apenas alguns chamados indiretos e chamados de `memcpy()` para cada leitura).

As desvantagens das tabelas `MERGE` são:

- Você pode usar apenas tabelas `MyISAM` idênticas para uma tabela `MERGE`.

- Algumas funcionalidades do `MyISAM` não estão disponíveis em tabelas `MERGE`. Por exemplo, você não pode criar índices `FULLTEXT` em tabelas `MERGE`. (Você pode criar índices `FULLTEXT` nas tabelas `MyISAM` subjacentes, mas não pode pesquisar a tabela `MERGE` com uma pesquisa de texto completo.)

- Se a tabela `MERGE` não for temporária, todas as tabelas `MyISAM` subjacentes também não podem ser temporárias. Se a tabela `MERGE` for temporária, as tabelas `MyISAM` podem ser uma mistura de temporárias e não temporárias.

- As tabelas `MERGE` usam mais descritores de arquivo do que as tabelas `MyISAM`. Se 10 clientes estiverem usando uma tabela `MERGE` que mapeia para 10 tabelas, o servidor usará (10 × 10) + 10 descritores de arquivo. (10 descritores de arquivo de dados para cada um dos 10 clientes e 10 descritores de arquivo de índice compartilhados entre os clientes.)

- As leituras do índice são mais lentas. Quando você lê um índice, o mecanismo de armazenamento `MERGE` precisa emitir uma leitura em todas as tabelas subjacentes para verificar qual delas mais se aproxima de um valor de índice dado. Para ler o próximo valor de índice, o mecanismo de armazenamento `MERGE` precisa procurar nos buffers de leitura para encontrar o próximo valor. Somente quando um buffer de índice é esgotado, o mecanismo de armazenamento precisa ler o próximo bloco de índice. Isso torna os índices `MERGE` muito mais lentos em pesquisas `eq_ref`, mas não muito mais lentos em pesquisas `ref`. Para mais informações sobre `eq_ref` e `ref`, consulte a Seção 13.8.2, “Instrução EXPLAIN”.
