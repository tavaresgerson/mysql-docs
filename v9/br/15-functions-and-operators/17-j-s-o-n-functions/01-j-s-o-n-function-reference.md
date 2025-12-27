### 14.17.1 Referência de Funções JSON

**Tabela 14.22 Funções JSON**

<table frame="box" rules="all" summary="Uma referência que lista todas as funções JSON.">
<tr><th>Nome</th> <th>Descrição</th> <th>Deprecado</th> </tr>
<tr><th>&lt;-&gt;</th> <td> Retorno do valor de uma coluna JSON após a avaliação do caminho; equivalente a JSON_EXTRACT().</td> <td></td> </tr>
<tr><th>&lt;&gt;&gt;</th> <td> Retorno do valor de uma coluna JSON após a avaliação do caminho e a descotação do resultado; equivalente a JSON_UNQUOTE(JSON_EXTRACT()).</td> <td></td> </tr>
<tr><th>JSON_ARRAY()</th> <td> Cria um array JSON</td> <td></td> </tr>
<tr><th>JSON_ARRAY_APPEND()</th> <td> Adiciona dados a um documento JSON</td> <td></td> </tr>
<tr><th>JSON_ARRAY_INSERT()</th> <td> Insere dados em um array JSON</td> <td></td> </tr>
<tr><th>JSON_CONTAINS()</th> <td> Verifica se o documento JSON contém um objeto específico no caminho</td> <td></td> </tr>
<tr><th>JSON_CONTAINS_PATH()</th> <td> Verifica se o documento JSON contém algum dado no caminho</td> <td></td> </tr>
<tr><th>JSON_DEPTH()</th> <td> Mínimo profundidade do documento JSON</td> <td></td> </tr>
<tr><th>JSON_DUALITY_OBJECT()</th> <td> Cria um objeto JSON de dualidade</td> <td></td> </tr>
<tr><th>JSON_EXTRACT()</th> <td> Retorna dados de um documento JSON</td> <td></td> </tr>
<tr><th>JSON_INSERT()</th> <td> Insere dados em um documento JSON</td> <td></td> </tr>
<tr><th>JSON_KEYS()</th> <td> Vetor de chaves de um documento JSON</td> <td></td> </tr>
<tr><th>JSON_LENGTH()</th> <td> Número de elementos em um documento JSON</td> <td></td> </tr>
<tr><th>JSON_MERGE()</th> <td> Mergulha documentos JSON, preservando chaves duplicadas. Sinônimo depreciado de JSON_MERGE_PRESERVE()</td> <td>Sim</td> </tr>
<tr><th>JSON_MERGE_PATCH()</th> <td> Mergulha documentos JSON, substituindo valores de chaves duplicadas</td> <td></td> </tr>
<tr><th>JSON_MERGE_PRESERVE()</th> <td> Mergulha documentos JSON, preservando chaves duplicadas</td> <td></td> </tr>
<tr><th>JSON_OBJECT()</th> <td> Cria um objeto JSON</td> <td></td> </tr>
<tr><th>JSON_OVERLAPS()</th> <td> Compara dois documentos JSON, retorna TRUE (1) se esses tiverem quaisquer pares de chave-valor ou elementos de array em comum, caso contrário, retorna FALSE (0)</td> <td></td> </tr>
<tr><th>JSON_PRETTY()</th> <td> Imprime um documento JSON em formato legível para humanos</td> <td></td> </tr>
<tr><th>JSON_QUOTE()</th> <td> Cota um documento JSON</td> <td></td> </tr>
<tr><th>JSON_REMOVE()</th> <td> Remove dados de um documento JSON</td> <td></td> </tr>
<tr><th>JSON_REPLACE()</th> <td> Substitui valores em um documento JSON</td> <td></td> </tr>
<tr><th>JSON_SCHEMA_VALID()</th> <td> Valida um documento JSON contra um esquema JSON; retorna TRUE/1 se o documento valida contra o esquema, ou FALSE/0 se não valida</th> <td></td> </tr>
<tr><th>JSON_SCHEMA_VALIDATION_REPORT()</th> <td> Valida um documento JSON contra um esquema JSON; retorna relatório em formato JSON sobre o resultado da validação, incluindo sucesso ou falha e razões para a falha</th> <td></td> </tr>
<tr><th>JSON_SEARCH()</th> <td> Caminho para o valor dentro do documento JSON</th> <td></td> </tr>
<tr><th>JSON_SET()</th> <td> Insere dados em um documento JSON</td> <td></td> </tr>
<tr><th>JSON_STORAGE_FREE()</th> <td> Espaço liberado dentro da representação binária do valor da coluna JSON após a atualização parcial</th> <td></td> </tr>
<tr><th>JSON_STORAGE_SIZE()</th> <td> Espaço usado para armazenamento da representação binária de um documento JSON</th> <td></td> </tr>
<tr><th>JSON_TABLE()</th> <td> Retorna dados de uma expressão JSON como uma tabela relacional</th> <td></td> </tr>
<tr><th>JSON_TYPE()</th> <td> Tipo do valor JSON</th> <td></td> </tr>
<tr><th>JSON_UNQUOTE()</th> <td> Descota um valor JSON</th> <td></td> </tr>
<tr><th>JSON_VALID()</th> <td> Verifica se o valor JSON é válido</th> <td></td> </tr>
<tr><th>JSON_VALUE()</th> <td> Extrai o valor de um documento JSON no local apontado pelo caminho fornecido; retorne este valor como

O MySQL suporta duas funções agregadas JSON `JSON_ARRAYAGG()` e `JSON_OBJECTAGG()`. Veja a Seção 14.19, “Funções Agregadas”, para descrições dessas funções.

O MySQL também suporta a “impressão bonita” de valores JSON em um formato fácil de ler, usando a função `JSON_PRETTY()`. Você pode ver quanto espaço de armazenamento um dado valor JSON ocupa e quanto espaço permanece para armazenamento adicional, usando `JSON_STORAGE_SIZE()` e `JSON_STORAGE_FREE()`, respectivamente. Para descrições completas dessas funções, veja a Seção 14.17.8, “Funções de Utilidade JSON”.