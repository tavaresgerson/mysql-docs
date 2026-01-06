### 14.1.1 Benefícios de usar tabelas InnoDB

As tabelas do `InnoDB` têm os seguintes benefícios:

- Se o servidor sair inesperadamente devido a um problema de hardware ou software, independentemente do que estava acontecendo no banco de dados na época, você não precisa fazer nada especial após reiniciar o banco de dados. A recuperação automática de falhas do `InnoDB` finaliza automaticamente as alterações que foram comprometidas antes do momento da falha e desfaz as alterações que estavam em processo, mas não foram comprometidas, permitindo que você reinicie e continue a partir do ponto em que parou. Veja a Seção 14.19.2, “Recuperação do InnoDB”.

- O mecanismo de armazenamento `InnoDB` mantém seu próprio pool de buffers que armazena dados de tabelas e índices na memória principal à medida que são acessados. Os dados frequentemente usados são processados diretamente da memória. Esse cache se aplica a muitos tipos de informações e acelera o processamento. Em servidores de banco de dados dedicados, até 80% da memória física é frequentemente atribuída ao pool de buffers. Veja a Seção 14.5.1, “Pool de Buffers”.

- Se você dividir dados relacionados em diferentes tabelas, você pode configurar chaves estrangeiras que garantem a integridade referencial. Veja a Seção 13.1.18.5, “Restrições de Chave Estrangeira”.

- Se os dados ficarem corrompidos no disco ou na memória, um mecanismo de verificação de checksum avisa você sobre os dados falsos antes que você os use. A variável `innodb_checksum_algorithm` define o algoritmo de verificação de checksum usado pelo `InnoDB`.

- Quando você cria um banco de dados com as colunas de chave primária apropriadas para cada tabela, as operações envolvendo essas colunas são automaticamente otimizadas. É muito rápido referenciar as colunas de chave primária nas cláusulas `WHERE`, `ORDER BY`, `GROUP BY` e nas operações de junção. Veja a Seção 14.6.2.1, “Indekses Agrupados e Secundários”.

- Inserções, atualizações e exclusões são otimizadas por um mecanismo automático chamado buffer de alterações. O `InnoDB` não só permite acesso concorrente de leitura e escrita à mesma tabela, mas também cacheia os dados alterados para otimizar o I/O de disco. Veja a Seção 14.5.2, “Buffer de Alterações”.

- Os benefícios de desempenho não se limitam a tabelas grandes com consultas de longa execução. Quando as mesmas linhas são acessadas repetidamente a partir de uma tabela, o Índice Hash Adaptativo assume para tornar essas consultas ainda mais rápidas, como se viessem de uma tabela hash. Veja a Seção 14.5.3, “Índice Hash Adaptativo”.

- Você pode comprimir tabelas e índices associados. Veja a Seção 14.9, “Compressão de Tabela e Página do InnoDB”.

- Você pode criptografar seus dados. Veja a Seção 14.14, “Criptografia de Dados em Repouso do InnoDB”.

- Você pode criar e excluir índices e realizar outras operações de DDL com muito menos impacto no desempenho e na disponibilidade. Veja a Seção 14.13.1, “Operações DDL Online”.

- O truncamento de um espaço de tabela por arquivo é muito rápido e pode liberar espaço no disco para que o sistema operacional possa reutilizá-lo, em vez de apenas o `InnoDB`. Veja a Seção 14.6.3.2, “Espaços de tabela por arquivo”.

- O layout de armazenamento para dados de tabela é mais eficiente para campos `BLOB` e texto longo, com o formato de linha `DINÂMICA`. Veja a Seção 14.11, “Formatos de Linha InnoDB”.

- Você pode monitorar o funcionamento interno do motor de armazenamento consultando as tabelas do esquema de informações `INFORMATION_SCHEMA`. Veja a Seção 14.16, “Tabelas do esquema de informações InnoDB”.

- Você pode monitorar os detalhes do desempenho do mecanismo de armazenamento consultando as tabelas do Schema de Desempenho. Consulte a Seção 14.17, “Integração InnoDB com o Schema de Desempenho do MySQL”.

- Você pode misturar tabelas `InnoDB` com tabelas de outros motores de armazenamento do MySQL, mesmo dentro da mesma instrução. Por exemplo, você pode usar uma operação de junção para combinar dados de tabelas `InnoDB` e `MEMORY` em uma única consulta.

- O `InnoDB` foi projetado para eficiência de CPU e desempenho máximo ao processar grandes volumes de dados.

- As tabelas do `InnoDB` podem lidar com grandes quantidades de dados, mesmo em sistemas operacionais onde o tamanho do arquivo é limitado a 2 GB.

Para técnicas de ajuste específicas para o `InnoDB`, que você pode aplicar ao seu servidor MySQL e ao código da aplicação, consulte a Seção 8.5, “Otimização para Tabelas InnoDB”.
