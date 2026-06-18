### 15.2.2 Espaço Necessário para Keys

Tabelas `MyISAM` usam indexes B-tree. Você pode calcular aproximadamente o tamanho do arquivo de Index como `(key_length+4)/0.67`, somado sobre todas as Keys. Este é o pior caso, quando todas as Keys são inseridas em ordem ordenada e a tabela não possui Keys compactadas.

Indexes de string são compactados em espaço. Se a primeira parte do Index for uma string, ela também é compactada por prefixo. A compactação de espaço torna o arquivo de Index menor do que o valor do pior caso se uma coluna de string tiver muito espaço final (trailing space) ou for uma coluna `VARCHAR` que nem sempre é usada em seu comprimento total. A compactação por prefixo é usada em Keys que começam com uma string. A compactação por prefixo ajuda se houver muitas strings com um prefixo idêntico.

Em tabelas `MyISAM`, você também pode compactar prefixos de números especificando a opção de tabela `PACK_KEYS=1` ao criar a tabela. Números são armazenados com o byte alto primeiro (high byte first), o que ajuda quando você tem muitas Keys inteiras que possuem um prefixo idêntico.