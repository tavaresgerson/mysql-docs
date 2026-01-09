### 17.1.1 Benefícios do Uso de Tabelas InnoDB

As tabelas `InnoDB` têm os seguintes benefícios:

* Se o servidor sair inesperadamente devido a um problema de hardware ou software, independentemente do que estava acontecendo no banco de dados na época, você não precisa fazer nada especial após reiniciar o banco de dados. A recuperação automática de falhas de `InnoDB` finaliza automaticamente as alterações que foram comprometidas antes do momento da falha e desfaz as alterações que estavam em processo, mas não foram comprometidas, permitindo que você reinicie e continue a partir do ponto em que parou. Veja a Seção 17.18.2, “Recuperação de `InnoDB’”.

* O mecanismo de armazenamento `InnoDB` mantém seu próprio pool de tampão que cacheia dados de tabelas e índices na memória principal à medida que os dados são acessados. Dados frequentemente usados são processados diretamente da memória. Esse cache se aplica a muitos tipos de informações e acelera o processamento. Em servidores de banco de dados dedicados, até 80% da memória física é frequentemente atribuída ao pool de tampão. Veja a Seção 17.5.1, “Pool de Tampão”.

* Se você dividir dados relacionados em diferentes tabelas, pode configurar chaves estrangeiras que importam a integridade referencial. Veja a Seção 15.1.24.5, “Restrições de Chave Estrangeira”.

* Se os dados ficarem corrompidos no disco ou na memória, um mecanismo de verificação de checksum alerta você sobre os dados falsos antes de usá-los. A variável `innodb_checksum_algorithm` define o algoritmo de checksum usado pelo `InnoDB`.

* Ao projetar um banco de dados com colunas de chave primária apropriadas para cada tabela, as operações envolvendo essas colunas são automaticamente otimizadas. É muito rápido referenciar as colunas da chave primária nas cláusulas `WHERE`, `ORDER BY`, `GROUP BY` e nas operações de junção. Veja a Seção 17.6.2.1, “Índices Agrupados e Secundários”.

* Inserções, atualizações e exclusões são otimizadas por um mecanismo automático chamado buffer de alterações. O `InnoDB` não só permite acesso concorrente de leitura e escrita à mesma tabela, mas também cacheia os dados alterados para otimizar o I/O de disco. Veja a Seção 17.5.2, “Buffer de Alterações”.

* Os benefícios de desempenho não se limitam a tabelas grandes com consultas de longa duração. Quando as mesmas linhas são acessadas repetidamente de uma tabela, o Índice Hash Adaptativo assume para tornar essas consultas ainda mais rápidas, como se viessem de uma tabela hash. Veja a Seção 17.5.3, “Índice Hash Adaptativo”.

* Você pode comprimir tabelas e índices associados. Veja a Seção 17.9, “Compressão de Tabelas e Páginas do InnoDB”.

* Você pode criptografar seus dados. Veja a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.

* Você pode criar e excluir índices e realizar outras operações DDL com muito menos impacto no desempenho e na disponibilidade. Veja a Seção 17.12.1, “Operações DDL Online”.

* O truncamento de um espaço de tabelas por arquivo é muito rápido e pode liberar espaço em disco para o sistema operacional reutilizar, em vez de apenas o `InnoDB`. Veja a Seção 17.6.3.2, “Espaços de Tabelas por Arquivo”.

* O layout de armazenamento para dados de tabela é mais eficiente para campos `BLOB` e texto longo, com o formato de linha `DYNAMIC`. Veja a Seção 17.10, “Formatos de Linha do InnoDB”.

* Você pode monitorar o funcionamento interno do motor de armazenamento consultando tabelas do `INFORMATION_SCHEMA`. Veja a Seção 17.15, “Tabelas do InnoDB INFORMATION_SCHEMA”.

* Você pode monitorar os detalhes de desempenho do motor de armazenamento consultando tabelas do Schema de Desempenho. Veja a Seção 17.16, “Integração do InnoDB com o Schema de Desempenho do MySQL”.

* Você pode misturar tabelas `InnoDB` com tabelas de outros motores de armazenamento do MySQL, mesmo dentro da mesma instrução. Por exemplo, você pode usar uma operação de junção para combinar dados de tabelas `InnoDB` e `MEMORY` em uma única consulta.

* O `InnoDB` foi projetado para eficiência de CPU e desempenho máximo ao processar grandes volumes de dados.

* As tabelas `InnoDB` podem lidar com grandes quantidades de dados, mesmo em sistemas operacionais onde o tamanho do arquivo é limitado a 2 GB.

Para técnicas de ajuste específicas do `InnoDB` que você pode aplicar ao seu servidor MySQL e ao código da aplicação, consulte a Seção 10.5, “Otimizando para Tabelas `InnoDB’”.