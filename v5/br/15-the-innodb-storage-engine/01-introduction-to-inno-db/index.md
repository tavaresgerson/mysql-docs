## 14.1 Introdução ao InnoDB

14.1.1 Benefícios do Uso de Tabelas InnoDB

14.1.2 Melhores Práticas para Tabelas InnoDB

14.1.3 Verificando se InnoDB é o Storage Engine Padrão

14.1.4 Testes e Benchmarking com InnoDB

14.1.5 Desativando o InnoDB

O `InnoDB` é um storage engine de propósito geral que equilibra alta confiabilidade e alto desempenho. No MySQL 5.7, o `InnoDB` é o storage engine padrão do MySQL. A menos que você tenha configurado um storage engine padrão diferente, a emissão de uma instrução `CREATE TABLE` sem uma cláusula `ENGINE` cria uma tabela `InnoDB`.

### Principais Vantagens do InnoDB

* Suas operações DML seguem o modelo ACID, com transações que incluem recursos de commit, rollback e crash-recovery para proteger os dados do usuário. Consulte a Seção 14.2, “InnoDB e o Modelo ACID”.

* O Row-level locking e as leituras consistentes no estilo Oracle aumentam a concorrência multiusuário e o desempenho. Consulte a Seção 14.7, “Modelo de Transação e Locking do InnoDB”.

* As tabelas `InnoDB` organizam seus dados em disco para otimizar Queries baseadas em Primary Keys. Cada tabela `InnoDB` possui um Primary Key Index chamado clustered index que organiza os dados para minimizar I/O para lookups de Primary Key. Consulte a Seção 14.6.2.1, “Clustered Indexes e Indexes Secundários”.

* Para manter a integridade dos dados, o `InnoDB` suporta restrições `FOREIGN KEY`. Com foreign keys, as inserções (inserts), atualizações (updates) e exclusões (deletes) são verificadas para garantir que não resultem em inconsistências entre tabelas relacionadas. Consulte a Seção 13.1.18.5, “Restrições FOREIGN KEY”.

**Tabela 14.1 Recursos do Storage Engine InnoDB**

| Recurso | Suporte |
| :--- | :--- |
| **B-tree indexes** | Sim |
| **Backup/point-in-time recovery** (Implementado no servidor, e não no storage engine.) | Sim |
| **Suporte a Database em Cluster** | Não |
| **Clustered indexes** | Sim |
| **Dados compactados** | Sim |
| **Caches de Dados** | Sim |
| **Dados criptografados** | Sim (Implementado no servidor via funções de criptografia; No MySQL 5.7 e posterior, há suporte para criptografia de dados em repouso - data-at-rest encryption.) |
| **Suporte a Foreign Key** | Sim |
| **Full-text search indexes** | Sim (O suporte para FULLTEXT Indexes está disponível no MySQL 5.6 e posterior.) |
| **Suporte a tipos de dados Geoespaciais** | Sim |
| **Suporte a Indexing Geoespacial** | Sim (O suporte para indexing geoespacial está disponível no MySQL 5.7 e posterior.) |
| **Hash indexes** | Não (O InnoDB utiliza hash indexes internamente para seu recurso Adaptive Hash Index.) |
| **Caches de Index** | Sim |
| **Granularidade de Locking** | Linha (Row) |
| **MVCC** | Sim |
| **Suporte à Replicação** (Implementado no servidor, e não no storage engine.) | Sim |
| **Limites de Armazenamento** | 64TB |
| **T-tree indexes** | Não |
| **Transactions** | Sim |
| **Atualização de estatísticas para dicionário de dados** | Sim |

Para comparar os recursos do `InnoDB` com outros storage engines fornecidos com o MySQL, consulte a tabela *Storage Engine Features* no Capítulo 15, *Alternative Storage Engines*.

### Aprimoramentos e Novos Recursos do InnoDB

Para obter informações sobre aprimoramentos e novos recursos do `InnoDB`, consulte:

* A lista de aprimoramentos do `InnoDB` na Seção 1.3, “O Que Há de Novo no MySQL 5.7”.

* As Notas de Lançamento (Release Notes).

### Informações e Recursos Adicionais do InnoDB

* Para termos e definições relacionados ao `InnoDB`, consulte o Glossário MySQL.

* Para um fórum dedicado ao storage engine `InnoDB`, consulte MySQL Forums::InnoDB.

* O `InnoDB` é publicado sob a mesma Licença GNU GPL Versão 2 (de Junho de 1991) que o MySQL. Para mais informações sobre o licenciamento do MySQL, consulte <http://www.mysql.com/company/legal/licensing/>.
