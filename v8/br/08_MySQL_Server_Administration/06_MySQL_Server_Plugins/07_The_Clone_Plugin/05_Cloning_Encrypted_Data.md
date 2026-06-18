#### 7.6.7.5 Clonagem de Dados Criptografados

O clonamento de dados criptografados é suportado. Os seguintes requisitos se aplicam:

- Uma conexão segura é necessária ao clonar dados remotos para garantir a transferência segura de chaves de espaço de tabela não criptografadas pela rede. As chaves do espaço de tabela são descriptografadas no doador antes do transporte e re-criptografadas no destinatário usando a chave mestre do destinatário. Um erro é relatado se uma conexão criptografada não estiver disponível ou se a cláusula `REQUIRE NO SSL` for usada na instrução `CLONE INSTANCE`. Para obter informações sobre a configuração de uma conexão criptografada para clonagem, consulte Configurando uma Conexão Criptografada para Clonagem.

- Ao clonar dados para um diretório de dados local que utiliza um conjunto de chaves gerenciado localmente, o mesmo conjunto de chaves deve ser usado ao iniciar o servidor MySQL no diretório de clonagem.

- Ao clonar dados para um diretório de dados remoto (o diretório destinatário) que utiliza um conjunto de chaves gerenciado localmente, o conjunto de chaves do destinatário deve ser usado ao iniciar o servidor MySQL no diretório clonado.

Nota

Os ajustes das variáveis `innodb_redo_log_encrypt` e `innodb_undo_log_encrypt` não podem ser modificados enquanto uma operação de clonagem estiver em andamento.

Para obter informações sobre o recurso de criptografia de dados, consulte a Seção 17.13, “Criptografia de Dados em Repouso do InnoDB”.
