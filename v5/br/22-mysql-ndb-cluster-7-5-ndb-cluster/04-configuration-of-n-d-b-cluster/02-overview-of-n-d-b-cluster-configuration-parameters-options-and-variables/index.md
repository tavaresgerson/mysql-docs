### 21.4.2 Visão geral dos parâmetros, opções e variáveis de configuração do cluster do NDB

21.4.2.1 Parâmetros de configuração do nó de dados do cluster NDB

21.4.2.2 Parâmetros de configuração do nó de gerenciamento do clúster NDB

21.4.2.3 Parâmetros de configuração do nó SQL do NDB Cluster e do nó API

21.4.2.4 Outros parâmetros de configuração do cluster do NDB

21.4.2.5 Referência de Opções e Variáveis do NDB Cluster mysqld

As próximas seções fornecem tabelas resumidas dos parâmetros de configuração do nó do NDB Cluster usados no arquivo `config.ini` para governar vários aspectos do comportamento do nó, bem como das opções e variáveis lidas pelo **mysqld** a partir de um arquivo `my.cnf` ou da linha de comando quando executado como um processo do NDB Cluster. Cada uma das tabelas de parâmetros do nó lista os parâmetros para um determinado tipo (`ndbd`, `ndb_mgmd`, `mysqld`, `computer`, `tcp` ou `shm`). Todas as tabelas incluem o tipo de dados para o parâmetro, opção ou variável, bem como seus valores padrão, mínimo e máximo, conforme aplicável.

**Considerações ao reiniciar nós.** Para os parâmetros dos nós, essas tabelas também indicam que tipo de reinício é necessário (reinício de nó ou reinício do sistema) e se o reinício deve ser feito com a opção `--initial` para alterar o valor de um parâmetro de configuração específico. Ao realizar um reinício de nó ou um reinício inicial de nó, todos os nós de dados do clúster devem ser reiniciados em ordem (também conhecido como reinício contínuo). É possível atualizar os parâmetros de configuração do clúster marcados como `node` online — ou seja, sem desligar o clúster — dessa maneira. Um reinício inicial de nó requer o reinício de cada processo **ndbd** com a opção `--initial`.

Para reiniciar o sistema, é necessário fazer um desligamento completo e reiniciar todo o clúster. Para um reinício inicial do sistema, é necessário fazer um backup do clúster, limpar o sistema de arquivos do clúster após o desligamento e, em seguida, restaurar a partir do backup após o reinício.

Em qualquer reinício do clúster, todos os servidores de gerenciamento do clúster devem ser reiniciados para que eles possam ler os valores dos parâmetros de configuração atualizados.

Importante

Os valores dos parâmetros de agrupamento numérico geralmente podem ser aumentados sem problemas, embora seja aconselhável fazê-lo de forma gradual, realizando esses ajustes em incrementos relativamente pequenos. Muitos deles podem ser aumentados online, usando um reinício contínuo.

No entanto, a redução dos valores desses parâmetros — seja por meio de um reinício do nó, um reinício inicial do nó ou até mesmo um reinício completo do sistema do clúster — não deve ser feita de forma descuidada; é recomendável que você faça isso apenas após um planejamento e testes cuidadosos. Isso é especialmente verdadeiro em relação aos parâmetros que se relacionam com o uso de memória e espaço em disco, como `MaxNoOfTables`, `MaxNoOfOrderedIndexes` e `MaxNoOfUniqueHashIndexes`. Além disso, geralmente é o caso de que os parâmetros de configuração relacionados ao uso de memória e disco podem ser aumentados por meio de um simples reinício do nó, mas eles exigem um reinício inicial do nó para serem reduzidos.

Como alguns desses parâmetros podem ser usados para configurar mais de um tipo de nó do cluster, eles podem aparecer em mais de uma das tabelas.

Nota

O valor `4294967039` geralmente aparece como o valor máximo nessas tabelas. Esse valor é definido nas fontes do `NDBCLUSTER` como `MAX_INT_RNIL` e é igual a `0xFFFFFEFF`, ou `232 − 28 − 1`.
