### 25.4.2 Resumo dos Parâmetros, Opções e Variáveis de Configuração do NDB Cluster

25.4.2.1 Parâmetros de Configuração dos Nó de Dados do NDB Cluster

25.4.2.2 Parâmetros de Configuração dos Nó de Gerenciamento do NDB Cluster

25.4.2.3 Parâmetros de Configuração dos Nó SQL e Nó de API do NDB Cluster

25.4.2.4 Outros Parâmetros de Configuração do NDB Cluster

25.4.2.5 Referência de Opções e Variáveis do NDB Cluster mysqld

As próximas seções fornecem tabelas resumidas dos parâmetros de configuração dos nós do NDB Cluster usados no arquivo `config.ini` para governar vários aspectos do comportamento do nó, bem como das opções e variáveis lidas pelo **mysqld** a partir de um arquivo `my.cnf` ou da linha de comando quando executado como um processo do NDB Cluster. Cada uma das tabelas de parâmetros de nó lista os parâmetros para um determinado tipo (`ndbd`, `ndb_mgmd`, `mysqld`, `computer`, `tcp` ou `shm`). Todas as tabelas incluem o tipo de dados para o parâmetro, opção ou variável, bem como seus valores padrão, mínimo e máximo, conforme aplicável.

**Considerações ao reiniciar os nós.** Para os parâmetros de nó, essas tabelas também indicam que tipo de reinício é necessário (reinício do nó ou reinício do sistema) e se o reinício deve ser feito com `--initial` para alterar o valor de um determinado parâmetro de configuração. Ao realizar um reinício de nó ou um reinício inicial do nó, todos os nós de dados do cluster devem ser reiniciados em ordem (também referido como reinício em rotação). É possível atualizar os parâmetros de configuração do cluster marcados como `node` online—ou seja, sem desligar o cluster—da seguinte maneira. Um reinício inicial do nó requer o reinício de cada processo **ndbd** com a opção `--initial`.

Um reinício do sistema requer o desligamento completo e o reinício do clúster inteiro. Um reinício inicial do sistema requer a criação de um backup do clúster, a limpeza do sistema de arquivos do clúster após o desligamento e, em seguida, a restauração a partir do backup após o reinício.

Em qualquer reinício do clúster, todos os servidores de gerenciamento do clúster devem ser reiniciados para que possam ler os valores atualizados dos parâmetros de configuração.

Importante

Os valores dos parâmetros numéricos do clúster geralmente podem ser aumentados sem problemas, embora seja aconselhável fazê-lo progressivamente, realizando ajustes em incrementos relativamente pequenos. Muitos desses parâmetros podem ser aumentados online, usando um reinício contínuo.

No entanto, diminuir os valores desses parâmetros—seja usando um reinício de nó, um reinício inicial de nó ou até mesmo um reinício completo do sistema do clúster—não deve ser feito de forma leve; é recomendável que você faça isso apenas após um planejamento e testes cuidadosos. Isso é especialmente verdadeiro em relação aos parâmetros que se relacionam com o uso de memória e espaço em disco, como `MaxNoOfTables`, `MaxNoOfOrderedIndexes` e `MaxNoOfUniqueHashIndexes`. Além disso, geralmente é o caso que os parâmetros de configuração relacionados ao uso de memória e disco podem ser aumentados usando um simples reinício de nó, mas eles requerem um reinício inicial de nó para serem diminuídos.

Como alguns desses parâmetros podem ser usados para configurar mais de um tipo de nó do clúster, eles podem aparecer em mais de uma das tabelas.

Nota

`4294967039` geralmente aparece como um valor máximo nessas tabelas. Esse valor é definido nas fontes `NDBCLUSTER` como `MAX_INT_RNIL` e é igual a `0xFFFFFEFF`, ou `232 − 28 − 1`.