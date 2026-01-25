#### 6.4.5.12 Restrições do Log de Auditoria

O MySQL Enterprise Audit está sujeito a estas restrições gerais:

* Apenas instruções SQL são registradas (logged). Alterações feitas por APIs no-SQL, como memcached, Node.JS e a NDB API, não são registradas.

* Apenas instruções de nível superior (top-level) são registradas, não instruções dentro de programas armazenados (stored programs), como triggers ou stored procedures.

* O conteúdo de arquivos referenciados por instruções como [`LOAD DATA`](load-data.html "13.2.6 LOAD DATA Statement") não é registrado.

* Antes do MySQL 5.7.21, o MySQL Enterprise Audit usava tabelas `MyISAM` no system database `mysql`. O Group Replication não suporta tabelas `MyISAM`. Consequentemente, o MySQL Enterprise Audit e o Group Replication não podem ser usados em conjunto.

**NDB Cluster.** É possível usar o MySQL Enterprise Audit com o MySQL NDB Cluster, sujeito às seguintes condições:

* Todas as alterações a serem registradas devem ser feitas usando a interface SQL. Alterações que utilizam interfaces no-SQL, como aquelas fornecidas pela NDB API, memcached ou ClusterJ, não são registradas.

* O plugin deve ser instalado em cada MySQL server que é usado para executar SQL no cluster.

* Os dados do Audit plugin devem ser agregados entre todos os MySQL servers usados com o cluster. Essa agregação é de responsabilidade da aplicação ou do usuário.