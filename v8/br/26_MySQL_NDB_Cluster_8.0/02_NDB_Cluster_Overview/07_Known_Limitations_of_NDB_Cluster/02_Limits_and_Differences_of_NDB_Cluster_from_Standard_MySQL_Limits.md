#### 25.2.7.2 Limitações e diferenças do cluster NDB em relação às limitações do MySQL padrão

Nesta seção, listamos os limites encontrados no NDB Cluster que diferem dos limites encontrados no MySQL padrão ou que não são encontrados no MySQL padrão.

**Uso e recuperação da memória.** A memória consumida quando os dados são inseridos em uma tabela `NDB` não é recuperada automaticamente quando são excluídos, como acontece com outros motores de armazenamento. Em vez disso, as seguintes regras se aplicam:

- Uma declaração `DELETE` em uma tabela `NDB` torna a memória anteriormente usada pelas linhas excluídas disponível para reutilização por inserções na mesma tabela apenas. No entanto, essa memória pode ser disponibilizada para reutilização geral executando `OPTIMIZE TABLE`.

  Um reinício contínuo do clúster também libera toda a memória usada pelas linhas excluídas. Veja a Seção 25.6.5, “Realizando um Reinício Contínuo de um Clúster NDB”.

- Uma operação `DROP TABLE` ou `TRUNCATE TABLE` em uma tabela `NDB` libera a memória que foi usada por essa tabela para ser reutilizada por qualquer tabela `NDB`, seja pela mesma tabela ou por outra tabela `NDB`.

  Nota

  Lembre-se de que `TRUNCATE TABLE` elimina e recria a tabela. Veja a Seção 15.1.37, “Instrução TRUNCATE TABLE”.

- **Limites impostos pela configuração do cluster.** Existem vários limites rígidos que podem ser configurados, mas a memória principal disponível no cluster define os limites. Consulte a lista completa dos parâmetros de configuração na Seção 25.4.3, “Arquivos de configuração do cluster NDB”. A maioria dos parâmetros de configuração pode ser atualizada online. Esses limites rígidos incluem:

  - Tamanho da memória do banco de dados e tamanho da memória do índice (`DataMemory` e `IndexMemory`, respectivamente).

    O `DataMemory` é alocado em páginas de 32 KB. À medida que cada página `DataMemory` é usada, ela é atribuída a uma tabela específica; uma vez alocada, essa memória não pode ser liberada, exceto por meio da remoção da tabela.

    Consulte a Seção 25.4.3.6, “Definindo Nodos de Dados do NDB Cluster”, para obter mais informações.

  - O número máximo de operações que podem ser realizadas por transação é definido usando os parâmetros de configuração `MaxNoOfConcurrentOperations` e `MaxNoOfLocalOperations`.

    Nota

    O carregamento em lote, `TRUNCATE TABLE` e `ALTER TABLE` são tratados como casos especiais ao executar várias transações, e, portanto, não estão sujeitos a essa limitação.

  - Diferentes limites relacionados a tabelas e índices. Por exemplo, o número máximo de índices ordenados no cluster é determinado por `MaxNoOfOrderedIndexes`, e o número máximo de índices ordenados por tabela é 16.

- **Máximos de nós e objetos de dados.** Os seguintes limites se aplicam ao número de nós do cluster e objetos de metadados:

  - O número máximo de nós de dados é de 144 (em NDB 7.6 e versões anteriores, esse número era de 48).

    Um nó de dados deve ter um ID de nó no intervalo de 1 a 144, inclusive.

    Os nós de gerenciamento e API podem usar IDs de nó no intervalo de 1 a 255, inclusive.

  - O número máximo total de nós em um NDB Cluster é de 255. Esse número inclui todos os nós SQL (servidores MySQL), nós de API (aplicativos que acessam o cluster, além dos servidores MySQL), nós de dados e servidores de gerenciamento.

  - O número máximo de objetos de metadados nas versões atuais do NDB Cluster é de 20.320. Esse limite é codificado de forma rígida.

  Consulte a Seção 25.2.7.11, “Problemas anteriores do cluster NDB resolvidos no NDB Cluster 8.0”, para obter mais informações.
