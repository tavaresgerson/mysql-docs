## 17.1 Introdução ao InnoDB

17.1.1 Benefícios de Usar Tabelas InnoDB

17.1.2 Melhores Práticas para Tabelas InnoDB

17.1.3 Verificando que o InnoDB é o Motor de Armazenamento Padrão

17.1.4 Testando e Benchmarkando com o InnoDB

O `InnoDB` é um motor de armazenamento de propósito geral que equilibra alta confiabilidade e alto desempenho. No MySQL 9.5, o `InnoDB` é o motor de armazenamento padrão do MySQL. A menos que você tenha configurado um motor de armazenamento padrão diferente, emitir uma declaração `CREATE TABLE` sem uma cláusula `ENGINE` cria uma tabela `InnoDB`.

### Principais Vantagens do InnoDB

* Suas operações DML seguem o modelo ACID, com transações que possuem recursos de commit, rollback e recuperação em caso de falha para proteger os dados do usuário. Veja a Seção 17.2, “InnoDB e o Modelo ACID”.

* O bloqueio em nível de linha e as leituras consistentes no estilo Oracle aumentam a concorrência e o desempenho em multiusuário. Veja a Seção 17.7, “Bloqueio InnoDB e Modelo de Transação”.

* As tabelas `InnoDB` organizam seus dados no disco para otimizar as consultas com base em chaves primárias. Cada tabela `InnoDB` tem um índice de chave primária chamado índice clúster que organiza os dados para minimizar o I/O para buscas por chaves primárias. Veja a Seção 17.6.2.1, “Indekses Clúster e Secundários”.

* Para manter a integridade dos dados, o `InnoDB` suporta restrições `FOREIGN KEY`. Com chaves estrangeiras, as inserções, atualizações e exclusões são verificadas para garantir que não resultem em inconsistências em tabelas relacionadas. Veja a Seção 15.1.24.5, “Restrições `FOREIGN KEY`”.

**Tabela 17.1 Características do Motor de Armazenamento InnoDB**

<table frame="box" rules="all" summary="Recursos suportados pelo mecanismo de armazenamento InnoDB."><col style="width: 60%"/><col style="width: 40%"/><thead><tr><th>Característica</th> <th>Suporte</th> </tr></thead><tbody><tr><td><span><strong>Indekses B-tree</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Recuperação de ponto no tempo</strong></span> (Implementado no servidor, em vez do mecanismo de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a banco de dados em clúster</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Indekses agrupados</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Dados comprimidos</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Caches de dados</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Dados criptografados</strong></span></td> <td>Sim (Implementado no servidor por meio de funções de criptografia; No MySQL 5.7 e versões posteriores, a criptografia de dados em repouso é suportada.)</span></td> </tr><tr><td><span><strong>Suporte a chaves estrangeiras</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Indekses de busca full-text</strong></span></td> <td>Sim (O suporte para índices FULLTEXT está disponível no MySQL 5.6 e versões posteriores.)</td> </tr><tr><td><span><strong>Suporte a tipos de dados geográficos</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a indexação geográficos</strong></span></td> <td>Sim (O suporte a indexação geográficos está disponível no MySQL 5.7 e versões posteriores.)</td> </tr><tr><td><span><strong>Indekses de hash</strong></span></td> <td>Não (O InnoDB utiliza índices de hash internamente para sua funcionalidade de Índice Hash Adaptativo.)</td> </tr><tr><td><span><strong>Caches de índice</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Granularidade de bloqueio</strong></span></td> <td>Linha</td> </tr><tr><td><span><strong>MVCC</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Suporte a replicação</strong></span> (Implementado no servidor, em vez do mecanismo de armazenamento.)</td> <td>Sim</td> </tr><tr><td><span><strong>Limites de armazenamento</strong></span></td> <td>64TB</td> </tr><tr><td><span><strong>Indekses T-tree</strong></span></td> <td>Não</td> </tr><tr><td><span><strong>Transações</strong></span></td> <td>Sim</td> </tr><tr><td><span><strong>Estatísticas de atualização para o dicionário de dados</strong></span></td> <td>Sim</td> </tr></tbody></table>

Para comparar as características do `InnoDB` com outros motores de armazenamento fornecidos com o MySQL, consulte a tabela *Características do Motor de Armazenamento* no Capítulo 18, *Motores de Armazenamento Alternativos*.

### Melhorias e Novas Características do InnoDB

Para obter informações sobre as melhorias e novas características do `InnoDB`, consulte:

* A lista de melhorias do `InnoDB` na Seção 1.4, “O que há de Novo no MySQL 9.5”.

* As Notas de Lançamento.

### Informações e Recursos Adicionais sobre o InnoDB

* Para termos e definições relacionados ao `InnoDB`, consulte o Glossário do MySQL.

* Para um fórum dedicado ao motor de armazenamento `InnoDB`, consulte MySQL Forums::InnoDB.

* O `InnoDB` é publicado sob a mesma Licença GPL Versão 2 (de junho de 1991) do MySQL. Para mais informações sobre a licença do MySQL, consulte <http://www.mysql.com/company/legal/licensing/>.