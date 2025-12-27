## 8.3 Usando Conexões Encriptadas

Com uma conexão não encriptada entre o cliente MySQL e o servidor, alguém com acesso à rede poderia monitorar todo o seu tráfego e inspecionar os dados enviados ou recebidos entre o cliente e o servidor.

Quando você precisa transferir informações de forma segura pela rede, uma conexão não encriptada é inaceitável. Para tornar qualquer tipo de dado ilegível, use a encriptação. Os algoritmos de encriptação devem incluir elementos de segurança para resistir a muitos tipos de ataques conhecidos, como alterar a ordem das mensagens encriptadas ou reproduzir os dados duas vezes.

O MySQL suporta conexões encriptadas entre clientes e o servidor usando o protocolo TLS (Transport Layer Security). O TLS é às vezes referido como SSL (Secure Sockets Layer), mas o MySQL não usa realmente o protocolo SSL para conexões encriptadas porque sua encriptação é fraca (veja a Seção 8.3.2, “Protocolos e Cifras TLS de Conexão Encriptada”).

O TLS usa algoritmos de encriptação para garantir que os dados recebidos em uma rede pública possam ser confiáveis. Ele possui mecanismos para detectar alterações, perda ou reprodução de dados. O TLS também incorpora algoritmos que fornecem verificação de identidade usando o padrão X.509.

O X.509 permite identificar alguém na Internet. Em termos básicos, deve haver alguma entidade chamada “Autoridade de Certificação” (ou CA) que atribui certificados eletrônicos a qualquer pessoa que os precise. Os certificados dependem de algoritmos de encriptação assimétrica que têm duas chaves de encriptação (uma chave pública e uma chave secreta). O proprietário do certificado pode apresentar o certificado a outra parte como prova de identidade. Um certificado consiste na chave pública do seu proprietário. Qualquer dado encriptado usando essa chave pública pode ser descriptografado apenas usando a chave secreta correspondente, que é mantida pelo proprietário do certificado.

O suporte para conexões criptografadas no MySQL é fornecido usando o OpenSSL. Para obter informações sobre os protocolos de criptografia e cifra que o OpenSSL suporta, consulte a Seção 8.3.2, “Protocolos e cifra TLS de Conexão Criptografada”.

Por padrão, as instâncias do MySQL se conectam a uma biblioteca OpenSSL instalada disponível no momento da execução para o suporte de conexões criptografadas e outras operações relacionadas à criptografia. Você pode compilar o MySQL a partir de fontes e usar a opção  `WITH_SSL` do  `CMake` para especificar o caminho para uma versão específica da OpenSSL instalada ou um pacote de sistema OpenSSL alternativo. Nesse caso, o MySQL seleciona essa versão. Para obter instruções sobre como fazer isso, consulte a Seção 2.8.6, “Configurando o Suporte à Biblioteca SSL”.

Você pode verificar qual versão da biblioteca OpenSSL está em uso no momento da execução usando a variável de status do sistema `Tls_library_version`.

Se você compilar o MySQL com uma versão do OpenSSL e quiser mudar para uma versão diferente sem recompilar, você pode fazer isso editando o caminho do carregador de bibliotecas dinâmicas (`LD_LIBRARY_PATH` em sistemas Unix ou `PATH` em sistemas Windows). Remova o caminho para a versão compilada do OpenSSL e adicione o caminho para a versão de substituição, colocando-o antes de quaisquer outras bibliotecas OpenSSL no caminho. Na inicialização, quando o MySQL não encontrar a versão do OpenSSL especificada com  `WITH_SSL` no caminho, ele usará a primeira versão especificada no caminho.

Por padrão, os programas do MySQL tentam se conectar usando criptografia se o servidor suportar conexões criptografadas, revertendo para uma conexão não criptografada se uma conexão criptografada não puder ser estabelecida. Para obter informações sobre opções que afetam o uso de conexões criptografadas, consulte a Seção 8.3.1, “Configurando o MySQL para Usar Conexões Criptografadas” e Opções de Comando para Conexões Criptografadas.

O MySQL realiza a criptografia por conexão e o uso da criptografia para um usuário específico pode ser opcional ou obrigatório. Isso permite que você escolha uma conexão criptografada ou não criptografada de acordo com os requisitos das aplicações individuais. Para obter informações sobre como exigir que os usuários usem conexões criptografadas, consulte a discussão da cláusula `REQUIRE` da instrução `CREATE USER` na Seção 15.7.1.3, “Instrução CREATE USER”. Veja também a descrição da variável de sistema `require_secure_transport` na Seção 7.1.8, “Variáveis de Sistema do Servidor”.

Conexões criptografadas podem ser usadas entre servidores de origem e replica. Consulte a Seção 19.3.1, “Configurando a Replicação para Usar Conexões Criptografadas”.

Para obter informações sobre o uso de conexões criptografadas a partir da API C do MySQL, consulte o Suporte para Conexões Criptografadas.

Também é possível se conectar usando criptografia a partir de uma conexão SSH ao host do servidor MySQL. Para um exemplo, consulte a Seção 8.3.4, “Conectando-se ao MySQL Remotamente a partir do Windows com SSH”.