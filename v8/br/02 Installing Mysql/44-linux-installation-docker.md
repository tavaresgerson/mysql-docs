### 2.5.6 Implantação do MySQL no Linux com Contenedores Docker

Esta seção explica como implantar o MySQL Server usando contenedores Docker.

Embora o cliente `docker` seja usado nas instruções a seguir para fins de demonstração, geralmente, as imagens de contêineres MySQL fornecidas pela Oracle funcionam com qualquer ferramenta de contêiner que esteja em conformidade com a especificação [OCI 1.0](https://opencontainers.org/posts/announcements/2021-05-04-oci-dist-spec-v1/).

Aviso

Antes de implantar o MySQL com contenedores Docker, certifique-se de entender os riscos de segurança de executar contêineres e mitigá-los adequadamente.