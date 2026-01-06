## 6.3 Usando Conexões Encriptadas

6.3.1 Configurando o MySQL para usar conexões criptografadas

6.3.2 Conexão Encriptada Protocolos e Cifras TLS

6.3.3 Criação de Certificados e Chaves SSL e RSA

6.3.4 Capacidades dependentes da biblioteca SSL

6.3.5 Conectar-se ao MySQL remotamente a partir do Windows com SSH

Com uma conexão não criptografada entre o cliente MySQL e o servidor, alguém com acesso à rede poderia monitorar todo o seu tráfego e inspecionar os dados enviados ou recebidos entre o cliente e o servidor.

Quando você precisa transferir informações por uma rede de maneira segura, uma conexão não criptografada é inaceitável. Para tornar qualquer tipo de dado ilegível, use criptografia. Os algoritmos de criptografia devem incluir elementos de segurança para resistir a muitos tipos de ataques conhecidos, como alterar a ordem das mensagens criptografadas ou reproduzir dados duas vezes.

O MySQL suporta conexões criptografadas entre clientes e o servidor usando o protocolo TLS (Transport Layer Security). O TLS é às vezes referido como SSL (Secure Sockets Layer), mas o MySQL não usa realmente o protocolo SSL para conexões criptografadas porque sua criptografia é fraca (veja Seção 6.3.2, “Protocolos e cifra TLS de conexão criptografada”).

O TLS utiliza algoritmos de criptografia para garantir que os dados recebidos em uma rede pública possam ser confiáveis. Ele possui mecanismos para detectar alterações, perda ou repetição de dados. O TLS também incorpora algoritmos que fornecem verificação de identidade usando o padrão X.509.

O X.509 permite identificar alguém na Internet. Em termos básicos, deve haver alguma entidade chamada “Autoridade de Certificação” (ou CA) que atribui certificados eletrônicos a qualquer pessoa que os precise. Os certificados dependem de algoritmos de criptografia assimétrica que possuem duas chaves de criptografia (uma chave pública e uma chave secreta). O proprietário do certificado pode apresentar o certificado a outra parte como prova de identidade. Um certificado consiste na chave pública do seu proprietário. Qualquer dado criptografado usando essa chave pública pode ser descriptografado apenas usando a chave secreta correspondente, que é mantida pelo proprietário do certificado.

O MySQL pode ser compilado para suporte a conexões criptografadas usando OpenSSL ou yaSSL. Para uma comparação entre os dois pacotes, consulte Seção 6.3.4, “Capacidades Dependentes da Biblioteca SSL”. Para informações sobre os protocolos de criptografia e cifra que cada pacote suporta, consulte Seção 6.3.2, “Protocolos e cifra de conexão criptografada TLS”.

Nota

É possível compilar o MySQL usando o yaSSL como alternativa ao OpenSSL apenas antes do MySQL 5.7.28. A partir do MySQL 5.7.28, o suporte ao yaSSL é removido e todas as compilações do MySQL usam o OpenSSL.

Por padrão, os programas do MySQL tentam se conectar usando criptografia se o servidor suportar conexões criptografadas, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Para obter informações sobre as opções que afetam o uso de conexões criptografadas, consulte Seção 6.3.1, “Configurando o MySQL para Usar Conexões Criptografadas” e Opções de Comando para Conexões Criptografadas.

O MySQL realiza criptografia por conexão e o uso de criptografia para um usuário específico pode ser opcional ou obrigatório. Isso permite que você escolha uma conexão criptografada ou não criptografada de acordo com os requisitos das aplicações individuais. Para obter informações sobre como exigir que os usuários usem conexões criptografadas, consulte a discussão da cláusula `REQUIRE` da declaração `CREATE USER` em Seção 13.7.1.2, “Declaração CREATE USER”. Veja também a descrição da variável de sistema `require_secure_transport` em Seção 5.1.7, “Variáveis de Sistema do Servidor”

Conexões criptografadas podem ser usadas entre os servidores de origem e replicação. Consulte Seção 16.3.8, “Configurando a Replicação para Usar Conexões Criptografadas”.

Para obter informações sobre o uso de conexões criptografadas a partir da API C do MySQL, consulte Suporte para Conexões Criptografadas.

Também é possível se conectar usando criptografia dentro de uma conexão SSH ao host do servidor MySQL. Para um exemplo, consulte Seção 6.3.5, “Conectando-se ao MySQL Remotamente a partir do Windows com SSH”.

