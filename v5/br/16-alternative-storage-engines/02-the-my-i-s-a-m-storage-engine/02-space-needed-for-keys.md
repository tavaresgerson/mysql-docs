### 15.2.2 Espaço necessário para as chaves

As tabelas `MyISAM` usam índices de árvore B. Você pode calcular aproximadamente o tamanho do arquivo do índice como `(comprimento da chave + 4)/0,67`, somando todas as chaves. Isso é para o caso pior, quando todas as chaves são inseridas em ordem ordenada e a tabela não tem chaves compactadas.

Os índices de strings são compactados em termos de espaço. Se a primeira parte do índice for uma string, ela também é compactada em termos de prefixo. A compactação em termos de espaço torna o arquivo de índice menor do que o valor máximo se uma coluna de string tiver muitos espaços finais ou for uma coluna `VARCHAR` que não é sempre usada na extensão completa. A compactação em termos de prefixo é usada em chaves que começam com uma string. A compactação em termos de prefixo ajuda se houver muitas strings com um prefixo idêntico.

Nas tabelas `MyISAM`, você também pode prefixar os números com compressão, especificando a opção de tabela `PACK_KEYS=1` ao criar a tabela. Os números são armazenados com o byte mais alto primeiro, então isso ajuda quando você tem muitos inteiros com um prefixo idêntico.
