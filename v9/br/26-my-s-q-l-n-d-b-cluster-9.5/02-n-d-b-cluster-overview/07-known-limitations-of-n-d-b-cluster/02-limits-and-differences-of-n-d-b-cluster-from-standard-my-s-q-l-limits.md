#### 25.2.7.2 Limitações e Diferenças do NDB Cluster em Relação às Limitações Padrão do MySQL

Nesta seção, listamos as limitações encontradas no NDB Cluster que diferem das limitações encontradas no MySQL padrão ou que não estão presentes no MySQL padrão.

**Uso de memória e recuperação.** A memória consumida ao inserir dados em uma tabela `NDB` não é recuperada automaticamente quando excluída, como ocorre com outros motores de armazenamento. Em vez disso, as seguintes regras se aplicam:

* Uma instrução `DELETE` em uma tabela `NDB` torna a memória anteriormente usada pelas linhas excluídas disponível para uso novamente por inserções na mesma tabela. No entanto, essa memória pode ser liberada para uso geral executando `OPTIMIZE TABLE`.

  Um reinício contínuo do cluster também libera qualquer memória usada pelas linhas excluídas. Consulte a Seção 25.6.5, “Realizando um Reinício Contínuo de um NDB Cluster”.

* A operação `DROP TABLE` ou `TRUNCATE TABLE` em uma tabela `NDB` libera a memória que foi usada por essa tabela para uso novamente por qualquer tabela `NDB`, seja pela mesma tabela ou por outra tabela `NDB`.

  Nota

  Lembre-se de que `TRUNCATE TABLE` exclui e recria a tabela. Consulte a Seção 15.1.42, “Instrução `TRUNCATE TABLE`”.

* **Limitações impostas pela configuração do cluster.** Existem vários limites rígidos que são configuráveis, mas a memória principal disponível no cluster define os limites. Consulte a lista completa dos parâmetros de configuração na Seção 25.4.3, “Arquivos de Configuração do NDB Cluster”. A maioria dos parâmetros de configuração pode ser atualizada online. Esses limites rígidos incluem:

  + Tamanho da memória do banco de dados e tamanho da memória do índice (`DataMemory` e `IndexMemory`, respectivamente).

    `DataMemory` é alocado em páginas de 32 KB. À medida que cada página de `DataMemory` é usada, ela é atribuída a uma tabela específica; uma vez alocada, essa memória não pode ser liberada, exceto por meio da exclusão da tabela.

Consulte a Seção 25.4.3.6, “Definindo Nodos de Dados do NDB Cluster”, para obter mais informações.

+ O número máximo de operações que podem ser realizadas por transação é definido usando os parâmetros de configuração `MaxNoOfConcurrentOperations` e `MaxNoOfLocalOperations`.

  Nota

  O carregamento em lote, `TRUNCATE TABLE` e `ALTER TABLE` são tratados como casos especiais ao executar múltiplas transações, e, portanto, não estão sujeitos a essa limitação.

+ Diferentes limites relacionados a tabelas e índices. Por exemplo, o número máximo de índices ordenados no cluster é determinado por `MaxNoOfOrderedIndexes`, e o número máximo de índices ordenados por tabela é 16.

* **Máximos de nós e objetos de dados.** Os seguintes limites se aplicam ao número de nós do cluster e objetos de metadados:

  + O número máximo de nós de dados é 144. (No NDB 7.6 e versões anteriores, esse número era 48.)

    Um nó de dados deve ter um ID de nó no intervalo de 1 a 144, inclusive.

    Nodos de gerenciamento e API podem usar IDs de nó no intervalo de 1 a 255, inclusive.

  + O número máximo total de nós em um NDB Cluster é de 255. Esse número inclui todos os nós SQL (servidores MySQL), nós API (aplicativos acessando o cluster que não são servidores MySQL), nós de dados e servidores de gerenciamento.

  + O número máximo de objetos de metadados nas versões atuais do NDB Cluster é 20320. Esse limite é codificado de forma rígida.