Várias melhorias foram feitas no suporte para conexões criptografadas no MySQL 5.7. O cronograma a seguir resume as mudanças:

- 5.7.3: No lado do cliente, a opção explícita `--ssl` deixou de ser apenas recomendável e passou a ser obrigatória. Dado que um servidor está habilitado para suportar conexões criptografadas, um programa cliente pode exigir uma conexão criptografada especificando apenas a opção `--ssl`. (Anteriormente, era necessário que o cliente especificasse a opção `--ssl-ca`, ou as três opções `--ssl-ca`, `--ssl-key` e `--ssl-cert`. Se não for especificada a opção `--ssl`, a tentativa de conexão falha se não for possível estabelecer uma conexão criptografada. Outras opções `--ssl-xxx` no lado do cliente são recomendadas na ausência de `--ssl`: O cliente tenta se conectar usando criptografia, mas retorna a uma conexão não criptografada se não for possível estabelecer uma conexão criptografada.

- 5.7.5: A opção `--ssl` no lado do servidor (server-options.html#option\_mysqld\_ssl) é ativada por padrão.

  Para servidores compilados com OpenSSL, as variáveis de sistema `auto_generate_certs` e `sha256_password_auto_generate_rsa_keys` estão disponíveis para habilitar a autogeração e autodescoberta de arquivos de certificado e chave SSL/RSA no momento do início. Para a autodescoberta de certificados e chaves, se `--ssl` estiver habilitado e outras opções `--ssl-xxx` *não* forem fornecidas para configurar conexões criptografadas explicitamente, o servidor tentará habilitar o suporte para conexões criptografadas automaticamente no momento do início, se descobrir os arquivos de certificado e chave necessários no diretório de dados.

- 5.7.6: O utilitário **mysql\_ssl\_rsa\_setup** está disponível para facilitar a geração manual de arquivos de certificado e chave SSL/RSA. A autodescoberta de arquivos SSL/RSA ao iniciar é expandida para aplicar a todos os servidores, independentemente de serem compilados com o OpenSSL ou o yaSSL. (Isso significa que o `auto_generate_certs` não precisa ser habilitado para que a autodescoberta ocorra.)

  Se o servidor descobrir, durante a inicialização, que o certificado da CA é autoassinado, ele escreve uma mensagem de alerta no log de erros. (O certificado é autoassinado se for criado automaticamente pelo servidor ou manualmente usando **mysql\_ssl\_rsa\_setup**.)

- 5.7.7: A biblioteca de cliente C tenta estabelecer uma conexão criptografada por padrão, se o servidor suportar conexões criptografadas. Isso afeta os programas cliente da seguinte forma:

  - Na ausência da opção `--ssl`, os clientes tentam se conectar usando criptografia, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida.

  - A presença de uma opção explícita `--ssl` ou um sinônimo (`--ssl=1`, `--enable-ssl`) é prescritiva: os clientes exigem uma conexão criptografada e falham se não puderem ser estabelecidas.

  - Com a opção `--ssl=0` ou um sinônimo (`--skip-ssl`, `--disable-ssl`), os clientes usam uma conexão não criptografada.

  Essa mudança também afeta as versões subsequentes dos Conectores MySQL que são baseados na biblioteca de clientes C: Connector/C++ e Connector/ODBC.

- 5.7.8: A variável de sistema `require_secure_transport` está disponível para controlar se as conexões do cliente ao servidor devem usar alguma forma de transporte seguro.

- 5.7.10: O suporte ao protocolo TLS é estendido do TLSv1 para incluir também o TLSv1.1 e o TLSv1.2. A variável de sistema `tls_version` no lado do servidor e a opção `--tls-version` no lado do cliente permitem selecionar o nível de suporte. Consulte Seção 6.3.2, “Protocolos e cifra de conexão TLS Encriptados”.

- 5.7.11: Os programas de cliente MySQL suportam a opção `--ssl-mode` que permite especificar o estado de segurança da conexão com o servidor. A opção `--ssl-mode` compreende as capacidades das opções de lado do cliente `--ssl` e `--ssl-verify-server-cert`. Consequentemente, `--ssl` e `--ssl-verify-server-cert` são desatualizados e serão removidos no MySQL 8.0.

- 5.7.28: O suporte para o yaSSL foi removido. Todas as compilações do MySQL usam o OpenSSL.

- 5.7.35: Os protocolos TLSv1 e TLSv1.1 estão desatualizados.
