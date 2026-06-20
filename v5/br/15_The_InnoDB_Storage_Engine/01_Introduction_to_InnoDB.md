## 14.1 Introdução ao InnoDB

`InnoDB` é um motor de armazenamento de propósito geral que equilibra alta confiabilidade e alto desempenho. No MySQL 5.7, `InnoDB` é o motor de armazenamento padrão do MySQL. A menos que você tenha configurado um motor de armazenamento padrão diferente, emitir uma declaração `CREATE TABLE` sem uma cláusula `ENGINE` cria uma tabela `InnoDB`.

### Principais vantagens do InnoDB

* Suas operações DML seguem o modelo ACID, com transações que apresentam capacidades de commit, rollback e recuperação em caso de falha para proteger os dados do usuário. Veja a Seção 14.2, “InnoDB e o Modelo ACID”.

* O bloqueio de nível de linha e as leituras consistentes ao estilo Oracle aumentam a concorrência e o desempenho de múltiplos usuários. Veja a Seção 14.7, “Bloqueio e Modelo de Transação InnoDB”.

* As tabelas `InnoDB` organizam seus dados no disco para otimizar as consultas com base em chaves primárias. Cada tabela `InnoDB` tem um índice de chave primária chamado índice agrupado que organiza os dados para minimizar o I/O para buscas de chave primária. Veja a Seção 14.6.2.1, “Indekses Agrupados e Secundários”.

* Para manter a integridade dos dados, `InnoDB` suporta as restrições de `FOREIGN KEY`. Com chaves estrangeiras, inserções, atualizações e exclusões são verificadas para garantir que não resultem em inconsistências em tabelas relacionadas. Veja a Seção 13.1.18.5, “Restrições de CHAVE ESTRANGEIRA”.

**Tabela 14.1 Características do Engate de Armazenamento InnoDB**

<table frame="box" rules="all" summary="Features supported by the InnoDB storage engine."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Característica</th> <th>Support</th> </tr></thead><tbody><tr><td><strong>Índices de árvore B</strong></td> <td>Yes</td> </tr><tr><td><strong>Backup/recuperação em ponto no tempo</strong>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Yes</td> </tr><tr><td><strong>Suporte para banco de dados em cluster</strong></td> <td>No</td> </tr><tr><td><strong>Índices agrupados</strong></td> <td>Yes</td> </tr><tr><td><strong>Dados comprimidos</strong></td> <td>Yes</td> </tr><tr><td><strong>Caches de dados</strong></td> <td>Yes</td> </tr><tr><td><strong>Dados criptografados</strong></td> <td>Yes (Implemented in the server via encryption functions; In MySQL 5.7 and later, data-at-rest encryption is supported.)</td> </tr><tr><td><strong>Suporte para chave estrangeira</strong></td> <td>Yes</td> </tr><tr><td><strong>Indekses de pesquisa de texto completo</strong></td> <td>Yes (Support for FULLTEXT indexes is available in MySQL 5.6 and later.)</td> </tr><tr><td><strong>Suporte ao tipo de dados geográficos</strong></td> <td>Yes</td> </tr><tr><td><strong>Suporte para indexação geospacial</strong></td> <td>Yes (Support for geospatial indexing is available in MySQL 5.7 and later.)</td> </tr><tr><td><strong>Indekses de hash</strong></td> <td>No (InnoDB utilizes hash indexes internally for its Adaptive Hash Index feature.)</td> </tr><tr><td><strong>Cache do índice</strong></td> <td>Yes</td> </tr><tr><td><strong>Granularidade de bloqueio</strong></td> <td>Row</td> </tr><tr><td><strong>MVCC</strong></td> <td>Yes</td> </tr><tr><td><strong>Suporte para replicação</strong>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Yes</td> </tr><tr><td><strong>Limites de armazenamento</strong></td> <td>64TB</td> </tr><tr><td><strong>Índices T-tree</strong></td> <td>No</td> </tr><tr><td><strong>Transações</strong></td> <td>Yes</td> </tr><tr><td><strong>Atualize as estatísticas do dicionário de dados</strong></td> <td>Yes</td> </tr></tbody></table>

