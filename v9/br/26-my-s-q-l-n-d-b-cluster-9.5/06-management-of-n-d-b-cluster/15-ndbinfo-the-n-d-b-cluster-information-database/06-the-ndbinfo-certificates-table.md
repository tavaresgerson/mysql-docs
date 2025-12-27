#### 25.6.15.6 A tabela de certificados ndbinfo

A tabela `certificates` fornece informações sobre os certificados usados pelos nós que se conectam com criptografia de link TLS (consulte a Seção 25.6.19.5, “Criptografia de Link TLS para NDB Cluster”).

A tabela `certificates` contém as seguintes colunas:

* `Node_id`

  ID do nó onde este certificado é encontrado

* `Name`

  Nome do certificado

* `Expires`

  Data de expiração, no formato `mm-nnn-yyyy` (por exemplo, `18-Dez-2023`).

* `Serial`

  Número de série