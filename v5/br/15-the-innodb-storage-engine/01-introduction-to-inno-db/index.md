## 14.1 Introdução ao InnoDB

14.1.1 Benefícios de usar tabelas InnoDB

14.1.2 Melhores Práticas para Tabelas InnoDB

14.1.3 Verificar se o InnoDB é o motor de armazenamento padrão

14.1.4 Testes e Benchmarking com InnoDB

14.1.5 Desligando o InnoDB

`InnoDB` é um mecanismo de armazenamento de propósito geral que equilibra alta confiabilidade e alto desempenho. No MySQL 5.7, `InnoDB` é o mecanismo de armazenamento padrão do MySQL. A menos que você tenha configurado um mecanismo de armazenamento padrão diferente, emitir uma instrução `CREATE TABLE` sem uma cláusula `ENGINE` cria uma tabela `InnoDB`.

### Principais vantagens do InnoDB

- Suas operações DML seguem o modelo ACID, com transações que oferecem recursos de commit, rollback e recuperação em caso de falha para proteger os dados do usuário. Veja a Seção 14.2, “InnoDB e o Modelo ACID”.

- O bloqueio de nível de linha e as leituras consistentes no estilo Oracle aumentam a concorrência e o desempenho em múltiplos usuários. Veja a Seção 14.7, “Modelo de Bloqueio e Transação InnoDB”.

- As tabelas `InnoDB` organizam seus dados no disco para otimizar as consultas com base em chaves primárias. Cada tabela `InnoDB` possui um índice de chave primária chamado índice agrupado que organiza os dados para minimizar o I/O para consultas de chave primária. Veja a Seção 14.6.2.1, “Indekses Agrupados e Secundários”.

- Para manter a integridade dos dados, o `InnoDB` suporta as restrições `FOREIGN KEY`. Com as chaves estrangeiras, as inserções, atualizações e exclusões são verificadas para garantir que não resultem em inconsistências entre as tabelas relacionadas. Veja a Seção 13.1.18.5, “Restrições de Chave Estrangeira”.

**Tabela 14.1 Características do Motor de Armazenamento InnoDB**

<table frame="box" rules="all" summary="Recursos suportados pelo motor de armazenamento InnoDB."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Característica</th> <th>Suporte</th> </tr></thead><tbody><tr><td><span class="bold"><strong>Índices de árvores B</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Backup/recuperação em ponto no tempo</strong></span>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Suporte a bancos de dados em cluster</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Índices agrupados</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Dados comprimidos</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Caches de dados</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Dados criptografados</strong></span></td> <td>Sim (implementado no servidor por meio de funções de criptografia; no MySQL 5.7 e versões posteriores, a criptografia de dados em repouso é suportada.)</td> </tr><tr><td><span class="bold"><strong>Suporte para chave estrangeira</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Índices de pesquisa de texto completo</strong></span></td> <td>Sim (O suporte para índices FULLTEXT está disponível no MySQL 5.6 e versões posteriores.)</td> </tr><tr><td><span class="bold"><strong>Suporte ao tipo de dados geográficos</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Suporte de indexação geospacial</strong></span></td> <td>Sim (O suporte para indexação geoespacial está disponível no MySQL 5.7 e versões posteriores.)</td> </tr><tr><td><span class="bold"><strong>Índices de hash</strong></span></td> <td>Não (o InnoDB utiliza índices de hash internamente para sua funcionalidade de Índice Hash Adaptativo.)</td> </tr><tr><td><span class="bold"><strong>Caches de índice</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Granularidade de bloqueio</strong></span></td> <td>Linha</td> </tr><tr><td><span class="bold"><strong>MVCC</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Suporte à replicação</strong></span>(Implementado no servidor, e não no motor de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Limites de armazenamento</strong></span></td> <td>64 TB</td> </tr><tr><td><span class="bold"><strong>Índices de T-tree</strong></span></td> <td>Não</td> </tr><tr><td><span class="bold"><strong>Transações</strong></span></td> <td>Sim</td> </tr><tr><td><span class="bold"><strong>Atualizar estatísticas para o dicionário de dados</strong></span></td> <td>Sim</td> </tr></tbody></table>

Para comparar as características do `InnoDB` com outros motores de armazenamento fornecidos com o MySQL, consulte a tabela *Características do Motor de Armazenamento* no Capítulo 15, *Motores de Armazenamento Alternativos*.

### Melhorias e Novas Funcionalidades do InnoDB

Para obter informações sobre as melhorias e novos recursos do `InnoDB`, consulte:

- A lista de aprimoramentos do `InnoDB` na Seção 1.3, “O que há de novo no MySQL 5.7”.

- As Notas de Lançamento.

### Informações e recursos adicionais do InnoDB

- Para termos e definições relacionados ao `InnoDB`, consulte o Glossário do MySQL.

- Para um fórum dedicado ao motor de armazenamento `InnoDB`, consulte MySQL Forums::InnoDB.

- O `InnoDB` é publicado sob a mesma Licença GPL Versão 2 (de junho de 1991) do MySQL. Para mais informações sobre a licença do MySQL, consulte <http://www.mysql.com/company/legal/licensing/>.