Para comparar as características do `InnoDB` com outros motores de armazenamento fornecidos com o MySQL, consulte a tabela *Características do Motor de Armazenamento* no Capítulo 15, *Motores de Armazenamento Alternativos*.

### Melhorias e Novas Funcionalidades do InnoDB

Para informações sobre as melhorias e novos recursos do `InnoDB`, consulte:

* A lista de aprimoramentos do `InnoDB` na Seção 1.3, “O que há de novo no MySQL 5.7”.

* Notas de lançamento.

### Informações e recursos adicionais do InnoDB

* Para termos e definições relacionados a `InnoDB`, consulte o Glossário do MySQL.

* Para um fórum dedicado ao motor de armazenamento `InnoDB`, veja os Fóruns do MySQL::InnoDB.

* `InnoDB` é publicado sob a mesma Licença GNU GPL Versão 2 (de junho de 1991) que o MySQL. Para mais informações sobre a licença do MySQL, consulte <http://www.mysql.com/company/legal/licensing/>.

### 14.1.1 Benefícios do uso de tabelas InnoDB

As tabelas `InnoDB` têm os seguintes benefícios:

* Se o servidor sair inesperadamente devido a um problema de hardware ou software, independentemente do que estava acontecendo no banco de dados naquela época, você não precisa fazer nada de especial após reiniciar o banco de dados. A recuperação automática do `InnoDB` finaliza automaticamente as alterações que foram comprometidas antes do momento do crash e desfaz as alterações que estavam em processo, mas não foram comprometidas, permitindo que você reinicie e continue a partir do ponto em que parou. Veja a Seção 14.19.2, “Recuperação InnoDB”.

* O motor de armazenamento `InnoDB` mantém seu próprio conjunto de buffers que armazena dados de tabela e índice na memória principal à medida que os dados são acessados. Os dados frequentemente utilizados são processados diretamente a partir da memória. Este cache se aplica a muitos tipos de informações e acelera o processamento. Em servidores de banco de dados dedicados, até 80% da memória física é frequentemente atribuída ao conjunto de buffers. Veja a Seção 14.5.1, “Conjunto de Buffers”.

* Se você dividir dados relacionados em diferentes tabelas, você pode configurar chaves estrangeiras que importam a integridade referencial. Veja a Seção 13.1.18.5, “Restrições de chave estrangeira”.

* Se os dados ficarem corrompidos no disco ou na memória, um mecanismo de verificação de checksum alerta o usuário sobre os dados falsos antes que eles sejam utilizados. A variável `innodb_checksum_algorithm` define o algoritmo de verificação de checksum utilizado pelo `InnoDB`.

* Quando você projeta um banco de dados com colunas de chave primária apropriadas para cada tabela, as operações que envolvem essas colunas são automaticamente otimizadas. É muito rápido referenciar as colunas da chave primária nas cláusulas `WHERE`, `ORDER BY` e `GROUP BY`, e nas operações de junção. Veja a Seção 14.6.2.1, “Indekses agrupados e secundários”.

* Inserções, atualizações e exclusões são otimizadas por um mecanismo automático chamado buffer de alterações. `InnoDB` não só permite acesso concorrente de leitura e escrita à mesma tabela, mas também cachea os dados alterados para otimizar o I/O de disco. Veja a Seção 14.5.2, “Buffer de Alterações”.

* Os benefícios de desempenho não se limitam a grandes tabelas com consultas de longa duração. Quando as mesmas linhas são acessadas várias vezes a partir de uma tabela, o Índice Hash Adaptativo assume para tornar essas pesquisas ainda mais rápidas, como se elas viessem de uma tabela hash. Veja a Seção 14.5.3, “Índice Hash Adaptativo”.

