#### 21.6.11.3 Requisitos de Armazenamento de Dados de Disco do NDB Cluster

Os seguintes itens se aplicam aos requisitos de armazenamento de dados do disco:

- Colunas de comprimento variável das tabelas de Dados de disco ocupam um espaço fixo. Para cada linha, isso equivale ao espaço necessário para armazenar o valor maior possível para essa coluna.

  Para obter informações gerais sobre o cálculo desses valores, consulte Seção 11.7, “Requisitos de Armazenamento de Tipo de Dados”.

  Você pode obter uma estimativa do espaço disponível em arquivos de dados e arquivos de registro de desfazer consultando a tabela do esquema de informações `FILES`. Para mais informações e exemplos, consulte Seção 24.3.9, “A Tabela INFORMATION_SCHEMA FILES”.

  Nota

  A instrução `OPTIMIZE TABLE` não tem efeito sobre as tabelas de Dados de disco.

- Em uma tabela de dados de disco, os primeiros 256 bytes de uma coluna de tipo `TEXT` ou `BLOB` são armazenados na memória; apenas o restante é armazenado no disco.

- Cada linha de uma tabela de Dados de disco usa 8 bytes de memória para apontar para os dados armazenados no disco. Isso significa que, em alguns casos, a conversão de uma coluna em memória para o formato baseado em disco pode resultar em um uso maior de memória. Por exemplo, a conversão de uma coluna `CHAR(4)` de memória para o formato baseado em disco aumenta a quantidade de `DataMemory` usada por linha de 4 para 8 bytes.

Importante

Iniciar o clúster com a opção `--initial` *não* remove os arquivos de dados do disco. Você deve removê-los manualmente antes de realizar um reinício inicial do clúster.

O desempenho das tabelas de dados de disco pode ser melhorado minimizando o número de buscas no disco, garantindo que o `DiskPageBufferMemory` tenha tamanho suficiente. Você pode consultar a tabela `diskpagebuffer` para ajudar a determinar se o valor desse parâmetro precisa ser aumentado.
