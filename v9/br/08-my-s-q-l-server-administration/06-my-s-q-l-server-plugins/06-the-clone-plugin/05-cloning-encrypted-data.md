#### 7.6.6.5 Clonagem de Dados Encriptados

A clonagem de dados encriptados é suportada. Os seguintes requisitos se aplicam:

* É necessária uma conexão segura ao clonar dados remotos para garantir a transferência segura de chaves de espaço de dados não encriptadas pela rede. As chaves de espaço de dados são descriptografadas no doador antes do transporte e re-encriptadas no destinatário usando a chave mestre do destinatário. Um erro é relatado se uma conexão encriptada não estiver disponível ou se a cláusula `CLONE INSTANCE` exigir `NO SSL`. Para obter informações sobre a configuração de uma conexão encriptada para clonagem, consulte Configurando uma Conexão Encriptada para Clonagem.

* Ao clonar dados para um diretório de dados local que usa um conjunto de chaves gerenciado localmente, o mesmo conjunto de chaves deve ser usado ao iniciar o servidor MySQL no diretório de clonagem.

* Ao clonar dados para um diretório de dados remoto (o diretório do destinatário) que usa um conjunto de chaves gerenciado localmente, o conjunto de chaves do destinatário deve ser usado ao iniciar o servidor MySQL no diretório clonado.

Observação

Os ajustes das variáveis `innodb_redo_log_encrypt` e `innodb_undo_log_encrypt` não podem ser modificados enquanto uma operação de clonagem estiver em andamento.

Para obter informações sobre o recurso de criptografia de dados, consulte a Seção 17.13, “Criptografia de Dados InnoDB em Repouso”.