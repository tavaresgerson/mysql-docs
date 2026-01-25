### 14.1.1 Benefícios do Uso de Tabelas InnoDB

As tabelas `InnoDB` oferecem os seguintes benefícios:

* Se o *server* for encerrado inesperadamente devido a um problema de hardware ou software, independentemente do que estava acontecendo no *Database* no momento, você não precisa fazer nada especial após reiniciar o *Database*. A *crash recovery* do `InnoDB` finaliza automaticamente as alterações que foram *committed* antes do momento da falha e desfaz as alterações que estavam em andamento, mas não foram *committed*, permitindo que você reinicie e continue de onde parou. Consulte a Seção 14.19.2, “Recuperação InnoDB”.

* O *storage engine* `InnoDB` mantém seu próprio *buffer pool* que armazena em *cache* dados de tabelas e *Index* na memória principal conforme os dados são acessados. Dados frequentemente usados são processados diretamente da memória. Este *cache* se aplica a muitos tipos de informação e acelera o processamento. Em *servers* de *Database* dedicados, frequentemente até 80% da memória física é atribuída ao *buffer pool*. Consulte a Seção 14.5.1, “Buffer Pool”.

* Se você dividir dados relacionados em tabelas diferentes, pode configurar *Foreign Keys* que impõem a integridade referencial. Consulte a Seção 13.1.18.5, “Restrições FOREIGN KEY”.

* Se os *data* se tornarem corrompidos no disco ou na memória, um mecanismo de *checksum* alerta você sobre os dados inválidos antes que você os use. A variável `innodb_checksum_algorithm` define o algoritmo de *checksum* usado pelo `InnoDB`.

* Ao projetar um *Database* com colunas *Primary Key* apropriadas para cada tabela, as operações que envolvem essas colunas são otimizadas automaticamente. É muito rápido referenciar as colunas *Primary Key* em cláusulas `WHERE`, cláusulas `ORDER BY`, cláusulas `GROUP BY` e operações de *JOIN*. Consulte a Seção 14.6.2.1, “Índices Clustered e Secundários”.

* *Inserts*, *updates* e *deletes* são otimizados por um mecanismo automático chamado *change buffering*. O `InnoDB` não apenas permite acesso concorrente de leitura e escrita à mesma tabela, mas também armazena em *cache* os *data* alterados para otimizar o *I/O* de disco. Consulte a Seção 14.5.2, “Change Buffer”.

* Os benefícios de desempenho não se limitam a tabelas grandes com *Queries* de longa duração. Quando as mesmas linhas são acessadas repetidamente a partir de uma tabela, o *Adaptive Hash Index* assume o controle para tornar essas buscas ainda mais rápidas, como se viessem de uma *hash table*. Consulte a Seção 14.5.3, “Adaptive Hash Index”.

* Você pode compactar tabelas e os *Index* associados. Consulte a Seção 14.9, “Compressão de Tabela e Página InnoDB”.

* Você pode criptografar seus dados. Consulte a Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”.

* Você pode criar e descartar *Index* e realizar outras operações *DDL* com muito menos impacto no desempenho e na disponibilidade. Consulte a Seção 14.13.1, “Operações DDL Online”.

* Truncar um *tablespace* *file-per-table* é muito rápido e pode liberar espaço em disco para o sistema operacional reutilizar, em vez de apenas o `InnoDB`. Consulte a Seção 14.6.3.2, “Tablespaces File-Per-Table”.

* O layout de armazenamento para *data* de tabela é mais eficiente para campos `BLOB` e de texto longo, com o *row format* `DYNAMIC`. Consulte a Seção 14.11, “Formatos de Linha (Row Formats) do InnoDB”.

* Você pode monitorar o funcionamento interno do *storage engine* executando *Queries* nas tabelas `INFORMATION_SCHEMA`. Consulte a Seção 14.16, “Tabelas INFORMATION_SCHEMA do InnoDB”.

* Você pode monitorar os detalhes de desempenho do *storage engine* executando *Queries* nas tabelas do *Performance Schema*. Consulte a Seção 14.17, “Integração do InnoDB com o Performance Schema do MySQL”.

* Você pode misturar tabelas `InnoDB` com tabelas de outros *storage engines* do MySQL, mesmo dentro da mesma instrução. Por exemplo, você pode usar uma operação de *JOIN* para combinar *data* de tabelas `InnoDB` e `MEMORY` em uma única *Query*.

* O `InnoDB` foi projetado para eficiência de *CPU* e desempenho máximo ao processar grandes volumes de dados.

* Tabelas `InnoDB` podem lidar com grandes quantidades de dados, mesmo em sistemas operacionais onde o tamanho do arquivo é limitado a 2GB.

Para técnicas de *tuning* específicas do `InnoDB` que você pode aplicar ao seu *MySQL server* e código de aplicação, consulte a Seção 8.5, “Otimizando para Tabelas InnoDB”.