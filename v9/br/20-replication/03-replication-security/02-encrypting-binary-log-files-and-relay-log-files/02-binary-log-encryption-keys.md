#### 19.3.2.2 Chaves de Criptografia de Log Binário

As chaves de criptografia de log binário usadas para criptografar as senhas dos arquivos dos arquivos de log são chaves de 256 bits que são geradas especificamente para cada instância do servidor MySQL usando o serviço de chaveira do MySQL Server (veja a Seção 8.4.5, “A Chaveira MySQL”). O serviço de chaveira gerencia a criação, recuperação e exclusão das chaves de criptografia de log binário. Uma instância de servidor cria e remove apenas chaves geradas para si mesma, mas pode ler chaves geradas para outras instâncias se estiverem armazenadas na chaveira, como no caso de uma instância de servidor que foi clonada por cópia de arquivos.

Importante

As chaves de criptografia de log binário para uma instância de servidor MySQL devem ser incluídas nos seus procedimentos de backup e recuperação, porque, se as chaves necessárias para descriptografar as senhas dos arquivos dos arquivos de log atuais e retidos ou dos arquivos de log de retransmissão forem perdidas, pode não ser possível iniciar o servidor.

O formato das chaves de criptografia de log binário na chaveira é o seguinte:

```
MySQLReplicationKey_{UUID}_{SEQ_NO}
```

Por exemplo:

```
MySQLReplicationKey_00508583-b5ce-11e8-a6a5-0010e0734796_1
```

`{UUID}` é o UUID verdadeiro gerado pelo servidor MySQL (o valor da variável de sistema `server_uuid`). `{SEQ_NO}` é o número de sequência para a chave de criptografia de log binário, que é incrementado em 1 para cada nova chave gerada no servidor.

A chave de criptografia do log binário que está atualmente em uso no servidor é chamada de chave mestre do log binário. O número de sequência para a chave mestre do log binário atual é armazenado no chaveiro. A chave mestre do log binário é usada para criptografar a senha do arquivo de log novo, que é uma senha de arquivo gerada aleatoriamente de 32 bytes específica para o arquivo de log que é usado para criptografar os dados do arquivo. A senha do arquivo é criptografada usando o modo AES-CBC (modo de Cadeia de Blocos de Criptografia AES) com a chave de criptografia binária do log binário de 256 bits e um vetor de inicialização aleatório (IV), e é armazenada no cabeçalho do arquivo de log. Os dados do arquivo são criptografados usando o modo AES-CTR (modo de Contador AES) com uma chave de 256 bits gerada a partir da senha do arquivo e um nonce também gerado a partir da senha do arquivo. É tecnicamente possível descriptografar um arquivo criptografado offline, se a chave de criptografia do log binário usada para criptografar a senha do arquivo for conhecida, usando ferramentas disponíveis no kit de criptografia OpenSSL.

Se você usar a cópia de arquivos para clonar uma instância do servidor MySQL que tem criptografia ativa, para que seus arquivos de log binário e arquivos de log de retransmissão sejam criptografados, certifique-se de que o chaveiro também seja copiado, para que o servidor clonado possa ler as chaves de criptografia do log binário do servidor de origem. Quando a criptografia é ativada no servidor clonado (seja no início ou posteriormente), o servidor clonado reconhece que as chaves de criptografia do log binário usadas com os arquivos copiados incluem o UUID gerado do servidor de origem. Ele gera automaticamente uma nova chave de criptografia do log binário usando seu próprio UUID gerado e usa isso para criptografar as senhas de arquivo para os arquivos de log binário subsequentes e arquivos de log de retransmissão. Os arquivos copiados continuam a ser lidos usando as chaves do servidor de origem.