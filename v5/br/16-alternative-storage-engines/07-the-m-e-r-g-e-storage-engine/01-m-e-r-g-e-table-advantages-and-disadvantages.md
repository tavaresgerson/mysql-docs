### 15.7.1 Vantagens e Desvantagens da Tabela MERGE

Tabelas `MERGE` podem ajudar a resolver os seguintes problemas:

*   Gerenciar facilmente um conjunto de tabelas de log. Por exemplo, você pode colocar dados de meses diferentes em tabelas separadas, compactar algumas delas com o **myisampack** e, em seguida, criar uma tabela `MERGE` para usá-las como se fossem uma única tabela.

*   Obter mais velocidade. Você pode dividir uma tabela grande read-only com base em alguns critérios e, em seguida, colocar as tabelas individuais em discos diferentes. Uma tabela `MERGE` estruturada dessa forma pode ser muito mais rápida do que usar uma única tabela grande.

*   Realizar buscas mais eficientes. Se você souber exatamente o que está procurando, poderá realizar a busca em apenas uma das tabelas subjacentes para certas Queries e usar uma tabela `MERGE` para outras. Você pode até ter muitas tabelas `MERGE` diferentes que usam conjuntos de tabelas sobrepostos.

*   Realizar reparos mais eficientes. É mais fácil reparar tabelas menores individuais que são mapeadas para uma tabela `MERGE` do que reparar uma única tabela grande.

*   Mapear instantaneamente muitas tabelas como se fossem uma. Uma tabela `MERGE` não precisa manter um Index próprio porque usa os Indexes das tabelas individuais. Como resultado, coleções de tabelas `MERGE` são *muito* rápidas de criar ou remapear. (Você ainda deve especificar as definições do Index ao criar uma tabela `MERGE`, mesmo que nenhum Index seja criado.)

*   Se você tiver um conjunto de tabelas a partir das quais cria uma tabela grande sob demanda, você pode, em vez disso, criar uma tabela `MERGE` a partir delas sob demanda. Isso é muito mais rápido e economiza bastante espaço em disco.

*   Exceder o limite de tamanho de arquivo do sistema operacional. Cada tabela `MyISAM` está sujeita a esse limite, mas uma coleção de tabelas `MyISAM` não está.

*   Você pode criar um alias ou sinônimo para uma tabela `MyISAM` definindo uma tabela `MERGE` que mapeia para essa tabela única. Não deve haver um impacto notável no performance ao fazer isso (apenas algumas chamadas indiretas e chamadas `memcpy()` para cada leitura).

As desvantagens das tabelas `MERGE` são:

*   Você pode usar apenas tabelas `MyISAM` idênticas para uma tabela `MERGE`.

*   Alguns recursos `MyISAM` estão indisponíveis em tabelas `MERGE`. Por exemplo, você não pode criar Indexes `FULLTEXT` em tabelas `MERGE`. (Você pode criar Indexes `FULLTEXT` nas tabelas `MyISAM` subjacentes, mas não pode realizar buscas na tabela `MERGE` usando uma full-text search.)

*   Se a tabela `MERGE` não for temporária, todas as tabelas `MyISAM` subjacentes devem ser não temporárias. Se a tabela `MERGE` for temporária, as tabelas `MyISAM` podem ser uma mistura de temporárias e não temporárias.

*   Tabelas `MERGE` usam mais file descriptors do que tabelas `MyISAM`. Se 10 clients estiverem usando uma tabela `MERGE` que mapeia para 10 tabelas, o server usará (10 × 10) + 10 file descriptors. (10 file descriptors de dados para cada um dos 10 clients e 10 file descriptors de Index compartilhados entre os clients.)

*   Leituras de Index são mais lentas. Ao ler um Index, o Storage Engine `MERGE` precisa emitir uma leitura em todas as tabelas subjacentes para verificar qual delas corresponde mais de perto a um determinado valor de Index. Para ler o próximo valor de Index, o Storage Engine `MERGE` precisa pesquisar os read buffers para encontrar o próximo valor. Somente quando um Index buffer se esgota, o Storage Engine precisa ler o próximo Index block. Isso torna os Indexes `MERGE` muito mais lentos em buscas `eq_ref`, mas não muito mais lentos em buscas `ref`. Para mais informações sobre `eq_ref` e `ref`, consulte Seção 13.8.2, “EXPLAIN Statement”.