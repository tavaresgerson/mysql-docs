### 2.5.6 Implantação do MySQL no Linux com Contenedores Docker

2.5.6.1 Passos Básicos para a Implantação do Servidor MySQL com Docker

2.5.6.2 Mais Tópicos sobre a Implantação do Servidor MySQL com Docker

2.5.6.3 Implantação do MySQL no Windows e em Outras Plataformas Não Linux com Docker

Esta seção explica como implantar o MySQL Server usando contêineres Docker.

Embora o cliente `docker` seja usado nas instruções a seguir para fins de demonstração, geralmente, as imagens de contêineres MySQL fornecidas pela Oracle funcionam com qualquer ferramenta de contêiner que seja compatível com a especificação [OCI 1.0](https://opencontainers.org/posts/announcements/2021-05-04-oci-dist-spec-v1/).

Aviso

Antes de implantar o MySQL com contêineres Docker, certifique-se de entender os riscos de segurança de executar contêineres e mitigá-los adequadamente.