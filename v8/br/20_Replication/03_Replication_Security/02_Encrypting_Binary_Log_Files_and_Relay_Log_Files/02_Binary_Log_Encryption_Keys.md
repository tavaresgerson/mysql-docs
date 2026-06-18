#### 19.3.2.2 Chaves de criptografia do log binário

As chaves de criptografia do log binário usadas para criptografar as senhas dos arquivos dos arquivos de log são chaves de 256 bits que são geradas especificamente para cada instância do servidor MySQL usando o serviço de chaveiro do MySQL Server (veja a Seção 8.4.4, “O Chaveiro MySQL”). O serviço de chaveiro gerencia a criação, recuperação e remoção das chaves de criptografia do log binário. Uma instância do servidor cria e remove apenas chaves geradas para si mesma, mas pode ler chaves geradas para outras instâncias se elas estiverem armazenadas no chaveiro, como no caso de uma instância do servidor que foi clonada por cópia de arquivos.

Importante

As chaves de criptografia do log binário para uma instância do servidor MySQL devem ser incluídas em seus procedimentos de backup e recuperação, pois, se as chaves necessárias para descriptografar as senhas dos arquivos de log binário atuais e mantidos ou dos arquivos de log de retransmissão forem perdidas, pode não ser possível iniciar o servidor.

O formato das chaves de criptografia de log binário no chaveiro é o seguinte:

```
MySQLReplicationKey_{UUID}_{SEQ_NO}
```

Por exemplo:

```
MySQLReplicationKey_00508583-b5ce-11e8-a6a5-0010e0734796_1
```

`{UUID}` é o verdadeiro UUID gerado pelo servidor MySQL (o valor da variável de sistema `server_uuid`). `{SEQ_NO}` é o número de sequência para a chave de criptografia do log binário, que é incrementado em 1 para cada nova chave gerada no servidor.

A chave de criptografia do log binário que está atualmente em uso no servidor é chamada de chave mestre do log binário. O número de sequência da chave mestre do log binário atual é armazenado no chaveiro. A chave mestre do log binário é usada para criptografar a senha do arquivo de log novo, que é uma senha de arquivo gerada aleatoriamente de 32 bytes específica para o arquivo de log que é usado para criptografar os dados do arquivo. A senha do arquivo é criptografada usando o modo AES-CBC (modo de Cadeia de Blocos de Criptografia AES) com a chave de criptografia binária do log binário de 256 bits e um vetor de inicialização aleatório (IV), e é armazenada no cabeçalho do arquivo de log. Os dados do arquivo são criptografados usando o modo AES-CTR (modo de Contador AES) com uma chave de 256 bits gerada a partir da senha do arquivo e um nonce também gerado a partir da senha do arquivo. É tecnicamente possível descriptografar um arquivo criptografado offline, se a chave de criptografia do log binário usada para criptografar a senha do arquivo for conhecida, usando ferramentas disponíveis no kit de criptografia OpenSSL.

Se você usar a cópia de arquivos para clonar uma instância do servidor MySQL que tem a criptografia ativa, garantindo que seus arquivos de log binário e arquivos de log de retransmissão estejam criptografados, certifique-se de que o conjunto de chaves também seja copiado, para que o servidor clonado possa ler as chaves de criptografia do log binário do servidor de origem. Quando a criptografia é ativada no servidor clonado (seja no início ou posteriormente), o servidor clonado reconhece que as chaves de criptografia do log binário usadas com os arquivos copiados incluem o UUID gerado do servidor de origem. Ele gera automaticamente uma nova chave de criptografia do log binário usando seu próprio UUID gerado e usa essa chave para criptografar as senhas dos arquivos para os arquivos de log binário e arquivos de log de retransmissão subsequentes. Os arquivos copiados continuam sendo lidos usando as chaves do servidor de origem.
