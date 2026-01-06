#### 21.2.7.2 Limitações e diferenças do cluster NDB em relação às limitações do MySQL padrão

Nesta seção, listamos os limites encontrados no NDB Cluster que diferem dos limites encontrados no MySQL padrão ou que não são encontrados no MySQL padrão.

**Uso e recuperação da memória.** A memória consumida quando os dados são inseridos em uma tabela de `NDB` não é recuperada automaticamente quando excluída, como acontece com outros motores de armazenamento. Em vez disso, as seguintes regras se aplicam:

- Uma declaração `DELETE` em uma tabela de `NDB` torna a memória anteriormente usada pelas linhas excluídas disponível para reutilização por inserções na mesma tabela. No entanto, essa memória pode ser disponibilizada para reutilização geral executando `OPTIMIZE TABLE`.

  Um reinício contínuo do clúster também libera toda a memória usada pelas linhas excluídas. Consulte Seção 21.6.5, “Realizando um Reinício Contínuo de um Clúster NDB”.

- Uma operação de `DROP TABLE` ou `TRUNCATE TABLE` em uma tabela de `NDB` libera a memória que foi usada por essa tabela para ser reutilizada por qualquer tabela de `NDB`, seja pela mesma tabela ou por outra tabela de `NDB`.

  Nota

  Lembre-se de que `TRUNCATE TABLE` exclui e recria a tabela. Veja Seção 13.1.34, “Instrução TRUNCATE TABLE”.

- **Limites impostos pela configuração do cluster.** Existem vários limites rígidos que podem ser configurados, mas a memória principal disponível no cluster define os limites. Consulte a lista completa dos parâmetros de configuração na Seção 21.4.3, “Arquivos de configuração do cluster NDB”. A maioria dos parâmetros de configuração pode ser atualizada online. Esses limites rígidos incluem:

  - Tamanho da memória do banco de dados e tamanho da memória do índice (`DataMemory` e `IndexMemory`, respectivamente).

    O `DataMemory` é alocado em páginas de 32 KB. À medida que cada página de `DataMemory` é usada, ela é atribuída a uma tabela específica; uma vez alocada, essa memória não pode ser liberada, exceto por meio da remoção da tabela.

    Para obter mais informações, consulte Seção 21.4.3.6, “Definindo nós de dados do cluster NDB”.

  - O número máximo de operações que podem ser realizadas por transação é definido pelos parâmetros de configuração `MaxNoOfConcurrentOperations` e `MaxNoOfLocalOperations`.

    Nota

    O carregamento em lote, `TRUNCATE TABLE` e `ALTER TABLE` são tratados como casos especiais ao executar múltiplas transações, e, portanto, não estão sujeitos a essa limitação.

  - Diferentes limites relacionados a tabelas e índices. Por exemplo, o número máximo de índices ordenados no cluster é determinado por `MaxNoOfOrderedIndexes`, e o número máximo de índices ordenados por tabela é 16.

- **Máximos de nós e objetos de dados.** Os seguintes limites se aplicam ao número de nós do cluster e objetos de metadados:

  - O número máximo de nós de dados é de 48.

    Um nó de dados deve ter um ID de nó no intervalo de 1 a 48, inclusive. (Nó de gerenciamento e nó de API podem usar IDs de nó no intervalo de 1 a 255, inclusive.)

  - O número máximo total de nós em um NDB Cluster é de 255. Esse número inclui todos os nós SQL (servidores MySQL), nós de API (aplicativos que acessam o cluster, além dos servidores MySQL), nós de dados e servidores de gerenciamento.

  - O número máximo de objetos de metadados nas versões atuais do NDB Cluster é de 20.320. Esse limite é codificado de forma rígida.

  Consulte Problemas anteriores do cluster NDB resolvidos no NDB Cluster 8.0 para obter mais informações.
