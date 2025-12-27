### 18.2.2 Espaço Necessário para Chaves

As tabelas `MyISAM` usam índices de árvore B. Você pode calcular aproximadamente o tamanho do arquivo do índice como `(comprimento da chave + 4)/0,67`, somando todas as chaves. Isso é para o caso pior quando todas as chaves são inseridas em ordem ordenada e a tabela não tem chaves compactadas.

Os índices de strings são compactados em termos de espaço. Se a primeira parte do índice for uma string, ela também é compactada por prefixo. A compactação em termos de espaço torna o arquivo do índice menor do que o número do caso pior se uma coluna de string tiver muitos espaços finais ou for uma coluna `VARCHAR` que não é usada sempre na extensão completa. A compactação por prefixo é usada em chaves que começam com uma string. A compactação por prefixo ajuda se houver muitas strings com um prefixo idêntico.

Em tabelas `MyISAM`, você também pode comprimir números por prefixo, especificando a opção de tabela `PACK_KEYS=1` ao criar a tabela. Os números são armazenados com o byte mais alto primeiro, então isso ajuda quando você tem muitas chaves inteiras que têm um prefixo idêntico.