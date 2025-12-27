#### 8.4.6.12 Restrições do Log de Auditoria

O MySQL Enterprise Audit está sujeito a essas restrições gerais:

* Apenas instruções SQL são registradas. Alterações feitas por APIs não SQL, como memcached, Node.JS e a API NDB, não são registradas.

* Apenas instruções de nível superior são registradas, não instruções dentro de programas armazenados, como gatilhos ou procedimentos armazenados.

* O conteúdo de arquivos referenciados por instruções como `LOAD DATA` não é registrado.

**Nível de Arranjo NDB.** É possível usar o MySQL Enterprise Audit com o MySQL NDB Cluster, sujeito às seguintes condições:

* Todas as alterações a serem registradas devem ser feitas usando a interface SQL. Alterações usando interfaces não SQL, como as fornecidas pela API NDB, memcached ou ClusterJ, não são registradas.

* O plugin deve ser instalado em cada servidor MySQL que é usado para executar SQL no cluster.

* Os dados do plugin de auditoria devem ser agregados entre todos os servidores MySQL usados com o cluster. Essa agregação é responsabilidade da aplicação ou do usuário.