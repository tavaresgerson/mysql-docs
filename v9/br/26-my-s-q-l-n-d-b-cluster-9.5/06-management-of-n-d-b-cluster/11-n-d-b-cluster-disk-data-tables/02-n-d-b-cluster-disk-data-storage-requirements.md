#### 25.6.11.2 Requisitos de Armazenamento de Dados de Disco do NDB Cluster

Os seguintes itens se aplicam aos requisitos de armazenamento de dados de disco:

* Colunas de comprimento variável das tabelas de Dados de Disco ocupam um espaço fixo. Para cada linha, isso é igual ao espaço necessário para armazenar o valor maior possível para essa coluna.

  Para informações gerais sobre o cálculo desses valores, consulte a Seção 13.7, “Requisitos de Armazenamento de Tipo de Dados”.

  Você pode obter uma estimativa do espaço disponível nos arquivos de dados e nos arquivos de log de desfazer consultando a tabela do Esquema de Informações `FILES`. Para mais informações e exemplos, consulte a Seção 28.3.15, “A Tabela INFORMATION_SCHEMA FILES”.

  Nota

  A instrução `OPTIMIZE TABLE` não tem efeito sobre as tabelas de Dados de Disco.

* Em uma tabela de Dados de Disco, os primeiros 256 bytes de uma coluna `TEXT` ou `BLOB` são armazenados na memória; apenas o restante é armazenado no disco.

* Cada linha em uma tabela de Dados de Disco usa 8 bytes na memória para apontar para os dados armazenados no disco. Isso significa que, em alguns casos, a conversão de uma coluna em memória para o formato baseado em disco pode resultar na utilização de mais memória. Por exemplo, a conversão de uma coluna `CHAR(4)` de formato baseado em memória para formato baseado em disco aumenta a quantidade de `DataMemory` usada por linha de 4 para 8 bytes.

Importante

Iniciar o cluster com a opção `--initial` *não* remove os arquivos de Dados de Disco. Você deve removê-los manualmente antes de realizar uma reinicialização inicial do cluster.

O desempenho das tabelas de Dados de Disco pode ser melhorado minimizando o número de buscas no disco, garantindo que o `DiskPageBufferMemory` tenha tamanho suficiente. Você pode consultar a tabela `diskpagebuffer` para ajudar a determinar se o valor para esse parâmetro precisa ser aumentado.