* Você pode comprimir tabelas e índices associados. Veja a Seção 14.9, “Compressão de Tabela e Página InnoDB”.

* Você pode criptografar seus dados. Veja a Seção 14.14, “Criptografia de dados em repouso do InnoDB”.

* Você pode criar e descartar índices e realizar outras operações de DDL com muito menos impacto no desempenho e na disponibilidade. Veja a Seção 14.13.1, “Operações DDL Online”.

* O truncamento de um espaço de tabela por arquivo é muito rápido e pode liberar espaço em disco para que o sistema operacional possa reutilizar, em vez de apenas `InnoDB`. Veja a Seção 14.6.3.2, “Espaços de tabela por arquivo”.

* O layout de armazenamento para dados de tabela é mais eficiente para os campos `BLOB` e de texto longo, com o formato da linha `DYNAMIC`. Veja a Seção 14.11, “Formatos de linha InnoDB”.

* Você pode monitorar o funcionamento interno do motor de armazenamento consultando as tabelas `INFORMATION_SCHEMA`. Veja a Seção 14.16, “Tabelas do esquema de informações InnoDB”.

* Você pode monitorar os detalhes de desempenho do motor de armazenamento consultando as tabelas do Schema de desempenho. Veja a Seção 14.17, “Integração InnoDB com o Schema de desempenho do MySQL”.

* Você pode misturar as tabelas `InnoDB` com tabelas de outros motores de armazenamento do MySQL, mesmo dentro da mesma declaração. Por exemplo, você pode usar uma operação de junção para combinar dados das tabelas `InnoDB` e `MEMORY` em uma única consulta.

* `InnoDB` foi projetado para eficiência da CPU e desempenho máximo ao processar grandes volumes de dados.

As tabelas `InnoDB` podem lidar com grandes quantidades de dados, mesmo em sistemas operacionais onde o tamanho do arquivo é limitado a 2 GB.

Para técnicas de ajuste específicas para `InnoDB`, que você pode aplicar ao seu servidor MySQL e ao código da aplicação, consulte a Seção 8.5, “Otimizando para Tabelas InnoDB”.

### 14.1.2 Práticas recomendadas para tabelas InnoDB

Esta seção descreve as melhores práticas ao usar as tabelas `InnoDB`.

* Especifique uma chave primária para cada tabela usando a coluna ou colunas mais frequentemente consultadas, ou um valor de auto-incremento, se não houver uma chave primária óbvia.

* Use junções sempre que os dados forem extraídos de várias tabelas com base em valores de ID idênticos dessas tabelas. Para obter um desempenho rápido nas junções, defina chaves estrangeiras nas colunas de junção e declare essas colunas com o mesmo tipo de dados em cada tabela. Adicionar chaves estrangeiras garante que as colunas referenciadas sejam indexadas, o que pode melhorar o desempenho. As chaves estrangeiras também propagam excluções e atualizações para todas as tabelas afetadas e impedem a inserção de dados em uma tabela secundária se os IDs correspondentes não estiverem presentes na tabela principal.

* Desative o autocommit. Comitir centenas de vezes por segundo limita o desempenho (limitado pela velocidade de escrita do seu dispositivo de armazenamento).

* Grupos de operações DML relacionadas são definidos em transações ao serem delimitados com as declarações `START TRANSACTION` e `COMMIT`. Embora você não queira comprometer com muita frequência, também não quer emitir grandes lotes de declarações `INSERT`, `UPDATE` ou `DELETE` que funcionam por horas sem comprometer.

* Não use declarações `LOCK TABLES`. `InnoDB` pode lidar com múltiplas sessões, todas lendo e escrevendo na mesma tabela ao mesmo tempo, sem sacrificar a confiabilidade ou o alto desempenho. Para obter acesso exclusivo de escrita a um conjunto de linhas, use a sintaxe `SELECT ... FOR UPDATE` para bloquear apenas as linhas que você pretende atualizar.

