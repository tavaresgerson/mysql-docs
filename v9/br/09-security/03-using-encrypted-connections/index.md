## 8.3 Usando Conexões Encriptadas

8.3.1 Configurando o MySQL para Usar Conexões Encriptadas

8.3.2 Protocolos e Cifras TLS de Conexão Encriptada

8.3.3 Criando Certificados e Chaves SSL e RSA

8.3.4 Conectando-se ao MySQL Remotamente a partir do Windows com SSH

8.3.5 Reutilizando Sessões SSL

Com uma conexão não encriptada entre o cliente MySQL e o servidor, alguém com acesso à rede poderia monitorar todo o seu tráfego e inspecionar os dados sendo enviados ou recebidos entre o cliente e o servidor.

Quando você precisa mover informações pela rede de maneira segura, uma conexão não encriptada é inaceitável. Para tornar qualquer tipo de dado ilegível, use a criptografia. Os algoritmos de criptografia devem incluir elementos de segurança para resistir a muitos tipos de ataques conhecidos, como alterar a ordem das mensagens criptografadas ou reproduzir dados duas vezes.

O MySQL suporta conexões encriptadas entre clientes e o servidor usando o protocolo TLS (Transport Layer Security). TLS é às vezes referido como SSL (Secure Sockets Layer), mas o MySQL não usa realmente o protocolo SSL para conexões encriptadas porque sua criptografia é fraca (veja a Seção 8.3.2, “Protocolos e Cifras TLS de Conexão Encriptada”).

O TLS usa algoritmos de criptografia para garantir que os dados recebidos em uma rede pública possam ser confiáveis. Ele possui mecanismos para detectar alterações, perda ou reprodução de dados. O TLS também incorpora algoritmos que fornecem verificação de identidade usando o padrão X.509.

O X.509 permite identificar alguém na Internet. Em termos básicos, deve haver alguma entidade chamada “Autoridade de Certificação” (ou CA) que atribui certificados eletrônicos a qualquer pessoa que os precise. Os certificados dependem de algoritmos de criptografia assimétrica que têm duas chaves de criptografia (uma chave pública e uma chave secreta). O proprietário do certificado pode apresentar o certificado a outra parte como prova de identidade. Um certificado consiste na chave pública do seu proprietário. Qualquer dado criptografado usando essa chave pública pode ser descriptografado apenas usando a chave secreta correspondente, que é mantida pelo proprietário do certificado.

O suporte para conexões criptografadas no MySQL é fornecido usando o OpenSSL. Para obter informações sobre os protocolos de criptografia e cifra que o OpenSSL suporta, consulte a Seção 8.3.2, “Protocolos e cifra de conexão TLS criptografada”.

Por padrão, as instâncias do MySQL se conectam a uma biblioteca OpenSSL instalada disponível no tempo de execução para o suporte de conexões criptografadas e outras operações relacionadas à criptografia. Você pode compilar o MySQL a partir de um código-fonte e usar a opção `WITH_SSL` do **CMake** para especificar o caminho para uma versão específica da OpenSSL instalada ou um pacote de sistema OpenSSL alternativo. Nesse caso, o MySQL seleciona essa versão. Para obter instruções sobre como fazer isso, consulte a Seção 2.8.6, “Configurando o suporte à biblioteca SSL”.

Você pode verificar qual versão da biblioteca OpenSSL está em uso no tempo de execução usando a variável de status do sistema `Tls_library_version`.

Se você compilar o MySQL com uma versão do OpenSSL e quiser mudar para uma versão diferente sem recompilar, pode fazer isso editando o caminho do carregador de bibliotecas dinâmicas (`LD_LIBRARY_PATH` em sistemas Unix ou `PATH` em sistemas Windows). Remova o caminho para a versão compilada do OpenSSL e adicione o caminho para a versão de substituição, colocando-o antes de qualquer outra biblioteca OpenSSL no caminho. Ao iniciar, quando o MySQL não encontrar a versão do OpenSSL especificada com `WITH_SSL` no caminho, ele usará a primeira versão especificada no caminho.

Por padrão, os programas do MySQL tentam se conectar usando criptografia se o servidor suportar conexões criptografadas, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Para informações sobre opções que afetam o uso de conexões criptografadas, consulte a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Criptografadas” e Opções de Comando para Conexões Criptografadas.

O MySQL realiza criptografia em uma base por conexão, e o uso da criptografia para um usuário específico pode ser opcional ou obrigatório. Isso permite que você escolha uma conexão criptografada ou não criptografada de acordo com os requisitos das aplicações individuais. Para informações sobre como exigir que os usuários usem conexões criptografadas, consulte a discussão da cláusula `REQUIRE` da declaração `CREATE USER` na Seção 15.7.1.3, “Declaração CREATE USER”. Veja também a descrição da variável de sistema `require_secure_transport` na Seção 7.1.8, “Variáveis de Sistema do Servidor”.

Conexões criptografadas podem ser usadas entre servidores de origem e replica. Veja a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Criptografadas”.

Para informações sobre o uso de conexões criptografadas a partir da API C do MySQL, consulte Suporte para Conexões Criptografadas.

Também é possível se conectar usando criptografia dentro de uma conexão SSH ao host do servidor MySQL. Para um exemplo, consulte a Seção 8.3.4, “Conectando-se ao MySQL Remotamente a partir do Windows com SSH”.