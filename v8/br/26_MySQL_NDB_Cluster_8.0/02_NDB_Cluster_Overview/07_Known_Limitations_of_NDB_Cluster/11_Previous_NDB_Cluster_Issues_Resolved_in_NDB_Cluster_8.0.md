#### 25.2.7.11 Problemas anteriores do NDB Cluster resolvidos no NDB Cluster 8.0

Várias limitações e problemas relacionados que existiam em versões anteriores do NDB Cluster foram resolvidos no NDB 8.0. Estes são descritos brevemente na lista a seguir:

- **Nomes de banco de dados e tabelas.** No NDB 7.6 e versões anteriores, ao usar o mecanismo de armazenamento `NDB`, o comprimento máximo permitido tanto para nomes de banco de dados quanto para nomes de tabelas era de 63 bytes, e uma declaração que usasse um nome de banco de dados ou um nome de tabela mais longo que esse limite falharia com um erro apropriado. No NDB 8.0, essa restrição foi levantada; os identificadores para bancos de dados e tabelas `NDB` podem agora usar até 64 caracteres, como acontece com outros nomes de banco de dados e tabelas do MySQL.

- **Suporte ao IPv6.** Antes da versão NDB 8.0.22, era necessário que todos os endereços de rede usados para conexões entre nós dentro de um NDB Cluster utilizassem ou fossem resolvíveis em endereços IPv4. A partir da versão NDB 8.0.22, o `NDB` suporta endereços IPv6 para todos os tipos de nós do cluster, bem como para aplicativos que utilizam a API NDB ou a API MGM.

  Para obter mais informações, consulte Problemas Conhecidos ao Atualizar ou Desatualizar um NDB Cluster.

- **Replicação multithread.** No NDB 8.0.32 e versões anteriores, a replicação multithread não era suportada para a replicação de cluster NDB. Essa restrição foi removida no NDB Cluster 8.0.33.

  Consulte a Seção 25.7.3, “Problemas Conhecidos na Replicação em NDB Cluster”, para obter mais informações.