* Ative a variável `innodb_file_per_table` ou use tabelas gerais para colocar os dados e índices das tabelas em arquivos separados, em vez do espaço de tabela do sistema. A variável `innodb_file_per_table` é ativada por padrão.

* Avalie se seus padrões de dados e acesso se beneficiam das funcionalidades de compressão de tabelas ou páginas do `InnoDB`. Você pode comprimir as tabelas `InnoDB` sem sacrificar a capacidade de leitura/escrita.

* Execute o servidor com a opção `--sql_mode=NO_ENGINE_SUBSTITUTION` para evitar que tabelas sejam criadas com motores de armazenamento que você não deseja usar.

### 14.1.3 Verificar se o InnoDB é o motor de armazenamento padrão

Emita a declaração `SHOW ENGINES` para visualizar os motores de armazenamento disponíveis do MySQL. Procure `DEFAULT` na coluna `SUPPORT`.

```sql
mysql> SHOW ENGINES;
```

Alternativamente, consulte a tabela do esquema de informações `ENGINES`.

```sql
mysql> SELECT * FROM INFORMATION_SCHEMA.ENGINES;
```

### 14.1.4 Testando e Benchmarkando com InnoDB

Se `InnoDB` não for o motor de armazenamento padrão, você pode determinar se seu servidor de banco de dados e aplicativos funcionam corretamente com `InnoDB` reiniciando o servidor com `--default-storage-engine=InnoDB` na linha de comando ou com `default-storage-engine=innodb` definido na seção `[mysqld]` do arquivo de opção do servidor MySQL.

Como a mudança do mecanismo de armazenamento padrão afeta apenas as tabelas recém-criadas, execute as etapas de instalação e configuração do aplicativo para confirmar que tudo é instalado corretamente, e, em seguida, exerça as funcionalidades do aplicativo para garantir que os recursos de carregamento, edição e consulta de dados funcionem. Se uma tabela dependa de uma funcionalidade específica de outro mecanismo de armazenamento, você receberá um erro. Neste caso, adicione a cláusula `ENGINE=other_engine_name` à declaração `CREATE TABLE` para evitar o erro.

Se você não tomou uma decisão deliberada sobre o motor de armazenamento e deseja visualizar como certas tabelas funcionam quando criadas usando `InnoDB`, execute o comando `ALTER TABLE table_name ENGINE=InnoDB;` para cada tabela. Alternativamente, para executar consultas de teste e outras declarações sem alterar a tabela original, faça uma cópia:

```sql
CREATE TABLE ... ENGINE=InnoDB AS SELECT * FROM other_engine_table;
```

Para avaliar o desempenho com uma aplicação completa sob uma carga de trabalho realista, instale o servidor MySQL mais recente e execute benchmarks.

Teste o ciclo de vida completo do aplicativo, desde a instalação, passando pelo uso intenso e o reinício do servidor. Interrompa o processo do servidor enquanto o banco de dados estiver ocupado para simular uma falha de energia e verifique se os dados são recuperados com sucesso quando você reiniciar o servidor.

Teste qualquer configuração de replicação, especialmente se você usar diferentes versões e opções do MySQL no servidor de origem e nas réplicas.

### 14.1.5 Desligando o InnoDB

A Oracle recomenda o `InnoDB` como o mecanismo de armazenamento preferido para aplicações de banco de dados típicas, desde wikis e blogs de único usuário que funcionam em um sistema local até aplicações de ponta que empurram os limites de desempenho. No MySQL 5.7, o `InnoDB` é o mecanismo de armazenamento padrão para novas tabelas.

Importante

`InnoDB` não pode ser desativado. A opção `--skip-innodb` é desatualizada e não tem efeito, e seu uso resulta em um aviso. Espere que ela seja removida em um lançamento futuro do MySQL. Isso também se aplica a seus sinônimos (`--innodb=OFF`, `--disable-innodb`, e assim por diante).